import { Clock, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IBlog } from '../types';

interface BlogCardProps {
  blog: IBlog;
  onSelect?: (blog: IBlog) => void;
}

export function BlogCard({ blog, onSelect }: BlogCardProps) {
  const rawAuthor = blog.authorDetails?.fullName || blog.author;
  const authorName = typeof rawAuthor === 'string' ? rawAuthor : (rawAuthor?.fullName || 'Candidate');
  const authorHeadline = blog.authorDetails?.headline;
  const tags = blog.tags || blog.blogKeywords || [];
  const score = blog.fortiAnalysisScore || 92;

  return (
    <Card
      className="flex flex-col border-border/80 hover:border-primary/50 transition-all shadow-sm hover:shadow-md bg-card/90 cursor-pointer group"
      onClick={() => onSelect?.(blog)}
    >
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {blog.readTime || '5 min read'}
          </span>
          <span>{blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recent')}</span>
        </div>
        <CardTitle className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <CardDescription className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed line-clamp-3">
          {blog.excerpt || (blog.content ? blog.content.slice(0, 160) + '...' : '')}
        </CardDescription>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] font-medium">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-[11px]">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="font-medium text-foreground truncate">{authorName}</p>
            {authorHeadline && <p className="text-[10px] text-muted-foreground truncate">{authorHeadline}</p>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/50 pt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
          <Sparkles className="size-3.5" />
          <span>Forti Velocity: {score}/100</span>
        </div>

        <span className="flex items-center gap-1 text-primary font-medium group-hover:underline">
          Read Article
          <ChevronRight className="size-3.5" />
        </span>
      </CardFooter>
    </Card>
  );
}
