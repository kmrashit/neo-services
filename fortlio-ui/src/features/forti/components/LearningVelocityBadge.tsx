import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LearningVelocityBadgeProps {
  score: number;
  progressionRate?: 'rapid' | 'steady' | 'exploratory';
  className?: string;
}

export function LearningVelocityBadge({
  score,
  progressionRate = 'rapid',
  className,
}: LearningVelocityBadgeProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Badge
        variant="outline"
        className="gap-1.5 py-1 px-2.5 border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-xs"
      >
        <Sparkles className="size-3.5 text-purple-500" />
        <span>Learning Velocity: {score}/100</span>
      </Badge>
      <Badge variant="secondary" className="text-[11px] capitalize">
        {progressionRate}
      </Badge>
    </div>
  );
}
