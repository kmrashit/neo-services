import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRoleBadge } from './UserRoleBadge';
import { AdRewardModal } from './AdRewardModal';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  User,
  Coins,
  ShieldCheck,
  Tv,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface UserProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    profile,
    isLoading,
    isSaving,
    saveProfile,
    updateCoinsLocally,
  } = useUserProfile();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [mobileNumber, setMobileNumber] = useState(profile?.mobileNumber || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [adModalOpen, setAdModalOpen] = useState(false);

  // Sync state when profile loads
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setLastName(profile.lastName || '');
      setMobileNumber(profile.mobileNumber || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await saveProfile({
        fullName,
        lastName,
        mobileNumber,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save changes');
    }
  };

  const handleRewardClaimed = (newCoins: number) => {
    updateCoinsLocally(newCoins);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[560px] bg-card border-border shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 border-b border-border/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
                  <User className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Account & RBAC Settings</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Manage your profile, verified role credentials, and search coins.
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="account" className="w-full">
            <div className="px-6 pt-3 border-b border-border/60">
              <TabsList className="grid grid-cols-3 w-full bg-muted/60 p-1 rounded-xl">
                <TabsTrigger value="account" className="text-xs rounded-lg font-medium">
                  General Info
                </TabsTrigger>
                <TabsTrigger value="monetization" className="text-xs rounded-lg font-medium">
                  Search Coins
                </TabsTrigger>
                <TabsTrigger value="rbac" className="text-xs rounded-lg font-medium">
                  Role & RBAC
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: General Info */}
            <TabsContent value="account" className="p-6 space-y-4 focus-visible:outline-none">
              {saveSuccess && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {saveError && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold">First / Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="h-9 text-xs rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-semibold">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Mercer"
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Email Address (Verified)</Label>
                  <Input
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="h-9 text-xs rounded-xl bg-muted/60 cursor-not-allowed opacity-80"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Email is anchored to your authentication identity and cannot be altered directly.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile" className="text-xs font-semibold">Contact Mobile</Label>
                  <Input
                    id="mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving || isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold h-9 px-4"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB 2: Search Coins & Monetization */}
            <TabsContent value="monetization" className="p-6 space-y-4 focus-visible:outline-none">
              <Card className="border-border bg-muted/30 rounded-2xl overflow-hidden">
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Coins className="size-4 text-amber-500" />
                      <span>Available Search Balance</span>
                    </CardTitle>
                    <span className="text-2xl font-black text-foreground">
                      {profile?.coins ?? 10} <span className="text-xs font-normal text-muted-foreground">coins</span>
                    </span>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground pt-1">
                    Recruiter searches consume 1 coin per candidate evaluation. Candidates and recruiters receive replenishments by viewing sponsor videos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="rounded-xl border border-border/80 bg-background/60 p-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">Watch Video Ad</p>
                      <p className="text-[11px] text-muted-foreground">Earn +10 search credits in 5 seconds</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setAdModalOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold gap-1.5 h-8 cursor-pointer"
                    >
                      <Tv className="size-3.5" />
                      <span>Watch (+10)</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Monetization & Search Policy (F05 rule):</p>
                <p className="text-[11px]">
                  Recruiters get 2 initial queries before watching a 5-second video ad to replenish quota.
                </p>
              </div>
            </TabsContent>

            {/* TAB 3: Role & RBAC */}
            <TabsContent value="rbac" className="p-6 space-y-4 focus-visible:outline-none">
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Assigned Role</h4>
                    <p className="text-xs text-muted-foreground">Determines accessible API routes and platform capabilities.</p>
                  </div>
                  <UserRoleBadge role={profile?.role || 'candidate'} />
                </div>

                <div className="border-t border-border/60 pt-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span>Role Capabilities</span>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5 pl-5 list-disc">
                    <li>Authenticated candidate portfolio and markdown blog authoring</li>
                    <li>PDF resume generation and share link tracking</li>
                    <li>Typesense talent discovery search and Forti AI chatbot</li>
                    <li>Bi-directional connection requests and real-time chat</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Embedded Ad Reward Modal */}
      <AdRewardModal
        open={adModalOpen}
        onOpenChange={setAdModalOpen}
        onRewardClaimed={handleRewardClaimed}
      />
    </>
  );
};
