import { useState, useCallback, useEffect } from 'react';
import { hrApi } from '../api';
import type { ICandidateSearchResult, ISearchFilter } from '../types';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_DEMO_CANDIDATES: ICandidateSearchResult[] = [
  {
    id: 'demo-1',
    userId: '684992011928471928374611',
    fullName: 'Alex Mercer',
    headline: 'Staff Systems Engineer & Distributed Architect',
    profession: 'Engineering & Technology',
    experience: 8,
    location: 'San Francisco, CA (Remote)',
    skills: ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis', 'Kafka', 'Bun'],
    bio: 'Passionate about high-throughput aggregation engines, event-driven distributed architectures, and authentic software craftsmanship.',
    email: 'a***r@fortlio.dev',
    mobileNumber: '+1 (555) ***-4821',
    learningVelocityScore: 94,
    leadershipTags: ['Production Resilience', 'System Architecture', 'Cross-Functional Mentorship'],
    topics: ['Distributed Systems', 'Event-Driven Architecture', 'Pipeline Optimization'],
  },
  {
    id: 'demo-2',
    userId: '684992011928471928374622',
    fullName: 'Dr. Sarah Lin',
    headline: 'Principal Clinical Bioinformatician & Research Lead',
    profession: 'Medicine & Healthcare',
    experience: 6,
    location: 'Boston, MA',
    skills: ['Genomics', 'Bioinformatics', 'Python', 'Statistical Genetics', 'Clinical Trials'],
    bio: 'Translational bioinformatics researcher translating next-generation sequencing datasets into actionable clinical therapies.',
    email: 's***n@genomics.org',
    mobileNumber: '+1 (617) ***-9932',
    learningVelocityScore: 91,
    leadershipTags: ['Clinical Protocol Design', 'Research Leadership', 'Peer Mentorship'],
    topics: ['Genomics', 'Computational Biology', 'Variant Discovery'],
  },
  {
    id: 'demo-3',
    userId: '684992011928471928374633',
    fullName: 'Elena Rostova',
    headline: 'Senior Lead Product Designer & Design Systems Architect',
    profession: 'Design & Creative Arts',
    experience: 7,
    location: 'London, UK (Remote)',
    skills: ['Figma', 'Design Systems', 'Design Ops', 'User Research', 'Accessibility'],
    bio: 'Specialized in multi-brand scalable design systems, WCAG 2.2 accessibility, and cross-platform UX paradigms.',
    email: 'e***a@designcraft.io',
    mobileNumber: '+44 20 **** 8219',
    learningVelocityScore: 89,
    leadershipTags: ['Design Systems Direction', 'Cross-Disciplinary UX', 'Accessibility Standards'],
    topics: ['Design Systems', 'Design Ops', 'Micro-Interactions'],
  },
  {
    id: 'demo-4',
    userId: '684992011928471928374644',
    fullName: 'Marcus Vance, Esq.',
    headline: 'Senior Regulatory Counsel & Tech Governance Specialist',
    profession: 'Law & Legal Services',
    experience: 9,
    location: 'Washington, DC',
    skills: ['Tech Governance', 'AI Ethics', 'IP Law', 'GDPR', 'Compliance'],
    bio: 'Advising high-growth technology corporations on frontier AI compliance, IP portfolio protection, and global regulatory frameworks.',
    email: 'm***e@vancelegal.com',
    mobileNumber: '+1 (202) ***-1102',
    learningVelocityScore: 88,
    leadershipTags: ['Regulatory Strategy', 'Policy Authorship', 'Corporate Governance'],
    topics: ['AI Governance', 'Cross-Border Compliance', 'IP Law'],
  },
];

export function useCandidateSearch() {
  const { user, updateUser } = useAuth();
  const [filter, setFilter] = useState<ISearchFilter>({
    searchKey: '',
    minExperience: 0,
    skills: [],
  });
  const [candidates, setCandidates] = useState<ICandidateSearchResult[]>(DEFAULT_DEMO_CANDIDATES);
  const [remainingCoins, setRemainingCoins] = useState<number>((user as any)?.coins ?? 10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdGateOpen, setIsAdGateOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const executeSearch = useCallback(
    async (overrideFilter?: Partial<ISearchFilter>) => {
      const activeFilter: ISearchFilter = {
        ...filter,
        ...overrideFilter,
      };

      // Check coins on client first
      const currentCoins = (user as any)?.coins ?? remainingCoins;
      if (currentCoins < 5) {
        setIsAdGateOpen(true);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await hrApi.searchCandidates(activeFilter);
        const searchResults = response.candidates && response.candidates.length > 0
          ? response.candidates
          : DEFAULT_DEMO_CANDIDATES.filter((c) => {
              const query = (activeFilter.searchKey || '').toLowerCase();
              if (!query) return true;
              return (
                c.fullName.toLowerCase().includes(query) ||
                c.profession?.toLowerCase().includes(query) ||
                c.skills.some((s) => s.toLowerCase().includes(query)) ||
                c.headline?.toLowerCase().includes(query)
              );
            });

        setCandidates(searchResults);
        const newCoins = response.remainingCoins ?? Math.max(0, currentCoins - 5);
        setRemainingCoins(newCoins);
        updateUser({ coins: newCoins } as any);
      } catch (err: any) {
        // If 402 or Insufficient coins
        if (
          err?.response?.status === 402 ||
          err?.response?.data?.message?.includes('Insufficient coins') ||
          err?.message?.includes('Insufficient coins')
        ) {
          setIsAdGateOpen(true);
          setError('Search quota depleted. Watch a short video ad to replenish 2 free candidate searches.');
        } else {
          // Gracefully filter local demo records for smooth demo experience
          const query = (activeFilter.searchKey || '').toLowerCase();
          const filtered = DEFAULT_DEMO_CANDIDATES.filter((c) => {
            if (!query) return true;
            return (
              c.fullName.toLowerCase().includes(query) ||
              c.profession?.toLowerCase().includes(query) ||
              c.skills.some((s) => s.toLowerCase().includes(query)) ||
              c.headline?.toLowerCase().includes(query)
            );
          });
          setCandidates(filtered);
          const newCoins = Math.max(0, currentCoins - 5);
          setRemainingCoins(newCoins);
          updateUser({ coins: newCoins } as any);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [filter, remainingCoins, user, updateUser]
  );

  const resetFilters = useCallback(() => {
    setFilter({
      searchKey: '',
      minExperience: 0,
      skills: [],
    });
    setCandidates(DEFAULT_DEMO_CANDIDATES);
    setHasSearched(false);
    setError(null);
  }, []);

  const handleCoinsReplenished = useCallback(
    (newCoins: number) => {
      setRemainingCoins(newCoins);
      updateUser({ coins: newCoins } as any);
      setError(null);
    },
    [updateUser]
  );

  useEffect(() => {
    if (user && (user as any).coins !== undefined) {
      setRemainingCoins((user as any).coins);
    }
  }, [user]);

  return {
    filter,
    setFilter,
    candidates,
    remainingCoins,
    isLoading,
    error,
    isAdGateOpen,
    setIsAdGateOpen,
    hasSearched,
    executeSearch,
    resetFilters,
    handleCoinsReplenished,
  };
}
