import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Building,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface HrJob {
  id: string;
  title: string;
  department: string;
  profession: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'Onsite';
  experienceYears: number;
  salaryRange: string;
  skills: string[];
  applicantCount: number;
  status: 'active' | 'closed';
  postedAt: string;
}

const INITIAL_HR_JOBS: HrJob[] = [
  {
    id: 'hr-job-1',
    title: 'Staff Distributed Systems Engineer',
    department: 'Core Infrastructure',
    profession: 'Engineering & Technology',
    location: 'San Francisco, CA (Remote)',
    workplaceType: 'Remote',
    experienceYears: 6,
    salaryRange: '$185,000 - $230,000',
    skills: ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis'],
    applicantCount: 14,
    status: 'active',
    postedAt: '2 days ago',
  },
  {
    id: 'hr-job-2',
    title: 'Senior Clinical Bioinformatician',
    department: 'Genetics R&D',
    profession: 'Medicine & Healthcare',
    location: 'Boston, MA (Hybrid)',
    workplaceType: 'Hybrid',
    experienceYears: 5,
    salaryRange: '$160,000 - $195,000',
    skills: ['Genomics', 'Bioinformatics', 'Python'],
    applicantCount: 8,
    status: 'active',
    postedAt: '4 days ago',
  },
];

export default function HrJobsPage() {
  const [jobs, setJobs] = useState<HrJob[]>(INITIAL_HR_JOBS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewApplicantsJob, setViewApplicantsJob] = useState<HrJob | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [profession, setProfession] = useState('Engineering & Technology');
  const [location, setLocation] = useState('Remote');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Remote');
  const [experienceYears, setExperienceYears] = useState(5);
  const [salaryRange, setSalaryRange] = useState('$150,000 - $190,000');
  const [skills, setSkills] = useState('TypeScript, Distributed Systems');
  const [description, setDescription] = useState('');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {return;}

    const newJob: HrJob = {
      id: `hr-job-${Date.now()}`,
      title,
      department: department || 'Engineering',
      profession,
      location,
      workplaceType,
      experienceYears,
      salaryRange,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      applicantCount: 0,
      status: 'active',
      postedAt: 'Just now',
    };

    setJobs([newJob, ...jobs]);
    setIsCreateOpen(false);
    // Reset form
    setTitle('');
    setDepartment('');
    setDescription('');
  };

  const handleToggleStatus = (jobId: string) => {
    setJobs(
      jobs.map((j) => {
        if (j.id === jobId) {
          return { ...j, status: j.status === 'active' ? 'closed' : 'active' };
        }
        return j;
      }),
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-background p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600/20 text-purple-600 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-0.5">
                <Briefcase className="size-3 mr-1" />
                Recruiter Job Postings
              </Badge>
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
                HR Workspace
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              Job Postings & Applicant Pipeline
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create, publish, and manage job openings across all disciplines. Review verified talent applications and initiate direct candidate connections.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-10 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold cursor-pointer shadow-md shrink-0"
          >
            <Plus className="size-4 mr-1.5" />
            <span>Post a New Job</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/80 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Active Listings</span>
            <Briefcase className="size-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {jobs.filter((j) => j.status === 'active').length}
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Applicants</span>
            <Users className="size-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {jobs.reduce((acc, curr) => acc + curr.applicantCount, 0)}
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Recruiter Status</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="text-base font-bold text-foreground mt-2 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verified Employer</span>
          </div>
        </Card>
      </div>

      {/* Active Postings Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Role Title & Department</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Profession & Type</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Applicants</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="font-bold text-xs text-foreground">{job.title}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
                    <Building className="size-3 text-purple-500" />
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-semibold py-0">
                    {job.profession}
                  </Badge>
                  <div className="text-[11px] text-muted-foreground pt-0.5">
                    {job.workplaceType} • {job.experienceYears}+ yrs
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs font-bold">
                    <Users className="size-3 mr-1" />
                    {job.applicantCount} Applicants
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === 'active' ? 'default' : 'secondary'}
                    className={`text-[10px] uppercase font-bold py-0 cursor-pointer ${
                      job.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    onClick={() => handleToggleStatus(job.id)}
                    title="Click to toggle status"
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewApplicantsJob(job)}
                    className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-500/10 cursor-pointer"
                  >
                    <Eye className="size-3.5 mr-1" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG: Post a New Job */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Post a New Job Opportunity</DialogTitle>
            <DialogDescription className="text-xs">
              Publish job criteria to reach verified candidates matching your required domain competencies.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateJob} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Job Title</label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Staff Systems Engineer"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Profession Track</label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                >
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Medicine & Healthcare">Medicine & Healthcare</option>
                  <option value="Design & Creative Arts">Design & Creative Arts</option>
                  <option value="Law & Legal Services">Law & Legal Services</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Science & Research">Science & Research</option>
                  <option value="Business & Operations">Business & Operations</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Workplace Type</label>
                <select
                  value={workplaceType}
                  onChange={(e: any) => setWorkplaceType(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Min Experience (Yrs)</label>
                <Input
                  type="number"
                  min={0}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Salary / Compensation Range</label>
                <Input
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. $160,000 - $210,000"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Required Skills (comma separated)</label>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="TypeScript, Redis, Kafka"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Role Description & Mission</label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key responsibilities, team impact, and required domain competencies..."
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-5"
              >
                Publish Job Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Review Applicants */}
      {viewApplicantsJob && (
        <Dialog open={!!viewApplicantsJob} onOpenChange={(open) => !open && setViewApplicantsJob(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Applicants: {viewApplicantsJob.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {viewApplicantsJob.applicantCount} candidates applied with verified portfolios.
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-3">
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-foreground">Alex Mercer</h4>
                  <p className="text-[11px] text-muted-foreground">Staff Systems Engineer • Forti Velocity: 94/100</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                  98% Match
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-foreground">Elena Rostova</h4>
                  <p className="text-[11px] text-muted-foreground">Design Systems Architect • Forti Velocity: 89/100</p>
                </div>
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-xs">
                  88% Match
                </Badge>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setViewApplicantsJob(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
