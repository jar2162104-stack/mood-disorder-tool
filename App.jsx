import React, { useState, useRef, useEffect } from 'react';
import { Send, FileDown, RefreshCw, CheckCircle, AlertCircle, Award } from 'lucide-react';

export default function MoodDisorderDiagnosticTool() {
  const [stage, setStage] = useState('instructions'); // instructions, interview, diagnosis, feedback
  const [clientCase, setClientCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState({
    primaryDiagnosis: '',
    differentialDiagnoses: '',
    dsmCriteria: '',
    treatmentPlan: ''
  });
  const [feedback, setFeedback] = useState(null);
  const [grades, setGrades] = useState(null);
  const [sessionId] = useState(() => `MOOD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const RUBRIC = {
    interviewThoroughness: {
      name: "Interview Thoroughness",
      maxPoints: 4,
      criteria: {
        4: "Excellent: 7+ substantive questions covering all key areas (mood, duration, severity, functioning, sleep, appetite, concentration, suicidality, medical/substance history). Questions are open-ended and clinically appropriate.",
        3: "Good: 5-6 substantive questions covering most key areas. Generally appropriate clinical interviewing.",
        2: "Satisfactory: 4-5 questions covering some key areas. Some important areas missed.",
        1: "Needs Improvement: 3 or fewer questions, significant gaps in assessment areas.",
        0: "Insufficient: Minimal questioning, unable to gather adequate diagnostic information."
      }
    },
    diagnosticAccuracy: {
      name: "Diagnostic Accuracy",
      maxPoints: 4,
      criteria: {
        4: "Excellent: Correct primary diagnosis with appropriate specifiers.",
        3: "Good: Correct diagnosis category, minor errors in specifiers.",
        2: "Satisfactory: Related diagnosis (correct disorder family but wrong specific diagnosis).",
        1: "Needs Improvement: Incorrect diagnosis but in related category (e.g., mood vs anxiety).",
        0: "Insufficient: Completely incorrect or missing diagnosis."
      }
    },
    dsmCriteriaApplication: {
      name: "DSM-5-TR Criteria Application",
      maxPoints: 4,
      criteria: {
        4: "Excellent: Accurately identifies all relevant criteria with specific evidence from interview. Demonstrates thorough understanding of diagnostic requirements.",
        3: "Good: Identifies most criteria with supporting evidence. Minor omissions or inaccuracies.",
        2: "Satisfactory: Identifies some criteria but missing key elements or insufficient evidence.",
        1: "Needs Improvement: Vague criteria citation, missing most specific requirements.",
        0: "Insufficient: No criteria cited or completely inaccurate criteria application."
      }
    },
    differentialDiagnosis: {
      name: "Differential Diagnosis & Clinical Reasoning",
      maxPoints: 4,
      criteria: {
        4: "Excellent: Identifies appropriate alternative diagnoses with clear ruling-out rationale. Shows sophisticated clinical reasoning.",
        3: "Good: Considers relevant alternatives with reasonable ruling-out process.",
        2: "Satisfactory: Mentions some alternatives but limited ruling-out rationale.",
        1: "Needs Improvement: Minimal consideration of alternatives or poor reasoning.",
        0: "Insufficient: No differential diagnosis provided or irrelevant alternatives."
      }
    },
    treatmentPlanAppropriateness: {
      name: "Treatment Plan Appropriateness",
      maxPoints: 4,
      criteria: {
        4: "Excellent: Evidence-based treatment plan appropriate for the diagnosis. Includes specific therapy modalities, considers medication, addresses safety/functioning. Demonstrates understanding of treatment principles.",
        3: "Good: Appropriate treatment recommendations, generally evidence-based, minor gaps.",
        2: "Satisfactory: Basic appropriate recommendations but lacking specificity or evidence base.",
        1: "Needs Improvement: Vague or partially inappropriate recommendations.",
        0: "Insufficient: Inappropriate treatment plan or missing entirely."
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateCase = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a clinical psychology case generator for educational purposes. Create a realistic and unique case presentation for ONE mood disorder. Randomly select from: Major Depressive Disorder, Persistent Depressive Disorder (Dysthymia), Bipolar I Disorder, Bipolar II Disorder, or Cyclothymic Disorder.

REQUIREMENTS:
1. Create a fictional client with realistic demographics (age 18-65, occupation, living situation)
2. Generate a presenting problem that brings them to therapy
3. Include complex symptom presentation with at least 2 symptoms that overlap with other diagnoses
4. Vary symptom severity and include duration information
5. Add cultural/contextual factors that might influence presentation
6. Include some protective factors and strengths
7. Make symptoms realistic - not textbook obvious

IMPORTANT: Do NOT reveal the diagnosis. Present only as the client would present themselves.

Format your response as JSON:
{
  "clientName": "First name only",
  "age": number,
  "occupation": "string",
  "presentingProblem": "What brings them to therapy today (2-3 sentences in first person)",
  "background": "Brief relevant background (family, culture, stressors)",
  "actualDiagnosis": "The correct DSM-5-TR diagnosis",
  "keySymptoms": ["list of symptoms they're experiencing"],
  "duration": "How long symptoms have been present",
  "redHerrings": ["symptoms that might suggest other diagnoses"]
}

Return ONLY the JSON, no other text.`
          }],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const caseData = JSON.parse(jsonMatch[0]);
        setClientCase(caseData);
        
        const initialMessage = {
          role: 'assistant',
          content: `Hello, my name is ${caseData.clientName}. ${caseData.presentingProblem}`
        };
        
        setMessages([initialMessage]);
        setStage('interview');
      }
    } catch (error) {
      console.error('Error generating case:', error);
      alert('Error generating case. Please try again.');
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are roleplaying as a client named ${clientCase.clientName} seeking mental health treatment. 

YOUR CHARACTER DETAILS:
- Age: ${clientCase.age}
- Occupation: ${clientCase.occupation}
- Background: ${clientCase.background}
- Actual diagnosis: ${clientCase.actualDiagnosis}
- Key symptoms: ${clientCase.keySymptoms.join(', ')}
- Duration: ${clientCase.duration}
- Red herrings: ${clientCase.redHerrings.join(', ')}

INSTRUCTIONS:
1. Stay completely in character as this client
2. Answer questions naturally and realistically - not clinically
3. Reveal information gradually based on what you're asked
4. Show emotions appropriate to your condition
5. Include realistic details about daily life impact
6. Don't use clinical terminology unless the client would naturally know it
7. Be honest but not overly forthcoming - make the student work for information
8. Include both symptoms and some normal experiences
9. Show insight or lack thereof as appropriate to the condition
10. If asked about something not in your character details, improvise realistically

Remember: You're a real person struggling with mental health, not a textbook case.`,
          messages: [...conversationHistory, { role: 'user', content: inputMessage }],
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, I seem to be having trouble responding right now.' 
      }]);
    }
    setLoading(false);
  };

  const submitDiagnosis = async () => {
    if (!diagnosis.primaryDiagnosis.trim() || !diagnosis.treatmentPlan.trim()) {
      alert('Please complete all required fields (Primary Diagnosis and Treatment Plan).');
      return;
    }

    setLoading(true);
    setStage('feedback');

    try {
      const interviewTranscript = messages.map(msg => 
        `${msg.role === 'user' ? 'Student' : clientCase.clientName}: ${msg.content}`
      ).join('\n\n');

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{
            role: "user",
            content: `You are a clinical supervisor providing feedback and grades on a student's diagnostic assessment.

ACTUAL CASE DETAILS:
- Correct Diagnosis: ${clientCase.actualDiagnosis}
- Key Symptoms: ${clientCase.keySymptoms.join(', ')}
- Duration: ${clientCase.duration}
- Client Background: ${clientCase.background}

STUDENT'S DIAGNOSTIC FORMULATION:
- Primary Diagnosis: ${diagnosis.primaryDiagnosis}
- Differential Diagnoses Considered: ${diagnosis.differentialDiagnoses || 'None provided'}
- DSM-5-TR Criteria Cited: ${diagnosis.dsmCriteria || 'None provided'}
- Treatment Plan: ${diagnosis.treatmentPlan}

INTERVIEW CONDUCTED:
${interviewTranscript}

GRADING RUBRIC (20 points total):

1. INTERVIEW THOROUGHNESS (4 points)
- 4: Excellent: 7+ substantive questions covering all key areas
- 3: Good: 5-6 substantive questions covering most key areas
- 2: Satisfactory: 4-5 questions covering some key areas
- 1: Needs Improvement: 3 or fewer questions, significant gaps
- 0: Insufficient: Minimal questioning

2. DIAGNOSTIC ACCURACY (4 points)
- 4: Excellent: Correct primary diagnosis with appropriate specifiers
- 3: Good: Correct diagnosis category, minor errors in specifiers
- 2: Satisfactory: Related diagnosis (correct disorder family)
- 1: Needs Improvement: Incorrect diagnosis but in related category
- 0: Insufficient: Completely incorrect or missing

3. DSM-5-TR CRITERIA APPLICATION (4 points)
- 4: Excellent: Accurately identifies all relevant criteria with specific evidence
- 3: Good: Identifies most criteria with supporting evidence
- 2: Satisfactory: Identifies some criteria, missing key elements
- 1: Needs Improvement: Vague criteria citation
- 0: Insufficient: No criteria cited or completely inaccurate

4. DIFFERENTIAL DIAGNOSIS & CLINICAL REASONING (4 points)
- 4: Excellent: Identifies appropriate alternatives with clear ruling-out rationale
- 3: Good: Considers relevant alternatives with reasonable process
- 2: Satisfactory: Mentions some alternatives but limited rationale
- 1: Needs Improvement: Minimal consideration of alternatives
- 0: Insufficient: No differential diagnosis provided

5. TREATMENT PLAN APPROPRIATENESS (4 points)
- 4: Excellent: Evidence-based plan appropriate for diagnosis with specifics
- 3: Good: Appropriate recommendations, generally evidence-based
- 2: Satisfactory: Basic appropriate recommendations lacking specificity
- 1: Needs Improvement: Vague or partially inappropriate
- 0: Insufficient: Inappropriate or missing

INSTRUCTIONS:
First, provide your detailed feedback in narrative form covering:
1. Diagnostic accuracy evaluation
2. Interview quality assessment
3. DSM-5-TR criteria application review
4. Differential diagnosis commentary
5. Treatment plan appropriateness
6. Overall clinical reasoning
7. Specific learning points for improvement

Then, at the end, provide grades in this EXACT format:

===== RUBRIC GRADES =====
Interview Thoroughness: [score]/4 - [brief justification]
Diagnostic Accuracy: [score]/4 - [brief justification]
DSM-5-TR Criteria Application: [score]/4 - [brief justification]
Differential Diagnosis & Clinical Reasoning: [score]/4 - [brief justification]
Treatment Plan Appropriateness: [score]/4 - [brief justification]

TOTAL SCORE: [sum]/20

===== END GRADES =====

Be fair, constructive, and educational. Provide specific examples from their work.`
          }],
        })
      });

      const data = await response.json();
      const fullFeedback = data.content[0].text;
      setFeedback(fullFeedback);

      // Parse grades from feedback
      const gradesMatch = fullFeedback.match(/===== RUBRIC GRADES =====([\s\S]*?)===== END GRADES =====/);
      if (gradesMatch) {
        const gradesText = gradesMatch[1];
        const parseGrade = (text, criterion) => {
          const regex = new RegExp(`${criterion}:\\s*(\\d+)/4`);
          const match = text.match(regex);
          return match ? parseInt(match[1]) : 0;
        };

        const parsedGrades = {
          interviewThoroughness: parseGrade(gradesText, 'Interview Thoroughness'),
          diagnosticAccuracy: parseGrade(gradesText, 'Diagnostic Accuracy'),
          dsmCriteriaApplication: parseGrade(gradesText, 'DSM-5-TR Criteria Application'),
          differentialDiagnosis: parseGrade(gradesText, 'Differential Diagnosis & Clinical Reasoning'),
          treatmentPlanAppropriateness: parseGrade(gradesText, 'Treatment Plan Appropriateness')
        };

        parsedGrades.total = Object.values(parsedGrades).reduce((sum, val) => sum + val, 0);
        setGrades(parsedGrades);
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback('Error generating feedback. Please try again.');
    }
    setLoading(false);
  };

  const exportResults = () => {
    const transcript = messages.map(msg => 
      `${msg.role === 'user' ? 'Student' : clientCase.clientName}: ${msg.content}`
    ).join('\n\n');

    const gradesSection = grades ? `
===== AUTOMATED RUBRIC GRADES =====
Interview Thoroughness: ${grades.interviewThoroughness}/4
Diagnostic Accuracy: ${grades.diagnosticAccuracy}/4
DSM-5-TR Criteria Application: ${grades.dsmCriteriaApplication}/4
Differential Diagnosis & Clinical Reasoning: ${grades.differentialDiagnosis}/4
Treatment Plan Appropriateness: ${grades.treatmentPlanAppropriateness}/4

TOTAL SCORE: ${grades.total}/20

NOTE TO INSTRUCTOR: These are AI-generated scores for initial review.
Please verify and adjust as needed in Canvas SpeedGrader.
=====================================
` : '';

    const exportContent = `MOOD DISORDER DIAGNOSTIC TRAINING - SUBMISSION
Session ID: ${sessionId}
Date: ${new Date().toLocaleString()}
Student Name: [Enter your name]

${gradesSection}

===== CASE INFORMATION =====
Client: ${clientCase.clientName}, Age ${clientCase.age}, ${clientCase.occupation}
Presenting Problem: ${clientCase.presentingProblem}

===== INTERVIEW TRANSCRIPT =====
${transcript}

===== STUDENT'S DIAGNOSTIC FORMULATION =====

Primary Diagnosis: ${diagnosis.primaryDiagnosis}

Differential Diagnoses Considered:
${diagnosis.differentialDiagnoses || 'None provided'}

DSM-5-TR Criteria Evidence:
${diagnosis.dsmCriteria || 'None provided'}

Treatment Plan:
${diagnosis.treatmentPlan}

===== CLINICAL SUPERVISOR FEEDBACK =====
${feedback}

===== VERIFICATION =====
Session ID: ${sessionId}
Completed: ${new Date().toLocaleString()}

===== STUDENT REFLECTION (Complete before submission) =====
[Write 1-2 paragraphs reflecting on:
1. What questions helped you most in forming your diagnosis?
2. What would you do differently in a real clinical setting?
3. What surprised you about the feedback?]`;

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Diagnostic_Training_${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setStage('instructions');
    setClientCase(null);
    setMessages([]);
    setInputMessage('');
    setDiagnosis({
      primaryDiagnosis: '',
      differentialDiagnoses: '',
      dsmCriteria: '',
      treatmentPlan: ''
    });
    setFeedback(null);
    setGrades(null);
  };

  const getLetterGrade = (score) => {
    if (score >= 18) return 'A';
    if (score >= 16) return 'B';
    if (score >= 14) return 'C';
    if (score >= 12) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Mood Disorder Diagnostic Training
          </h1>
          <p className="text-gray-600">
            Interactive clinical case simulation for PSY 266: Abnormal Psychology
          </p>
          {sessionId && stage !== 'instructions' && (
            <p className="text-sm text-gray-500 mt-2">Session ID: {sessionId}</p>
          )}
        </div>

        {/* Instructions Stage */}
        {stage === 'instructions' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Learning Objectives:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Apply DSM-5-TR diagnostic criteria for mood disorders</li>
                  <li>Conduct effective clinical interviewing</li>
                  <li>Develop differential diagnoses</li>
                  <li>Create evidence-based treatment plans</li>
                </ul>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <h3 className="font-semibold text-amber-900 mb-2">How This Works:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Generate Case:</strong> A unique client case will be created with realistic mood disorder symptoms</li>
                  <li><strong>Interview Client:</strong> Ask questions to gather diagnostic information (minimum 5-7 substantive questions recommended)</li>
                  <li><strong>Formulate Diagnosis:</strong> Provide your diagnostic assessment with DSM-5-TR criteria and treatment recommendations</li>
                  <li><strong>Receive Feedback & Grades:</strong> Get detailed clinical supervisor feedback and automated rubric scores</li>
                  <li><strong>Export Results:</strong> Download your complete session with grades for Canvas submission</li>
                </ol>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Award size={18} />
                  Grading (20 points total):
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>Interview Thoroughness (4 pts):</strong> Quality and comprehensiveness of questions</li>
                  <li><strong>Diagnostic Accuracy (4 pts):</strong> Correctness of primary diagnosis</li>
                  <li><strong>DSM-5-TR Criteria (4 pts):</strong> Application of diagnostic criteria with evidence</li>
                  <li><strong>Differential Diagnosis (4 pts):</strong> Clinical reasoning and ruling-out process</li>
                  <li><strong>Treatment Plan (4 pts):</strong> Evidence-based and appropriate recommendations</li>
                </ul>
                <p className="text-sm text-purple-800 mt-2 italic">
                  Note: AI provides initial scores for instructor review. Your instructor will verify and may adjust grades in Canvas.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-semibold text-green-900 mb-2">Tips for Success:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Review DSM-5-TR criteria before starting</li>
                  <li>Ask about symptom duration, severity, and functional impairment</li>
                  <li>Explore differential diagnoses (what else could explain symptoms?)</li>
                  <li>Consider ruling out medical causes and substance use</li>
                  <li>Be thorough - each case is unique!</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h3 className="font-semibold text-red-900 mb-2">Important Reminders:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>This is a simulation - treat the client professionally</li>
                  <li>Each student receives a different case</li>
                  <li>Document your clinical reasoning clearly</li>
                  <li>This tool is for educational purposes only</li>
                </ul>
              </div>
            </div>

            <button
              onClick={generateCase}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Case...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Generate Unique Client Case
                </>
              )}
            </button>
          </div>
        )}

        {/* Interview Stage */}
        {stage === 'interview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Clinical Interview</h2>
                  <p className="text-gray-600">Client: {clientCase.clientName}, Age {clientCase.age}</p>
                </div>
                <button
                  onClick={() => setStage('diagnosis')}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Ready to Diagnose
                </button>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Ask open-ended questions about mood, sleep, energy, concentration, 
                  appetite, relationships, work/school functioning, substance use, medical history, and 
                  symptom timeline. Aim for 5-7 substantive questions minimum.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {msg.role === 'user' ? 'You' : clientCase.clientName}
                      </p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        <span className="text-sm">{clientCase.clientName} is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Diagnosis Stage */}
        {stage === 'diagnosis' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Diagnostic Formulation</h2>
              <button
                onClick={() => setStage('interview')}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                ← Back to Interview
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={diagnosis.primaryDiagnosis}
                  onChange={(e) => setDiagnosis({...diagnosis, primaryDiagnosis: e.target.value})}
                  placeholder="e.g., Major Depressive Disorder, Single Episode, Moderate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Differential Diagnoses Considered
                </label>
                <textarea
                  value={diagnosis.differentialDiagnoses}
                  onChange={(e) => setDiagnosis({...diagnosis, differentialDiagnoses: e.target.value})}
                  placeholder="What other diagnoses did you consider and why did you rule them out?"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  DSM-5-TR Criteria Evidence
                </label>
                <textarea
                  value={diagnosis.dsmCriteria}
                  onChange={(e) => setDiagnosis({...diagnosis, dsmCriteria: e.target.value})}
                  placeholder="List specific DSM-5-TR criteria and evidence from the interview that supports your diagnosis"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Treatment Plan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={diagnosis.treatmentPlan}
                  onChange={(e) => setDiagnosis({...diagnosis, treatmentPlan: e.target.value})}
                  placeholder="Provide evidence-based treatment recommendations (e.g., specific therapy modalities, medication considerations, lifestyle interventions)"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={submitDiagnosis}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Feedback & Grades...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Submit for Feedback & Grading
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Feedback Stage */}
        {stage === 'feedback' && feedback && (
          <div className="space-y-4">
            {/* Grades Summary Card */}
            {grades && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Award className="text-purple-600" size={28} />
                    Your Grades
                  </h2>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-600">{grades.total}</div>
                    <div className="text-sm text-gray-600">out of 20</div>
                    <div className="text-2xl font-bold text-gray-700 mt-1">
                      Grade: {getLetterGrade(grades.total)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-semibold text-blue-900 mb-1">Interview Thoroughness</div>
                    <div className="text-2xl font-bold text-blue-700">{grades.interviewThoroughness}/4</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-semibold text-green-900 mb-1">Diagnostic Accuracy</div>
                    <div className="text-2xl font-bold text-green-700">{grades.diagnosticAccuracy}/4</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm font-semibold text-yellow-900 mb-1">DSM-5-TR Criteria</div>
                    <div className="text-2xl font-bold text-yellow-700">{grades.dsmCriteriaApplication}/4</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm font-semibold text-orange-900 mb-1">Differential Diagnosis</div>
                    <div className="text-2xl font-bold text-orange-700">{grades.differentialDiagnosis}/4</div>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg md:col-span-2">
                    <div className="text-sm font-semibold text-pink-900 mb-1">Treatment Plan</div>
                    <div className="text-2xl font-bold text-pink-700">{grades.treatmentPlanAppropriateness}/4</div>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-sm">
                  <p className="text-amber-900">
                    <strong>Note for Students:</strong> These are AI-generated scores to help you understand your performance. 
                    Your instructor will review and may adjust grades in Canvas SpeedGrader.
                  </p>
                </div>
              </div>
            )}

            {/* Detailed Feedback */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Clinical Supervisor Feedback</h2>
              
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Actual Diagnosis:</strong> {clientCase.actualDiagnosis}
                </p>
              </div>

              <div className="prose max-w-none bg-gray-50 p-6 rounded-lg mb-6 whitespace-pre-wrap">
                {feedback}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={exportResults}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileDown size={20} />
                  Export Session with Grades
                </button>
                <button
                  onClick={resetTool}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Start New Case
                </button>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Canvas Submission Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Click "Export Session with Grades" above</li>
                <li>Open the downloaded file and add your name at the top</li>
                <li>Complete the reflection section at the bottom of the file</li>
                <li>Submit the complete file to Canvas</li>
                <li>Your instructor will review the AI-generated grades and finalize your score</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}