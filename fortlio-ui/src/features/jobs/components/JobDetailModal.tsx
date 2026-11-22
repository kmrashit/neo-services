import { useState } from 'react';
import {
  Building,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import type { IJobPost } from '../types';

interface JobDetailModalProps {
  job: IJobPost | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string, coverNote?: string) => Promise<void>;
  hasApplied?: boolean;
}

export function JobDetailModal({
  job,
  isOpen,
  onClose,
  onApply,
  hasApplied,
}: JobDetailModalProps) {
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!job) {
    return null;
  }

  const handleSubmitApply = async () => {
    setSubmitting(true);
    try {
      await onApply(job._id || job.id || '', coverNote);
      setAppliedSuccess(true);
      setCoverNote('');
    } catch {
      // error handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  const isAlreadyApplied = Boolean(hasApplied || appliedSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-2 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                {job.title}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-1">
                <Building className="size-4 shrink-0 text-purple-600" />
                <span>{job.companyName}</span>
                {job.department && (
                  <>
                    <span>•</span>
                    <span>{job.department}</span>
                  </>
                )}
              </DialogDescription>
            </div>

            {typeof job.matchScore === 'number' && (
              <Badge className="bg-purple-600/10 text-purple-600 dark:text-purple-300 border-purple-500/30 gap-1.5 px-3 py-1 font-bold text-xs shrink-0">
                <Sparkles className="size-3.5" />
                <span>{job.matchScore}% Match</span>
              </Badge>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
              {job.profession}
            </Badge>
            <Badge variant="outline" className="text-xs px-2.5 py-0.5">
              {job.workplaceType}
            </Badge>
            {job.location && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3.5" />
                {job.location}
              </span>
            )}
            {job.salaryRange && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <DollarSign className="size-3.5" />
                {job.salaryRange}
              </span>
            )}
            {typeof job.experienceYears === 'number' && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3.5" />
                {job.experienceYears}+ years exp
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Description & Requirements */}
        <div className="space-y-5 py-3 border-y border-border/60">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-2">Job Description</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.description || 'No detailed description provided.'}
            </p>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Required Skills & Specialties</h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Application Cover Note Area */}
          {!isAlreadyApplied && (
            <div className="space-y-2 pt-2">
              <label htmlFor="cover-note-input" className="text-sm font-bold text-foreground">
                Cover Note / Message to Recruiter (Optional)
              </label>
              <Textarea
                id="cover-note-input"
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Highlight your domain strengths, key projects, or why you're a standout fit..."
                rows={3}
                className="text-xs rounded-xl"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="cursor-pointer text-xs">
            Close
          </Button>

          {isAlreadyApplied ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="size-5" />
              <span>Application Submitted Successfully!</span>
            </div>
          ) : (
            <Button
              onClick={handleSubmitApply}
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer shadow-md text-xs px-5 h-9"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Apply with Verified Profile
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
