import { Search, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IJobSearchParams, WorkplaceType } from '../types';

interface JobFilterPanelProps {
  filters: IJobSearchParams;
  onUpdateFilters: (filters: Partial<IJobSearchParams>) => void;
  professions: string[];
}

const WORKPLACE_OPTIONS: { label: string; value: WorkplaceType | '' }[] = [
  { label: 'All Locations', value: '' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Onsite', value: 'Onsite' },
];

export function JobFilterPanel({
  filters,
  onUpdateFilters,
  professions,
}: JobFilterPanelProps) {
  const handleSearchChange = (val: string) => {
    onUpdateFilters({ searchKey: val });
  };

  const handleProfessionChange = (val: string) => {
    onUpdateFilters({ profession: val || undefined });
  };

  const handleWorkplaceChange = (val: WorkplaceType | '') => {
    onUpdateFilters({ workplaceType: (val as WorkplaceType) || undefined });
  };

  const handleReset = () => {
    onUpdateFilters({
      searchKey: '',
      profession: undefined,
      workplaceType: undefined,
      minExperience: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filters.searchKey || filters.profession || filters.workplaceType || filters.minExperience,
  );

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-4 space-y-4 shadow-sm backdrop-blur-sm">
      {/* Top Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={filters.searchKey || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by job title, department, or company..."
            className="pl-10 h-10 text-sm bg-background rounded-xl focus-visible:ring-purple-500"
          />
        </div>

        {/* Profession Dropdown */}
        <div className="sm:w-64 shrink-0">
          <select
            value={filters.profession || ''}
            onChange={(e) => handleProfessionChange(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-foreground cursor-pointer"
          >
            <option value="">All Professions & Disciplines</option>
            {professions.map((prof) => (
              <option key={prof} value={prof}>
                {prof}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Workplace Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40 text-xs">
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-muted-foreground mr-1" />
          <span className="text-muted-foreground font-medium mr-1">Workplace:</span>
          {WORKPLACE_OPTIONS.map((opt) => {
            const isSelected =
              (!filters.workplaceType && opt.value === '') ||
              filters.workplaceType === opt.value;
            return (
              <Badge
                key={opt.label}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => handleWorkplaceChange(opt.value)}
                className={`cursor-pointer text-[11px] px-2.5 py-1 font-medium transition-colors ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {opt.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
