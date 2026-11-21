import { useState, useEffect, useCallback } from 'react';
import { hrApi } from '../api';
import type { ISearchHistoryItem, IViewedProfileItem } from '../types';

export function useHrHistory() {
  const [searches, setSearches] = useState<ISearchHistoryItem[]>([]);
  const [viewedProfiles, setViewedProfiles] = useState<IViewedProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [searchRes, viewsRes] = await Promise.allSettled([
        hrApi.getSearchHistory(),
        hrApi.getViewedProfiles(),
      ]);

      if (searchRes.status === 'fulfilled') {
        setSearches(searchRes.value);
      }
      if (viewsRes.status === 'fulfilled') {
        setViewedProfiles(viewsRes.value);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load recruiter history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    searches,
    viewedProfiles,
    isLoading,
    error,
    refreshHistory: fetchHistory,
  };
}
