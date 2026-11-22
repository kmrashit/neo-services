import { Users, Eye, Power } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IJobPost, JobStatus } from '../types';

interface HrJobPostsTableProps {
  jobs: IJobPost[];
  onViewApplicants: (job: IJobPost) => void;
  onToggleStatus: (jobId: string, nextStatus: JobStatus) => Promise<IJobPost | unknown>;
}

export function HrJobPostsTable({
  jobs,
  onViewApplicants,
  onToggleStatus,
}: HrJobPostsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-2xl">
        <p className="text-sm font-medium">No job postings created yet.</p>
        <p className="text-xs text-muted-foreground/80 mt-1">
          Click &quot;Post New Job&quot; above to create and publish your first role.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 overflow-hidden bg-card/60 backdrop-blur-sm shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-bold text-xs">Role Title</TableHead>
            <TableHead className="font-bold text-xs">Profession</TableHead>
            <TableHead className="font-bold text-xs">Workplace</TableHead>
            <TableHead className="font-bold text-xs">Status</TableHead>
            <TableHead className="font-bold text-xs">Applicants</TableHead>
            <TableHead className="font-bold text-xs text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const jobId = job._id || job.id || '';
            const isActive = job.status === 'active';

            return (
              <TableRow key={jobId} className="hover:bg-muted/40 transition-colors">
                <TableCell>
                  <div className="font-bold text-sm text-foreground">{job.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {job.department ? `${job.companyName} • ${job.department}` : job.companyName}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[11px] font-normal px-2 py-0">
                    {job.profession}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">{job.workplaceType}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[11px] px-2 py-0 capitalize ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onViewApplicants(job)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs cursor-pointer transition-colors"
                  >
                    <Users className="size-3.5" />
                    <span>{job.applicantCount || 0}</span>
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplicants(job)}
                      className="h-8 px-2.5 text-xs rounded-lg cursor-pointer"
                    >
                      <Eye className="size-3.5 mr-1" />
                      Applicants
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(jobId, isActive ? 'closed' : 'active')}
                      className={`h-8 px-2 text-xs rounded-lg cursor-pointer ${
                        isActive ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-500/10' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10'
                      }`}
                    >
                      <Power className="size-3.5 mr-1" />
                      {isActive ? 'Close' : 'Reopen'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
