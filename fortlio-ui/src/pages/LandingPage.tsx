import { Link } from "react-router-dom";
import {
  FileCode,
  Sparkles,
  BookOpen,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  FolderGit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <FolderGit2 className="size-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-300">
              Fortlio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#forti-ai" className="hover:text-foreground transition-colors">Forti AI</a>
            <a href="#analytics" className="hover:text-foreground transition-colors">Analytics</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/candidate-profile">
                <Button className="font-semibold shadow-md bg-purple-600 hover:bg-purple-700 text-white">
                  Dashboard
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="text-sm font-semibold shadow-md bg-purple-600 hover:bg-purple-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <Sparkles className="size-3.5" />
            <span>AI-Powered Portfolios & Leadership Discovery for All Professions</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Where Expertise Speaks, Mindset Leads, and Talent is Discovered.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The universal portfolio platform for anyone and everyone. Showcase your background, share your specialty in blogs, export pixel-perfect PDF resumes, and let Forti AI synthesize your trajectory across all disciplines and education paths.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold px-8 shadow-lg shadow-purple-600/25 bg-purple-600 hover:bg-purple-700 text-white">
                Create Professional Portfolio
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium px-8">
                Recruiter Sign In
              </Button>
            </Link>
          </div>

          {/* Universal Professions Pill Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {["Technology & Engineering", "Healthcare & Medicine", "Design & Arts", "Law & Legal Services", "Finance & Banking", "Science & Research", "Marketing & Media", "Education & Academia"].map((p) => (
              <span key={p} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/60">
                {p}
              </span>
            ))}
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-border/60 max-w-3xl mx-auto">
            <div>
              <p className="text-2xl font-bold text-foreground">Universal</p>
              <p className="text-xs text-muted-foreground">All Professions & Backgrounds</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">AI-Driven</p>
              <p className="text-xs text-muted-foreground">Learning Velocity Metrics</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Active</p>
              <p className="text-xs text-muted-foreground">Visitor Dwell-Time Tracking</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Typesense</p>
              <p className="text-xs text-muted-foreground">Instant Talent Search</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-muted/30 border-y border-border px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground">Everything You Need to Stand Out</h2>
            <p className="text-sm text-muted-foreground">
              Built for professionals across all disciplines who value clarity, domain depth, and actionable career analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FileCode className="size-5" />
                </div>
                <CardTitle className="text-lg">Markdown-to-PDF Resumes</CardTitle>
                <CardDescription>
                  Write your resume in clean markdown and export pixel-perfect, printer-ready PDFs rendered via headless Puppeteer.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <BookOpen className="size-5" />
                </div>
                <CardTitle className="text-lg">Specialty Blogs & Case Studies</CardTitle>
                <CardDescription>
                  Publish domain case studies, professional analyses, and problem-solving methodologies that showcase your field expertise.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card id="forti-ai" className="border-border/80 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <div className="size-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle className="text-lg">Forti AI Leadership Synthesis</CardTitle>
                <CardDescription>
                  Evaluates your learning velocity, topic diversity, and mentorship qualities automatically as you publish.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card id="analytics" className="border-border/80 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Clock className="size-5" />
                </div>
                <CardTitle className="text-lg">Dwell-Time Share Analytics</CardTitle>
                <CardDescription>
                  Share short links for resumes & blogs with active telemetry tracking how long recruiters review your work.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Search className="size-5" />
                </div>
                <CardTitle className="text-lg">Recruiter Talent Discovery</CardTitle>
                <CardDescription>
                  Keyword and trait search powered by Typesense with fair 2-query video ad replenishments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle className="text-lg">Privacy & Contact Masking</CardTitle>
                <CardDescription>
                  Full privacy controls protecting your phone and email from unauthorized scrapers and unverified accounts.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Fortlio Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
