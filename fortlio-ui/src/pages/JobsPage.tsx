import { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Search,
  Loader2,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PROFESSIONS_TAXONOMY } from '@/constants/taxonomy';
import {
  JobCard,
  JobFilterPanel,
  JobDetailModal,
  useJobSearch,
  useJobSuggestions,
  useJobApply,
  type IJobPost,
} from '@/features/jobs';

export default function JobsPage() {
  const [selectedTab, setSelectedTab] = useState<'suggestions' | 'search'>('suggestions');
  const [activeJob, setActiveJob] = useState<IJobPost | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Professions list for filter dropdown
  const professionNames = PROFESSIONS_TAXONOMY.map((p) => p.name);

  // Hooks
  const {
    jobs,
    totalCount,
    loading: searchLoading,
    filters,
    updateFilters,
  } = useJobSearch();

  const {
    suggestions,
    loading: suggestionsLoading,
  } = useJobSuggestions();

  const { apply, hasApplied } = useJobApply();

  const handleViewDetails = (job: IJobPost) => {
    setActiveJob(job);
    setIsDetailOpen(true);
  };

  const handleApply = async (jobId: string, coverNote?: string) => {
    await apply(jobId, coverNote);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-background p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600/20 text-purple-600 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-0.5">
                <Sparkles className="size-3 mr-1" />
                AI Job Suggestions & Smart Match
              </Badge>
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
                Universal Career Board
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              Career & Opportunity Engine
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover opportunities matched against your verified domain skills, multi-disciplinary experience, and Forti learning velocity score.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={selectedTab}
        onValueChange={(val) => setSelectedTab(val as 'suggestions' | 'search')}
        className="w-full space-y-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <TabsList className="bg-muted/60 p-1 rounded-xl">
            <TabsTrigger
              value="suggestions"
              className="gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              <span>AI Suggestions</span>
              {suggestions.length > 0 && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                  {suggestions.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="search"
              className="gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white cursor-pointer"
            >
              <Search className="size-3.5" />
              <span>Browse All Openings</span>
              {totalCount > 0 && (
                <span className="text-[10px] bg-muted-foreground/20 px-1.5 py-0.2 rounded-full font-mono">
                  {totalCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-6 mt-0">
          {suggestionsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-purple-600 mb-2" />
              <p className="text-sm">Synthesizing personalized job matches with Forti AI...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground border border-dashed rounded-3xl bg-card/40">
              <Sparkles className="size-10 mx-auto text-purple-500/50 mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">No AI suggestions found yet</h3>
              <p className="text-xs max-w-md mx-auto leading-relaxed">
                Add your verified skills and publish specialty blogs to strengthen your learning velocity score and unlock high-match opportunities!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTab('search')}
                className="mt-4 text-xs rounded-xl cursor-pointer"
              >
                Browse All Openings
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {suggestions.map((job) => (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  hasApplied={hasApplied(job._id || job.id || '')}
                  onViewDetails={handleViewDetails}
                  onQuickApply={handleViewDetails}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Browse All Jobs Tab */}
        <TabsContent value="search" className="space-y-6 mt-0">
          <JobFilterPanel
            filters={filters}
            onUpdateFilters={updateFilters}
            professions={professionNames}
          />

          {searchLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-purple-600 mb-2" />
              <p className="text-sm">Fetching job postings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground border border-dashed rounded-3xl bg-card/40">
              <Briefcase className="size-10 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">No jobs match your filter</h3>
              <p className="text-xs max-w-sm mx-auto">
                Try clearing keyword filters or selecting a different profession category.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id || job.id}
                    job={job}
                    hasApplied={hasApplied(job._id || job.id || '')}
                    onViewDetails={handleViewDetails}
                    onQuickApply={handleViewDetails}
                  />
                ))}
              </div>

              {/* Pagination Info */}
              {totalCount > 12 && (
                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <span>
                    Showing {jobs.length} of {totalCount} open positions
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={(filters.page || 1) <= 1}
                      onClick={() => updateFilters({ page: (filters.page || 1) - 1 })}
                      className="text-xs h-8 rounded-lg cursor-pointer"
                    >
                      Previous
                    </Button>
                    <span className="font-mono px-2">Page {filters.page || 1}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={jobs.length < (filters.pageSize || 12)}
                      onClick={() => updateFilters({ page: (filters.page || 1) + 1 })}
                      className="text-xs h-8 rounded-lg cursor-pointer"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail & Application Modal */}
      <JobDetailModal
        job={activeJob}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onApply={handleApply}
        hasApplied={activeJob ? hasApplied(activeJob._id || activeJob.id || '') : false}
      />
    </div>
  );
}
