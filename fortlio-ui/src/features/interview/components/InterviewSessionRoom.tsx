import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { IInterviewSession } from '../types';
import {
  Mic,
  MicOff,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  Clock,
  Flag,
} from 'lucide-react';

interface InterviewSessionRoomProps {
  session: IInterviewSession;
  isSubmitting: boolean;
  isConcluding: boolean;
  onSubmitAnswer: (answerText: string, audioDurationSeconds?: number) => Promise<unknown>;
  onConcludeEarly: () => Promise<unknown>;
}

export const InterviewSessionRoom: React.FC<InterviewSessionRoomProps> = ({
  session,
  isSubmitting,
  isConcluding,
  onSubmitAnswer,
  onConcludeEarly,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Audio recording timer simulation
  useEffect(() => {
    if (!isRecording) {
      return;
    }
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setRecordingSeconds(0);
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Append simulated speech note if answer was empty
      if (!answerText.trim()) {
        setAnswerText((prev) =>
          prev
            ? `${prev} [Dictated audio note (${recordingSeconds}s)]`
            : `Comprehensive verbal assessment recorded over ${recordingSeconds} seconds highlighting core principles, execution constraints, and measurable trade-offs.`,
        );
      }
    }
  };

  const currentTurnIndex = session.currentTurn;
  const currentQuestionTurn = session.turns[currentTurnIndex] || session.turns[session.turns.length - 1];
  const maxTurns = session.maxTurns || 4;
  const progressPercent = Math.round(((currentTurnIndex + 1) / maxTurns) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || isSubmitting) {return;}

    const duration = isRecording ? recordingSeconds : (recordingSeconds || 15);
    setIsRecording(false);
    await onSubmitAnswer(answerText.trim(), duration);
    setAnswerText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6" data-testid="interview-session-room">
      {/* Top Status Bar */}
      <Card className="border-border/60 shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-semibold text-xs">
                {session.profession}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {session.targetLevel} Level
              </Badge>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {session.specialty} Simulation
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Progress</span>
              <p className="text-sm font-bold text-primary">
                Question {currentTurnIndex + 1} of {maxTurns}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onConcludeEarly}
              disabled={isConcluding || isSubmitting}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              {isConcluding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Flag className="w-3.5 h-3.5" />
              )}
              <span>Conclude Session</span>
            </Button>
          </div>
        </div>

        <Progress value={progressPercent} className="h-1.5 rounded-none" />
      </Card>

      {/* Main Conversation Stream */}
      <div className="space-y-4">
        {/* Previous Answered Turns */}
        {session.turns.slice(0, currentTurnIndex).map((turn, idx) => (
          <div key={turn.questionId || idx} className="space-y-3 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl rounded-tl-sm border border-border/40 text-sm max-w-3xl">
                <span className="text-xs font-bold text-primary block mb-1">Interviewer (Turn {idx + 1})</span>
                <p>{turn.questionText}</p>
              </div>
            </div>

            {turn.answerText && (
              <div className="flex gap-3 items-start justify-end">
                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-2xl rounded-tr-sm border border-primary/20 text-sm max-w-3xl text-right">
                  <span className="text-xs font-bold text-primary block mb-1">You</span>
                  <p className="whitespace-pre-wrap text-left">{turn.answerText}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Current Active Question Card */}
        {currentQuestionTurn && (
          <Card className="border-primary/30 shadow-md bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Fortlio Adaptive AI Interviewer</CardTitle>
                    <span className="text-xs text-muted-foreground">Turn {currentTurnIndex + 1} of {maxTurns}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Real-time Prompt</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base font-medium leading-relaxed text-foreground">
                {currentQuestionTurn.questionText}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Answer Form Card */}
      <Card className="border-border/60 shadow-sm">
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="relative">
            <Textarea
              placeholder="Synthesize your answer clearly, articulating technical principles, rationale, constraints, and metrics..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="min-h-[140px] resize-y p-3.5 text-sm"
              disabled={isSubmitting || isConcluding}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant={isRecording ? 'destructive' : 'outline'}
                size="sm"
                onClick={toggleRecording}
                className="gap-2 text-xs"
                disabled={isSubmitting || isConcluding}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 animate-pulse" />
                    <span>Recording ({recordingSeconds}s)...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Dictate Audio Response</span>
                  </>
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                {answerText.length} characters
              </span>
            </div>

            <Button
              type="submit"
              disabled={!answerText.trim() || isSubmitting || isConcluding}
              className="w-full sm:w-auto gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Response...</span>
                </>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
