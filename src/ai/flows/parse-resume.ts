'use server';
/**
 * @fileOverview Parses resume data using AI to extract key information.
 *
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ParseResumeOutputSchema = z.object({
  name: z.string().describe('The name of the resume owner.'),
  email: z.string().describe('The email address of the resume owner.'),
  phone: z.string().describe('The phone number of the resume owner.'),
  experience: z.array(z.string()).describe('An array of work experience descriptions.'),
  education: z.array(z.string()).describe('An array of education descriptions.'),
  skills: z.array(z.string()).describe('An array of skills.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const parseResumePrompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an AI expert in parsing resumes.

  Extract the following information from the resume text provided:
  - Name
  - Email
  - Phone
  - Experience (array of strings)
  - Education (array of strings)
  - Skills (array of strings)

  Resume Text: {{{resumeText}}}
  `,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await parseResumePrompt(input);
    return output!;
  }
);
