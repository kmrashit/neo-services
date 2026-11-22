import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Save,
  Download,
  FileText,
  BookOpen,
  Sparkles,
  Loader2,
  Check,
  Eye,
  Edit3,
  Columns,
  Palette,
  Wand2,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { DrawYourImaginationModal } from './DrawYourImaginationModal';

export interface UnifiedMarkdownEditorProps {
  initialMode?: 'resume' | 'blog';
  initialMarkdown?: string;
  initialOpenDraw?: boolean;
  onSave?: (markdown: string) => void;
  onPublishBlog?: (data: { title: string; content: string; tags: string[] }) => Promise<void>;
  onExportPdf?: (markdown: string) => Promise<void>;
  candidateName?: string;
}

const DEFAULT_RESUME_MARKDOWN = `# [Your Full Name]
**[Target Role / Professional Specialty Headline]**
[City, State / Open to Remote] • [email@example.com] • [portfolio-link.com] • [linkedin.com/in/username] • [github.com/username]

---

## Executive Summary

A results-driven **[Specialty / Profession Title]** with **[X+] years of proven experience** in *[Core Domain 1]*, *[Core Domain 2]*, and *[Core Domain 3]*. Recognized for translating complex problem spaces into scalable, high-impact outcomes through structured methodology and cross-disciplinary leadership.

> **Professional Value Proposition**: Combines strategic domain vision with execution rigor to deliver measurable organizational impact and sustainable growth.

---

## Core Competencies & Skills

| Competency Area | Core Methodologies & Technologies | Experience / Mastery |
|:----------------|:----------------------------------|---------------------:|
| **Primary Domain** | [Specialty A, Methodology B, Industry Standard C] | Expert (5+ yrs) |
| **Tools & Platforms** | [Platform 1, System 2, Framework 3, Database 4] | Advanced (4+ yrs) |
| **Practices & Quality** | [STAR Method, Architecture Review, Compliance] | Advanced (4+ yrs) |
| **Leadership** | [Cross-functional Alignment, Mentorship, Strategy] | Proficient (3+ yrs) |

### Functional Skill Breakdown

- **Domain Disciplines**: [Core Discipline 1], [Core Discipline 2], [Core Discipline 3], [Core Discipline 4]
- **Tooling & Environments**: [Tool A], [Platform B], [Environment C], [System D]
- **Professional Practices**: Agile delivery, quantifiable impact reporting, technical writing, stakeholder communication

---

## Professional Experience

### [Job Title / Position] | [Company / Organization Name]
*[Start Month, Year] – [End Month, Year / Present] | [Location / Remote]*

- **[Key Initiative 1]**: Spearheaded [project/system initiative], achieving an **[X%] efficiency gain** and saving **$[Y]k annually** using [primary methodology/tool].
- **[Key Initiative 2]**: Architected and deployed [core deliverable], supporting over **[Z]k active users/transactions** with **99.9% reliability**.
- **[Leadership & Process]**: Mentored a cross-functional team of **[N] professionals**, establishing best practices and reducing turnaround time by **[X%]**.
  - Standardized peer review workflows across [department/unit].
  - Authored standard operating procedures and technical documentation.

### [Previous Job Title] | [Previous Organization Name]
*[Start Month, Year] – [End Month, Year] | [Location / Remote]*

- Delivered [milestone deliverable] on schedule, directly improving [critical metric] by **[X%]**.
- Collaborated with cross-disciplinary stakeholders to implement [feature/solution], reducing operational overhead by **[Y%]**.
- Resolved [complex bottleneck/challenge] using [structured analysis], resulting in [tangible business benefit].

---

## Education & Credentials

### [Degree / Professional Qualification]
*[University / Academic Institution / Issuing Board] • [Graduation Year]*
- **Honors / Concentration**: [Summa Cum Laude / Dean's List / Major Field Concentration]
- **Capstone / Thesis**: [Title or focus of research / capstone project]

### Verified Certifications & Credentials

- [x] **[Certification Name 1]** — *[Issuing Organization]* (Credential ID: [ABC-12345])
- [x] **[Certification Name 2]** — *[Issuing Organization]* (Credential ID: [XYZ-67890])
- [ ] **[In-Progress Credential]** — *Expected [Month, Year]*

---

## Key Projects & Case Studies

1. **[Flagship Project / Domain Case Study]** ([Link](https://fortlio.com))
   - Designed and executed [deliverable] addressing [domain challenge].
   - Leveraged [key methodology] to achieve [quantifiable outcome].
2. **[Specialty Blog / Whitepaper Publication]**
   - Authored deep dive on [topic], demonstrating problem-solving judgment and domain analysis.

---

*Tip: In Resume Builder Mode, use standard markdown headings (\`#\`, \`##\`, \`###\`), tables, and bullet points. Fortlio compiles your layout into a pixel-perfect, print-ready A4 PDF with watermark.*
`;

