'use client';
import { useActionState } from 'react';
import { analyzeResumeAction } from '@/app/actions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ActionState } from '@/lib/types';
import AnalysisFormFields from './analysis-form-fields';
import AnalysisResult from './analysis-result';

const initialState: ActionState = {};

export default function AnalysisFormWrapper() {
  const [state, formAction] = useActionState(analyzeResumeAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleAction = (formData: FormData) => {
    // Check if files are selected to decide to show skeleton
    const resumeFile = formData.get('resume') as File;
    const jdText = formData.get('jobDescriptionText') as string;
    const jdFile = formData.get('jobDescriptionFile') as File;

    if (!resumeFile || resumeFile.size === 0 || (!jdText && (!jdFile || jdFile.size === 0))) {
        // Let server-side validation handle detailed errors
        return formAction(formData);
    }
    
    formAction(formData);
  };

  return (
    <form ref={formRef} action={handleAction}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <AnalysisFormFields errors={state.errors} />
        <div className="lg:sticky top-8">
          <AnalysisResult result={state.result} />
        </div>
      </div>
    </form>
  );
}
