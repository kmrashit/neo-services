import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Eye, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IViewedProfileItem } from '../types';

dayjs.extend(relativeTime);

interface ViewedProfilesGridProps {
  viewedProfiles: IViewedProfileItem[];
}

export const ViewedProfilesGrid: React.FC<ViewedProfilesGridProps> = ({
  viewedProfiles,
}) => {
  if (!viewedProfiles || viewedProfiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed border-border/80 rounded-2xl bg-card/40">
        <Eye className="size-8 text-muted-foreground/50 mb-2" />
        <p className="text-xs font-semibold">No viewed profiles yet</p>
        <p className="text-[11px] text-muted-foreground">
          Profiles you visit will be automatically archived here for follow-up review.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {viewedProfiles.map((item) => {
        const prof = item.profile;
        const name = prof?.fullName || 'Candidate Profile';
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return (
          <Card
            key={item.viewedUserId + item.viewedAt}
            className="hover:border-purple-500/40 transition-all bg-card/70 border-border/80 shadow-sm"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground truncate max-w-[150px]">
                      {name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                      {prof?.headline || prof?.designation || prof?.profession || 'Professional'}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="text-[9px] py-0 px-1.5 shrink-0">
                  {dayjs(item.viewedAt).fromNow()}
                </Badge>
              </div>

              {prof?.skills && prof.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {prof.skills.slice(0, 3).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px] py-0 px-1.5">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-500" />
                  Verified
                </span>
                <Link to={`/candidate-profile?candidateId=${item.viewedUserId}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-500/10 cursor-pointer"
                  >
                    <span>View</span>
                    <ExternalLink className="size-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
