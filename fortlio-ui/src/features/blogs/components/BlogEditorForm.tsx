import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PenLine, Eye, Sparkles, Plus, X, Palette, Wand2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCreateBlog } from '../hooks/useCreateBlog';
import type { IBlog } from '../types';

interface BlogEditorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (newBlog: IBlog) => void;
}

const PRESET_TAGS = [
  'Engineering',
  'Medicine',
  'Healthcare',
  'Legal',
  'Finance',
  'Design',
  'Research',
  'AI & ML',
  'Operations',
  'Education',
];

export function BlogEditorForm({ isOpen, onClose, onPublished }: BlogEditorFormProps) {
  const { publishBlog, isSubmitting } = useCreateBlog();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Engineering']);
  const [error, setError] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  const handleImproveWithAi = () => {
    if (!content.trim()) {
      setError('Please write your initial thoughts/draft first so AI can polish it.');
      return;
    }
    setIsImproving(true);
    setTimeout(() => {
      setIsImproving(false);
      setContent((prev) => {
        return (
          prev +
          '\n\n## Key Takeaways & Methodological Insights\n- Structured domain synthesis based on verified evidence.\n- High-impact execution with measurable outcomes.'
        );
      });
      setAiNotice('Article polished! Remember: Forti AI evaluates your learning velocity and domain depth strictly based on your authentic inputs and critical thinking.');
      setTimeout(() => setAiNotice(null), 8000);
    }, 800);
  };

  const handleDrawImagination = () => {
    const diagramTemplate = `\n\n### System / Domain Architecture\n\`\`\`mermaid\ngraph TD\n  A[Challenge / Problem Hypothesis] --> B[Domain Analysis & Method]\n  B --> C[Execution & Architecture]\n  C --> D[Verified Result & Impact]\n\`\`\`\n`;
    setContent((prev) => prev + diagramTemplate);
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Article title is required.');
      return;
    }
    if (!content.trim() || content.length < 20) {
      setError('Article content must be at least 20 characters.');
      return;
    }

    try {
      setError(null);
      const newBlog = await publishBlog({
        title: title.trim(),
        content: content.trim(),
        blogKeywords: tags,
        status: 'published',
      });
      onPublished?.(newBlog);
      setTitle('');
      setContent('');
      setTags(['Engineering']);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to publish blog article.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold">Write Specialty Domain Blog</DialogTitle>
            <Badge variant="outline" className="gap-1 text-xs text-purple-600 dark:text-purple-400 border-purple-500/30">
              <Sparkles className="size-3 text-purple-500" />
              Forti Analyzed
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Publish your insights, architecture case studies, clinical analyses, or domain breakdowns. The Forti AI Engine synthesizes candidate velocity and knowledge depth upon publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="blog-title" className="text-xs font-semibold">
              Article Title
            </Label>
            <Input
              id="blog-title"
              placeholder="e.g. Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Tags selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Specialty Topics & Tags</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 text-xs py-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(tagInput)}
                className="h-8 text-xs cursor-pointer shrink-0"
              >
                <Plus className="size-3 mr-1" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1 self-center">Presets:</span>
              {PRESET_TAGS.filter((p) => !tags.includes(p)).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddTag(preset)}
                  className="text-[11px] text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Markdown Content with Editor & Preview tabs */}
          <Tabs defaultValue="write" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5">
              <Label className="text-xs font-semibold">Markdown Content</Label>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDrawImagination}
                  className="h-7 text-[11px] gap-1 px-2 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 cursor-pointer"
                >
                  <Palette className="size-3" />
                  Draw Imagination
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImproveWithAi}
                  disabled={isImproving}
                  className="h-7 text-[11px] gap-1 px-2 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer"
                >
                  <Wand2 className="size-3" />
                  {isImproving ? 'Improving...' : 'Improve with AI'}
                </Button>

                <TabsList className="h-7 ml-1">
                  <TabsTrigger value="write" className="text-xs gap-1.5 px-2.5 h-6">
                    <PenLine className="size-3" />
                    Write
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs gap-1.5 px-2.5 h-6">
                    <Eye className="size-3" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {aiNotice && (
              <div className="mb-2 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{aiNotice}</span>
              </div>
            )}

            <TabsContent value="write" className="mt-0">
              <Textarea
                placeholder="Write your article in Markdown... (headings, code blocks, lists, quotes supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[240px] font-mono text-xs leading-relaxed"
                required
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="min-h-[240px] p-4 rounded-lg border border-input bg-card/60 overflow-y-auto max-h-[300px] prose dark:prose-invert text-xs max-w-none">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic text-xs">Nothing to preview yet. Switch to &apos;Write&apos; tab to add content.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer gap-2"
            >
              <Sparkles className="size-4" />
              {isSubmitting ? 'Publishing & Forti Analyzing...' : 'Publish Specialty Article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
