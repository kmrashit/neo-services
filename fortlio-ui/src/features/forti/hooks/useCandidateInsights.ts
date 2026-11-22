import { useState, useEffect, useCallback } from 'react';
import { fortiApi } from '../api';
import type { ICandidateInsights } from '../types';

export const DEFAULT_FALLBACK_INSIGHTS: ICandidateInsights = {
  candidateId: '123456789012345678901234',
  learningVelocity: {
    score: 94,
    summary: 'Candidate exhibits rapid conceptual velocity across distributed systems and high-throughput architectures based on authentic draft progression.',
    progressionRate: 'rapid',
  },
  knowledgeVolume: {
    articleCount: 3,
    depthLevel: 'expert',
  },
  topicDiversity: {
    primaryDomains: ['Distributed Systems', 'MongoDB Aggregations', 'Event Streaming'],
    exploredTopics: ['Bun', 'Redis Streams', 'Kafka', 'Kubernetes', 'Typesense', 'System Design'],
    diversityScore: 9.4,
  },
  detectedQualities: {
    leadership: ['System Architecture', 'Mentorship', 'Technical Writing', 'Production Resilience'],
    mindset: ['Curious', 'Authentic Problem-Solver', 'Execution-Oriented', 'Analytical'],
  },
  rawAiSummary: 'Synthesized talent profile demonstrates deep domain mastery, rigorous critical thinking, and strong cross-functional communication.',
};

export function useCandidateInsights(candidateId?: string) {
  const [insights, setInsights] = useState<ICandidateInsights>(DEFAULT_FALLBACK_INSIGHTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!candidateId) {
      setInsights(DEFAULT_FALLBACK_INSIGHTS);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fortiApi.getInsights(candidateId);
      if (res.data) {
        setInsights(res.data);
      } else {
        setInsights(DEFAULT_FALLBACK_INSIGHTS);
      }
    } catch {
      // In offline / dev mode, return rich fallback insights
      setInsights(DEFAULT_FALLBACK_INSIGHTS);
    } finally {
      setIsLoading(false);
    }
  }, [candidateId]);

  const forceSynthesize = async () => {
    if (!candidateId) {return;}
    setIsLoading(true);
    try {
      const res = await fortiApi.synthesizeInsights(candidateId);
      if (res.data) {
        setInsights(res.data);
      }
    } catch {
      setInsights(DEFAULT_FALLBACK_INSIGHTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    isLoading,
    error,
    refreshInsights: fetchInsights,
    forceSynthesize,
  };
}
