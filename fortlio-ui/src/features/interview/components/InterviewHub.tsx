import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InterviewBadge } from './InterviewBadge';
import type {
  IInterviewSession,
  IStartInterviewPayload,
  InterviewType,
  TargetLevel,
} from '../types';
import {
  Sparkles,
  Briefcase,
  Layers,
  ArrowRight,
  History,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

interface InterviewHubProps {
  history: IInterviewSession[];
  historyLoading: boolean;
  isStarting: boolean;
  onStartSession: (payload: IStartInterviewPayload) => Promise<unknown>;
  onSelectSession: (sessionId: string) => void;
}

const PROFESSIONS = [
  'Engineering & Technology',
  'Healthcare & Medicine',
  'Legal, Compliance & Risk',
  'Finance & Accounting',
  'Product, Design & Creative',
  'Science & Biotechnology',
  'Marketing & Communications',
  'Operations & Management',
];

const SPECIALTY_SUGGESTIONS: Record<string, string[]> = {
  'Engineering & Technology': [
    'Distributed Systems',
    'Cloud Architecture',
    'Full Stack TypeScript',
    'Data Platform Engineering',
    'AI / Machine Learning Systems',
  ],
  'Healthcare & Medicine': [
    'Internal Medicine',
    'Clinical Operations',
    'Biostatistics & Epidemiology',
    'Healthcare Informatics',
  ],
  'Legal, Compliance & Risk': [
    'Corporate IP & Tech Law',
    'Regulatory Compliance & Privacy',
    'Commercial Contract Negotiation',
  ],
  'Finance & Accounting': [
    'Quantitative Risk Modeling',
    'Corporate Financial Planning & Analysis',
    'Fintech & Payment Systems',
  ],
  'Product, Design & Creative': [
    'Product Strategy & Discovery',
    'Design Systems & Interaction Architecture',
    'UX Research & Analytics',
  ],
  'Science & Biotechnology': [
    'Genomic Data Analysis',
    'Pharmaceutical Drug Development',
    'Computational Biology',
  ],
  'Marketing & Communications': [
    'Growth & Product-Led Marketing',
    'Brand Strategy & Corporate Comms',
    'Lifecycle Analytics',
  ],
  'Operations & Management': [
    'Supply Chain Optimization',
    'Program Management & Agile Transformation',
    'Business Operations',
  ],
};

const TARGET_LEVELS: TargetLevel[] = [
  'Junior',
  'Mid',
  'Senior',
  'Staff / Principal',
  'Executive',
];

const INTERVIEW_TYPES: { id: InterviewType; label: string; description: string }[] = [
  {
    id: 'domain_technical',
    label: 'Domain Deep-Dive',
    description: 'Rigorous assessment of core technical concepts, paradigms, and problem-solving',
  },
  {
    id: 'behavioral_leadership',
    label: 'Behavioral & Leadership',
    description: 'STAR-format scenarios evaluating mentorship, cross-team alignment, and trade-offs',
  },
  {
    id: 'case_study',
    label: 'Real-World Case Study',
    description: 'Open-ended problem architecture from diagnosis to production execution',
  },
];

export const InterviewHub: React.FC<InterviewHubProps> = ({
  history,
  historyLoading,
  isStarting,
  onStartSession,
  onSelectSession,
}) => {
  const [selectedProfession, setSelectedProfession] = useState(PROFESSIONS[0]);
  const [specialty, setSpecialty] = useState('Distributed Systems');
  const [targetLevel, setTargetLevel] = useState<TargetLevel>('Senior');
  const [interviewType, setInterviewType] = useState<InterviewType>('domain_technical');

  const handleProfessionChange = (prof: string) => {
    setSelectedProfession(prof);
    const defaults = SPECIALTY_SUGGESTIONS[prof] || [];
    if (defaults.length > 0) {
      setSpecialty(defaults[0]);
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialty.trim() || isStarting) {return;}

    await onStartSession({
      profession: selectedProfession,
      specialty: specialty.trim(),
      targetLevel,
      interviewType,
    });
  };

  const suggestions = SPECIALTY_SUGGESTIONS[selectedProfession] || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6" data-testid="interview-hub">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 border border-primary/20 p-8 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Domain Simulation & Readiness Evaluation</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Universal AI Domain Interviews
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Test and prove your expertise across any profession—from Distributed Systems and Clinical Pathways to Corporate Law and Quantitative Finance. Receive deep multi-dimensional feedback and earn verified domain badges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Setup Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>Configure Interview Parameters</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Customize the domain scope, target seniority, and assessment model
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleStart} className="space-y-6">
                {/* Profession Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    1. Select Profession or Discipline
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PROFESSIONS.map((prof) => {
                      const isSelected = selectedProfession === prof;
                      return (
                        <button
                          key={prof}
                          type="button"
                          onClick={() => handleProfessionChange(prof)}
                          className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-card hover:bg-accent/40 text-muted-foreground hover:text-foreground border-border/60'
                          }`}
                        >
                          {prof}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specialty Input & Suggestions */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    2. Specific Domain Specialty
                  </label>
                  <Input
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Distributed Consensus, Pediatric Oncology, Antitrust Law"
                    className="h-10 text-sm"
                    required
                  />
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setSpecialty(sug)}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                            specialty === sug
                              ? 'bg-primary/10 border-primary/40 text-primary font-semibold'
                              : 'bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Seniority Level */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    3. Target Seniority Level
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TARGET_LEVELS.map((lvl) => {
                      const isSelected = targetLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setTargetLevel(lvl)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-card hover:bg-accent/40 text-muted-foreground hover:text-foreground border-border/60'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interview Format */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    4. Interview Assessment Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {INTERVIEW_TYPES.map((type) => {
                      const isSelected = interviewType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setInterviewType(type.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border/60 bg-card hover:bg-accent/40'
                          }`}
                        >
                          <span className={`text-xs font-bold block ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {type.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground block mt-1 leading-snug">
                            {type.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Launch CTA */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!specialty.trim() || isStarting}
                  className="w-full gap-2 text-sm font-semibold h-11"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initiating Adaptive Session...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Interview Simulation</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Previous History & Insights Side Pane */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <span>Interview History</span>
                </div>
                {history.length > 0 && (
                  <Badge variant="secondary" className="text-[11px]">
                    {history.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                Your past simulated interviews and readiness reports
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {historyLoading ? (
                <div className="py-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground">
                    No completed interviews yet. Start your first session to earn domain readiness badges.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {history.map((sess) => {
                    const sessId = sess.id || sess._id || '';
                    const isCompleted = sess.status === 'completed';
                    return (
                      <div
                        key={sessId}
                        onClick={() => onSelectSession(sessId)}
                        className="p-3 rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900/40 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground truncate max-w-[170px]">
                            {sess.specialty}
                          </span>
                          {sess.scorecard ? (
                            <InterviewBadge badge={sess.scorecard.readinessBadge} score={sess.scorecard.overallScore} />
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              {sess.status}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{sess.targetLevel}</span>
                          <span className="flex items-center gap-1">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-500" />
                            )}
                            <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
