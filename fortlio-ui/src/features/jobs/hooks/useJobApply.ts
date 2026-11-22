import { useState, useCallback } from 'react';
import { applyForJob } from '../api';

export function useJobApply() {
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback(async (jobId: string, coverNote?: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await applyForJob(jobId, coverNote);
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
    } catch (err: any) {
      console.warn('Failed to apply for job:', err);
      const msg = err?.response?.data?.message || 'Failed to apply for job';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setSubmitting(false);
    }
  }, []);

  const hasApplied = useCallback((jobId: string) => appliedJobIds.has(jobId), [appliedJobIds]);

  return {
    appliedJobIds,
    hasApplied,
    submitting,
    error,
    apply,
  };
}
