'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing job descriptions using AI.
 *
 * The flow extracts key requirements, skills, and the full text from the job description.
 *
 * @exports parseJobDescription - The main function to initiate the job description parsing flow.
 * @exports ParseJobDescriptionInput - The input type for the parseJobDescription function.
 * @exports ParseJobDescriptionOutput - The output type for the parseJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the job description parsing flow
const ParseJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description text or data URI.'),
});
export type ParseJobDescriptionInput = z.infer<typeof ParseJobDescriptionInputSchema>;

// Define the output schema for the job description parsing flow
const ParseJobDescriptionOutputSchema = z.object({
  requirements: z.array(z.string()).describe('Key requirements extracted from the job description.'),
  skills: z.array(z.string()).describe('Key skills extracted from the job description.'),
  extractedText: z.string().describe('The full extracted text from the job description.'),
});
export type ParseJobDescriptionOutput = z.infer<typeof ParseJobDescriptionOutputSchema>;

// Exported function to initiate the job description parsing flow
export async function parseJobDescription(input: ParseJobDescriptionInput): Promise<ParseJobDescriptionOutput> {
  return parseJobDescriptionFlow(input);
}

// Define the prompt for parsing the job description
const parseJobDescriptionPrompt = ai.definePrompt({
  name: 'parseJobDescriptionPrompt',
  input: {schema: ParseJobDescriptionInputSchema},
  output: {schema: ParseJobDescriptionOutputSchema},
  prompt: `You are an AI expert at extracting information from job descriptions.

  Your goal is to identify the key requirements, skills, and the full text from the provided job description.

  Job Description:
  {{jobDescription}}

  Please extract the requirements, skills, and the full text from the job description.
  Return the response as a JSON object.
  `,
});

// Define the Genkit flow for parsing the job description
const parseJobDescriptionFlow = ai.defineFlow(
  {
    name: 'parseJobDescriptionFlow',
    inputSchema: ParseJobDescriptionInputSchema,
    outputSchema: ParseJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await parseJobDescriptionPrompt(input);
    return output!;
  }
);
