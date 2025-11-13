import type { ParseJobDescriptionOutput } from '@/ai/flows/parse-job-description';
import type { ParseResumeOutput } from '@/ai/flows/parse-resume';
import type { ScoreResumeOutput } from '@/ai/flows/score-resume';
import type { ZodIssue } from 'zod';

export type AnalysisResult = {
  score: ScoreResumeOutput;
  resume: ParseResumeOutput;
  jd: ParseJobDescriptionOutput;
  rawResume: string;
};

export type ActionState = {
  error?: string;
  result?: AnalysisResult;
  errors?: Record<string, string[] | undefined>
};
