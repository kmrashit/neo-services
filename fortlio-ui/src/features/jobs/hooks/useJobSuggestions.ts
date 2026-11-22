import { useState, useEffect, useCallback } from 'react';
import { fetchJobSuggestions } from '../api';
import type { IJobPost } from '../types';

export function useJobSuggestions() {
  const [suggestions, setSuggestions] = useState<IJobPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJobSuggestions();
      setSuggestions(data);
    } catch (err: any) {
      console.warn('Failed to load job suggestions:', err);
      setError(err?.response?.data?.message || 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  return {
    suggestions,
    loading,
    error,
    refreshSuggestions: loadSuggestions,
  };
}
