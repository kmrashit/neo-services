import { useState, type FormEvent } from 'react';
import { Plus, Loader2, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { IJobCreatePayload, IJobPost, WorkplaceType } from '../types';

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: IJobCreatePayload) => Promise<IJobPost | unknown>;
  professions: string[];
}

export function JobPostModal({
  isOpen,
  onClose,
  onSubmit,
  professions,
}: JobPostModalProps) {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');
  const [profession, setProfession] = useState('Engineering & Technology');
  const [location, setLocation] = useState('Remote');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('Remote');
  const [experienceYears, setExperienceYears] = useState(3);
  const [salaryRange, setSalaryRange] = useState('$120,000 - $160,000');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyName.trim()) {
      setError('Title and company name are required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSubmit({
        title: title.trim(),
        companyName: companyName.trim(),
        department: department.trim() || undefined,
        profession,
        location: location.trim() || undefined,
        workplaceType,
        experienceYears: Number(experienceYears) || 0,
        salaryRange: salaryRange.trim() || undefined,
        skills: skillsArray.length > 0 ? skillsArray : ['Universal'],
        description: description.trim() || undefined,
      });

      // Reset form
      setTitle('');
      setCompanyName('');
      setDepartment('');
      setSkills('');
      setDescription('');
      onClose();
    } catch (err: any) {
      console.warn('Job creation error:', err);
      setError(err?.response?.data?.message || 'Failed to create job posting');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Briefcase className="size-5" />
            </div>
            <DialogTitle className="text-xl font-bold">Post New Job Opening</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Publish a role across any profession and reach verified candidates dynamically matched by skills.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="job-title-input" className="text-xs font-semibold text-foreground">
                Job Title *
              </label>
              <Input
                id="job-title-input"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Genomics Researcher"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="company-name-input" className="text-xs font-semibold text-foreground">
                Company / Organization *
              </label>
              <Input
                id="company-name-input"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. BioTherapeutics Lab"
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="profession-select" className="text-xs font-semibold text-foreground">
                Profession / Domain *
              </label>
              <select
                id="profession-select"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-foreground"
              >
                {professions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="department-input" className="text-xs font-semibold text-foreground">
                Department
              </label>
              <Input
                id="department-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Translational R&D"
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label htmlFor="workplace-type-select" className="text-xs font-semibold text-foreground">
                Workplace Type
              </label>
              <select
                id="workplace-type-select"
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                className="w-full h-9 px-3 text-xs bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-foreground"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="location-input" className="text-xs font-semibold text-foreground">
                Location
              </label>
              <Input
                id="location-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Boston, MA"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="exp-years-input" className="text-xs font-semibold text-foreground">
                Min Exp (Years)
              </label>
              <Input
                id="exp-years-input"
                type="number"
                min={0}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="salary-range-input" className="text-xs font-semibold text-foreground">
              Salary Range
            </label>
            <Input
              id="salary-range-input"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. $140,000 - $180,000"
              className="h-9 text-xs rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="skills-input" className="text-xs font-semibold text-foreground">
              Required Skills (Comma separated)
            </label>
            <Input
              id="skills-input"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Genomics, Bioinformatics, Python, Clinical Trials"
              className="h-9 text-xs rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="job-description-input" className="text-xs font-semibold text-foreground">
              Description & Key Responsibilities
            </label>
            <Textarea
              id="job-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline mission, core technical or domain deliverables, and team context..."
              rows={4}
              className="text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={submitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 h-9 rounded-xl shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Plus className="size-4 mr-2" />
                  Publish Role
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
