import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { InterviewBadge } from './InterviewBadge';
import type { IInterviewSession } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  Share2,
  Check,
  RotateCcw,
  Sparkles,
  Globe,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface InterviewScorecardProps {
  session: IInterviewSession;
  onRestart: () => void;
  onToggleVisibility?: (isPublic: boolean) => void;
}

export const InterviewScorecard: React.FC<InterviewScorecardProps> = ({
  session,
  onRestart,
  onToggleVisibility,
}) => {
  const [copied, setCopied] = useState(false);
  const scorecard = session.scorecard;

  if (!scorecard) {
    return (
      <Card className="max-w-3xl mx-auto my-8 text-center p-8">
        <CardContent>
          <p className="text-muted-foreground">Evaluation scorecard is not available yet.</p>
          <Button onClick={onRestart} className="mt-4">Back to Interview Hub</Button>
        </CardContent>
      </Card>
    );
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/interview?session=${session.id || session._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) {return 'text-emerald-500';}
    if (score >= 70) {return 'text-blue-500';}
    if (score >= 50) {return 'text-amber-500';}
    return 'text-rose-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6" data-testid="interview-scorecard">
      {/* Header Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-6 border-b border-border/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs uppercase font-bold tracking-wider text-primary">
                  Evaluation Report & Readiness Scorecard
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {session.specialty} Readiness
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {session.profession} • {session.targetLevel} Level • Completed in {session.turns.length} turns
              </p>
            </div>

            <div className="flex items-center gap-2">
              <InterviewBadge badge={scorecard.readinessBadge} />
              {onToggleVisibility && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleVisibility(!session.isPublic)}
                  className="gap-1.5 text-xs"
                >
                  {session.isPublic ? (
                    <>
                      <Globe className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Private</span>
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-1.5 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Overall Score Circle */}
            <div className="md:col-span-2 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/50 text-center">
              <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary/20 bg-background shadow-inner">
                <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(scorecard.overallScore)}`}>
                  {scorecard.overallScore}
                </span>
                <span className="text-xs text-muted-foreground absolute bottom-5">/ 100</span>
              </div>
              <h3 className="text-sm font-semibold mt-3">Overall Domain Score</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Adaptive evaluation across verified technical and communication rubrics
              </p>
            </div>

            {/* Dimensional Scores */}
            <div className="md:col-span-3 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Domain Depth & Precision</span>
                  <span className={getScoreColor(scorecard.domainDepthScore)}>{scorecard.domainDepthScore}%</span>
                </div>
                <Progress value={scorecard.domainDepthScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Problem Solving & Scenario Analysis</span>
                  <span className={getScoreColor(scorecard.problemSolvingScore)}>{scorecard.problemSolvingScore}%</span>
                </div>
                <Progress value={scorecard.problemSolvingScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Communication & Articulation</span>
                  <span className={getScoreColor(scorecard.communicationScore)}>{scorecard.communicationScore}%</span>
                </div>
                <Progress value={scorecard.communicationScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Leadership, Ownership & Collaboration</span>
                  <span className={getScoreColor(scorecard.leadershipScore)}>{scorecard.leadershipScore}%</span>
                </div>
                <Progress value={scorecard.leadershipScore} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>Key Strengths & Mastery</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Demonstrated proficiencies identified during technical prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm">
              {scorecard.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <span>Targeted Growth Opportunities</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Areas to expand for higher seniority readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm">
              {scorecard.areasForImprovement.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Executive Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {scorecard.summary}
          </p>
        </CardContent>
      </Card>

      {/* Session Turns Accordion/History */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Interview Transcript & Q&A Log</CardTitle>
          <CardDescription className="text-xs">
            Review your answers and questions across all {session.turns.length} turns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {session.turns.map((turn, index) => (
            <div
              key={turn.questionId || index}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">Question {index + 1}</span>
                {turn.audioDurationSeconds ? (
                  <span className="text-[11px] text-muted-foreground">
                    Duration: {turn.audioDurationSeconds}s
                  </span>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-foreground">{turn.questionText}</p>
              {turn.answerText && (
                <div className="mt-2 pt-2 border-t border-border/40">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Your Response:</span>
                  <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap">{turn.answerText}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={onRestart} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Take Another Interview</span>
        </Button>
        <Button onClick={onRestart} className="gap-2">
          <span>Go to Interview Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
