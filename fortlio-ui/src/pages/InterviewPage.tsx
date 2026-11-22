import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useAiInterview,
  InterviewHub,
  InterviewSessionRoom,
  InterviewScorecard,
} from '@/features/interview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function InterviewPage() {
  const [searchParams] = useSearchParams();
  const sessionIdParam = searchParams.get('session');

  const {
    currentSession,
    isStarting,
    isSubmitting,
    isConcluding,
    error,
    history,
    historyLoading,
    startSession,
    submitAnswer,
    concludeSession,
    loadReport,
    toggleVisibility,
    resetSession,
  } = useAiInterview();

  useEffect(() => {
    if (sessionIdParam && !currentSession) {
      loadReport(sessionIdParam);
    }
  }, [sessionIdParam, currentSession, loadReport]);

  return (
    <div className="container mx-auto px-4 py-4 min-h-[calc(100vh-4rem)]">
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">Interview System Notice</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* 1. Scorecard View */}
      {currentSession && (currentSession.scorecard || currentSession.status === 'completed') ? (
        <InterviewScorecard
          session={currentSession}
          onRestart={resetSession}
          onToggleVisibility={toggleVisibility}
        />
      ) : currentSession && currentSession.status === 'in_progress' ? (
        /* 2. Active Interactive Session Room */
        <InterviewSessionRoom
          session={currentSession}
          isSubmitting={isSubmitting}
          isConcluding={isConcluding}
          onSubmitAnswer={submitAnswer}
          onConcludeEarly={concludeSession}
        />
      ) : (
        /* 3. Setup Hub & History */
        <InterviewHub
          history={history}
          historyLoading={historyLoading}
          isStarting={isStarting}
          onStartSession={startSession}
          onSelectSession={(id) => loadReport(id)}
        />
      )}
    </div>
  );
}
