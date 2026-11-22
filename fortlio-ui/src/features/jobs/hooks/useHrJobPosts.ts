import { useState, useEffect, useCallback } from 'react';
import { fetchMyJobPosts, createJobPost, updateJobPostStatus } from '../api';
import type { IJobPost, IJobCreatePayload, JobStatus } from '../types';

export function useHrJobPosts() {
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyJobPosts(1, 50);
      setJobs(result.jobs);
      setTotalCount(result.totalCount);
    } catch (err: any) {
      console.warn('Failed to load HR job posts:', err);
      setError(err?.response?.data?.message || 'Failed to fetch job postings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleCreateJob = async (payload: IJobCreatePayload) => {
    setCreating(true);
    try {
      const newPost = await createJobPost(payload);
      setJobs((prev) => [newPost, ...prev]);
      setTotalCount((prev) => prev + 1);
      return newPost;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (jobId: string, status: JobStatus) => {
    const updated = await updateJobPostStatus(jobId, status);
    setJobs((prev) =>
      prev.map((j) => ((j._id || j.id) === jobId ? { ...j, status } : j)),
    );
    return updated;
  };

  return {
    jobs,
    totalCount,
    loading,
    creating,
    error,
    createJob: handleCreateJob,
    updateStatus: handleUpdateStatus,
    refreshJobs: loadJobs,
  };
}
