'use server';

import { AnalysisFormSchema } from '@/lib/schemas';
import type { ActionState } from '@/lib/types';
import { parseJobDescription } from '@/ai/flows/parse-job-description';
import { parseResume } from '@/ai/flows/parse-resume';
import { rescoreResume, scoreResume } from '@/ai/flows/score-resume';
import mammoth from 'mammoth';
import type { ScoreResumeOutput } from '@/ai/flows/score-resume';

async function fileToTextOrDataUri(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (file.type.startsWith('text/')) {
    return buffer.toString('utf8');
  }
  
  // For PDF and images, return a data URI for Genkit
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function analyzeResumeAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = AnalysisFormSchema.safeParse({
    resume: formData.get('resume'),
    jobDescriptionText: formData.get('jobDescriptionText') || undefined,
    jobDescriptionFile: formData.get('jobDescriptionFile'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { resume: resumeFile, jobDescriptionText, jobDescriptionFile } = validatedFields.data;

  try {
    const resumeContentPromise = fileToTextOrDataUri(resumeFile);
    const jobDescriptionContentPromise = jobDescriptionFile
      ? fileToTextOrDataUri(jobDescriptionFile)
      : Promise.resolve(jobDescriptionText!);

    const [resumeContent, jobDescriptionContent] = await Promise.all([
      resumeContentPromise,
      jobDescriptionContentPromise,
    ]);

    const [resumeData, jdData] = await Promise.all([
      parseResume({ resumeText: resumeContent }),
      parseJobDescription({ jobDescription: jobDescriptionContent }),
    ]);

    const rawResumeText = resumeContent.startsWith('data:')
      ? `${resumeData.name}\n${resumeData.email}\n${resumeData.phone}\n\nExperience:\n${resumeData.experience.join('\n\n')}\n\nEducation:\n${resumeData.education.join('\n\n')}\n\nSkills:\n${resumeData.skills.join(', ')}`
      : resumeContent;

    const rawJdText = jdData.extractedText;

    const scoreData = await scoreResume({
      resumeText: rawResumeText,
      jobDescriptionText: rawJdText,
    });

    return {
      result: {
        score: scoreData,
        resume: resumeData,
        jd: jdData,
        rawResume: rawResumeText,
      },
    };
  } catch (e: any) {
    console.error('Error in analyzeResumeAction:', e);
    return {
      error: e.message || 'An unexpected error occurred during analysis.',
    };
  }
}

export async function rescoreResumeAction(
  resumeText: string,
  jobDescriptionText: string
): Promise<{ error?: string; score?: ScoreResumeOutput }> {
  if (!resumeText || !jobDescriptionText) {
    return { error: 'Missing data for re-scoring.' };
  }

  try {
    const newScoreData = await rescoreResume({
      resumeText,
      jobDescriptionText,
    });
    return { score: newScoreData };
  } catch (e: any) {
    console.error('Error in rescoreResumeAction:', e);
    return { error: 'Failed to re-score resume.' };
  }
}
