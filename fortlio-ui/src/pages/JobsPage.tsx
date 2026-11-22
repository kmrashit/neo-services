import { useState } from 'react';
import {
  Briefcase,
  Search,
  Sparkles,
  MapPin,
  Building,
  DollarSign,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface JobPosting {
  id: string;
  title: string;
  companyName: string;
  profession: string;
  department: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'Onsite';
  experienceYears: number;
  salaryRange: string;
  skills: string[];
  matchScore: number;
  description: string;
  postedAt: string;
}

const DEMO_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Staff Distributed Systems Engineer',
    companyName: 'Veloce Cloud Systems',
    profession: 'Engineering & Technology',
    department: 'Core Infrastructure',
    location: 'San Francisco, CA (Remote)',
    workplaceType: 'Remote',
    experienceYears: 6,
    salaryRange: '$185,000 - $230,000',
    skills: ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis', 'Kafka'],
    matchScore: 98,
    description: 'Looking for a Staff Systems Engineer to lead the design and optimization of our high-throughput aggregation and telemetry pipelines.',
    postedAt: '2 days ago',
  },
  {
    id: 'job-2',
    title: 'Senior Clinical Bioinformatician',
    companyName: 'Genomics Health Institute',
    profession: 'Medicine & Healthcare',
    department: 'Translational Genetics',
    location: 'Boston, MA (Hybrid)',
    workplaceType: 'Hybrid',
    experienceYears: 5,
    salaryRange: '$160,000 - $195,000',
    skills: ['Genomics', 'Bioinformatics', 'Python', 'Statistical Genetics'],
    matchScore: 92,
    description: 'Analyze next-generation sequencing pipelines and translate variant discovery algorithms into clinical therapeutics.',
    postedAt: '3 days ago',
  },
  {
    id: 'job-3',
    title: 'Lead Design Systems Architect',
    companyName: 'Lumina Digital Media',
    profession: 'Design & Creative Arts',
    department: 'Product Design',
    location: 'New York, NY (Remote)',
    workplaceType: 'Remote',
    experienceYears: 6,
    salaryRange: '$150,000 - $185,000',
    skills: ['Design Systems', 'Figma', 'Accessibility', 'Design Ops', 'React'],
    matchScore: 89,
    description: 'Spearhead enterprise-wide multi-brand design systems, token architecture, and accessible cross-platform component libraries.',
    postedAt: '1 week ago',
  },
  {
    id: 'job-4',
    title: 'Senior AI Governance & Regulatory Counsel',
    companyName: 'Nova Juris Technologies',
    profession: 'Law & Legal Services',
    department: 'Legal & Compliance',
    location: 'Washington, DC (Hybrid)',
    workplaceType: 'Hybrid',
    experienceYears: 7,
    salaryRange: '$190,000 - $240,000',
    skills: ['Tech Governance', 'AI Ethics', 'IP Law', 'GDPR', 'Compliance'],
    matchScore: 88,
    description: 'Advise product and AI research pods on global regulatory frameworks, responsible AI governance, and IP portfolio protection.',
    postedAt: '4 days ago',
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'suggestions' | 'all' | 'applied'>('suggestions');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applySuccess, setApplySuccess] = useState(false);

  const filteredJobs = DEMO_JOBS.filter((job) => {
    if (!searchQuery) {return true;}
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.companyName.toLowerCase().includes(q) ||
      job.profession.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const displayedJobs = activeTab === 'applied'
    ? DEMO_JOBS.filter((j) => appliedJobs.includes(j.id))
    : filteredJobs;

  const handleApply = (job: JobPosting) => {
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs([...appliedJobs, job.id]);
    }
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJob(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-background p-6 lg:p-8 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600/20 text-purple-600 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-0.5">
              <Sparkles className="size-3 mr-1" />
              AI Job Suggestions & Career Engine
            </Badge>
            <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
              Role-Matched
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
            Job Suggestions & Career Opportunities
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Personalized job recommendations dynamically matched against your verified domain skills, portfolio showcase, and Forti learning velocity.
          </p>
        </div>
      </div>

      {/* Search Bar & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs by title, skill, or domain..."
            className="pl-10 text-xs h-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="suggestions" className="text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-purple-600" />
              <span>AI Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs font-semibold flex items-center gap-1.5">
              <Briefcase className="size-3.5" />
              <span>All Jobs ({DEMO_JOBS.length})</span>
            </TabsTrigger>
            <TabsTrigger value="applied" className="text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Applied ({appliedJobs.length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedJobs.map((job) => {
          const isApplied = appliedJobs.includes(job.id);
          return (
            <Card
              key={job.id}
              className="flex flex-col justify-between hover:border-purple-500/50 hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm border-border/80 group"
            >
              <CardHeader className="p-5 pb-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-purple-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 pt-0.5">
                      <Building className="size-3.5 text-purple-500" />
                      <span>{job.companyName}</span>
                      <span>•</span>
                      <span>{job.department}</span>
                    </p>
                  </div>

                  {/* AI Match Badge */}
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold shrink-0">
                    <Sparkles className="size-3 mr-1" />
                    {job.matchScore}% Match
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-indigo-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="size-3 text-emerald-500" />
                    {job.salaryRange}
                  </span>
                  <span>{job.experienceYears}+ yrs exp</span>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-[11px] font-medium py-0.5 px-2 bg-muted/40"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-border/40 mt-2">
                <span className="text-[11px] text-muted-foreground font-mono">
                  Posted {job.postedAt}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-semibold cursor-pointer"
                  >
                    View Details
                  </Button>

                  <Button
                    size="sm"
                    disabled={isApplied}
                    onClick={() => handleApply(job)}
                    className={`text-xs font-semibold cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="size-3.5 mr-1 text-white" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5 mr-1" />
                        Quick Apply
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="text-lg font-bold">{selectedJob.title}</DialogTitle>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                  {selectedJob.matchScore}% Match
                </Badge>
              </div>
              <DialogDescription className="text-xs font-medium">
                {selectedJob.companyName} • {selectedJob.location} • {selectedJob.salaryRange}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Role Overview</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Required Domain Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs py-0.5 px-2">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {applySuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Application submitted successfully with your verified portfolio!</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
              <Button
                size="sm"
                disabled={appliedJobs.includes(selectedJob.id) || applySuccess}
                onClick={() => handleApply(selectedJob)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
              >
                {appliedJobs.includes(selectedJob.id) ? 'Application Submitted' : 'Submit Application'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
