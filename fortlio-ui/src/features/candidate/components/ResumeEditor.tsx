import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Save,
  Download,
  FileText,
  FileCode,
  Sparkles,
  Loader2,
  Check,
  Eye,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeOcrModal } from './ResumeOcrModal';
import { useResumePdfExport } from '../hooks/useResumePdfExport';

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

const splitMarkdownIntoA4Pages = (md: string): string[] => {
  if (md.includes('<!-- pagebreak -->')) {
    return md.split('<!-- pagebreak -->').map((p) => p.trim()).filter(Boolean);
  }
  if (md.includes('---page---')) {
    return md.split('---page---').map((p) => p.trim()).filter(Boolean);
  }

  const sections = md.split(/(?=\n##\s+)/);
  if (sections.length <= 1 || md.length < 1800) {
    return [md];
  }

  const pages: string[] = [];
  let currentPage = '';

  for (const section of sections) {
    if ((currentPage.length + section.length > 2200) && currentPage.length > 800) {
      pages.push(currentPage.trim());
      currentPage = section;
    } else {
      currentPage += (currentPage ? '\n\n' : '') + section;
    }
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [md];
};

export const ResumeEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState(() => localStorage.getItem('fortlio_resume_markdown') || DEFAULT_RESUME_MARKDOWN);
  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSaved, setIsSaved] = useState(false);
  const [isOcrOpen, setIsOcrOpen] = useState(false);

  const { exportPdf, isExporting } = useResumePdfExport();

  useEffect(() => {
    localStorage.setItem('fortlio_resume_markdown', markdown);
  }, [markdown]);

  const handleSave = () => {
    localStorage.setItem('fortlio_resume_markdown', markdown);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = async () => {
    await exportPdf(markdown, 'Resume.pdf');
  };

  return (
    <div className="flex flex-col h-screen w-full space-y-3 p-3 overflow-hidden animate-in fade-in-50 duration-300">
      {/* Editor Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Markdown Resume Studio</h1>
            <p className="text-xs text-muted-foreground">
              Author pixel-perfect Markdown resumes and export to PDF via headless Puppeteer.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <Tabs
            value={activeTab}
            onValueChange={(val: any) => setActiveTab(val)}
            className="hidden sm:block"
          >
            <TabsList className="bg-muted/60 p-1 rounded-xl h-8">
              <TabsTrigger value="split" className="text-xs h-6 px-2.5 rounded-lg">
                <FileCode className="size-3.5 mr-1" />
                Split
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-xs h-6 px-2.5 rounded-lg">
                <Edit2 className="size-3.5 mr-1" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs h-6 px-2.5 rounded-lg">
                <Eye className="size-3.5 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-1.5 text-xs font-semibold rounded-xl h-8 cursor-pointer"
          >
            {isSaved ? <Check className="size-3.5 text-emerald-500" /> : <Save className="size-3.5" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadMd}
            className="gap-1.5 text-xs font-semibold rounded-xl h-8 cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>.MD</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOcrOpen(true)}
            className="gap-1.5 text-xs font-semibold rounded-xl h-8 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>AI Resume OCR</span>
          </Button>

          <Button
            size="sm"
            disabled={isExporting}
            onClick={handleExportPdf}
            className="gap-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl h-8 cursor-pointer shadow-sm"
          >
            {isExporting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                <span>Export PDF</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Split Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Editor Pane */}
        {(activeTab === 'split' || activeTab === 'edit') && (
          <Card className="flex flex-col border border-border/80 bg-card overflow-hidden shadow-sm">
            <CardHeader className="py-2.5 px-4 bg-muted/30 border-b border-border/60">
              <CardTitle className="text-xs font-semibold flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileCode className="size-3.5 text-primary" />
                  Markdown Source
                </span>
                <span className="text-[10px] bg-background/80 px-2 py-0.5 rounded border border-border/60">
                  {markdown.length} characters
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type your markdown resume content here..."
                aria-label="Markdown Source Editor"
                className="w-full flex-1 py-4 px-4 sm:px-6 font-mono text-xs text-foreground bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed"
                spellCheck={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Live Preview Pane */}
        {(activeTab === 'split' || activeTab === 'preview') && (
          <Card className="flex flex-col border border-border/80 bg-card overflow-hidden shadow-sm">
            <CardHeader className="py-2.5 px-4 bg-muted/30 border-b border-border/60">
              <CardTitle className="text-xs font-semibold flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="size-3.5 text-emerald-500" />
                  Print Preview (Pixel-Perfect A4 Pages)
                </span>
                <span className="text-[10px] text-muted-foreground">Live Render</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-1 sm:p-2 overflow-y-auto flex-1 bg-muted/20 text-foreground">
              <div className="w-full flex flex-col items-center space-y-4">
                {splitMarkdownIntoA4Pages(markdown).map((pageContent, pageIdx, allPages) => {
                  const pageNum = pageIdx + 1;
                  const totalPages = allPages.length;
                  return (
                    <React.Fragment key={pageIdx}>
                      <div className="w-full max-w-[880px] min-h-[1050px] bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 shadow-md rounded-sm p-8 sm:p-14 border border-border/80 relative flex flex-col justify-between my-2">
                        {pageNum > 1 && (
                          <div className="pb-2 mb-4 border-b border-border/40 flex items-center justify-between text-[11px] text-muted-foreground select-none">
                            <span className="font-semibold text-foreground/80">Professional Resume</span>
                            <span className="font-mono text-[10px]">Page {pageNum} of {totalPages}</span>
                          </div>
                        )}
                        <article className="prose prose-sm dark:prose-invert text-foreground dark:text-slate-100 max-w-none prose-headings:font-bold prose-h1:text-xl prose-h2:text-sm prose-h2:border-b prose-h2:border-neutral-200 dark:prose-h2:border-neutral-800 prose-h2:pb-1 prose-h3:text-xs prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs prose-ul:my-2 flex-1 dark:[&_*]:text-slate-200 dark:[&_p]:text-slate-200 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_strong]:text-white">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{pageContent}</ReactMarkdown>
                        </article>
                        <div className="pt-4 mt-6 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground select-none">
                          <span className="font-mono font-medium">Page {pageNum} of {totalPages}</span>
                          <div className="flex items-center gap-1.5 font-semibold text-muted-foreground/80">
                            <span>By :</span>
                            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                              <Sparkles className="size-3" />
                              Fortlio
                            </span>
                          </div>
                        </div>
                      </div>
                      {pageNum < totalPages && (
                        <div className="w-full max-w-[750px] my-1 flex items-center justify-center gap-2 text-muted-foreground select-none">
                          <div className="h-px flex-1 border-t-2 border-dashed border-border/50" />
                          <span className="bg-muted px-2 py-0.5 rounded-full font-mono text-[10px]">
                            Page Break • Page {pageNum} of {totalPages}
                          </span>
                          <div className="h-px flex-1 border-t-2 border-dashed border-border/50" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Resume OCR Ingestion Modal */}
      <ResumeOcrModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onApplyMarkdown={(extractedMd) => {
          setMarkdown(extractedMd);
          setIsSaved(false);
        }}
      />
    </div>
  );
};