const DEFAULT_BLOG_MARKDOWN = `# Welcome to Fortlio

A clean, distraction-free markdown editor. Type on the left, see the rendered output on the right.

---

## Text Formatting

Markdown makes it easy to format text. You can write in **bold**, *italic*, or ~~strikethrough~~. Combine them for ***bold italic*** text. Use \`inline code\` for technical terms.

## Lists

Unordered lists use dashes, asterisks, or plus signs:

- Import files from GitHub, Dropbox, or Google Drive
- Export to Markdown, HTML, or PDF
- Drag and drop files directly into the editor

Ordered lists are numbered automatically:

1. Write your markdown
2. Preview the rendered output
3. Export or save to the cloud

Nested lists work too:

- Cloud integrations
  - GitHub repositories
  - Dropbox folders
  - Google Drive files
  - OneDrive and Bitbucket
- Local features
  - Auto-save to browser storage
  - Image paste from clipboard

## Task Lists

- [x] Set up the editor
- [x] Write some markdown
- [ ] Connect a cloud service
- [ ] Export the finished document

## Links and Images

Link to any page with [inline links](https://fortlio.com) or use [reference-style links][fortlio].

Images use a similar syntax:

![Placeholder](https://placehold.co/600x200/2B2F36/35D7BB?text=Your+Image+Here)

[fortlio]: https://fortlio.com

## Blockquotes

> The art of writing is the art of discovering what you believe.
>
> — Gustave Flaubert

Blockquotes can contain other markdown elements:

> **Tip:** Use \`Cmd+Shift+Z\` to enter zen mode for distraction-free writing.

## Code

Fenced code blocks support syntax highlighting:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}.\`;
}

console.log(greet("world"));
\`\`\`

\`\`\`python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`

## Tables

| Shortcut | Action |
|----------|--------|
| \`⌘ ⇧ Z\` | Toggle zen mode |
| \`Escape\` | Exit zen mode |
| \`?\` | Keyboard shortcuts |

Tables support alignment:

| Feature | Status | Notes |
|:--------|:------:|------:|
| Markdown editing | Active | Monaco-powered |
| Live preview | Active | Scroll-synced |
| Cloud sync | Available | 5 providers |
| PDF export | Available | Server-rendered |

## Footnotes

Fortlio supports extended markdown syntax including footnotes[^1] and definition lists.

[^1]: Footnotes appear at the bottom of the rendered preview.

## Math

Inline math: $E = mc^2$

Block equations:

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

---

*Your documents save automatically. Start writing.*
`;

