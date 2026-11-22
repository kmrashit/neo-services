import { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Eraser,
  PenTool,
  RotateCcw,
  Check,
  Code2,
  Brush,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DrawYourImaginationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'resume' | 'blog';
  onInsertMarkdown: (content: string, notice: string) => void;
}

const PALETTE_COLORS = [
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Slate', hex: '#1e293b' },
];

export function DrawYourImaginationModal({
  open,
  onOpenChange,
  mode,
  onInsertMarkdown,
}: DrawYourImaginationModalProps) {
  const [activeTab, setActiveTab] = useState<'canvas' | 'templates'>('canvas');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#7c3aed');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Initialize canvas with clean background
  useEffect(() => {
    if (open && activeTab === 'canvas') {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }, 50);
    }
  }, [open, activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleInsertCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const title = mode === 'resume' ? 'System Architecture Sketch' : 'Visual Concept Illustration';
    const markdownImage = `\n\n### ${title}\n![${title}](${dataUrl})\n\n`;
    onInsertMarkdown(
      markdownImage,
      `Hand-drawn ${mode === 'resume' ? 'architecture sketch' : 'concept diagram'} embedded into ${mode}!`
    );
    onOpenChange(false);
  };

  const handleInsertTemplate = (type: string) => {
    let templateMarkdown = '';
    let description = '';

    if (mode === 'resume') {
      if (type === 'system') {
        templateMarkdown = `\n\n### System Architecture Blueprint\n\`\`\`mermaid\ngraph TD\n  Client[Universal Web & Mobile Clients] --> Gateway[API Gateway / AuthGuard]\n  Gateway --> Service[Core Microservices Engine]\n  Service --> Cache[(Redis Cache & Session Store)]\n  Service --> Mongo[(MongoDB Aggregation Cluster)]\n\`\`\`\n`;
        description = 'System Architecture Blueprint inserted into resume!';
      } else if (type === 'clinical') {
        templateMarkdown = `\n\n### Clinical Diagnostic & Treatment Protocol\n\`\`\`mermaid\ngraph LR\n  Screen[Patient Clinical Presentation] --> Biomarker[Genomic Sequencing / Variant Assay]\n  Biomarker --> Differential[Diagnostic Staging]\n  Differential --> TargetedRx[Targeted Precision Therapeutics]\n\`\`\`\n`;
        description = 'Clinical Pathway schematic inserted into resume!';
      } else if (type === 'legal') {
        templateMarkdown = `\n\n### Regulatory Governance & Compliance Schema\n\`\`\`mermaid\ngraph TD\n  Regulation[Global Statutory Framework] --> RiskAudit[Systemic Risk Assessment]\n  RiskAudit --> SafeGuards[Guardrail Enforcement]\n  SafeGuards --> VerifiedAudit[Regulatory Certification]\n\`\`\`\n`;
        description = 'Legal Governance Framework inserted into resume!';
      } else {
        templateMarkdown = `\n\n### Execution Process & Impact Flowchart\n\`\`\`mermaid\ngraph LR\n  Hypothesis[Problem Discovery] --> Prototype[Rapid Prototyping]\n  Prototype --> Verification[Rigorous Telemetry]\n  Verification --> QuantifiedScale[Verified Business Scale]\n\`\`\`\n`;
        description = 'Process Flowchart inserted into resume!';
      }
    } else {
      // Blog Mode
      if (type === 'system') {
        templateMarkdown = `\n\n### Multi-Tier Pipeline Topology\n\`\`\`mermaid\ngraph LR\n  Ingress[Event Streams / Telemetry] --> Worker[BullMQ Async Processing]\n  Worker --> Slicing[Post-Facet MongoDB Pipeline]\n  Slicing --> Client[Sub-10ms Verified Response]\n\`\`\`\n`;
        description = 'Pipeline topology diagram inserted into article!';
      } else if (type === 'interaction') {
        templateMarkdown = `\n\n### Domain Interaction Sequence\n\`\`\`mermaid\nsequenceDiagram\n  autonumber\n  Candidate->>Fortlio: Publish Authentic Markdown Knowledge\n  Fortlio->>Forti AI: Synthesize Learning Velocity & Depth\n  Recruiter->>Candidate: Discover Verified Domain Mastery\n\`\`\`\n`;
        description = 'Interaction sequence model inserted into article!';
      } else {
        templateMarkdown = `\n\n### Conceptual Tradeoff & Decision Tree\n\`\`\`mermaid\ngraph TD\n  Challenge{Performance Bottleneck} -->|In-Memory Filter| HighMem[Working RAM Spikes]\n  Challenge -->|Post-Facet Pipeline| Optimal[Sub-10ms Latency]\n\`\`\`\n`;
        description = 'Decision tree diagram inserted into article!';
      }
    }

    onInsertMarkdown(templateMarkdown, description);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Palette className="size-4" />
              </div>
              <DialogTitle className="text-lg font-bold">Draw Your Imagination</DialogTitle>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {mode === 'resume' ? 'Resume Visual Studio' : 'Blog Editorial Studio'}
            </Badge>
          </div>
          <DialogDescription className="text-xs">
            {mode === 'resume'
              ? 'Sketch system architectures, clinical pathways, legal schematics, or process flows and embed them directly into your resume.'
              : 'Sketch technical concept diagrams, system topologies, or workflows and embed them directly into your specialty blog.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full pt-2">
          <TabsList className="grid grid-cols-2 bg-muted/60 p-1 mb-4">
            <TabsTrigger value="canvas" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Brush className="size-3.5" />
              <span>Interactive Whiteboard</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Code2 className="size-3.5" />
              <span>Mermaid Diagram Templates</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Interactive Whiteboard Canvas */}
          <TabsContent value="canvas" className="space-y-3 mt-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-muted/40 border border-border/80 flex-wrap">
              {/* Color Swatches */}
              <div className="flex items-center gap-1.5">
                {PALETTE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setColor(c.hex);
                      setIsEraser(false);
                    }}
                    className={`size-6 rounded-full cursor-pointer transition-transform ${
                      color === c.hex && !isEraser ? 'scale-125 ring-2 ring-purple-600 ring-offset-2' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Tool Mode Toggles */}
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={!isEraser ? 'default' : 'ghost'}
                  onClick={() => setIsEraser(false)}
                  className={`h-7 px-2.5 text-xs font-medium cursor-pointer ${
                    !isEraser ? 'bg-purple-600 text-white' : ''
                  }`}
                >
                  <PenTool className="size-3.5 mr-1" />
                  Pen
                </Button>
                <Button
                  size="sm"
                  variant={isEraser ? 'default' : 'ghost'}
                  onClick={() => setIsEraser(true)}
                  className={`h-7 px-2.5 text-xs font-medium cursor-pointer ${
                    isEraser ? 'bg-purple-600 text-white' : ''
                  }`}
                >
                  <Eraser className="size-3.5 mr-1" />
                  Eraser
                </Button>
              </div>

              {/* Stroke Width Selector */}
              <div className="flex items-center gap-1 bg-background/80 rounded-lg p-0.5 border border-border/60">
                {[2, 4, 8].map((w) => (
                  <button
                    key={w}
                    onClick={() => setLineWidth(w)}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded cursor-pointer ${
                      lineWidth === w ? 'bg-purple-600 text-white font-bold' : 'text-muted-foreground'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>

              {/* Clear Canvas */}
              <Button
                size="sm"
                variant="ghost"
                onClick={clearCanvas}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-rose-500 cursor-pointer"
                title="Clear whiteboard"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>

            {/* Drawing Canvas Frame */}
            <div className="border-2 border-border/80 rounded-2xl overflow-hidden bg-white shadow-inner flex justify-center">
              <canvas
                ref={canvasRef}
                width={560}
                height={280}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair touch-none w-full max-w-[560px] h-[280px]"
              />
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              Sketch your architecture, clinical pathway, or process flow with mouse or stylus, then embed it into your markdown.
            </p>

            <DialogFooter className="pt-2">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleInsertCanvasImage}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 cursor-pointer"
              >
                <Check className="size-3.5 mr-1.5" />
                <span>Embed Drawing into {mode === 'resume' ? 'Resume' : 'Blog'}</span>
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* TAB 2: Mermaid Diagram Templates */}
          <TabsContent value="templates" className="space-y-3 mt-0">
            <div className="grid grid-cols-1 gap-2.5">
              {mode === 'resume' ? (
                <>
                  <button
                    onClick={() => handleInsertTemplate('system')}
                    className="text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                      System Architecture Blueprint
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Client → Gateway → Core Services → Redis Cache → MongoDB Cluster pipeline.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertTemplate('clinical')}
                    className="text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                      Clinical Pathway & Diagnostic Schematic
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Biomarker Assay → Diagnostic Staging → Targeted Therapeutics protocol for healthcare specialists.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertTemplate('legal')}
                    className="text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                      Regulatory Governance & Compliance Schema
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Statutory Framework → Systemic Risk Assessment → Guardrail Certification for legal specialists.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertTemplate('process')}
                    className="text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                      Execution Process & Quantifiable Impact Flowchart
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Hypothesis → Execution → Verification → Quantified Scale flowchart.
                    </p>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleInsertTemplate('system')}
                    className="text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                      Multi-Tier Pipeline Topology
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Event Ingress → BullMQ Workers → Post-Facet Slicing aggregation topology.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertTemplate('interaction')}
                    className="text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                      Domain Interaction Sequence Model
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Multi-Actor sequence diagram showcasing collaborative contracts and event responses.
                    </p>
                  </button>

                  <button
                    onClick={() => handleInsertTemplate('tradeoff')}
                    className="text-left p-3.5 rounded-xl border border-border/80 hover:border-purple-500/60 bg-muted/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-foreground group-hover:text-purple-600 transition-colors">
                      Conceptual Tradeoff & Decision Tree
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Architectural decision graph mapping trade-offs between memory, throughput, and complexity.
                    </p>
                  </button>
                </>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
