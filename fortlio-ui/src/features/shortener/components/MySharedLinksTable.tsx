import { useState } from 'react';
import { Copy, Check, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IShortLink } from '../types';

interface MySharedLinksTableProps {
  links: IShortLink[];
}

export function MySharedLinksTable({ links }: MySharedLinksTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (shortCode: string) => {
    const fullUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (links.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-xl border-border text-xs text-muted-foreground">
        No shared links generated yet. Click &quot;Share Profile&quot; or share a blog post to start tracking visitor engagement.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-xs text-left">
        <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
          <tr>
            <th className="p-3">Short URL</th>
            <th className="p-3">Type</th>
            <th className="p-3">Views</th>
            <th className="p-3">Avg Duration</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {links.map((link) => {
            const views = link.viewsCount || link.accessCount || 0;
            const avg = link.averageTimeSpentSeconds || (views > 0 && link.totalTimeSpentSeconds ? Math.round(link.totalTimeSpentSeconds / views) : 0);
            const isCopied = copiedCode === link.shortCode;

            return (
              <tr key={link.shortCode} className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-medium text-foreground">
                  /s/{link.shortCode}
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {link.targetType || 'custom'}
                  </Badge>
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Eye className="size-3 text-muted-foreground" />
                    {views}
                  </span>
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3 text-muted-foreground" />
                    {avg}s
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(link.shortCode)}
                    className="h-7 px-2 text-xs gap-1 cursor-pointer hover:text-primary"
                  >
                    {isCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
