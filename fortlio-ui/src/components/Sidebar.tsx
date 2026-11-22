import { NavLink } from "react-router-dom";
import {
  User,
  FileText,
  FileCode,
  BookOpen,
  Users,
  MessageSquare,
  Bell,
  Sparkles,
  LogOut,
  FolderGit2,
  Palette,
  Bot,
  Search,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const roleStr = (user?.role || '').toLowerCase();
  const emailStr = (user?.email || '').toLowerCase();
  const isHr = roleStr === 'hr' || emailStr.includes('hr') || emailStr === 'hr@test.com';

  const candidateSections = [
    {
      title: "Career & Opportunities",
      items: [
        { name: "Job Suggestions", path: "/jobs", icon: Briefcase },
      ],
    },
    {
      title: "Portfolio Showcase",
      items: [
        { name: "My Showcase Profile", path: "/candidate-profile", icon: User },
        { name: "Edit Profile", path: "/edit-profile", icon: FileText },
        { name: "Resume Builder (A4)", path: "/editor?mode=resume", icon: FileCode },
      ],
    },
    {
      title: "Knowledge & Creation",
      items: [
        { name: "Specialty Blogs", path: "/candidate-blogs", icon: BookOpen },
        { name: "Create Blog (Medium)", path: "/editor?mode=blog", icon: FileText },
        { name: "Draw Imagination", path: "/editor?mode=draw", icon: Palette },
      ],
    },
    {
      title: "AI Career Suite",
      items: [
        { name: "AI Interviews", path: "/candidate-profile?tab=interviews", icon: Bot },
      ],
    },
    {
      title: "Networking",
      items: [
        { name: "Connections", path: "/connections", icon: Users },
        { name: "Direct Chat", path: "/chat", icon: MessageSquare },
        { name: "Notifications", path: "/notifications", icon: Bell },
      ],
    },
  ];

  const hrSections = [
    {
      title: "Recruiter Discovery & Hiring",
      items: [
        { name: "Candidate Search", path: "/candidates", icon: Search },
        { name: "Job Postings & Intake", path: "/hr/jobs", icon: Briefcase },
        { name: "Applicants Review", path: "/hr/applicants", icon: Briefcase },
      ],
    },
    {
      title: "Networking",
      items: [
        { name: "Connections", path: "/connections", icon: Users },
        { name: "Direct Chat", path: "/chat", icon: MessageSquare },
        { name: "Notifications", path: "/notifications", icon: Bell },
      ],
    },
  ];

  const activeSections = isHr ? hrSections : candidateSections;
  const userInitial = (user?.fullName || user?.email || "U").charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border bg-card text-card-foreground shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
          <FolderGit2 className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-300">
            Fortlio
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Portfolio & Talent Platform
          </span>
        </div>
        <Badge variant="outline" className="ml-auto text-[10px] py-0 px-1.5 font-mono">
          v2.0
        </Badge>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {activeSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`
                    }
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Forti AI Feature Banner */}
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <Sparkles className="size-3.5" />
            Forti AI Engine
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Auto-synthesizes candidate learning velocity and leadership traits.
          </p>
        </div>
      </div>

      {/* User Footer Snippet */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-accent/50 transition-colors">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">
              {user?.fullName || "Candidate"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user?.email || "user@fortlio.dev"}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={logout}
            className="size-8 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
