import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  Settings,
  Coins,
  Tv,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  UserRoleBadge,
  UserProfileSettings,
  AdRewardModal,
  FortiAiProModal,
} from '@/features/user';
import { NotificationBell } from '@/features/connections';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { isDark, setTheme } = useTheme();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [fortiAiModalOpen, setFortiAiModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const userInitial = (user?.fullName || user?.email || 'U').charAt(0).toUpperCase();
  const coinsBalance = (user as any)?.coins ?? 10;
  const isAiOptedIn = Boolean((user as any)?.isAiOptedIn ?? true);
  const isPro = Boolean((user as any)?.isPro);
  const roleStr = (user?.role || '').toLowerCase();
  const isHr = roleStr === 'hr' || (user?.email || '').toLowerCase().includes('hr');

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
        {/* Left: Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="size-9 text-muted-foreground hover:text-foreground md:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="size-5" />
          </Button>
        </div>

        {/* Right: Actions, Theme Toggle, Notifications, User */}
        <div className="flex items-center gap-2.5">
          {/* Watch Ad Quick Trigger for Recruiters & Candidates */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAdModalOpen(true)}
            className="flex items-center gap-1.5 h-8 text-xs rounded-lg border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
            title="Watch video ad or add money via Credit Card to earn coins"
          >
            <Coins className="size-3.5 text-amber-500" />
            <span>{coinsBalance} Coins</span>
            <span className="text-[10px] bg-amber-500/20 px-1 rounded font-bold">+10</span>
          </Button>

          {/* Forti AI Status Trigger with Green LED Indicator */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFortiAiModalOpen(true)}
            className="flex items-center gap-1.5 h-8 text-xs rounded-lg border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer"
            title={isAiOptedIn ? 'Forti AI Engine Opted-In (Active)' : 'Forti AI Engine Paused - Click to Configure'}
          >
            {isAiOptedIn ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            )}
            <Sparkles className="size-3.5" />
            <span>Forti AI</span>
            {isPro && (
              <span className="text-[9px] bg-purple-600 text-white font-extrabold px-1 rounded">
                PRO
              </span>
            )}
          </Button>

          {/* Theme Toggle Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="size-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
          </Button>

          {/* Notifications Dropdown Bell */}
          <NotificationBell />

          {/* User Profile Dropdown Menu */}
          <div className="flex items-center pl-2 border-l border-border/80">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-accent/80 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Open User Menu"
                >
                  <Avatar className="size-8 rounded-full shadow-sm bg-gradient-to-tr from-purple-600 to-indigo-600 text-white">
                    <AvatarFallback className="bg-transparent text-white text-xs font-bold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                      {user?.fullName || (isHr ? 'HR Recruiter' : 'Candidate')}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {user?.role || (isHr ? 'hr' : 'candidate')}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl">
                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {user?.fullName || (isHr ? 'HR Recruiter' : 'Candidate')}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user?.email || 'candidate@test.com'}
                    </p>
                    <div className="pt-1">
                      <UserRoleBadge role={isHr ? 'hr' : (user?.role || 'candidate')} />
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate(isHr ? '/candidates' : '/candidate-profile')}
                  className="cursor-pointer gap-2"
                >
                  <UserIcon className="size-4 text-muted-foreground" />
                  <span>Candidate Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setSettingsOpen(true)}
                  className="cursor-pointer gap-2"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  <span>Account & RBAC Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setAdModalOpen(true)}
                  className="cursor-pointer gap-2 text-amber-600 dark:text-amber-400"
                >
                  <Tv className="size-4" />
                  <span>Watch Ad (+10 Coins)</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Account Settings Dialog */}
      <UserProfileSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Video Ad Modal */}
      <AdRewardModal
        open={adModalOpen}
        onOpenChange={setAdModalOpen}
        onRewardClaimed={(newCoins) => {
          updateUser({ coins: newCoins } as any);
        }}
      />

      {/* Forti AI Pro & Credit Card Payment Modal */}
      <FortiAiProModal
        isOpen={fortiAiModalOpen}
        onClose={() => setFortiAiModalOpen(false)}
      />
    </>
  );
}
