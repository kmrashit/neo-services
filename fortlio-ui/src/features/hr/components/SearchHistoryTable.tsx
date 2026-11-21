import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Search, Clock, ArrowRight } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ISearchHistoryItem } from '../types';

dayjs.extend(relativeTime);

interface SearchHistoryTableProps {
  searches: ISearchHistoryItem[];
  onSelectSearch: (query: string) => void;
}

export const SearchHistoryTable: React.FC<SearchHistoryTableProps> = ({
  searches,
  onSelectSearch,
}) => {
  if (!searches || searches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed border-border/80 rounded-2xl bg-card/40">
        <Clock className="size-8 text-muted-foreground/50 mb-2" />
        <p className="text-xs font-semibold">No recent searches</p>
        <p className="text-[11px] text-muted-foreground">
          Queries you execute will automatically appear here for rapid re-evaluation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Search Query</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Filters Applied</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Time</TableHead>
            <TableHead className="text-right text-xs font-bold uppercase tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searches.map((item) => (
            <TableRow key={item._id || item.query + item.searchedAt} className="hover:bg-muted/50">
              <TableCell className="font-semibold text-xs text-foreground flex items-center gap-2">
                <Search className="size-3.5 text-purple-600" />
                <span>{item.query}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.filters?.minExperience && (
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      Exp: {item.filters.minExperience}+ yrs
                    </Badge>
                  )}
                  {item.filters?.skills && (
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      Skills: {item.filters.skills}
                    </Badge>
                  )}
                  {!item.filters?.minExperience && !item.filters?.skills && (
                    <span className="text-[11px] text-muted-foreground font-medium">None</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {dayjs(item.searchedAt).fromNow()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectSearch(item.query)}
                  className="h-7 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-500/10 cursor-pointer"
                >
                  <span>Re-run</span>
                  <ArrowRight className="size-3 ml-1" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
