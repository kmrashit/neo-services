import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  fortiAnalysisScore?: number;
}

const sampleBlogs: BlogArticle[] = [
  {
    id: "1",
    title: "Optimizing MongoDB Pipelines with Post-Facet Slicing & Lookups",
    excerpt: "Deep dive into mongo.helper patterns: running $lookup stages after $match, $sort, $skip, and $limit to avoid unneeded full collection joins.",
    date: "November 18, 2026",
    readTime: "7 min read",
    tags: ["Engineering", "MongoDB", "Performance", "Databases"],
    author: "Alex Mercer",
    fortiAnalysisScore: 96,
  },
  {
    id: "2",
    title: "Clinical Decision Support Systems: Evaluating Diagnostic Precision & Latency",
    excerpt: "Investigating how Bayesian diagnostic frameworks reduce missed early-stage symptoms in emergency triage workflows.",
    date: "November 04, 2026",
    readTime: "8 min read",
    tags: ["Healthcare", "Clinical Medicine", "Biomedical"],
    author: "Dr. Elena Rostova",
    fortiAnalysisScore: 94,
  },
  {
    id: "3",
    title: "Intellectual Property Strategies in Generative AI Model Training",
    excerpt: "Legal analysis of fair use boundaries, transformative licensing precedents, and collective bargaining agreements in synthetic media.",
    date: "October 22, 2026",
    readTime: "11 min read",
    tags: ["Legal", "Intellectual Property", "AI Ethics", "Regulatory"],
    author: "Marcus Vance, JD",
    fortiAnalysisScore: 91,
  },
  {
    id: "4",
    title: "Design Systems at Scale: Token Architecture and Usability Testing",
    excerpt: "How semantic design tokens bridge Figma variables and React Tailwind tokens across multi-brand enterprise platforms.",
    date: "October 12, 2026",
    readTime: "6 min read",
    tags: ["Design", "UI/UX", "Design Systems", "Accessibility"],
    author: "Sophia Chen",
    fortiAnalysisScore: 89,
  },
  {
    id: "5",
    title: "Algorithmic Risk Underwriting: Real-time Variance in Credit Portfolios",
    excerpt: "Mathematical modeling of systemic macro risks, dynamic liquidity adjustments, and non-performing loan forecasts.",
    date: "September 28, 2026",
    readTime: "9 min read",
    tags: ["Finance", "Quantitative Finance", "Risk Modeling"],
    author: "David Sterling, CFA",
    fortiAnalysisScore: 93,
  },
];

export default function CandidateBlogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(sampleBlogs.flatMap((b) => b.tags)));

  const filteredBlogs = sampleBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Specialty Blogs & Knowledge Showcase
            </h1>
            <Badge variant="outline" className="gap-1 text-xs">
              <Sparkles className="size-3 text-purple-500" />
              Forti Evaluated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Publish domain insights and research demonstrating problem-solving judgment, analytical thinking, and learning velocity across any profession.
          </p>
        </div>

        <Link to="/editor">
          <Button className="font-semibold gap-2 shadow-md bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
            <Plus className="size-4" />
            Write New Blog
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles by title, keywords or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-xl"
          />
        </div>

        {/* Tag pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Button
            size="sm"
            variant={selectedTag === null ? "default" : "outline"}
            className="text-xs h-9 rounded-lg"
            onClick={() => setSelectedTag(null)}
          >
            All Topics
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              size="sm"
              variant={selectedTag === tag ? "default" : "outline"}
              className="text-xs h-9 rounded-lg shrink-0"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              #{tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles Feed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <Card
            key={blog.id}
            className="flex flex-col border-border/80 hover:border-primary/50 transition-all shadow-sm hover:shadow-md bg-card/90"
          >
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {blog.readTime}
                </span>
                <span>{blog.date}</span>
              </div>
              <CardTitle className="text-lg font-bold leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                {blog.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <CardDescription className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {blog.excerpt}
              </CardDescription>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] font-medium">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/50 pt-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
                <SparkiIcon />
                <span>Forti Velocity: {blog.fortiAnalysisScore}/100</span>
              </div>

              <span className="flex items-center gap-1 text-primary font-medium cursor-pointer hover:underline">
                Read Article
                <ChevronRight className="size-3.5" />
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SparkiIcon() {
  return <Sparkles className="size-3.5" />;
}
