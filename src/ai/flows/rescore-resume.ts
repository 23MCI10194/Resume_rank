// src/ai/flows/rescore-resume.ts
'use server';

/**
 * @fileOverview Rescores the resume after the user has added skills.
 *
 * - rescoreResume - A function that handles the resume rescoring process after skills are added.
 * - RescoreResumeInput - The input type for the rescoreResume function.
 * - RescoreResumeOutput - The return type for the rescoreResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RescoreResumeInputSchema = z.object({
  resumeText: z.string().describe('The updated resume text with added skills.'),
  jobDescriptionText: z.string().describe('The job description text.'),
});
export type RescoreResumeInput = z.infer<typeof RescoreResumeInputSchema>;

const RescoreResumeOutputSchema = z.object({
  score: z.number().describe('The overall match score (0-100).'),
  atsScore: z.number().describe('An ATS-friendliness score (0-100).'),
  breakdown: z.string().describe('A detailed text analysis of the scores.'),
  primarySkills: z.array(
    z.object({
      name: z.string().describe('The name of the skill.'),
      hasSkill: z.boolean().describe('Whether the resume has the skill.'),
    })
  ).
    describe('Key primary skills from the job description and their presence in the resume'),
  secondarySkills: z.array(
    z.object({
      name: z.string().describe('The name of the skill.'),
      hasSkill: z.boolean().describe('Whether the resume has the skill.'),
    })
  ).
    describe('Key secondary skills from the job description and their presence in the resume'),
});
export type RescoreResumeOutput = z.infer<typeof RescoreResumeOutputSchema>;

export async function rescoreResume(input: RescoreResumeInput): Promise<RescoreResumeOutput> {
  return rescoreResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rescoreResumePrompt',
  input: {schema: RescoreResumeInputSchema},
  output: {schema: RescoreResumeOutputSchema},
  prompt: `You are an AI resume expert. You will take the resume and job description and provide a score, an ATS score and a breakdown of the scores.

    Resume:
    {{resumeText}}

    Job Description:
    {{jobDescriptionText}}

    Instructions: Provide an encouraging and slightly higher score than the initial score due to the user adding new skills to their resume.

    Output the response in JSON format. Include "score", "atsScore", "breakdown", "primarySkills", and "secondarySkills".
    The score and atsScore must be between 0 and 100.
    The breakdown is a detailed text analysis of the scores.
    primarySkills & secondarySkills are arrays of objects { name: string, hasSkill: boolean } identifying key skills from the job description and whether they are present in the resume.
    `,
});

const rescoreResumeFlow = ai.defineFlow(
  {
    name: 'rescoreResumeFlow',
    inputSchema: RescoreResumeInputSchema,
    outputSchema: RescoreResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
