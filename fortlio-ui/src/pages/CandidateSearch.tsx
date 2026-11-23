import { useState } from 'react';
import {
  Users,
  Coins,
  Tv,
  Sparkles,
  SlidersHorizontal,
  Clock,
  Eye,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CandidateSearchBar,
  CandidateFilterPanel,
  CandidateResultCard,
  VideoAdGateModal,
  SearchHistoryTable,
  ViewedProfilesGrid,
  useCandidateSearch,
  useHrHistory,
  type ICandidateSearchResult,
} from '@/features/hr';
import { HrCandidateChatDrawer } from '@/features/forti';

export default function CandidateSearch() {
  const [activeTab, setActiveTab] = useState('candidates');
  const [showFilters, setShowFilters] = useState(false);
  const [chatCandidate, setChatCandidate] = useState<ICandidateSearchResult | null>(null);

  const {
    filter,
    setFilter,
    candidates,
    remainingCoins,
    isLoading,
    error,
    isAdGateOpen,
    setIsAdGateOpen,
    executeSearch,
    resetFilters,
    handleCoinsReplenished,
  } = useCandidateSearch();

  const { searches, viewedProfiles, refreshHistory } = useHrHistory();

  const handleSelectSearchFromHistory = (query: string) => {
    setFilter({ ...filter, searchKey: query });
    setActiveTab('candidates');
    executeSearch({ searchKey: query });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-background p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600/20 text-purple-600 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-0.5">
                <Sparkles className="size-3 mr-1" />
                Universal Recruiter Discovery
              </Badge>
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
                Typesense Fast Search
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              Candidate Discovery & Talent Engine
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover verified candidates across all professions, engineering, healthcare, legal, and design. Evaluated by authentic trajectory, learning velocity, and portfolio depth.
            </p>
          </div>

          {/* Quota & Ad Monetization Card */}
          <div className="flex flex-col items-start md:items-end gap-2 bg-card/80 border border-border/80 backdrop-blur-md p-4 rounded-2xl shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Coins className="size-4" />
              </div>
              <div className="text-left md:text-right">
                <div className="text-xs text-muted-foreground font-medium">Search Quota</div>
                <div className="text-base font-extrabold text-foreground flex items-center gap-1">
                  <span>{remainingCoins} Coins</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    ({Math.floor(remainingCoins / 5)} searches)
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setIsAdGateOpen(true)}
              className="w-full md:w-auto h-8 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold cursor-pointer shadow-sm"
            >
              <Tv className="size-3.5 mr-1.5" />
              Watch Ad (+10 Coins)
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="candidates" className="text-xs font-semibold flex items-center gap-1.5">
              <Users className="size-3.5" />
              <span>Candidates</span>
              <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1.5">
                {candidates.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs font-semibold flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>Search History</span>
              {searches.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1.5">
                  {searches.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="viewed" className="text-xs font-semibold flex items-center gap-1.5">
              <Eye className="size-3.5" />
              <span>Recently Viewed</span>
              {viewedProfiles.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1.5">
                  {viewedProfiles.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {activeTab === 'candidates' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`h-9 text-xs font-semibold cursor-pointer ${
                showFilters ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300' : ''
              }`}
            >
              <SlidersHorizontal className="size-3.5 mr-1.5" />
              {showFilters ? 'Hide Filter Panel' : 'Filter Candidates'}
            </Button>
          )}
        </div>

        {/* Tab 1: Candidates Search */}
        <TabsContent value="candidates" className="space-y-6 m-0">
          <CandidateSearchBar
            value={filter.searchKey || ''}
            onChange={(val) => setFilter({ ...filter, searchKey: val })}
            onSearch={() => executeSearch()}
            onClear={() => {
              setFilter({ ...filter, searchKey: '' });
              resetFilters();
            }}
            isLoading={isLoading}
          />

          {showFilters && (
            <CandidateFilterPanel
              filter={filter}
              onChange={(updated) => {
                setFilter(updated);
                executeSearch(updated);
              }}
              onReset={() => {
                resetFilters();
              }}
            />
          )}

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive font-medium flex items-center justify-between">
              <span>{error}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAdGateOpen(true)}
                className="h-7 text-xs bg-card hover:bg-accent text-destructive border-destructive/40 cursor-pointer"
              >
                Watch Video Ad
              </Button>
            </div>
          )}

          {/* Results Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Showing {candidates.length} candidate profiles</span>
              <span>Sorted by Typesense relevance & Forti velocity</span>
            </div>

            {candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
                <Users className="size-10 text-muted-foreground/40 mb-3" />
                <h3 className="text-base font-semibold text-foreground">No candidate profiles found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  No candidates match your current search terms or filter criteria. Try resetting filters or using broader keywords.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-4 text-xs cursor-pointer"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {candidates.map((cand) => (
                  <CandidateResultCard
                    key={cand.id || cand.userId}
                    candidate={cand}
                    onOpenChat={(c) => setChatCandidate(c)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Search History */}
        <TabsContent value="history" className="space-y-4 m-0">
          <SearchHistoryTable
            searches={searches}
            onSelectSearch={handleSelectSearchFromHistory}
          />
        </TabsContent>

        {/* Tab 3: Viewed Profiles */}
        <TabsContent value="viewed" className="space-y-4 m-0">
          <ViewedProfilesGrid viewedProfiles={viewedProfiles} />
        </TabsContent>
      </Tabs>

      {/* Video Ad Gate Modal */}
      <VideoAdGateModal
        open={isAdGateOpen}
        onOpenChange={setIsAdGateOpen}
        onRewardClaimed={(newCoins) => {
          handleCoinsReplenished(newCoins);
          refreshHistory();
        }}
      />

      {/* Forti AI Chat Drawer for Candidate Profile */}
      {chatCandidate && (
        <HrCandidateChatDrawer
          isOpen={!!chatCandidate}
          onClose={() => setChatCandidate(null)}
          userId={chatCandidate.userId || chatCandidate.id}
          candidateName={chatCandidate.fullName}
          candidateHeadline={chatCandidate.headline || chatCandidate.profession}
        />
      )}
    </div>
  );
}
