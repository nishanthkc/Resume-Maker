import type { ResumeFormData } from '@/types/resume-form';
import { getLatexTemplate } from '@/utils/template-utils';

/**
 * Builds the LLM prompt for resume tailoring based on user inputs
 * @param formData - Complete form data including resume, JD, job role, template, and personalization
 * @returns Complete prompt string ready for OpenAI API
 */
export function buildResumePrompt(formData: ResumeFormData): string {
  // Validate required fields
  if (!formData.resumeFile) {
    throw new Error('Resume file is required');
  }
  
  if (!formData.template) {
    throw new Error('Template is required');
  }

  // Extract values
  const extractedData = formData.resumeFile.extractedText;
  const jobDescription = formData.jobDescription;
  const jobRole = formData.jobRole;
  const resumeTemplate = formData.template;
  const personalizationPrompt = formData.personalizationPrompt.trim() || undefined;

  // Check if template is "your-format" for conditional rules
  const isYourFormat = resumeTemplate === 'your-format';

  // Build IMPORTANT RULES section (only for "your-format")
  const importantRulesSection = isYourFormat ? `
**IMPORTANT RULES**:  

- **MOST IMPORTANT: USE THE SAME FORMAT, DO NOT CHANGE ANY SPACING/FORMATTING/HEADINGS/SECTIONS IN THE RESUME. I CANNOT HAVE FORMAT/SYNTAX ERRORS** (so that it doesn't change main styles and spacing in templates and only added tailored content)

- MAKE CHANGES ONLY between where it says CHANGES START HERE to CHANGES END HERE. KEEP THE COMMENTS AS WELL (i used 'MAKE CHANGES ONLY' in my resume latex but this will not be there in general we need to specify how to change in prompt. Same goes with 'EXTRA CHANGES START HERE')

- The points cannot exceed 2 lines as the resume has only 1 page

- *MAKE THE POINTS IN Experience and Projects sections DETAILED AND RICH OF ACTION VERBS, KEYWORDS etc AND NOT VERY SMALL POINTS. REFER TO HOW IT IS WRITTEN IN MY RESUME.*

- Where it says, **EXTRA CHANGES START HERE**, ACT AS AN EXPERT ${jobRole.toUpperCase()} AND you can write only *2* new points to make sure you cover all the necessary things needed to make this the best resume for the job. THESE POINTS MUST BE REALISTIC AND TECHNICALLY PLAUSIBLE.

- MAKE UP EXPERIENCE: Always try to *make up/invent realistic, plausible* points if there are any technical, managerial, or analytical points are missing, and will add much strength to my resume as if you're an expert in the field.

For example: If I made a web application in python but job description needs Java then change the tech stack and its relevant frameworks accordingly. IF the point is not realistic then make up and entire new made up point

- *MAKE SURE YOU DON'T REPEAT ANY ACTION VERBS MORE THAN 2 TIMES*

` : '';

  // Build personalization step
  const personalizationStep = personalizationPrompt
    ? `7. User personalization prompt from user if provided: ${personalizationPrompt}. If user says make up experience only then apply MAKE UP EXPERIENCE`
    : '7. User personalization prompt from user if provided: (none provided)';

  // Get LaTeX template example based on selected template
  // For 'your-format', pass extractedData to use user's actual resume as template
  const latexTemplate = getLatexTemplate(resumeTemplate, extractedData);

  // Build the complete prompt
  const prompt = `You are an expert hiring manager, professional resume writer, and an expert ${jobRole}.

You will receive:

1. A job description (JD) of the job I want to apply for

2. My resume(extracted data from users resume)

YOUR TASK: Think deeply on how you can tailor my resume to best fit the job and return **just latex code for resume in the format of the TEMPLATE** and nothing else, no explanation nothing

${importantRulesSection}IMPORTANT: Look at how detailed and rich my points are in my resume, i expect similar points. The resume can take upto 600 words in total.

This is the main part so don't change much

Your tasks: (this is very important)

1. **Spot the Flaws**

   - Critically analyze the resume as a hiring manager for this job.

   - Identify vague language, weak bullet points, formatting issues, or missing quantifiable achievements.

   - Be brutally honest — list all flaws.

2. **Rewrite**

   - Rewrite the entire resume in LaTeX format.

   - Make it concise, achievement-oriented, and metrics-driven.

   - Emphasize results and impact using numbers (percentage improvements, savings, time reductions, etc.)

   - Ensure bullet points use strong action verbs and match keywords in the JD.

3. **ATS Optimization**

   - Rewrite to include relevant technical and soft skills from the JD.

   - Make the resume ATS-friendly (no tables, graphics, or unusual fonts).

4. **Skills Section Enhancement**

   - Ensure all the tech related keywords are present, make sure to add the skills needed for this job.

5. **Experience Section Enhancement**

   - *MAKE THE POINTS IN Experience and Projects sections DETAILED AND RICH OF ACTION VERBS, KEYWORDS etc and not very small points. refer the points in my resume*

   - Remove points that are not relevant to the JD

   - Use MAKE UP EXPERIENCE when needed and add/replace points that strengthen/replace weak points for the job. Make strong bullet points like in my resume.

   - No more than 5 points in a section

   - Ensure each bullet follows the "XYZ format": *Accomplished X by doing Y, resulting in Z.*

   - Use Action Verbs like Built, Optimized, Designed, Developed, Collaborated, Engineered, Led, Owned. Use Impact:
Use metrics wherever possible. For example: "Reduced processing time by 30%" is stronger than "Improved performance."

   - Use EXTRA CHANGES START HERE to write only *2* new points to make sure you cover all the necessary points required for the job. Use MAKE UP EXPERIENCE for this

   - Bold important keywords

6. **Projects Section Enhancement**

   - As a domain expert, check if the listed Projects fully fits the JD, if not use MAKE UP EXPERIENCE when needed and add/replace points that strengthen/replace weak points for the job. Make strong bullet points like in my resume.

   - Use Action Verbs like Built, Deployed, Integrated, Prototyped, Automated etc. Use Impact: Show innovation, real-world use, and recognition (e.g., awards or publications).

- EXTRA CHANGES START HERE in Projects:
If the JD still expects something that is missing from my current projects, you may replace or extend exactly one project with a new, made up but realistic project that fills that gap. This new project must:   

   - Use the tech and domain that the JD cares about

   - Be clearly something a student could build alone

   - Have only two bullet points, both detailed and written in the same rich style as my existing projects (like TravelBuddy), with concrete responsibilities and plausible impact.

   - Do not invent fake corporate level impact numbers. Keep impact numbers small and believable for a personal or academic project.

   - Bold important keywords and technologies that match the JD, just like in the TravelBuddy example.

   - Make sure the writing style of all project bullets matches the rest of my resume: detailed, specific, and grounded in what I did, not buzzwords.

${personalizationStep}

Finally, return **just latex code for resume** and nothing else, no explanation nothing.

---

${isYourFormat 
  ? `**USER RESUME TEMPLATE** (This is the user's actual resume LaTeX structure. Use this exact format and structure, making changes only as specified):`
  : `**TEMPLATE** (Use this LaTeX Template structure and formatting to make the resume):`
}
${latexTemplate}

`;

  return prompt;
}

