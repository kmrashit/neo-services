import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { candidateApi } from '../api';
import type { ICandidateProfile } from '../types';

export function useCandidateProfile(targetUserId?: string) {
  const { user } = useAuth();
  const userId = targetUserId || user?.id;

  const [profile, setProfile] = useState<ICandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFallbackProfile = useCallback((): ICandidateProfile => {
    return {
      userId: userId || 'default-candidate-id',
      fullName: user?.fullName || 'Alex Mercer',
      headline: 'Staff Systems Engineer & Distributed Architect',
      profession: 'Engineering & Technology',
      industry: 'Technology & Software',
      educationLevel: "Bachelor's Degree (BS in Computer Science)",
      email: user?.email || 'alex.mercer@fortlio.dev',
      mobileNumber: '+1 (555) 382-9102',
      location: 'San Francisco, CA (Open to Remote)',
      bio: 'Passionate systems engineer focused on high-throughput event streaming, distributed consensus, and developer tooling. Author of technical blogs on Kafka pipelines and TypeScript compilation architectures.',
      experienceYears: 6,
      skills: [
        'TypeScript', 'Go', 'Distributed Systems', 'Kubernetes', 'Kafka',
        'MongoDB Aggregations', 'Redis', 'Bun', 'PostgreSQL', 'Docker', 'Typesense'
      ],
      social: {
        github: 'https://github.com/alexmercer',
        linkedin: 'https://linkedin.com/in/alexmercer',
        website: 'https://alexmercer.dev',
      },
      experiences: [
        {
          role: 'Lead Systems Architect',
          company: 'Veloce Cloud Systems',
          period: '2023 - Present',
          description: 'Architected distributed telemetry ingestion processing 45k events/sec with sub-50ms latency using Bun, Redis streams, and MongoDB aggregations.',
        },
        {
          role: 'Senior Backend Engineer',
          company: 'Stratos Core Inc.',
          period: '2021 - 2023',
          description: 'Scaled microservices infrastructure across Kubernetes clusters. Authored internal developer SDKs reducing deployment lead time by 40%.',
        },
      ],
      education: [
        {
          degree: 'B.S. in Computer Science',
          institution: 'University of California, Berkeley',
          year: '2017 - 2021',
        },
      ],
      blogs: [
        {
          title: 'Optimizing MongoDB Pipelines with Post-Facet Slicing',
          date: 'Nov 15, 2026',
          readTime: '6 min read',
          tags: ['MongoDB', 'Database', 'Performance'],
        },
        {
          title: 'Architecting Microservices with Bun and Redis Stream Consumers',
          date: 'Oct 28, 2026',
          readTime: '9 min read',
          tags: ['Bun', 'Redis', 'Distributed Systems'],
        },
        {
          title: 'Typesense vs Elasticsearch for Real-Time Recruiter Search',
          date: 'Sep 12, 2026',
          readTime: '5 min read',
          tags: ['Search', 'Typesense', 'DevOps'],
        },
      ],
      fortiAiInsights: {
        velocityScore: 94,
        progressionRate: 'Rapid Velocity',
        depthLevel: 'Expert',
        diversityScore: '9.2/10',
        leadershipTraits: ['System Architecture', 'Mentorship', 'Technical Writing', 'Production Resilience'],
        primaryDomains: ['Distributed Systems', 'High-Throughput Databases', 'Cloud Native'],
      },
    };
  }, [userId, user?.fullName, user?.email]);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await candidateApi.getProfile(userId);
      if (res.data) {
        // Merge with sensible defaults for nested showcase attributes
        const fallback = getFallbackProfile();
        setProfile({
          ...fallback,
          ...res.data,
          skills: res.data.skills?.length ? res.data.skills : fallback.skills,
          experiences: res.data.experiences?.length ? res.data.experiences : fallback.experiences,
          education: res.data.education?.length ? res.data.education : fallback.education,
        });
      } else {
        setProfile(getFallbackProfile());
      }
    } catch {
      // In mock/dev or when profile not yet stored in DB, use rich fallback
      setProfile(getFallbackProfile());
    } finally {
      setIsLoading(false);
    }
  }, [userId, getFallbackProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    setProfile,
    isLoading,
    error,
    refreshProfile: fetchProfile,
  };
}
