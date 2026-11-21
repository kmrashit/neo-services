import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface SkillsBadgeListProps {
  skills?: string[];
  title?: string;
}

export const SkillsBadgeList: React.FC<SkillsBadgeListProps> = ({
  skills = [],
  title = 'Verified Skills',
}) => {
  if (!skills.length) {
    return null;
  }

  return (
    <Card className="border border-border/80 shadow-sm bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium text-xs px-3 py-1 rounded-xl"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