export const UnifiedMarkdownEditor: React.FC<UnifiedMarkdownEditorProps> = ({
  initialMode = 'resume',
  initialMarkdown,
  initialOpenDraw = false,
  onSave,
  onPublishBlog,
  onExportPdf,
  candidateName,
}) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'resume' | 'blog'>(initialMode);
  const [markdown, setMarkdown] = useState<string>(() => {
    if (initialMarkdown) {return initialMarkdown;}
    const key = mode === 'resume' ? 'fortlio_resume_markdown' : 'fortlio_blog_markdown';
    const saved = localStorage.getItem(key);
    if (saved) {return saved;}
    return mode === 'resume' ? DEFAULT_RESUME_MARKDOWN : DEFAULT_BLOG_MARKDOWN;
  });

  const [viewTab, setViewTab] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Dialog states
  const [isDrawOpen, setIsDrawOpen] = useState(initialOpenDraw || false);
  const [isAiResumeOpen, setIsAiResumeOpen] = useState(false);
  const [isAiBlogOpen, setIsAiBlogOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogTags, setBlogTags] = useState('Engineering, Architecture');

  // AI assistant feedback
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  useEffect(() => {
    const key = mode === 'resume' ? 'fortlio_resume_markdown' : 'fortlio_blog_markdown';
    localStorage.setItem(key, markdown);
  }, [markdown, mode]);

  const handleModeSwitch = (newMode: 'resume' | 'blog') => {
    if (newMode === mode) {return;}
    setMode(newMode);
    const key = newMode === 'resume' ? 'fortlio_resume_markdown' : 'fortlio_blog_markdown';
    const saved = localStorage.getItem(key);
    setMarkdown(saved || (newMode === 'resume' ? DEFAULT_RESUME_MARKDOWN : DEFAULT_BLOG_MARKDOWN));
  };

  const handleSave = () => {
    const key = mode === 'resume' ? 'fortlio_resume_markdown' : 'fortlio_blog_markdown';
    localStorage.setItem(key, markdown);
    if (onSave) {onSave(markdown);}
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'resume' ? 'resume.md' : 'article.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = async () => {
    if (onExportPdf) {
      setIsExporting(true);
      try {
        await onExportPdf(markdown);
      } finally {
        setIsExporting(false);
      }
    }
  };

  // Help Me Write Resume AI Action
  const handleApplyResumeAi = (action: string) => {
    if (action === 'action-verbs') {
      setMarkdown((prev) =>
        prev +
        '\n\n### Key Technical Impact Highlights\n- **Architected** distributed resilient data pipelines handling high-throughput event spikes.\n- **Spearheaded** cross-functional reliability audits reducing latency variance by 40%.\n- **Authored** comprehensive developer tooling to accelerate pod velocity.',
      );
    } else if (action === 'quantify') {
      setMarkdown((prev) =>
        prev +
        '\n\n### Quantifiable Engineering Metrics\n- Improved system uptime from 99.8% to **99.99%** over 18 consecutive months.\n- Reduced infrastructure overhead by **35%** via intelligent resource autoscaling.',
      );
    }
    setIsAiResumeOpen(false);
    setAiNotice('Resume achievement bullets enhanced with action verbs & metrics!');
    setTimeout(() => setAiNotice(null), 4000);
  };

  // Help Me Write Blog AI Action
  const handleApplyBlogAi = () => {
    setMarkdown((prev) =>
      prev +
      '\n\n## Key Takeaways & Methodological Insights\n- Structured domain synthesis based on verified evidence and benchmarked telemetry.\n- High-impact execution with measurable architectural outcomes.\n\n*Authentic Trajectory Note*: Original candidate draft preserved for Forti learning velocity evaluation.',
    );
    setIsAiBlogOpen(false);
    setAiNotice('Article refined! Remember: Forti AI evaluates your learning velocity based strictly on authentic inputs.');
    setTimeout(() => setAiNotice(null), 5000);
  };

  const authorName = candidateName || user?.fullName || 'Your Name';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-background text-foreground">
      {/* Top Toolbar */}
      <div className="border-b border-border/80 bg-card/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Mode Selector & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60">
            <Button
              size="sm"
              variant={mode === 'resume' ? 'default' : 'ghost'}
              onClick={() => handleModeSwitch('resume')}
              className={`h-7 px-3 text-xs font-semibold rounded-lg cursor-pointer ${
                mode === 'resume'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="size-3.5 mr-1.5" />
              Resume Builder (Paginated)
            </Button>
            <Button
              size="sm"
              variant={mode === 'blog' ? 'default' : 'ghost'}
              onClick={() => handleModeSwitch('blog')}
              className={`h-7 px-3 text-xs font-semibold rounded-lg cursor-pointer ${
                mode === 'blog'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="size-3.5 mr-1.5" />
              Blog Creator (Medium View)
            </Button>
          </div>

          <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono">
            {mode === 'resume' ? 'A4 Paginated View' : 'Medium Fluid View'}
          </Badge>
        </div>

        {/* Center: Contextual Tool Buttons based on Mode */}
        <div className="flex items-center gap-2">
          {/* Draw Your Imagination Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsDrawOpen(true)}
            className="h-8 text-xs font-medium border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer"
          >
            <Palette className="size-3.5 mr-1.5" />
            <span>Draw Imagination</span>
          </Button>

          {/* Contextual AI Copilot */}
          {mode === 'resume' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAiResumeOpen(true)}
              className="h-8 text-xs font-semibold bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 cursor-pointer shadow-sm"
            >
              <Sparkles className="size-3.5 mr-1.5 text-purple-600" />
              <span>Help Me Write Resume</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAiBlogOpen(true)}
              className="h-8 text-xs font-semibold bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 cursor-pointer shadow-sm"
            >
              <Wand2 className="size-3.5 mr-1.5 text-purple-600" />
              <span>Help Me Write Blog</span>
            </Button>
          )}
        </div>

        {/* Right: View Toggles & Export/Publish */}
        <div className="flex items-center gap-2">
          {/* Split / Edit / Preview View Selector */}
          <div className="hidden md:flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
            <button
              onClick={() => setViewTab('edit')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                viewTab === 'edit'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Editor only"
            >
              <Edit3 className="size-3.5 inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => setViewTab('split')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                viewTab === 'split'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Split side-by-side"
            >
              <Columns className="size-3.5 inline mr-1" />
              Split
            </button>
            <button
              onClick={() => setViewTab('preview')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                viewTab === 'preview'
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Preview only"
            >
              <Eye className="size-3.5 inline mr-1" />
              Preview
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            className="h-8 text-xs font-medium cursor-pointer"
          >
            {isSaved ? <Check className="size-3.5 mr-1 text-emerald-500" /> : <Save className="size-3.5 mr-1" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownloadMd}
            className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title="Download Raw Markdown file"
          >
            <Download className="size-3.5" />
          </Button>

          {mode === 'resume' ? (
            <Button
              size="sm"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="h-8 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer shadow-sm"
            >
              {isExporting ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <Download className="size-3.5 mr-1" />}
              <span>Export PDF (with Watermark)</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsPublishOpen(true)}
              className="h-8 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer shadow-sm"
            >
              <Send className="size-3.5 mr-1" />
              <span>Publish Blog</span>
            </Button>
          )}
        </div>
      </div>

      {/* AI Notice Banner */}
      {aiNotice && (
        <div className="bg-purple-600/10 border-b border-purple-500/20 px-4 py-2 text-xs font-medium text-purple-700 dark:text-purple-300 flex items-center justify-between">
          <span>{aiNotice}</span>
          <button onClick={() => setAiNotice(null)} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
      )}

      {/* Main Workspace Panes */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Left Pane: Markdown Source Editor */}
        {(viewTab === 'split' || viewTab === 'edit') && (
          <div className="flex flex-col h-full bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30 text-xs font-mono text-muted-foreground">
              <span>Markdown Source</span>
              <span>{wordCount} words • {markdown.length} chars</span>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write your markdown here..."
              aria-label="Markdown Source Editor"
              className="flex-1 w-full p-4 font-mono text-xs md:text-sm bg-transparent border-0 rounded-none focus-visible:ring-0 resize-none overflow-y-auto"
            />
          </div>
        )}

        {/* Right Pane: Contextual Preview */}
        {(viewTab === 'split' || viewTab === 'preview') && (
          <div className="flex flex-col h-full bg-muted/20 overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30 text-xs font-mono text-muted-foreground shrink-0">
              <span>{mode === 'resume' ? 'Paginated A4 Resume Preview' : 'Medium Editorial Article Preview'}</span>
              <span>{mode === 'resume' ? 'A4 Format • Print Ready' : `${readingTime} min read`}</span>
            </div>

            {/* PREVIEW CONTAINER BASED ON MODE */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {mode === 'resume' ? (
                /* RESUME MODE: Paginated A4 Sheet with Watermark */
                <div className="w-full flex justify-center py-4">
                  <div className="w-full max-w-[800px] min-h-[1050px] bg-card text-card-foreground shadow-2xl rounded-sm p-8 sm:p-14 border border-border/80 relative flex flex-col justify-between">
                    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                    </div>

                    {/* Backend Mirror Watermark Pill in Bottom-Right Corner */}
                    <div className="pt-8 mt-12 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground select-none">
                      <span className="font-mono text-[10px]">Print Format • A4 Standard</span>
                      <div className="flex items-center gap-1.5 font-semibold text-muted-foreground/80">
                        <span>By :</span>
                        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                          <Sparkles className="size-3" />
                          Fortlio
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* BLOG MODE: Medium-Like Fluid Reading/Writing View */
                <div className="w-full max-w-2xl mx-auto py-6 px-2 space-y-6">
                  {/* Medium-like Article Header */}
                  <div className="space-y-4 pb-6 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11 border border-border">
                        <AvatarFallback className="bg-purple-600 text-white font-bold text-sm">
                          {authorInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-foreground">{authorName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>Specialty Contributor</span>
                          <span>•</span>
                          <span>{readingTime} min read</span>
                          <span>•</span>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">Forti Trajectory Verified</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Article Typography Body */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Draw Your Imagination (Interactive Canvas & Diagram Ingestion) */}
      <DrawYourImaginationModal
        open={isDrawOpen}
        onOpenChange={setIsDrawOpen}
        mode={mode}
        onInsertMarkdown={(content, notice) => {
          setMarkdown((prev) => prev + content);
          setAiNotice(notice);
          setTimeout(() => setAiNotice(null), 4000);
        }}
      />

      {/* DIALOG: Help Me Write Resume */}
      <Dialog open={isAiResumeOpen} onOpenChange={setIsAiResumeOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              <DialogTitle className="text-base font-bold">Help Me Write Resume</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              AI Copilot optimizing your resume accomplishments using quantifiable metrics and the STAR framework.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <button
              onClick={() => handleApplyResumeAi('action-verbs')}
              className="w-full text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer"
            >
              <div className="font-semibold text-xs text-foreground">Inject Strong Action Verbs</div>
              <p className="text-[11px] text-muted-foreground">
                Elevate bullet points using authoritative verbs (Spearheaded, Architected, Engineered).
              </p>
            </button>

            <button
              onClick={() => handleApplyResumeAi('quantify')}
              className="w-full text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer"
            >
              <div className="font-semibold text-xs text-foreground">Quantify Engineering Metrics</div>
              <p className="text-[11px] text-muted-foreground">
                Transform qualitative descriptions into concrete percentages, latency gains, and scale metrics.
              </p>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Help Me Write Blog */}
      <Dialog open={isAiBlogOpen} onOpenChange={setIsAiBlogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Wand2 className="size-5 text-purple-600" />
              <DialogTitle className="text-base font-bold">Help Me Write Blog</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Refine your specialty article for conceptual clarity, paragraph transitions, and verified domain depth.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
              <span className="font-bold">Authentic Evaluation Notice:</span> Forti AI strictly evaluates candidates based on their original thoughts and problem-solving trajectory, preserving your genuine intellectual signal.
            </div>

            <Button
              onClick={handleApplyBlogAi}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold py-2.5 cursor-pointer shadow-md"
            >
              Synthesize Key Takeaways & Polish Article
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Publish Blog Form */}
      <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Publish Specialty Article</DialogTitle>
            <DialogDescription className="text-xs">
              Publishing will index your article for recruiter discovery and trigger the Forti AI engine to synthesize your learning velocity.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Article Title</label>
              <Input
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="e.g. Optimizing High-Throughput Aggregation Pipelines"
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Tags (comma separated)</label>
              <Input
                value={blogTags}
                onChange={(e) => setBlogTags(e.target.value)}
                placeholder="Engineering, Distributed Systems, MongoDB"
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsPublishOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                if (onPublishBlog) {
                  await onPublishBlog({
                    title: blogTitle || 'Specialty Article',
                    content: markdown,
                    tags: blogTags.split(',').map((t) => t.trim()),
                  });
                }
                setIsPublishOpen(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
            >
              Confirm & Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
