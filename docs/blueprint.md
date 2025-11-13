# **App Name**: Clyptus Rank

## Core Features:

- Resume Upload and Processing: Allow users to upload resumes in .pdf, .docx, or .txt format and process them for analysis. The app must handle conversion from .docx to text using the Mammoth tool.
- Job Description Input: Provide options for users to input job descriptions, either by pasting text or uploading a file (.pdf, .docx, .txt, .png, .jpg).
- AI-Powered Resume Parsing: Use Genkit with Google's Gemini model to parse resume content and extract structured data (name, email, phone, experience, education, skills).
- AI-Powered Job Description Parsing: Employ AI to extract key requirements, skills, and the full text from the job description. This is a Genkit flow.
- Resume Scoring and Analysis: Generate a match score (0-100) and ATS-friendliness score (0-100) by comparing the resume and job description, along with a detailed textual breakdown, primary and secondary skill assessment.
- Dynamic Re-Scoring on Skill Additions: Enable users to add missing skills to their resume and trigger an immediate re-scoring using a separate AI flow to reflect the updated resume and achieve an improved, encouraging score.
- Report Generation: Allow users to download a .txt report summarizing the analysis, and after adding skills, a .txt file with the updated resume content.

## Style Guidelines:

- Primary color: Indigo (#4F669B) for a professional and trustworthy feel.
- Background color: Light off-white (#FAF9F6) to provide a clean and modern canvas.
- Accent color: Teal (#008080) to draw attention to key actions and highlights.
- Body text: 'Inter' (sans-serif) for readability and a modern feel.
- Headline font: 'Space Grotesk' (sans-serif) for a tech-forward and attention-grabbing feel.
- Use lucide-react icons (Bot, Download, PlusCircle, CheckCircle2, etc.) to enhance the UI and provide visual cues.
- Employ a responsive two-column layout that stacks vertically on smaller screens for optimal viewing on mobile devices.
- Use subtle animations such as animated counters in progress indicators and loading skeletons to enhance UX.