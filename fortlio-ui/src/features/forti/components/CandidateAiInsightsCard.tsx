import { Sparkles, Bot, ArrowRight, Award, Compass, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LearningVelocityBadge } from './LearningVelocityBadge';
import type { ICandidateInsights } from '../types';

interface CandidateAiInsightsCardProps {
  insights: ICandidateInsights;
  onOpenChat?: () => void;
  candidateName?: string;
}

export function CandidateAiInsightsCard({
  insights,
  onOpenChat,
  candidateName = 'Alex Mercer',
}: CandidateAiInsightsCardProps) {
  const { learningVelocity, knowledgeVolume, topicDiversity, detectedQualities, rawAiSummary } = insights;

  return (
    <Card className="border border-purple-500/30 bg-gradient-to-br from-card via-purple-500/5 to-card shadow-md overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
                Forti AI Candidate Insights & Leadership Synthesis
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400">
                Authentic Input Verified
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Evaluated strictly on authentic candidate problem formulation, conceptual curiosity, and domain trajectory.
            </CardDescription>
          </div>

          <LearningVelocityBadge
            score={learningVelocity.score}
            progressionRate={learningVelocity.progressionRate}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* Metric Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Velocity Score box */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Learning Velocity Score</span>
              <Award className="size-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {learningVelocity.score}/100
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {learningVelocity.summary}
            </p>
          </div>

          {/* Knowledge Depth box */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Knowledge Volume & Depth</span>
              <Compass className="size-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground capitalize">
              {knowledgeVolume.depthLevel}
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {knowledgeVolume.articleCount} published domain research blogs demonstrating problem-solving depth.
            </p>
          </div>

          {/* Topic Diversity score box */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Topic Diversity Score</span>
              <ShieldCheck className="size-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {topicDiversity.diversityScore}/10
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Explores {topicDiversity.exploredTopics.length} distinct technologies across multi-disciplinary domains.
            </p>
          </div>
        </div>

        {/* Leadership & Soft Qualities */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Leadership & Soft Qualities
          </h4>
          <div className="flex flex-wrap gap-2">
            {detectedQualities.leadership.map((trait) => (
              <Badge
                key={trait}
                variant="secondary"
                className="text-xs font-semibold py-1 px-3 bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
              >
                {trait}
              </Badge>
            ))}
            {detectedQualities.mindset.map((trait) => (
              <Badge
                key={trait}
                variant="outline"
                className="text-xs font-medium py-1 px-3 border-border/80"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        {/* Primary Domains & Explored Topics */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Verified Domains & Specialty Topics
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {topicDiversity.primaryDomains.map((dom) => (
              <Badge key={dom} variant="default" className="text-xs bg-purple-600">
                {dom}
              </Badge>
            ))}
            {topicDiversity.exploredTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                #{topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Raw AI Synthesis summary */}
        {rawAiSummary && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground mr-1.5">Executive Talent Summary:</span>
            {rawAiSummary}
          </div>
        )}
      </CardContent>

      {onOpenChat && (
        <CardFooter className="border-t border-border/50 pt-3.5 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Have questions about {candidateName}&apos;s background?
          </div>
          <Button
            size="sm"
            onClick={onOpenChat}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer shadow-sm text-xs"
          >
            <Bot className="size-4" />
            <span>Chat with Candidate Profile (AI)</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
