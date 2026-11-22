import { useState, useCallback, useEffect } from 'react';
import type {
  IInterviewSession,
  IStartInterviewPayload,
} from '../types';
import {
  startInterviewSession,
  submitInterviewTurn,
  concludeInterviewSession,
  fetchInterviewReport,
  fetchMyInterviewHistory,
  toggleInterviewVisibility,
} from '../api';

interface ApiErrorShape {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as ApiErrorShape;
  return e?.response?.data?.message || e?.message || fallback;
}

export function useAiInterview() {
  const [currentSession, setCurrentSession] = useState<IInterviewSession | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConcluding, setIsConcluding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<IInterviewSession[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const loadHistory = useCallback(async (page = 1, pageSize = 10) => {
    setHistoryLoading(true);
    setError(null);
    try {
      const res = await fetchMyInterviewHistory(page, pageSize);
      setHistory(res.sessions);
      setTotalCount(res.totalCount);
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Failed to load interview history'));
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const startSession = useCallback(async (payload: IStartInterviewPayload) => {
    setIsStarting(true);
    setError(null);
    try {
      const session = await startInterviewSession(payload);
      const normalizedSession: IInterviewSession = {
        ...session,
        id: session.id || session._id || '',
      };
      setCurrentSession(normalizedSession);
      return normalizedSession;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Failed to start interview session');
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsStarting(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (answerText: string, audioDurationSeconds = 0) => {
      if (!currentSession) {
        return;
      }
      setIsSubmitting(true);
      setError(null);
      try {
        const sessionId = currentSession.id || currentSession._id || '';
        const result = await submitInterviewTurn(sessionId, {
          answerText,
          audioDurationSeconds,
        });

        if (result.isComplete) {
          const completedSession = await concludeInterviewSession(sessionId);
          const normalized: IInterviewSession = {
            ...completedSession,
            id: completedSession.id || completedSession._id || '',
          };
          setCurrentSession(normalized);
          loadHistory();
          return normalized;
        }

        const updatedTurns = [...currentSession.turns];
        const lastTurnIdx = updatedTurns.length - 1;
        if (lastTurnIdx >= 0) {
          updatedTurns[lastTurnIdx] = {
            ...updatedTurns[lastTurnIdx],
            answerText,
            audioDurationSeconds,
            answeredAt: new Date().toISOString(),
          };
        }

        if (result.nextQuestion) {
          updatedTurns.push({
            questionId: `q-${result.turnCompleted + 1}`,
            questionText: result.nextQuestion,
            askedAt: new Date().toISOString(),
          });
        }

        const updatedSession: IInterviewSession = {
          ...currentSession,
          currentTurn: result.turnCompleted,
          turns: updatedTurns,
        };
        setCurrentSession(updatedSession);
        return updatedSession;
      } catch (err: unknown) {
        const msg = extractErrorMessage(err, 'Failed to submit response');
        setError(msg);
        throw new Error(msg, { cause: err });
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentSession, loadHistory],
  );

  const concludeSession = useCallback(async () => {
    if (!currentSession) {
      return;
    }
    setIsConcluding(true);
    setError(null);
    try {
      const sessionId = currentSession.id || currentSession._id || '';
      const completedSession = await concludeInterviewSession(sessionId);
      const normalized: IInterviewSession = {
        ...completedSession,
        id: completedSession.id || completedSession._id || '',
      };
      setCurrentSession(normalized);
      loadHistory();
      return normalized;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Failed to conclude session');
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsConcluding(false);
    }
  }, [currentSession, loadHistory]);

  const loadReport = useCallback(async (sessionId: string) => {
    setError(null);
    try {
      const report = await fetchInterviewReport(sessionId);
      const normalized: IInterviewSession = {
        ...report,
        id: report.id || report._id || '',
      };
      setCurrentSession(normalized);
      return normalized;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Failed to load interview report');
      setError(msg);
      throw new Error(msg, { cause: err });
    }
  }, []);

  const toggleVisibility = useCallback(
    async (isPublic: boolean) => {
      if (!currentSession) {
        return;
      }
      try {
        const sessionId = currentSession.id || currentSession._id || '';
        await toggleInterviewVisibility(sessionId, isPublic);
        setCurrentSession((prev) => (prev ? { ...prev, isPublic } : null));
      } catch (err: unknown) {
        const msg = extractErrorMessage(err, 'Failed to toggle visibility');
        setError(msg);
      }
    },
    [currentSession],
  );

  const resetSession = useCallback(() => {
    setCurrentSession(null);
    setError(null);
  }, []);

  return {
    currentSession,
    isStarting,
    isSubmitting,
    isConcluding,
    error,
    history,
    historyLoading,
    totalCount,
    loadHistory,
    startSession,
    submitAnswer,
    concludeSession,
    loadReport,
    toggleVisibility,
    resetSession,
  };
}
