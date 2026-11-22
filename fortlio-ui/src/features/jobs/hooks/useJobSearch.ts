import { useState, useEffect, useCallback } from 'react';
import { searchJobPosts } from '../api';
import type { IJobPost, IJobSearchParams } from '../types';

export function useJobSearch(initialFilters: IJobSearchParams = {}) {
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IJobSearchParams>({
    page: 1,
    pageSize: 12,
    ...initialFilters,
  });

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchJobPosts(filters);
      setJobs(result.jobs);
      setTotalCount(result.totalCount);
    } catch (err: any) {
      console.warn('Failed to search jobs:', err);
      setError(err?.response?.data?.message || 'Failed to search jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const updateFilters = useCallback((newFilters: Partial<IJobSearchParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // reset page to 1 on filter changes unless explicitly provided
    }));
  }, []);

  return {
    jobs,
    totalCount,
    loading,
    error,
    filters,
    updateFilters,
    refreshJobs: loadJobs,
  };
}
