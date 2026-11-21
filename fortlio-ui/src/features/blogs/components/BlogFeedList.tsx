import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard } from './BlogCard';
import type { IBlog } from '../types';

interface BlogFeedListProps {
  blogs: IBlog[];
  isLoading?: boolean;
  onSelectBlog: (blog: IBlog) => void;
  onResetFilter?: () => void;
}

export function BlogFeedList({ blogs, isLoading, onSelectBlog, onResetFilter }: BlogFeedListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-xl border border-border/60 bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed border-border bg-card/50">
        <div className="p-3 bg-muted rounded-full text-muted-foreground mb-4">
          <SearchX className="size-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Specialty Blogs Found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
          No articles match your current search query or tag filter. Try searching for different keywords or explore other specialties.
        </p>
        {onResetFilter && (
          <Button variant="outline" size="sm" onClick={onResetFilter}>
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} onSelect={onSelectBlog} />
      ))}
    </div>
  );
}
