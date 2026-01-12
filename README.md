# Mood Disorder Diagnostic Training Tool

Interactive clinical case simulation for PSY 266: Abnormal Psychology
Created for Chandler-Gilbert Community College

## 📋 Overview

This tool provides students with realistic, AI-powered clinical case simulations to practice diagnostic interviewing, DSM-5-TR criteria application, and treatment planning for mood disorders. Each student receives a unique case with automated rubric-based grading.

## ✨ Features

- **Unique Case Generation** - Randomly generates mood disorder cases with realistic presentations
- **Interactive Interviewing** - Students conduct clinical interviews with AI clients
- **Diagnostic Formulation** - Structured assessment forms for systematic evaluation
- **Automated Grading** - AI-generated rubric scores (20 points total)
- **Detailed Feedback** - Clinical supervisor-style feedback on performance
- **Export Function** - Downloads complete session with grades for Canvas submission

## 🚀 Quick Deployment to Vercel (Recommended)

### Prerequisites
- A GitHub account (free)
- A Vercel account (free - sign up at vercel.com)

### Step-by-Step Deployment Instructions

#### Option A: Deploy via GitHub (Recommended - 10 minutes)

1. **Create GitHub Repository**
   - Go to github.com and sign in
   - Click the "+" icon → "New repository"
   - Name it: `mood-disorder-diagnostic-tool`
   - Keep it Public or Private (your choice)
   - Click "Create repository"

2. **Upload Files to GitHub**
   - On your new repository page, click "uploading an existing file"
   - Drag and drop ALL files from the deployment_package folder
   - Write commit message: "Initial commit"
   - Click "Commit changes"

3. **Deploy to Vercel**
   - Go to vercel.com and sign in (or create account with GitHub)
   - Click "Add New..." → "Project"
   - Click "Import" next to your repository
   - Vercel will auto-detect the settings - just click "Deploy"
   - Wait 2-3 minutes for deployment to complete
   - Copy your deployment URL (will look like: `your-project-name.vercel.app`)

4. **Done!** 
   - Your tool is now live at the Vercel URL
   - Share this URL with students via Canvas

