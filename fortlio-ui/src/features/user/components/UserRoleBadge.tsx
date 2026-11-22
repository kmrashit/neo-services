import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Code, Briefcase, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '../types';

interface UserRoleBadgeProps {
  role?: UserRole | string;
  className?: string;
  showIcon?: boolean;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  role = 'candidate',
  className,
  showIcon = true,
}) => {
  const normalized = role.toLowerCase();

  if (normalized === 'hr' || normalized === 'recruiter') {
    return (
      <Badge
        variant="secondary"
        className={cn(
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium gap-1 text-xs px-2.5 py-0.5',
          className,
        )}
      >
        {showIcon && <Briefcase className="size-3" />}
        <span>Recruiter / HR</span>
      </Badge>
    );
  }

  if (normalized === 'admin') {
    return (
      <Badge
        variant="secondary"
        className={cn(
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium gap-1 text-xs px-2.5 py-0.5',
          className,
        )}
      >
        {showIcon && <ShieldAlert className="size-3" />}
        <span>Admin</span>
      </Badge>
    );
  }

  // Default: candidate
  return (
    <Badge
      variant="secondary"
      className={cn(
        'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium gap-1 text-xs px-2.5 py-0.5',
        className,
      )}
    >
      {showIcon && <Code className="size-3" />}
      <span>Candidate</span>
    </Badge>
  );
};
