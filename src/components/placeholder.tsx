import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function Placeholder() {
  return (
    <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed shadow-none min-h-[500px]">
      <CardHeader className="items-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full">
          <Bot className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl mt-4">Start Your Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground max-w-sm">
          Upload your resume and a job description to get started. Our AI will provide a detailed analysis and match score.
        </p>
      </CardContent>
    </Card>
  );
}
