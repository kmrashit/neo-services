import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Share2,
  Edit3,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sparkles,
  BookOpen,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Check,
  Bot,
  TrendingUp,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCandidateProfile } from '@/features/candidate';
import {
  useTrackLinkDwellTime,
  useLinkAnalytics,
  ShareAnalyticsCard,
  ShareLinkModal,
  MySharedLinksTable,
} from '@/features/shortener';
import {
  useCandidateInsights,
  CandidateAiInsightsCard,
  HrCandidateChatDrawer,
} from '@/features/forti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function CandidateProfile() {
  const { user } = useAuth();
  const { profile } = useCandidateProfile();
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  useTrackLinkDwellTime();
  const { links } = useLinkAnalytics();
  const { insights } = useCandidateInsights(profile?.id || user?.id);

  // Candidate portfolio data (connected to active user credentials & candidate profile)
  const candidate = {
    fullName: profile?.fullName || user?.fullName || 'Alex Mercer',
    headline: profile?.headline || 'Staff Systems Engineer & Distributed Architect',
    profession: profile?.profession || 'Engineering & Technology',
    industry: profile?.industry || 'Technology & Software',
    educationLevel: profile?.educationLevel || "Bachelor's Degree (BS in Computer Science)",
    email: profile?.email || user?.email || 'alex.mercer@fortlio.dev',
    phone: profile?.mobileNumber || '+1 (555) 382-9102',
    location: profile?.location || 'San Francisco, CA (Open to Remote)',
    bio: profile?.bio || 'Passionate systems engineer focused on high-throughput event streaming, distributed consensus, and developer tooling. Author of technical blogs on Kafka pipelines and TypeScript compilation architectures.',
    skills: profile?.skills || [
      'TypeScript', 'Go', 'Distributed Systems', 'Kubernetes', 'Kafka',
      'MongoDB Aggregations', 'Redis', 'Bun', 'PostgreSQL', 'Docker', 'Typesense',
    ],
    social: profile?.social || {
      github: profile?.githubUrl || 'https://github.com',
      linkedin: profile?.linkedinUrl || 'https://linkedin.com',
      website: profile?.portfolioUrl || 'https://alexmercer.dev',
    },
    experiences: profile?.experiences || [
      {
        role: 'Lead Systems Architect',
        company: 'Veloce Cloud Systems',
        period: '2023 - Present',
        description: 'Architected distributed telemetry ingestion processing 45k events/sec with sub-50ms latency using Bun, Redis streams, and MongoDB aggregations.',
      },
      {
        role: 'Senior Backend Engineer',
        company: 'Stratos Core Inc.',
        period: '2021 - 2023',
        description: 'Scaled microservices infrastructure across Kubernetes clusters. Authored internal developer SDKs reducing deployment lead time by 40%.',
      },
    ],
    education: profile?.education || [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2017 - 2021',
      },
    ],
    blogs: profile?.blogs || [
      {
        title: 'Optimizing MongoDB Pipelines with Post-Facet Slicing',
        date: 'Nov 15, 2026',
        readTime: '6 min read',
        tags: ['MongoDB', 'Database', 'Performance'],
      },
      {
        title: 'Architecting Microservices with Bun and Redis Stream Consumers',
        date: 'Oct 28, 2026',
        readTime: '9 min read',
        tags: ['Bun', 'Redis', 'Distributed Systems'],
      },
      {
        title: 'Typesense vs Elasticsearch for Real-Time Recruiter Search',
        date: 'Sep 12, 2026',
        readTime: '5 min read',
        tags: ['Search', 'Typesense', 'DevOps'],
      },
    ],
    fortiAiInsights: profile?.fortiAiInsights || {
      velocityScore: 94,
      progressionRate: 'Rapid Velocity',
      depthLevel: 'Expert',
      diversityScore: '9.2/10',
      leadershipTraits: ['System Architecture', 'Mentorship', 'Technical Writing', 'Production Resilience'],
      primaryDomains: ['Distributed Systems', 'High-Throughput Databases', 'Cloud Native'],
    },
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const userInitial = candidate.fullName.charAt(0).toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Profile Hero Card */}
      <Card className="border-border/80 shadow-md overflow-hidden bg-card/90 backdrop-blur-sm">
        {/* Banner pattern */}
        <div className="h-32 w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-900 opacity-90 relative" />

        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <div className="size-24 rounded-2xl border-4 border-card bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl">
                {userInitial}
              </div>

              <div className="space-y-0.5 pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {candidate.fullName}
                  </h1>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 gap-1 text-[11px]">
                    <CheckCircle2 className="size-3" />
                    Verified Candidate
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {candidate.headline}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <Badge variant="outline" className="text-[10px] font-normal border-purple-500/30 text-purple-600 dark:text-purple-400">
                    {candidate.profession}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {candidate.industry}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {candidate.educationLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyShare}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share Profile'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <LinkIcon className="size-3.5 text-purple-600 dark:text-purple-400" />
                <span>Short Link</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatDrawerOpen(true)}
                className="gap-1.5 text-xs font-medium cursor-pointer text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
              >
                <Bot className="size-3.5 text-purple-600 dark:text-purple-400" />
                <span>Chat with Profile</span>
              </Button>

              <Link to="/editor">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>PDF Resume</span>
                </Button>
              </Link>

              <Link to="/edit-profile">
                <Button
                  size="sm"
                  className="gap-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                >
                  <Edit3 className="size-3.5" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact & Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-y border-border/60 py-3 mb-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {candidate.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {candidate.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5" />
              {candidate.phone}
            </span>
            <div className="ml-auto flex items-center gap-3">
              {candidate.social?.github && (
                <a href={candidate.social.github} target="_blank" rel="noreferrer" className="hover:text-foreground text-xs font-medium">
                  GitHub
                </a>
              )}
              {candidate.social?.linkedin && (
                <a href={candidate.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground text-xs font-medium">
                  LinkedIn
                </a>
              )}
              {candidate.social?.website && (
                <a href={candidate.social.website} target="_blank" rel="noreferrer" className="hover:text-foreground">
                  <Globe className="size-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed max-w-3xl">
            {candidate.bio}
          </p>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="overview" className="gap-1.5">
            <Briefcase className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="blogs" className="gap-1.5">
            <BookOpen className="size-4" />
            Blogs ({candidate.blogs.length})
          </TabsTrigger>
          <TabsTrigger value="forti" className="gap-1.5">
            <Sparkles className="size-4 text-purple-500" />
            Forti AI Insights
          </TabsTrigger>
          <TabsTrigger value="interviews" className="gap-1.5">
            <Bot className="size-4 text-amber-500" />
            AI Interviews
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 cols: Experience Timeline & Education */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {candidate.experiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-border space-y-1">
                      <div className="absolute -left-[9px] top-1 size-4 rounded-full border-2 border-primary bg-background" />
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">{exp.role}</h4>
                        <span className="text-xs text-muted-foreground">{exp.period}</span>
                      </div>
                      <p className="text-xs font-medium text-primary">{exp.company}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="size-4 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-foreground">{edu.degree}</p>
                        <p className="text-muted-foreground">{edu.institution}</p>
                      </div>
                      <span className="text-muted-foreground font-mono">{edu.year}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right 1 col: Verified Skills */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Verified Skills</CardTitle>
                  <CardDescription className="text-xs">Indexed for recruiter search</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs font-medium py-1 px-2.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Share & Dwell Time analytics card */}
              <ShareAnalyticsCard
                links={links}
                onOpenMyLinks={() => setIsLinksModalOpen(true)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Blogs Tab Content */}
        <TabsContent value="blogs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidate.blogs.map((blog, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{blog.date}</span>
                    <Badge variant="outline" className="text-[10px]">{blog.readTime}</Badge>
                  </div>
                  <CardTitle className="text-base hover:text-primary transition-colors cursor-pointer">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Forti AI Insights Tab Content */}
        <TabsContent value="forti" className="space-y-6">
          <CandidateAiInsightsCard
            insights={insights}
            onOpenChat={() => setIsChatDrawerOpen(true)}
            candidateName={candidate.fullName}
          />
        </TabsContent>

        {/* AI Interviews Tab Content */}
        <TabsContent value="interviews" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-amber-500/30">
              <CardHeader className="text-center pb-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider">
                  Domain Readiness Score
                </CardDescription>
                <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 pt-2">
                  92<span className="text-sm font-normal text-muted-foreground">/100</span>
                </div>
              </CardHeader>
              <CardContent className="text-center text-xs text-muted-foreground">
                <Badge variant="success" className="text-[10px] mb-2">Verified Ready</Badge>
                <p>Simulated across architecture case studies and behavioral leadership scenarios.</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Bot className="size-4 text-amber-500" />
                      AI Interactive Interview Simulator
                    </CardTitle>
                    <CardDescription className="text-xs pt-1">
                      Practice adaptive real-time domain interviews tailored to your specialty.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 dark:text-amber-400">
                    F10 Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div>
                    <p className="font-semibold text-foreground">Domain Rigor</p>
                    <p className="text-muted-foreground pt-0.5">94% Accuracy</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Communication</p>
                    <p className="text-muted-foreground pt-0.5">90% Clarity</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Problem Solving</p>
                    <p className="text-muted-foreground pt-0.5">93% Structure</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Link to="/interview">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs">
                      Start Mock Interview
                    </Button>
                  </Link>
                  <span className="text-[11px] text-muted-foreground">
                    Available in text and real-time voice mode.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Trackable Short Link Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        targetType="resume"
        targetTitle={`${candidate.fullName}'s Professional Portfolio & Resume`}
        originalUrl={window.location.href}
      />

      {/* My Shared Links Modal */}
      <Dialog open={isLinksModalOpen} onOpenChange={setIsLinksModalOpen}>
        <DialogContent className="max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="size-5 text-purple-600" />
              My Trackable Shared Links
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review visitor reach, total clicks, and active dwell time across your portfolio and blog links.
            </DialogDescription>
          </DialogHeader>
          <MySharedLinksTable links={links} />
        </DialogContent>
      </Dialog>

      {/* Forti AI Recruiter Profile Chat Drawer */}
      <HrCandidateChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        userId={user?.id || '123456789012345678901234'}
        candidateName={candidate.fullName}
        candidateHeadline={candidate.headline}
      />
    </div>
  );
}
