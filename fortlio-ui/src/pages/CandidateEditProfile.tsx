import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, User, Globe, Check, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PROFESSIONS_TAXONOMY, INDUSTRIES_LIST, EDUCATION_LEVELS } from "@/constants/taxonomy";

export default function CandidateEditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "Alex Mercer");
  const [headline, setHeadline] = useState("Staff Systems Engineer & Distributed Architect");
  const [location, setLocation] = useState("San Francisco, CA (Open to Remote)");
  const [bio, setBio] = useState(
    "Passionate systems engineer focused on high-throughput event streaming, distributed consensus, and developer tooling."
  );
  const [selectedCategory, setSelectedCategory] = useState("tech-software");
  const [industry, setIndustry] = useState("Technology & Software");
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree (BA / BS / BFA / B.Tech / BBA)");

  const [skills, setSkills] = useState<string[]>([
    "TypeScript", "Go", "Distributed Systems", "Kubernetes", "Kafka",
    "MongoDB Aggregations", "Redis", "Bun"
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [github, setGithub] = useState("https://github.com/alexmercer");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/alexmercer");
  const [website, setWebsite] = useState("https://alexmercer.dev");

  const [isSaved, setIsSaved] = useState(false);

  const currentCategory = PROFESSIONS_TAXONOMY.find((c) => c.id === selectedCategory) || PROFESSIONS_TAXONOMY[0];

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ fullName });
    setIsSaved(true);
    setTimeout(() => {
      navigate("/candidate-profile");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/candidate-profile")}
          className="gap-2 text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </Button>

        <h1 className="text-xl font-bold text-foreground">Edit Candidate Profile</h1>

        <Button
          type="button"
          onClick={handleSave}
          className="gap-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm"
        >
          {isSaved ? <Check className="size-4 text-emerald-400" /> : <Save className="size-4" />}
          {isSaved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="size-4 text-primary" />
              General Information
            </CardTitle>
            <CardDescription className="text-xs">
              Primary profile details visible on your public portfolio page.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="headline" className="text-xs font-medium">Professional Headline</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-medium">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Open to Remote)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-medium">About / Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Describe your domain expertise, analytical philosophy, and what kind of roles or collaborations you are seeking..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Specialty, Industry & Education Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="size-4 text-primary" />
              Specialty, Industry & Education
            </CardTitle>
            <CardDescription className="text-xs">
              Universal taxonomy indexing your profile for recruiter discovery across all disciplines.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-medium">Field / Profession</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PROFESSIONS_TAXONOMY.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industry" className="text-xs font-medium">Industry</Label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {INDUSTRIES_LIST.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="education" className="text-xs font-medium">Highest Education</Label>
                <select
                  id="education"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Suggestions from selected category */}
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground font-medium">
                Suggested specialties for {currentCategory.name} (click to add):
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentCategory.specialties.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => {
                      if (!skills.includes(spec)) {
                        setSkills([...skills, spec]);
                      }
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors cursor-pointer"
                  >
                    + {spec}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verified Skills & Specialties Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Verified Skills & Specialties</CardTitle>
            <CardDescription className="text-xs">
              Add domain disciplines, methodologies, clinical or system tools you specialize in.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill or specialty (e.g. Distributed Systems, Clinical Research, Corporate Law) and press Enter"
                className="text-xs h-10"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSkill}
                className="h-10 text-xs gap-1.5 font-medium shrink-0 cursor-pointer"
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1.5 py-1 px-3 text-xs font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-destructive transition-colors ml-0.5 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portfolio & Social Profiles</CardTitle>
            <CardDescription className="text-xs">
              Link external repositories and profiles.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="github" className="text-xs font-medium flex items-center gap-1.5">
                <Globe className="size-3.5" />
                GitHub Profile URL
              </Label>
              <Input
                id="github"
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="linkedin" className="text-xs font-medium flex items-center gap-1.5">
                <Globe className="size-3.5" />
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-xs font-medium flex items-center gap-1.5">
                <Globe className="size-3.5" />
                Personal Portfolio or Website
              </Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://myportfolio.dev"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