#### Option B: Deploy via Vercel CLI (Alternative - 5 minutes if you're comfortable with terminal)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd deployment_package
   vercel
   ```
   
3. Follow the prompts (defaults work fine)

4. Your URL will be displayed after deployment

### Updating the Tool

After deployment, if you need to update:

**Via GitHub:**
1. Edit files directly on GitHub or upload new versions
2. Vercel automatically rebuilds and deploys changes

**Via CLI:**
```bash
cd deployment_package
vercel --prod
```

## 📚 Canvas Integration

### Method 1: External Link (Easiest)
1. In Canvas, create a new Assignment
2. Add description and instructions
3. In the description, paste: "Access the tool here: [your-vercel-url]"
4. Set submission type to "File Upload"
5. Students complete tool, export file, submit to Canvas

### Method 2: Embedded in Assignment (Better UX)
1. Create Assignment in Canvas
2. In the assignment description, click the HTML editor icon (</>)
3. Add this code:
   ```html
   <iframe src="YOUR-VERCEL-URL" width="100%" height="800px" frameborder="0"></iframe>
   ```
4. Students complete embedded tool and export for submission

### Method 3: External Tool Link
1. Go to Canvas Settings → Apps
2. Add "External App" using URL: your-vercel-url
3. Configure as you prefer
4. Add to module or assignment

## 📊 Grading in Canvas

### Rubric Setup (20 points)

The tool automatically provides scores in these categories:

| Criterion | Points | Description |
|-----------|--------|-------------|
| Interview Thoroughness | 4 | Quality and comprehensiveness of questions |
| Diagnostic Accuracy | 4 | Correctness of primary diagnosis |
| DSM-5-TR Criteria Application | 4 | Application of criteria with evidence |
| Differential Diagnosis | 4 | Clinical reasoning and ruling-out process |
| Treatment Plan | 4 | Evidence-based recommendations |

**Create matching Canvas rubric:**
1. In your assignment, click "Add Rubric"
2. Create 5 criteria matching the categories above
3. Set each to 4 points
4. Add rating levels (Excellent: 4, Good: 3, Satisfactory: 2, Needs Improvement: 1, Insufficient: 0)

### SpeedGrader Workflow

1. Student submits exported .txt file
2. Open in SpeedGrader
3. Scroll to top of file - automated grades are listed clearly:
   ```
   ===== AUTOMATED RUBRIC GRADES =====
   Interview Thoroughness: 3/4
   Diagnostic Accuracy: 4/4
   DSM-5-TR Criteria Application: 3/4
   Differential Diagnosis & Clinical Reasoning: 3/4
   Treatment Plan Appropriateness: 4/4
   
   TOTAL SCORE: 17/20
   ```
4. Review the student's work and feedback
5. Transfer scores to Canvas rubric (adjust if needed)
6. Add any instructor comments
7. Submit grade

**Efficiency Tip:** For most students, you can quickly verify the AI grades are appropriate and enter them directly. Only spend time on detailed review when grades seem off or student work needs additional feedback.

## 🎓 Sample Canvas Assignment

### Title
**Mood Disorder Diagnostic Training Exercise**

### Instructions for Students

Complete this interactive diagnostic training exercise to practice clinical interviewing and diagnostic formulation for mood disorders.

**What You'll Do:**
1. Access the Diagnostic Training Tool using the link below
2. Generate a unique client case
3. Conduct a clinical interview (minimum 5-7 substantive questions)
4. Provide your diagnostic formulation using DSM-5-TR criteria
5. Review your feedback and automated scores
6. Export your complete session
7. Add your name and complete the reflection section
8. Submit the file to Canvas

**Access the Tool:** [Insert your Vercel URL here]

**Grading (20 points):**
- Interview Thoroughness: 4 points
- Diagnostic Accuracy: 4 points
- DSM-5-TR Criteria Application: 4 points
- Differential Diagnosis & Clinical Reasoning: 4 points
- Treatment Plan Appropriateness: 4 points

The tool will provide initial automated scores. Your instructor will review and finalize grades.

**Submission Requirements:**
- Complete exported session file (.txt)
- Your name at the top of the file
- Completed reflection section at the bottom

**Due Date:** [Your date]

### Submission Type
- File Upload
- Accept: .txt files

### Rubric
[Create 5 criteria matching the tool's rubric - see Grading section above]

## 🔧 Customization Options

### Changing Disorder Categories
Edit `src/App.jsx` line 52-53 to change disorders:
```javascript
Randomly select from: Major Depressive Disorder, Persistent Depressive Disorder (Dysthymia), 
Bipolar I Disorder, Bipolar II Disorder, or Cyclothymic Disorder.
```

Replace with other disorder categories:
- Anxiety disorders: GAD, Panic Disorder, Social Anxiety, Specific Phobias
- Psychotic disorders: Schizophrenia, Schizoaffective, Brief Psychotic
- Personality disorders: Borderline, Narcissistic, Avoidant, etc.

### Adjusting Point Values
Edit the `RUBRIC` object in `src/App.jsx` (lines 19-67) to change point distributions.

### Modifying Rubric Criteria
Edit rubric criteria descriptions in the same section to match your grading preferences.

## 🛠️ Technical Requirements

**For Students:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- No account or login required

**For Hosting:**
- Vercel account (free tier is sufficient)
- GitHub account (optional but recommended)

## 💰 Cost

**Free Forever!**
- Vercel free tier: Unlimited bandwidth, automatic SSL, global CDN
- No credit card required
- No hidden fees

## 🔐 Privacy & Security

- No student data is stored on servers
- Each session is temporary and exists only during use
- Session IDs are randomly generated for tracking purposes only
- Complies with FERPA guidelines (no PII collected)

## 📞 Support & Troubleshooting

### Common Issues

**Problem:** Deployment fails
**Solution:** Make sure all files are uploaded and package.json is in the root directory

**Problem:** Page shows blank
**Solution:** Check browser console for errors, ensure URL is correct

**Problem:** AI not responding
**Solution:** This uses Claude API which has rate limits - wait 30 seconds and try again

### Need Help?

Contact Jared McDonald at Chandler-Gilbert Community College or submit an issue on GitHub.

## 📄 License

Created for educational use at Maricopa Community College District.
Free to use and modify for educational purposes.

## 🙏 Acknowledgments

Built with:
- React
- Tailwind CSS
- Anthropic Claude API
- Lucide React Icons

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Created By:** Jared McDonald, Chandler-Gilbert Community College  
**Course:** PSY 266 - Abnormal Psychology
