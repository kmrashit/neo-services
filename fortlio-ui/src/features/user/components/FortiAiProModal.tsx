import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CreditCard,
  Coins,
  Check,
  Loader2,
  AlertCircle,
  Tv,
  Zap,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '../api';

export interface FortiAiProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COIN_PACKAGES = [
  { id: 'coins_50', coins: 50, price: 5, label: 'Starter', desc: '5,000 AI tokens or 10 recruiter searches' },
  { id: 'coins_200', coins: 200, price: 15, label: 'Popular', badge: 'Save 25%', desc: '20,000 AI tokens or 40 recruiter searches' },
  { id: 'coins_500', coins: 500, price: 35, label: 'Power', badge: 'Best Value', desc: '50,000 AI tokens or 100 recruiter searches' },
];

export const FortiAiProModal: React.FC<FortiAiProModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'pro' | 'coins'>('pro');

  const [isAiOptedIn, setIsAiOptedIn] = useState<boolean>(Boolean((user as any)?.isAiOptedIn ?? true));
  const [isPro, setIsPro] = useState<boolean>(Boolean((user as any)?.isPro));
  const [tokensUsed, setTokensUsed] = useState<number>((user as any)?.tokensUsed ?? 0);
  const [coins, setCoins] = useState<number>((user as any)?.coins ?? 10);

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState(user?.fullName || '');
  const [selectedPackageId, setSelectedPackageId] = useState('coins_200');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      userApi.getTokenUsage().then((res) => {
        if (res.data) {
          setIsAiOptedIn(res.data.isAiOptedIn);
          setIsPro(res.data.isPro);
          setTokensUsed(res.data.tokensUsed);
          setCoins(res.data.coins);
        }
      }).catch(() => {
        // Fallback to auth context user state
        setIsAiOptedIn(Boolean((user as any)?.isAiOptedIn ?? true));
        setIsPro(Boolean((user as any)?.isPro));
        setCoins((user as any)?.coins ?? 10);
      });
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, user]);

  const handleToggleAiOptIn = async () => {
    const nextVal = !isAiOptedIn;
    setIsLoading(true);
    setError(null);
    try {
      const res = await userApi.toggleAiOptIn(nextVal);
      setIsAiOptedIn(res.data.isAiOptedIn);
      updateUser({ ...(user as any), isAiOptedIn: res.data.isAiOptedIn });
      setSuccessMsg(`Forti AI Engine is now ${res.data.isAiOptedIn ? 'Active (Green LED enabled)' : 'Paused'}.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update AI Engine status');
    } finally {
      setIsLoading(false);
    }
  };

  const parseExpDate = (val: string) => {
    const [m, y] = val.split('/');
    const expMonth = parseInt(m || '12', 10);
    const expYear = parseInt(y ? (y.length === 2 ? `20${y}` : y) : '2028', 10);
    return { expMonth: isNaN(expMonth) ? 12 : expMonth, expYear: isNaN(expYear) ? 2028 : expYear };
  };

  const handleUpgradePro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.replace(/\s+/g, '') || cardNumber.length < 13) {
      setError('Please provide a valid card number.');
      return;
    }
    if (!cvc || cvc.length < 3) {
      setError('Please provide a valid 3 or 4 digit CVC.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { expMonth, expYear } = parseExpDate(expDate);
      const res = await userApi.upgradeToPro({
        cardNumber: cardNumber.replace(/\s+/g, ''),
        expMonth,
        expYear,
        cvc,
        cardholderName: cardholderName || 'Cardholder',
        plan: 'pro_monthly',
        amountPaid: 29.0,
      });

      setIsPro(true);
      setIsAiOptedIn(true);
      setCoins(res.data.coins);
      updateUser({ ...(user as any), isPro: true, isAiOptedIn: true, coins: res.data.coins });
      setSuccessMsg('Congratulations! Your account has been upgraded to Forti AI Pro with 500 bonus coins.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Credit card processing failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = COIN_PACKAGES.find((p) => p.id === selectedPackageId) || COIN_PACKAGES[1];
    if (!cardNumber.replace(/\s+/g, '') || cardNumber.length < 13) {
      setError('Please provide a valid credit card number.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { expMonth, expYear } = parseExpDate(expDate);
      const res = await userApi.purchaseCoins({
        cardNumber: cardNumber.replace(/\s+/g, ''),
        expMonth,
        expYear,
        cvc,
        cardholderName: cardholderName || 'Cardholder',
        coinPackageId: pkg.id,
        coins: pkg.coins,
        amountPaid: pkg.price,
      });

      setCoins(res.data.coins);
      updateUser({ ...(user as any), coins: res.data.coins });
      setSuccessMsg(`Success! ${res.data.coinsAdded} coins added via Credit Card. New balance: ${res.data.coins} coins.`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Coin purchase failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchAdReward = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userApi.watchAd(user?.id || (user as any)?.userId);
      setCoins(res.data.coins);
      updateUser({ ...(user as any), coins: res.data.coins });
      setSuccessMsg('You earned 10 free coins by watching a sponsored video ad!');
    } catch (err: any) {
      setError(err.message || 'Failed to claim ad reward');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
              Forti AI Engine & Pro Subscription
            </DialogTitle>
            <div className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1 rounded-full">
              <span className="text-muted-foreground text-[11px]">AI Status:</span>
              {isAiOptedIn ? (
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Opted-In (Active)
                </span>
              ) : (
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  Paused
                </span>
              )}
            </div>
          </div>
          <DialogDescription className="text-xs">
            Manage your authentic input tracking, token usage, credit card billing, and Forti AI Pro features.
          </DialogDescription>
        </DialogHeader>

        {successMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <Check className="size-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pro' | 'coins')}>
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="pro" className="text-xs gap-1.5 h-7">
              <Zap className="size-3.5 text-purple-500" />
              AI Engine & Pro Membership
            </TabsTrigger>
            <TabsTrigger value="coins" className="text-xs gap-1.5 h-7">
              <Coins className="size-3.5 text-amber-500" />
              Add Coins & Token Usage
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: AI Engine Opt-In & Pro Upgrade */}
          <TabsContent value="pro" className="space-y-4 pt-2">
            {/* Opt-In Switch Card */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Forti AI Engine Opt-In</span>
                  {isAiOptedIn && (
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-0">
                      Active (Green LED)
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  When enabled, Forti AI tracks authentic learning velocity, domain depth, and STAR methodology metrics.
                </p>
              </div>
              <Button
                size="sm"
                variant={isAiOptedIn ? 'default' : 'outline'}
                onClick={handleToggleAiOptIn}
                disabled={isLoading}
                className={`text-xs h-8 cursor-pointer shrink-0 ${
                  isAiOptedIn ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                }`}
              >
                {isAiOptedIn ? 'Opted-In' : 'Opt In Now'}
              </Button>
            </div>

            {/* Pro Plan Card */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Forti AI Pro</span>
                    {isPro ? (
                      <Badge className="bg-purple-600 text-white text-[10px]">Active Member</Badge>
                    ) : (
                      <Badge variant="outline" className="border-purple-500/40 text-purple-600 text-[10px]">
                        $29 / month
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    For HR recruiters and ambitious candidates requiring deep authentic evaluation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Unlimited Authentic Analysis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-500 shrink-0" />
                  <span>500 Bonus Monthly Coins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Priority LLM Inference</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Recruiter Search Multiplier</span>
                </div>
              </div>

              {!isPro && (
                <form onSubmit={handleUpgradePro} className="pt-2 border-t border-purple-500/20 space-y-2.5">
                  <p className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                    <CreditCard className="size-3.5 text-purple-500" />
                    Pay by Credit Card to Enable Pro
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 space-y-1">
                      <Label className="text-[11px]">Card Number</Label>
                      <Input
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="h-8 text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Expires (MM/YY)</Label>
                      <Input
                        placeholder="12/28"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                        className="h-8 text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">CVC</Label>
                      <Input
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="h-8 text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-[11px]">Cardholder Name</Label>
                      <Input
                        placeholder="Full Name as on card"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-8 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer mt-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        Processing Card...
                      </>
                    ) : (
                      'Pay $29 & Enable Forti AI Pro'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: Add Coins & Token Usage */}
          <TabsContent value="coins" className="space-y-4 pt-2">
            {/* Balance & Token Usage Stats */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-[11px] text-muted-foreground block">Available Coins</span>
                <span className="text-xl font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                  <Coins className="size-5" />
                  {coins}
                </span>
                <span className="text-[10px] text-muted-foreground">Each coin = 100 AI tokens</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-[11px] text-muted-foreground block">Actual Token Usage</span>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5 block">
                  {tokensUsed.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">Tracked per LLM interaction</span>
              </div>
            </div>

            {/* Coin Packages Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Coin Package</Label>
              <div className="grid grid-cols-3 gap-2">
                {COIN_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-500/10 shadow-sm'
                          : 'border-border hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{pkg.label}</span>
                        {pkg.badge && (
                          <span className="text-[9px] bg-purple-600 text-white px-1 rounded font-semibold">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-foreground mt-1">
                        +{pkg.coins} Coins
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">${pkg.price}.00</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Credit Card Form for Coins */}
            <form onSubmit={handleBuyCoins} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  <CreditCard className="size-3.5 text-purple-500" />
                  Add Money via Credit Card
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  Total: ${COIN_PACKAGES.find((p) => p.id === selectedPackageId)?.price}.00
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 space-y-1">
                  <Label className="text-[11px]">Card Number</Label>
                  <Input
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Expires (MM/YY)</Label>
                  <Input
                    placeholder="12/28"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">CVC</Label>
                  <Input
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay $${COIN_PACKAGES.find((p) => p.id === selectedPackageId)?.price}.00 & Add Coins`
                )}
              </Button>
            </form>

            {/* Free Coins by Watching Ad */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Need coins without paying?</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleWatchAdReward}
                disabled={isLoading}
                className="h-7 text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 gap-1.5 cursor-pointer"
              >
                <Tv className="size-3 text-amber-500" />
                <span>Watch Video Ad (+10 Coins)</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
