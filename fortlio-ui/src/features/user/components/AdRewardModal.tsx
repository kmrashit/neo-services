import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Play, CheckCircle2, Sparkles, Tv, Loader2 } from 'lucide-react';
import { useAdReward } from '../hooks/useAdReward';

interface AdRewardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRewardClaimed?: (newCoins: number) => void;
}

export const AdRewardModal: React.FC<AdRewardModalProps> = ({
  open,
  onOpenChange,
  onRewardClaimed,
}) => {
  const {
    isWatching,
    countdown,
    completed,
    isClaiming,
    earnedCoins,
    startAd,
    claimReward,
    reset,
  } = useAdReward({
    durationSeconds: 5,
    onSuccess: (coins) => {
      if (onRewardClaimed) {onRewardClaimed(coins);}
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const progressPercent = Math.min(100, Math.round(((5 - countdown) / 5) * 100));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[460px] bg-card border-border shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
              <Tv className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Watch Ad & Earn Credits</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Earn 10 search coins immediately upon completing this short video simulation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Video Simulation Box */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 text-white text-center shadow-inner my-2">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -left-12 size-32 rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 size-32 rounded-full bg-indigo-600/20 blur-2xl pointer-events-none" />

          {earnedCoins !== null ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="size-8" />
              </div>
              <h4 className="text-base font-bold text-white">Reward Claimed!</h4>
              <p className="text-xs text-neutral-300">
                Your search balance is now <span className="font-bold text-emerald-400">{earnedCoins} coins</span>.
              </p>
            </div>
          ) : isWatching ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex size-16 items-center justify-center rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 animate-pulse">
                <span className="text-2xl font-black">{countdown}s</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-purple-200">Playing Sponsored Video...</p>
                <p className="text-[11px] text-neutral-400">Please do not close this window</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700/60 mt-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : completed ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40">
                <Sparkles className="size-7" />
              </div>
              <h4 className="text-base font-bold text-white">Video Finished!</h4>
              <p className="text-xs text-neutral-300">
                You've successfully watched the video ad. Claim your reward below.
              </p>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 shadow-md">
                <Coins className="size-7 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Sponsor: DevTalent Cloud</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Watch a 5-second preview to replenish 10 search coins for candidate evaluations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          {earnedCoins !== null ? (
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              onClick={handleClose}
            >
              Done
            </Button>
          ) : completed ? (
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2"
              disabled={isClaiming}
              onClick={claimReward}
            >
              {isClaiming ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Claiming Reward...</span>
                </>
              ) : (
                <>
                  <Coins className="size-4" />
                  <span>Claim +10 Search Coins</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2"
              disabled={isWatching}
              onClick={startAd}
            >
              <Play className="size-4 fill-current" />
              <span>{isWatching ? `Watching (${countdown}s)...` : 'Start Watching Video Ad'}</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
