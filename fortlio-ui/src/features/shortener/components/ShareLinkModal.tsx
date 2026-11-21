import { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Link as LinkIcon,
  Sparkles,
  QrCode,
  Clock,
  Eye,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCreateShareLink } from '../hooks/useCreateShareLink';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'resume' | 'blog' | 'custom';
  targetTitle?: string;
  originalUrl: string;
}

export function ShareLinkModal({
  isOpen,
  onClose,
  targetType,
  targetTitle,
  originalUrl,
}: ShareLinkModalProps) {
  const { generateLink, createdUrl, shortCode, isLoading, reset } = useCreateShareLink();
  const [customAlias, setCustomAlias] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateLink({
      originalUrl,
      customAlias: customAlias.trim() || undefined,
      targetType,
    });
  };

  const handleCopy = () => {
    const urlToCopy = createdUrl || originalUrl;
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    reset();
    setCustomAlias('');
    setCopied(false);
    setShowQr(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Share2 className="size-5 text-purple-600" />
              Share Trackable Short Link
            </DialogTitle>
            <Badge variant="outline" className="text-[11px] capitalize">
              {targetType}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {targetTitle ? `Sharing: ${targetTitle}` : 'Share your professional portfolio with real-time dwell-time analytics.'}
          </DialogDescription>
        </DialogHeader>

        {!createdUrl ? (
          <form onSubmit={handleGenerate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="custom-alias" className="text-xs font-semibold">
                Custom Short Alias (Optional)
              </Label>
              <div className="flex items-center rounded-lg border border-input bg-muted/40 px-3">
                <span className="text-xs text-muted-foreground mr-1">/s/</span>
                <Input
                  id="custom-alias"
                  placeholder="e.g. alex-mercer or mongo-facet"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  className="border-0 bg-transparent px-0 text-xs focus-visible:ring-0 shadow-none"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Leave blank to generate an automatic short link code.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="size-4 text-purple-500" />
                <span>Built-in Engagement Analytics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Eye className="size-3 text-primary" />
                  <span>Visitor view counts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-primary" />
                  <span>Active dwell-time tracking</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer gap-2"
              >
                <LinkIcon className="size-4" />
                {isLoading ? 'Creating Link...' : 'Generate Short Link'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Your Branded Short URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={createdUrl}
                  className="font-mono text-xs bg-muted/50 cursor-text select-all"
                />
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className="gap-1.5 shrink-0 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer font-semibold"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            </div>

            {/* QR Code toggle */}
            <div className="flex items-center justify-between border-t border-border/50 pt-3">
              <span className="text-xs text-muted-foreground">Quick mobile sharing</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQr(!showQr)}
                className="gap-1.5 text-xs h-8 cursor-pointer"
              >
                <QrCode className="size-3.5" />
                <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
              </Button>
            </div>

            {showQr && (
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-border shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(createdUrl)}`}
                  alt="QR Code"
                  className="size-36 rounded-md"
                />
                <p className="text-[11px] text-gray-500 mt-2 font-mono">/s/{shortCode}</p>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button variant="default" onClick={handleClose} className="w-full font-semibold">
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
