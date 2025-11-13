import AnalysisFormWrapper from "@/components/analysis-form-wrapper";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Clyptus Rank
        </h1>
        <p className="text-muted-foreground mt-2 md:text-lg">
          Get an AI-powered analysis of your resume against any job description.
        </p>
      </header>
      <AnalysisFormWrapper />
    </main>
  );
}
