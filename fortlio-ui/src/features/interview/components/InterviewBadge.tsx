import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import type { ReadinessBadge } from '../types';

interface InterviewBadgeProps {
  badge: ReadinessBadge;
  score?: number;
  className?: string;
}

export const InterviewBadge: React.FC<InterviewBadgeProps> = ({
  badge,
  score,
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (badge) {
    case 'Expert / Lead':
      return {
        icon: Sparkles,
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
        label: 'Expert / Lead',
      };
    case 'Advanced':
      return {
        icon: ShieldCheck,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        label: 'Advanced',
      };
    case 'Proficient':
      return {
        icon: Zap,
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        label: 'Proficient',
      };
    case 'Emerging':
    default:
      return {
        icon: Award,
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        label: 'Emerging',
      };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-3 py-1 font-medium text-xs rounded-full border ${config.color} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
      {typeof score === 'number' && (
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-background/60 font-semibold text-[10px]">
          {score}
        </span>
      )}
    </Badge>
  );
};
