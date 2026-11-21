import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import type { IEducation } from '../types';

interface EducationListProps {
  education?: IEducation[];
}

export const EducationList: React.FC<EducationListProps> = ({ education = [] }) => {
  if (!education.length) {
    return null;
  }

  return (
    <Card className="border border-border/80 shadow-sm bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <GraduationCap className="size-4 text-purple-600 dark:text-purple-400" />
          <span>Education Credentials</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {education.map((edu, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 gap-1"
          >
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">{edu.degree}</h4>
              <p className="text-xs text-muted-foreground">{edu.institution}</p>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {edu.year}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
