'use client';
import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import CircularProgress from './circular-progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckCircle2, XCircle, PlusCircle, Download, Loader2, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useTransition, useEffect } from 'react';
import { rescoreResumeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import type { ScoreResumeOutput } from '@/ai/flows/score-resume';
import jsPDF from 'jspdf';

function downloadTextFile(content: string, filename: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const SkillsTable = ({ title, skills, onAddSkill, isRescoring }: { title: string, skills: ScoreResumeOutput['primarySkills'], onAddSkill: (skill: string) => void, isRescoring: boolean }) => (
  <Card>
    <CardHeader>
      <CardTitle className='font-headline text-xl'>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead className="text-center">In Resume</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.name}>
              <TableCell className="font-medium">{skill.name}</TableCell>
              <TableCell className="text-center">
                {skill.hasSkill ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 inline" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive inline" />
                )}
              </TableCell>
              <TableCell className="text-right">
                {!skill.hasSkill && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddSkill(skill.name)}
                    disabled={isRescoring}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function Dashboard({ analysis }: { analysis: AnalysisResult }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(analysis);
  const [updatedResumeText, setUpdatedResumeText] = useState(analysis.rawResume);
  const [addedSkills, setAddedSkills] = useState<string[]>([]);
  const [isRescoring, startRescoreTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentAnalysis(analysis);
    setUpdatedResumeText(analysis.rawResume);
    setAddedSkills([]);
  }, [analysis]);

  const { score, atsScore, breakdown, primarySkills, secondarySkills } = currentAnalysis.score;
  const { name, email, phone, experience, education, skills: resumeSkills } = currentAnalysis.resume;
  const { requirements, skills: jdSkills } = currentAnalysis.jd;

  const handleAddSkill = (skillName: string) => {
    const newResumeText = `${updatedResumeText}\n\n# Added by Clyptus Rank:\n- ${skillName}`;
    setUpdatedResumeText(newResumeText);
    setAddedSkills(prev => [...prev, skillName]);

    startRescoreTransition(async () => {
      const result = await rescoreResumeAction(newResumeText, currentAnalysis.jd.extractedText);
      if (result.error) {
        toast({ variant: 'destructive', title: 'Re-scoring failed', description: result.error });
      } else if (result.score) {
        setCurrentAnalysis(prev => ({ ...prev, score: result.score! }));
        toast({ title: 'Resume Re-scored!', description: 'Your match score has been updated.' });
      }
    });
  };

  const handleDownloadReport = () => {
    const reportContent = `
Clyptus Rank Analysis Report
=============================

Overall Score: ${score}/100
ATS Friendliness: ${atsScore}/100

AI Breakdown:
----------------
${breakdown}

Primary Skills Match:
---------------------
${primarySkills.map(s => `${s.name}: ${s.hasSkill ? '✓' : '✗'}`).join('\n')}

Secondary Skills Match:
-----------------------
${secondarySkills.map(s => `${s.name}: ${s.hasSkill ? '✓' : '✗'}`).join('\n')}

Extracted Resume Details:
-------------------------
Name: ${name}
Contact: ${email} | ${phone}
Experience:
${experience.map(e => `- ${e}`).join('\n')}
Education:
${education.map(e => `- ${e}`).join('\n')}
Skills: ${resumeSkills.join(', ')}

Job Description Requirements:
-----------------------------
${requirements.map(r => `- ${r}`).join('\n')}
`;
    downloadTextFile(reportContent, 'clyptus-rank-report.txt');
  };

  const handleDownloadResume = () => {
    const doc = new jsPDF();
    doc.text(updatedResumeText, 10, 10);
    doc.save('updated-resume.pdf');
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Analysis Complete</CardTitle>
          <CardDescription>Here is the breakdown of your resume against the job description.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-around items-center gap-8">
          <CircularProgress value={score} label="Overall Match Score" />
          <CircularProgress value={atsScore} label="ATS Friendliness Score" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <CardTitle className="font-headline text-xl">AI Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {breakdown}
        </CardContent>
      </Card>

      <SkillsTable title="Primary Skills" skills={primarySkills} onAddSkill={handleAddSkill} isRescoring={isRescoring} />
      <SkillsTable title="Secondary Skills" skills={secondarySkills} onAddSkill={handleAddSkill} isRescoring={isRescoring} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-headline text-xl">Resume Details</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><p className="font-semibold">Name</p><p>{name}</p></div>
            <div><p className="font-semibold">Contact</p><p>{email} | {phone}</p></div>
            <Separator />
            <div><p className="font-semibold">Experience</p><ul className="list-disc list-inside space-y-1 mt-1">{experience.map((e, i) => <li key={i}>{e}</li>)}</ul></div>
            <Separator />
            <div><p className="font-semibold">Education</p><ul className="list-disc list-inside space-y-1 mt-1">{education.map((e, i) => <li key={i}>{e}</li>)}</ul></div>
            <Separator />
            <div><p className="font-semibold">Skills</p><p className="text-muted-foreground">{resumeSkills.join(', ')}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-headline text-xl">Job Description Details</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><p className="font-semibold">Key Requirements</p><ul className="list-disc list-inside space-y-1 mt-1">{requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
            <Separator />
            <div><p className="font-semibold">Required Skills</p><p className="text-muted-foreground">{jdSkills.join(', ')}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-headline text-xl">Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
          <Button onClick={handleDownloadResume} disabled={addedSkills.length === 0} variant="secondary">
            {isRescoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Download Updated Resume
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
