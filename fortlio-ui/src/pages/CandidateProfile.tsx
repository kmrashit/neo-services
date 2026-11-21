import { useState } from "react";
import { Link } from "react-router-dom";
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
  Check
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CandidateProfile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Candidate portfolio data (connected to active user credentials)
  const candidate = {
    fullName: user?.fullName || "Alex Mercer",
    headline: "Staff Systems Engineer & Distributed Architect",
    profession: "Engineering & Technology",
    industry: "Technology & Software",
    educationLevel: "Bachelor's Degree (BS in Computer Science)",
    email: user?.email || "alex.mercer@fortlio.dev",
    phone: "+1 (555) 382-9102",
    location: "San Francisco, CA (Open to Remote)",
    bio: "Passionate systems engineer focused on high-throughput event streaming, distributed consensus, and developer tooling. Author of technical blogs on Kafka pipelines and TypeScript compilation architectures.",
    experienceYears: 6,
    skills: [
      "TypeScript", "Go", "Distributed Systems", "Kubernetes", "Kafka",
      "MongoDB Aggregations", "Redis", "Bun", "PostgreSQL", "Docker", "Typesense"
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://alexmercer.dev",
    },
    experiences: [
      {
        role: "Lead Systems Architect",
        company: "Veloce Cloud Systems",
        period: "2023 - Present",
        description: "Architected distributed telemetry ingestion processing 45k events/sec with sub-50ms latency using Bun, Redis streams, and MongoDB aggregations.",
      },
      {
        role: "Senior Backend Engineer",
        company: "Stratos Core Inc.",
        period: "2021 - 2023",
        description: "Scaled microservices infrastructure across Kubernetes clusters. Authored internal developer SDKs reducing deployment lead time by 40%.",
      },
    ],
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        year: "2017 - 2021",
      },
    ],
    blogs: [
      {
        title: "Optimizing MongoDB Pipelines with Post-Facet Slicing",
        date: "Nov 15, 2026",
        readTime: "6 min read",
        tags: ["MongoDB", "Database", "Performance"],
      },
      {
        title: "Architecting Microservices with Bun and Redis Stream Consumers",
        date: "Oct 28, 2026",
        readTime: "9 min read",
        tags: ["Bun", "Redis", "Distributed Systems"],
      },
      {
        title: "Typesense vs Elasticsearch for Real-Time Recruiter Search",
        date: "Sep 12, 2026",
        readTime: "5 min read",
        tags: ["Search", "Typesense", "DevOps"],
      },
    ],
    fortiAiInsights: {
      velocityScore: 94,
      progressionRate: "Rapid Velocity",
      depthLevel: "Expert",
      diversityScore: "9.2/10",
      leadershipTraits: ["System Architecture", "Mentorship", "Technical Writing", "Production Resilience"],
      primaryDomains: ["Distributed Systems", "High-Throughput Databases", "Cloud Native"],
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
                  <Badge variant="success" className="gap-1 text-[11px]">
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
                {copied ? "Link Copied" : "Share Profile"}
              </Button>

              <Link to="/editor">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <Download className="size-3.5" />
                  PDF Resume
                </Button>
              </Link>

              <Link to="/edit-profile">
                <Button
                  size="sm"
                  className="gap-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                >
                  <Edit3 className="size-3.5" />
                  Edit Profile
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
              <a href={candidate.social.github} target="_blank" rel="noreferrer" className="hover:text-foreground text-xs font-medium">
                GitHub
              </a>
              <a href={candidate.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground text-xs font-medium">
                LinkedIn
              </a>
              <a href={candidate.social.website} target="_blank" rel="noreferrer" className="hover:text-foreground">
                <Globe className="size-4" />
              </a>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed max-w-3xl">
            {candidate.bio}
          </p>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
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
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 cols: Experience Timeline */}
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

              {/* Dwell Time telemetry highlight */}
              <Card className="bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 border-purple-500/20">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <Sparkles className="size-3.5" />
                    Telemetry Analytics Active
                  </div>
                  <CardTitle className="text-sm">Recruiter Dwell Tracking</CardTitle>
                  <CardDescription className="text-xs">
                    Short links created for this portfolio measure recruiter review duration in real-time.
                  </CardDescription>
                </CardHeader>
              </Card>
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
                    {blog.tags.map((tag) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-purple-500/30">
              <CardHeader className="text-center pb-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider">
                  Learning Velocity Score
                </CardDescription>
                <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 pt-2">
                  {candidate.fortiAiInsights.velocityScore}
                  <span className="text-sm font-normal text-muted-foreground">/100</span>
                </div>
              </CardHeader>
              <CardContent className="text-center text-xs text-muted-foreground">
                <Badge variant="success" className="text-[10px] mb-2">{candidate.fortiAiInsights.progressionRate}</Badge>
                <p>Synthesized across 3 published technical articles and continuous topic expansion.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Leadership & Soft Qualities</CardTitle>
                <CardDescription className="text-xs">Detected via article writing style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {candidate.fortiAiInsights.leadershipTraits.map((trait) => (
                    <Badge key={trait} variant="default" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Primary Expertise Domains</CardTitle>
                <CardDescription className="text-xs">Deepest conceptual density</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {candidate.fortiAiInsights.primaryDomains.map((domain) => (
                    <Badge key={domain} variant="secondary" className="text-xs">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
