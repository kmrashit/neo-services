import {
  Sparkles,
  MapPin,
  Building,
  DollarSign,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IJobPost } from '../types';

interface JobCardProps {
  job: IJobPost;
  hasApplied?: boolean;
  onViewDetails: (job: IJobPost) => void;
  onQuickApply?: (job: IJobPost) => void;
}

export function JobCard({
  job,
  hasApplied,
  onViewDetails,
  onQuickApply,
}: JobCardProps) {
  const getMatchScoreBadge = (score?: number) => {
    if (typeof score !== 'number') {
      return null;
    }
    const colorClass =
      score >= 90
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        : score >= 75
          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

    return (
      <Badge variant="outline" className={`gap-1 font-semibold text-xs py-0.5 ${colorClass}`}>
        <Sparkles className="size-3" />
        <span>{score}% AI Match</span>
      </Badge>
    );
  };

  const getWorkplaceBadgeVariant = (type: string) => {
    if (type === 'Remote') {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
    if (type === 'Hybrid') {
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    }
    return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
  };

  return (
    <Card className="flex flex-col justify-between border-border/80 bg-card/60 backdrop-blur-sm hover:shadow-md hover:border-purple-500/40 transition-all rounded-2xl group">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="font-bold text-base text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium">
              <Building className="size-3 shrink-0" />
              <span className="truncate">{job.companyName}</span>
              {job.department && (
                <>
                  <span>•</span>
                  <span className="truncate">{job.department}</span>
                </>
              )}
            </p>
          </div>
          {getMatchScoreBadge(job.matchScore)}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Badge variant="secondary" className="text-[11px] font-normal px-2 py-0 h-5">
            {job.profession}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[11px] font-normal px-2 py-0 h-5 ${getWorkplaceBadgeVariant(job.workplaceType)}`}
          >
            {job.workplaceType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 py-2 space-y-3">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {job.location && (
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="size-3 shrink-0 text-muted-foreground/70" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.salaryRange && (
            <div className="flex items-center gap-1.5 truncate font-medium text-foreground">
              <DollarSign className="size-3 shrink-0 text-emerald-500" />
              <span className="truncate">{job.salaryRange}</span>
            </div>
          )}
          {typeof job.experienceYears === 'number' && (
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="size-3 shrink-0 text-muted-foreground/70" />
              <span>{job.experienceYears}+ years exp</span>
            </div>
          )}
        </div>

        {/* Short description */}
        {job.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* Skills Pills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] text-muted-foreground px-1 py-0.5 font-mono">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(job)}
          className="text-xs h-8 px-3 rounded-xl cursor-pointer"
        >
          View Details
        </Button>

        {hasApplied ? (
          <Badge
            variant="outline"
            className="h-8 px-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 font-semibold text-xs"
          >
            <CheckCircle2 className="size-3.5" />
            Applied
          </Badge>
        ) : (
          <Button
            size="sm"
            onClick={() => onQuickApply ? onQuickApply(job) : onViewDetails(job)}
            className="text-xs h-8 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer shadow-sm transition-all"
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
