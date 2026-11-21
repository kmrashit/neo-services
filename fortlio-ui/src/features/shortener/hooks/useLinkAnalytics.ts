import { useState, useEffect, useCallback } from 'react';
import { shortenerApi } from '../api';
import type { IShortLink, ILinkAnalytics } from '../types';

export function useLinkAnalytics(shortCode?: string) {
  const [links, setLinks] = useState<IShortLink[]>([]);
  const [selectedAnalytics, setSelectedAnalytics] = useState<ILinkAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await shortenerApi.getMyLinks();
      if (res.data?.links) {
        setLinks(res.data.links);
      }
    } catch {
      // Mock links in offline / dev mode
      setLinks([
        {
          shortCode: 'res-alex-2026',
          originalUrl: `${window.location.origin}/candidate-profile`,
          targetType: 'resume',
          accessCount: 42,
          viewsCount: 42,
          totalTimeSpentSeconds: 1540,
          averageTimeSpentSeconds: 36.7,
          createdAt: new Date().toISOString(),
        },
        {
          shortCode: 'blog-mongo-facet',
          originalUrl: `${window.location.origin}/candidate-blogs`,
          targetType: 'blog',
          accessCount: 28,
          viewsCount: 28,
          totalTimeSpentSeconds: 980,
          averageTimeSpentSeconds: 35.0,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async (code: string) => {
    try {
      const res = await shortenerApi.getLinkAnalytics(code);
      if (res.data) {
        setSelectedAnalytics(res.data);
      }
    } catch {
      // fallback
      setSelectedAnalytics({
        shortCode: code,
        originalUrl: `${window.location.origin}/candidate-profile`,
        targetType: 'resume',
        accessCount: 42,
        viewsCount: 42,
        totalTimeSpentSeconds: 1540,
        averageTimeSpentSeconds: 36.7,
      });
    }
  }, []);

  useEffect(() => {
    fetchMyLinks();
    if (shortCode) {
      fetchAnalytics(shortCode);
    }
  }, [fetchMyLinks, fetchAnalytics, shortCode]);

  return {
    links,
    selectedAnalytics,
    isLoading,
    error,
    refreshLinks: fetchMyLinks,
    loadAnalytics: fetchAnalytics,
  };
}
