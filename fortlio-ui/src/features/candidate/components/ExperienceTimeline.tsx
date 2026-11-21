import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import type { IExperience } from '../types';

interface ExperienceTimelineProps {
  experiences?: IExperience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  experiences = [],
}) => {
  if (!experiences.length) {
    return null;
  }

  return (
    <Card className="border border-border/80 shadow-sm bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Briefcase className="size-4 text-purple-600 dark:text-purple-400" />
          <span>Work Experience</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="relative pl-6 pb-4 border-l border-border/80 last:border-none last:pb-0"
          >
            <div className="absolute -left-1.5 top-1 size-3 rounded-full bg-purple-600 ring-4 ring-card" />
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-foreground">{exp.role}</h4>
                <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full w-fit">
                  {exp.period}
                </span>
              </div>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{exp.company}</p>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">{exp.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
