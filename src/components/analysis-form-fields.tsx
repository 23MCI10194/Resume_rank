'use client';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FileInput } from './file-input';
import { Label } from './ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Resume'
      )}
    </Button>
  );
}

type AnalysisFormFieldsProps = {
    errors?: Record<string, string[] | undefined>
}

export default function AnalysisFormFields({ errors }: AnalysisFormFieldsProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Resume Analysis</CardTitle>
        <CardDescription>Upload your documents to begin the AI-powered analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <FileInput
            label="Your Resume*"
            id="resume"
            name="resume"
            accept=".pdf,.docx,.txt"
          />
          {errors?.resume && <p className="text-sm font-medium text-destructive">{errors.resume[0]}</p>}
        </div>

        <Tabs defaultValue="paste" className="w-full">
          <Label>Job Description*</Label>
          <TabsList className="grid w-full grid-cols-2 mt-1.5">
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>
          <TabsContent value="paste">
            <div className="space-y-1">
                <Textarea
                    name="jobDescriptionText"
                    placeholder="Paste the job description here..."
                    className="min-h-[200px]"
                />
                {errors?.jobDescriptionText && <p className="text-sm font-medium text-destructive">{errors.jobDescriptionText[0]}</p>}
            </div>
          </TabsContent>
          <TabsContent value="upload">
            <div className="space-y-1">
                <FileInput
                    label=""
                    id="jobDescriptionFile"
                    name="jobDescriptionFile"
                    accept=".pdf,.docx,.txt,.png,.jpg"
                />
                {errors?.jobDescriptionFile && <p className="text-sm font-medium text-destructive">{errors.jobDescriptionFile[0]}</p>}
            </div>
          </TabsContent>
        </Tabs>
        
        <SubmitButton />
      </CardContent>
    </Card>
  );
}
