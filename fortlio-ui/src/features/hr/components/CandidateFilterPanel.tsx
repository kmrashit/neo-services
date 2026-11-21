import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ISearchFilter } from '../types';

interface CandidateFilterPanelProps {
  filter: ISearchFilter;
  onChange: (filter: ISearchFilter) => void;
  onReset: () => void;
}

const COMMON_SKILLS = [
  'TypeScript',
  'Distributed Systems',
  'MongoDB',
  'Redis',
  'Bioinformatics',
  'Genomics',
  'Design Systems',
  'Figma',
  'Tech Governance',
  'IP Law',
  'Python',
  'Cloud Architecture',
];

const EXPERIENCE_OPTIONS = [
  { label: 'Any Experience', value: 0 },
  { label: '3+ Years', value: 3 },
  { label: '5+ Years', value: 5 },
  { label: '8+ Years', value: 8 },
];

export const CandidateFilterPanel: React.FC<CandidateFilterPanelProps> = ({
  filter,
  onChange,
  onReset,
}) => {
  const toggleSkill = (skill: string) => {
    const current = filter.skills || [];
    const exists = current.includes(skill);
    const updated = exists ? current.filter((s) => s !== skill) : [...current, skill];
    onChange({ ...filter, skills: updated });
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-4 space-y-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-purple-600 dark:text-purple-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Filter Candidates
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <RotateCcw className="size-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Experience Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Minimum Experience</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => {
            const isSelected = (filter.minExperience || 0) === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...filter, minExperience: opt.value })}
                className={`text-xs h-8 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Skills Multi-select */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Domain Competencies & Skills</label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SKILLS.map((skill) => {
            const isSelected = (filter.skills || []).includes(skill);
            return (
              <Badge
                key={skill}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => toggleSkill(skill)}
                className={`text-xs py-1 px-2.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 font-semibold shadow-sm'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                {skill}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};
