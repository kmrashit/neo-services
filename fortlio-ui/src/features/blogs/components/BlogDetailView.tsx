import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock, Calendar, Sparkles, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShareLinkModal } from '@/features/shortener';
import type { IBlog } from '../types';

interface BlogDetailViewProps {
  blog: IBlog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogDetailView({ blog, isOpen, onClose }: BlogDetailViewProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  if (!blog) {return null;}

  const rawAuthor = blog.authorDetails?.fullName || blog.author;
  const authorName = typeof rawAuthor === 'string' ? rawAuthor : (rawAuthor?.fullName || 'Candidate');
  const authorHeadline = blog.authorDetails?.headline;
  const tags = blog.tags || blog.blogKeywords || [];
  const score = blog.fortiAnalysisScore || 92;

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                Back to Articles
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 text-xs cursor-pointer"
              >
                <Share2 className="size-3.5" />
                Share
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30">
                  <Sparkles className="size-3 text-purple-500" />
                Forti Velocity: {score}/100
                </Badge>
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                  #{t}
                  </Badge>
                ))}
              </div>

              <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-foreground">
                {blog.title}
              </DialogTitle>

              <DialogDescription className="sr-only">
                {blog.excerpt || 'Full blog post details'}
              </DialogDescription>
            </div>

            {/* Author & Publication metadata */}
            <div className="flex items-center justify-between border-y border-border/60 py-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{authorName}</p>
                  {authorHeadline && <p className="text-xs text-muted-foreground">{authorHeadline}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recent')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {blog.readTime || '5 min read'}
                </span>
              </div>
            </div>
          </DialogHeader>

          {/* Markdown Content */}
          <div className="prose dark:prose-invert text-foreground dark:text-slate-100 max-w-none pt-4 text-sm md:text-base leading-relaxed dark:[&_*]:text-slate-200 dark:[&_p]:text-slate-200 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_strong]:text-white">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

          <Separator className="my-6" />

          {/* Forti Engine Verification Callout */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-700 dark:text-purple-300">
              <Sparkles className="size-4" />
            Forti AI Insights Verification
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
            This article was analyzed by the Forti AI Engine. The publication contributed to the candidate&apos;s verified learning velocity score, demonstrated domain depth, and enriched recruiter talent discovery filters.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        targetType="blog"
        targetTitle={blog.title}
        originalUrl={window.location.href}
      />
    </>
  );
}
