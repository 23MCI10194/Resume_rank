'use server';

/**
 * @fileOverview Scores a resume against a job description, providing match scores and analysis.
 *
 * - scoreResume - Scores the resume and job description.
 * - rescoreResume - Scores the resume and job description assuming the user has updated their resume with new skills.
 * - ScoreResumeInput - The input type for the scoring functions.
 * - ScoreResumeOutput - The return type for the scoring functions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillSchema = z.object({
  name: z.string().describe('The name of the skill.'),
  hasSkill: z.boolean().describe('Whether the resume possesses this skill.'),
});

const ScoreResumeInputSchema = z.object({
  resumeText: z.string().describe('Full text content of the resume.'),
  jobDescriptionText: z.string().describe('Full text content of the job description.'),
});
export type ScoreResumeInput = z.infer<typeof ScoreResumeInputSchema>;

const ScoreResumeOutputSchema = z.object({
  score: z.number().describe('Overall match score between 0 and 100.'),
  atsScore: z.number().describe('ATS-friendliness score between 0 and 100.'),
  breakdown: z.string().describe('Detailed analysis of the scores.'),
  primarySkills: z.array(SkillSchema).describe('Key skills from the job description and their presence in the resume.'),
  secondarySkills: z.array(SkillSchema).describe('Additional skills from the job description and their presence in the resume.'),
});
export type ScoreResumeOutput = z.infer<typeof ScoreResumeOutputSchema>;

export async function scoreResume(input: ScoreResumeInput): Promise<ScoreResumeOutput> {
  return scoreResumeFlow(input);
}

export async function rescoreResume(input: ScoreResumeInput): Promise<ScoreResumeOutput> {
  return rescoreResumeFlow(input);
}

const scoreResumePrompt = ai.definePrompt({
  name: 'scoreResumePrompt',
  input: {schema: ScoreResumeInputSchema},
  output: {schema: ScoreResumeOutputSchema},
  prompt: `You are an AI resume analyzer. Analyze the resume text against the job description text and provide the following:

  - score: Overall match score (0-100).
  - atsScore: ATS-friendliness score (0-100).
  - breakdown: Detailed analysis of the scores.
  - primarySkills: Key skills from the job description and whether they are present in the resume.
  - secondarySkills: Additional skills from the job description and their presence in the resume.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescriptionText}}`,
});

const rescoreResumePrompt = ai.definePrompt({
  name: 'rescoreResumePrompt',
  input: {schema: ScoreResumeInputSchema},
  output: {schema: ScoreResumeOutputSchema},
  prompt: `You are an AI resume analyzer. A user has updated their resume with new skills, so please provide a higher, more encouraging score than before. Analyze the resume text against the job description text and provide the following:

  - score: Overall match score (0-100). Make sure it is higher than the original score.
  - atsScore: ATS-friendliness score (0-100).  Make sure it is higher than the original score.
  - breakdown: Detailed analysis of the scores.
  - primarySkills: Key skills from the job description and whether they are present in the resume.
  - secondarySkills: Additional skills from the job description and their presence in the resume.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescriptionText}}`,
});

const scoreResumeFlow = ai.defineFlow(
  {
    name: 'scoreResumeFlow',
    inputSchema: ScoreResumeInputSchema,
    outputSchema: ScoreResumeOutputSchema,
  },
  async input => {
    const {output} = await scoreResumePrompt(input);
    return output!;
  }
);

const rescoreResumeFlow = ai.defineFlow(
  {
    name: 'rescoreResumeFlow',
    inputSchema: ScoreResumeInputSchema,
    outputSchema: ScoreResumeOutputSchema,
  },
  async input => {
    const {output} = await rescoreResumePrompt(input);
    return output!;
  }
);
