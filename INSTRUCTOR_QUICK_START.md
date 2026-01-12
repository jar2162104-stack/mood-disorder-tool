# Instructor Quick Start Guide
## Get Your Tool Live in 10 Minutes

### ⚡ Super Quick Deployment (For Non-Technical Instructors)

#### What You Need:
- ☐ Computer with internet
- ☐ Gmail account (to sign up for GitHub & Vercel)
- ☐ 10 minutes of time

---

### Step 1: Create GitHub Account (2 minutes)
1. Go to: **github.com**
2. Click "Sign up"
3. Use your work email
4. Follow the prompts (choose free plan)
5. Verify your email

### Step 2: Upload Files to GitHub (3 minutes)
1. On GitHub, click the **"+"** icon (top right) → **"New repository"**
2. Name it: **mood-disorder-tool**
3. Leave everything else as default
4. Click **"Create repository"**
5. On the next page, click **"uploading an existing file"**
6. Drag ALL files from the **deployment_package** folder into the browser
   - Make sure you include the hidden files (`.gitignore`)
7. Scroll down, click **"Commit changes"**

### Step 3: Deploy to Vercel (3 minutes)
1. Go to: **vercel.com**
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "Add New..." → "Project"
5. Find your **mood-disorder-tool** repository
6. Click **"Import"**
7. Don't change any settings - just click **"Deploy"**
8. Wait 2-3 minutes (grab coffee!)

### Step 4: Get Your URL (1 minute)
1. When deployment finishes, you'll see "Congratulations!"
2. Copy your URL (looks like: `mood-disorder-tool.vercel.app`)
3. Click the URL to test it - you should see your tool!

### Step 5: Add to Canvas (1 minute)
1. Go to your Canvas course
2. Create a new Assignment
3. In the description, paste your Vercel URL
4. Set points to 100
5. Set submission type to "File Upload"
6. Save!

---

## 🎯 Quick SpeedGrader Workflow

When grading submissions:

1. **Open student's .txt file**
2. **Look at the top** - you'll see:
   ```
   Interview Thoroughness: 3/4
   Diagnostic Accuracy: 4/4
   DSM-5-TR Criteria: 3/4
   Differential Diagnosis: 3/4
   Treatment Plan: 4/4
   
   TOTAL: 17/20
   ```
3. **Skim the feedback** - does it look reasonable?
4. **Enter grades into Canvas** rubric
5. **Adjust if needed** (you're still in control!)
6. **Done!**

**Average grading time:** 2-3 minutes per student (vs 15-20 for traditional diagnostic case)

---

## 📋 Sample Canvas Assignment Text (Copy/Paste Ready)

```
MOOD DISORDER DIAGNOSTIC TRAINING

In this assignment, you'll practice clinical interviewing and diagnostic formulation using an AI-powered simulation tool. Each student will receive a unique case.

INSTRUCTIONS:
1. Access the tool: [PASTE YOUR VERCEL URL HERE]
2. Click "Generate Unique Client Case"
3. Conduct a thorough interview (minimum 5-7 questions)
4. Complete your diagnostic formulation
5. Review your feedback and scores
6. Click "Export Session with Grades"
7. Open the downloaded file and add your name at the top
8. Complete the reflection section at the bottom
9. Submit the file here

GRADING (20 points):
- Interview Thoroughness: 4 pts
- Diagnostic Accuracy: 4 pts
- DSM-5-TR Criteria Application: 4 pts
- Differential Diagnosis: 4 pts
- Treatment Plan: 4 pts

The tool provides automated scores, which I will review and may adjust.

SUBMISSION:
- Upload your completed .txt file
- Must include your name and reflection
```

---

## 🆘 Troubleshooting

**Q: The deployment failed!**
A: Make sure you uploaded ALL files including package.json. Try again.

**Q: Students see a blank page**
A: The deployment might still be processing. Wait 5 minutes and refresh.

**Q: A student's exported file has weird formatting**
A: They should open in a text editor (Notepad, TextEdit) not Word.

**Q: The AI grades seem off for a student**
A: That's why you review! Just adjust in Canvas as you would with any rubric.

**Q: Can I change the disorders covered?**
A: Yes! See the full README for customization instructions, or contact me.

**Q: How much does this cost?**
A: $0. Vercel's free tier is more than enough for a class.

---

## 💡 Pro Tips

1. **Test it yourself first** - Generate a case and go through the whole process
2. **Do a live demo** in class - Students learn better when they see it
3. **Create a practice version** - Deploy twice, give students a "practice" URL to try
4. **Share the URL early** - Let students play with it before the graded assignment
5. **Keep the feedback** - Look for patterns in what students struggle with

---

## 📞 Need More Help?

**Technical Issues:**
- Check the full README.md file
- Email: jared.mcdonald@cgc.edu

**Pedagogical Questions:**
- Happy to discuss implementation strategies
- Can provide additional assessment ideas

---

**You've got this!** 🎉

Remember: This is easier than setting up a new discussion board in Canvas. If you can create an assignment, you can deploy this tool.
