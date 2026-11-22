import { useEffect, useState, useCallback } from 'react';
import { Users, Mail, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { fetchJobApplicants } from '../api';
import type { IJobPost, IJobApplicant } from '../types';

interface JobApplicantsDrawerProps {
  job: IJobPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicantsDrawer({
  job,
  isOpen,
  onClose,
}: JobApplicantsDrawerProps) {
  const [applicants, setApplicants] = useState<IJobApplicant[]>([]);
  const [loading, setLoading] = useState(false);

  const loadApplicants = useCallback(async () => {
    if (!job) {
      return;
    }
    const jobId = job._id || job.id;
    if (!jobId) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetchJobApplicants(jobId);
      setApplicants(res.applicants);
    } catch (err) {
      console.warn('Failed to fetch applicants:', err);
    } finally {
      setLoading(false);
    }
  }, [job]);

  useEffect(() => {
    if (isOpen && job) {
      loadApplicants();
    }
  }, [isOpen, job, loadApplicants]);

  if (!job) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Users className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Applicants: {job.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Review candidate credentials, verified skills, and cover notes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-3">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Loader2 className="size-6 animate-spin text-purple-600 mb-2" />
              <p className="text-xs">Loading applicants...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-2xl">
              <Users className="size-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium">No applications submitted yet.</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                When candidates apply, their profiles and notes will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {app.candidate?.fullName || 'Candidate'}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Mail className="size-3" />
                        <span>{app.candidate?.email}</span>
                        {app.candidate?.profession && (
                          <>
                            <span>•</span>
                            <span>{app.candidate?.profession}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] px-2 py-0 capitalize"
                    >
                      <CheckCircle2 className="size-3 mr-1" />
                      {app.status}
                    </Badge>
                  </div>

                  {app.candidate?.headline && (
                    <p className="text-xs text-muted-foreground">
                      {app.candidate?.headline}
                    </p>
                  )}

                  {/* Skills */}
                  {app.candidate?.skills && app.candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {app.candidate.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-mono text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Cover Note */}
                  {app.coverNote && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-xl border border-border/40 text-xs text-foreground">
                      <p className="font-semibold text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                        <FileText className="size-3" />
                        Candidate Cover Note:
                      </p>
                      <p className="leading-relaxed whitespace-pre-wrap">{app.coverNote}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
