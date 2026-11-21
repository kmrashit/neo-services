import React from 'react';
import { Search, X, Sparkles, Coins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CandidateSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

const QUICK_SEARCH_PILLS = [
  'Distributed Systems',
  'Genomics',
  'Design Systems',
  'Tech Governance',
  'TypeScript',
  'Bioinformatics',
];

export const CandidateSearchBar: React.FC<CandidateSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  isLoading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search candidates by profession, skill, keyword, or domain..."
            className="pl-10 pr-9 h-11 text-sm bg-card border-border/80 shadow-sm focus-visible:ring-purple-500"
          />
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-purple-500/20 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <Sparkles className="size-4 animate-spin mr-1.5" />
          ) : (
            <Search className="size-4 mr-1.5" />
          )}
          <span>Search</span>
          <span className="ml-2 text-[11px] opacity-80 flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded-full">
            <Coins className="size-3 text-amber-300" />
            5
          </span>
        </Button>
      </form>

      {/* Quick Filter Pills */}
      <div className="flex items-center flex-wrap gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-muted-foreground mr-1">Trending:</span>
        {QUICK_SEARCH_PILLS.map((pill) => (
          <Badge
            key={pill}
            variant="outline"
            onClick={() => {
              onChange(pill);
            }}
            className="cursor-pointer text-xs py-0.5 px-2.5 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 dark:hover:bg-purple-950/40 dark:hover:text-purple-300 transition-colors"
          >
            {pill}
          </Badge>
        ))}
      </div>
    </div>
  );
};
