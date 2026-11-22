import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  User,
  Globe,
  Check,
  Briefcase,
  AlertCircle,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUpsertProfile } from '../hooks/useUpsertProfile';
import type { ICandidateProfile, CandidateProfileUpsertPayload } from '../types';
import { PROFESSIONS_TAXONOMY, INDUSTRIES_LIST, EDUCATION_LEVELS } from '@/constants/taxonomy';

interface ProfileEditFormProps {
  initialProfile?: ICandidateProfile | null;
  onSuccess?: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialProfile,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { saveProfile, isSaving, error } = useUpsertProfile();

  const [fullName, setFullName] = useState(initialProfile?.fullName || 'Alex Mercer');
  const [email] = useState(initialProfile?.email || 'alex.mercer@fortlio.dev');
  const [mobileNumber, setMobileNumber] = useState(initialProfile?.mobileNumber || '+1 (555) 382-9102');
  const [headline, setHeadline] = useState(initialProfile?.headline || 'Staff Systems Engineer & Distributed Architect');
  const [location, setLocation] = useState(initialProfile?.location || 'San Francisco, CA (Open to Remote)');
  const [bio, setBio] = useState(
    initialProfile?.bio ||
      'Passionate systems engineer focused on high-throughput event streaming, distributed consensus, and developer tooling.',
  );

  const [profession, setProfession] = useState(initialProfile?.profession || PROFESSIONS_TAXONOMY[0].name);
  const [industry, setIndustry] = useState(initialProfile?.industry || INDUSTRIES_LIST[0]);
  const [educationLevel, setEducationLevel] = useState(
    initialProfile?.educationLevel || EDUCATION_LEVELS[2],
  );

  const [skills, setSkills] = useState<string[]>(
    initialProfile?.skills || [
      'TypeScript', 'Go', 'Distributed Systems', 'Kubernetes', 'Kafka',
      'MongoDB Aggregations', 'Redis', 'Bun',
    ],
  );
  const [skillInput, setSkillInput] = useState('');
  const [githubUrl, setGithubUrl] = useState(initialProfile?.githubUrl || 'https://github.com/alexmercer');
  const [linkedinUrl, setLinkedinUrl] = useState(initialProfile?.linkedinUrl || 'https://linkedin.com/in/alexmercer');
  const [portfolioUrl, setPortfolioUrl] = useState(initialProfile?.portfolioUrl || 'https://alexmercer.dev');

  const [isSaved, setIsSaved] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(false);

    const payload: CandidateProfileUpsertPayload = {
      fullName,
      email,
      mobileNumber,
      skills,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      bio,
      headline,
      location,
      profession,
      industry,
      educationLevel,
    };

    await saveProfile(payload);
    setIsSaved(true);

    if (onSuccess) {
      onSuccess();
    } else {
      setTimeout(() => {
        navigate('/candidate-profile');
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/candidate-profile')}
          className="gap-2 text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </Button>

        <h1 className="text-xl font-bold text-foreground">Edit Candidate Profile</h1>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="gap-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin mr-1" />
              <span>Saving...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="size-4 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info Card */}
        <Card className="border border-border/80 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="size-4 text-purple-600 dark:text-purple-400" />
              General Information
            </CardTitle>
            <CardDescription className="text-xs">
              Primary profile details visible on your public portfolio page.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address (Verified)</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="h-9 text-xs rounded-xl bg-muted/60 opacity-80 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="headline" className="text-xs font-semibold">Professional Headline</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Staff Systems Engineer & Distributed Architect"
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobileNumber" className="text-xs font-semibold">Contact Mobile</Label>
                <Input
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +1 555-0199"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold">Location & Remote Availability</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Open to Remote)"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            {/* Profession & Taxonomy Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="profession" className="text-xs font-semibold flex items-center gap-1">
                  <Briefcase className="size-3.5 text-purple-600" />
                  Profession
                </Label>
                <select
                  id="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {PROFESSIONS_TAXONOMY.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industry" className="text-xs font-semibold">Industry Sector</Label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {INDUSTRIES_LIST.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="educationLevel" className="text-xs font-semibold flex items-center gap-1">
                  <GraduationCap className="size-3.5 text-purple-600" />
                  Education Credential
                </Label>
                <select
                  id="educationLevel"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {EDUCATION_LEVELS.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-semibold">Professional Biography</Label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your professional journey, expertise, and focus areas..."
                className="w-full text-xs rounded-xl border border-input bg-transparent px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills & Expertise Card */}
        <Card className="border border-border/80 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="size-4 text-purple-600 dark:text-purple-400" />
              Verified Skills & Core Competencies
            </CardTitle>
            <CardDescription className="text-xs">
              Add technical skills, tools, and domain specialties.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill (e.g. TypeScript, GraphQL, Distributed Systems) and press Enter"
                className="h-9 text-xs rounded-xl"
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                variant="outline"
                className="h-9 px-4 text-xs font-semibold rounded-xl gap-1 cursor-pointer"
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs px-3 py-1 rounded-xl flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-destructive cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links & Portfolio Card */}
        <Card className="border border-border/80 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="size-4 text-purple-600 dark:text-purple-400" />
              Links & Portfolio Repositories
            </CardTitle>
            <CardDescription className="text-xs">
              Connect external links so recruiters can verify your codebase and artifacts.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="github" className="text-xs font-semibold">GitHub Profile URL</Label>
                <Input
                  id="github"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs font-semibold">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs font-semibold">Personal / Blog Website</Label>
                <Input
                  id="website"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourdomain.dev"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
