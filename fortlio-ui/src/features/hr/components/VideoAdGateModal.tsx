import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tv, Play, CheckCircle2, Sparkles, Coins, Loader2 } from 'lucide-react';
import { hrApi } from '../api';
import { useAuth } from '@/contexts/AuthContext';

interface VideoAdGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRewardClaimed: (newCoins: number) => void;
}

export const VideoAdGateModal: React.FC<VideoAdGateModalProps> = ({
  open,
  onOpenChange,
  onRewardClaimed,
}) => {
  const { user } = useAuth();
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [completed, setCompleted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any = null;
    if (isWatching && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (isWatching && countdown === 0) {
      setIsWatching(false);
      setCompleted(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWatching, countdown]);

  const handleStart = () => {
    setError(null);
    setClaimed(false);
    setCompleted(false);
    setCountdown(5);
    setIsWatching(true);
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    setError(null);
    try {
      const res = await hrApi.watchAdReward(user?.id);
      const coins = res?.coins ?? ((user as any)?.coins || 0) + 10;
      setClaimed(true);
      onRewardClaimed(coins);
    } catch {
      // Fallback in dev/offline
      const fallback = ((user as any)?.coins || 0) + 10;
      setClaimed(true);
      onRewardClaimed(fallback);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClose = () => {
    setIsWatching(false);
    setCompleted(false);
    setClaimed(false);
    onOpenChange(false);
  };

  const progress = Math.min(100, Math.round(((5 - countdown) / 5) * 100));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
              <Tv className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Recruiter Search Quota Depleted
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Watch a sponsored video ad to replenish 2 free candidate searches.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Video Simulation Box */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 text-white text-center shadow-inner my-2">
          {/* Ambient lighting */}
          <div className="absolute -top-12 -left-12 size-36 rounded-full bg-purple-600/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 size-36 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />

          {claimed ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="size-8" />
              </div>
              <h4 className="text-base font-bold text-white">Search Quota Replenished!</h4>
              <p className="text-xs text-neutral-300">
                You earned <span className="font-bold text-emerald-400">+10 Search Coins</span>. You can now execute 2 more candidate searches.
              </p>
            </div>
          ) : isWatching ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex size-16 items-center justify-center rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 animate-pulse">
                <span className="text-2xl font-black">{countdown}s</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-purple-200">Playing Sponsored Video Ad...</p>
                <p className="text-[11px] text-neutral-400">Please do not close this window</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700/60 mt-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : completed ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/40">
                <Sparkles className="size-8" />
              </div>
              <h4 className="text-base font-bold text-white">Sponsored Ad Finished</h4>
              <p className="text-xs text-neutral-300">
                Click below to claim your 10 search credits and continue finding talent.
              </p>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/40">
                <Coins className="size-8 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white">Replenish 2 Free Searches</h4>
              <p className="text-xs text-neutral-300 max-w-xs">
                Recruiters receive 2 searches before being required to watch a video ad. Complete the short 5s video to continue.
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-destructive text-center">{error}</p>}

        <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </Button>

          {claimed ? (
            <Button
              onClick={handleClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 cursor-pointer"
            >
              Start Searching Now
            </Button>
          ) : completed ? (
            <Button
              onClick={handleClaim}
              disabled={isClaiming}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold px-5 cursor-pointer shadow-md shadow-purple-500/20"
            >
              {isClaiming ? (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              ) : (
                <Coins className="size-4 mr-1.5 text-amber-300" />
              )}
              Claim +10 Search Coins
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              disabled={isWatching}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold px-5 cursor-pointer shadow-md shadow-purple-500/20"
            >
              <Play className="size-3.5 mr-1.5 fill-current" />
              Start Watching Video Ad
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
