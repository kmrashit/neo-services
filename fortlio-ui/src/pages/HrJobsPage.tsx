import { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Building,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PROFESSIONS_TAXONOMY } from '@/constants/taxonomy';
import {
  HrJobPostsTable,
  JobPostModal,
  JobApplicantsDrawer,
  useHrJobPosts,
  type IJobPost,
  type IJobCreatePayload,
  type JobStatus,
} from '@/features/jobs';

export default function HrJobsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewApplicantsJob, setViewApplicantsJob] = useState<IJobPost | null>(null);

  const {
    jobs,
    totalCount,
    loading,
    createJob,
    updateStatus,
  } = useHrJobPosts();

  const professionNames = PROFESSIONS_TAXONOMY.map((p) => p.name);

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const totalApplicantsCount = jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);

  const handleCreateSubmit = (payload: IJobCreatePayload) => createJob(payload);

  const handleToggleStatus = (jobId: string, nextStatus: JobStatus) => updateStatus(jobId, nextStatus);

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-background p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600/20 text-purple-600 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-0.5">
                <Briefcase className="size-3 mr-1" />
                Talent Acquisition & Hiring
              </Badge>
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
                Recruiter Studio
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              Recruitment & Job Postings
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Publish multidisciplinary roles across engineering, design, medicine, law, research, and beyond. Review authentic candidate portfolios and track applicants.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-10 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold cursor-pointer shadow-md rounded-xl shrink-0"
          >
            <Plus className="size-4 mr-1.5" />
            <span>Post New Job</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-border/80 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Listings</p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">{totalCount}</h3>
            </div>
            <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Building className="size-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border/80 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active Openings</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {activeJobsCount}
              </h3>
            </div>
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border/80 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Applicants</p>
              <h3 className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {totalApplicantsCount}
              </h3>
            </div>
            <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Users className="size-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Job Postings Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Your Job Postings</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {jobs.length} listed
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground flex flex-col items-center">
            <Loader2 className="size-8 animate-spin text-purple-600 mb-2" />
            <p className="text-sm">Loading your postings...</p>
          </div>
        ) : (
          <HrJobPostsTable
            jobs={jobs}
            onViewApplicants={(job) => setViewApplicantsJob(job)}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Create Job Modal */}
      <JobPostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        professions={professionNames}
      />

      {/* View Applicants Drawer */}
      <JobApplicantsDrawer
        job={viewApplicantsJob}
        isOpen={Boolean(viewApplicantsJob)}
        onClose={() => setViewApplicantsJob(null)}
      />
    </div>
  );
}
