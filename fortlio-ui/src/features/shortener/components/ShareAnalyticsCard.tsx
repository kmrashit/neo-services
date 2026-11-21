import { Clock, Eye, TrendingUp, Sparkles, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IShortLink } from '../types';

interface ShareAnalyticsCardProps {
  links: IShortLink[];
  onOpenMyLinks?: () => void;
}

export function ShareAnalyticsCard({ links, onOpenMyLinks }: ShareAnalyticsCardProps) {
  const totalViews = links.reduce((acc, curr) => acc + (curr.viewsCount || curr.accessCount || 0), 0);
  const totalSeconds = links.reduce((acc, curr) => acc + (curr.totalTimeSpentSeconds || 0), 0);
  const avgSeconds = totalViews > 0 ? Math.round(totalSeconds / totalViews) : 0;

  const formatDuration = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${remainder}s`;
  };

  return (
    <Card className="border border-border/80 bg-card/90 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Link Share & Visitor Analytics</CardTitle>
              <p className="text-xs text-muted-foreground">Real-time candidate reach and dwell time</p>
            </div>
          </div>

          <Badge variant="outline" className="gap-1 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400">
            <Sparkles className="size-3 text-purple-500" />
            Active Tracking
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
            <div className="flex items-center justify-center text-muted-foreground mb-1">
              <Eye className="size-3.5" />
            </div>
            <div className="text-xl font-extrabold text-foreground">{totalViews}</div>
            <div className="text-[11px] text-muted-foreground font-medium">Total Views</div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
            <div className="flex items-center justify-center text-muted-foreground mb-1">
              <Clock className="size-3.5" />
            </div>
            <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
              {formatDuration(totalSeconds)}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">Time Engaged</div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
            <div className="flex items-center justify-center text-muted-foreground mb-1">
              <TrendingUp className="size-3.5" />
            </div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {avgSeconds}s
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">Avg Dwell Time</div>
          </div>
        </div>

        {links.length > 0 && onOpenMyLinks && (
          <button
            type="button"
            onClick={onOpenMyLinks}
            className="w-full text-xs text-primary font-medium hover:underline flex items-center justify-center gap-1 pt-1 cursor-pointer"
          >
            <span>View all {links.length} shared links</span>
            <ExternalLink className="size-3" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}
