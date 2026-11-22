import { useState } from 'react';
import { UserPlus, Clock, Check, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useConnectionActions } from '../hooks/useConnectionActions';

interface ConnectButtonProps {
  receiverId: string;
  receiverName?: string;
  initialStatus?: 'none' | 'pending' | 'accepted';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onConnected?: () => void;
}

export function ConnectButton({
  receiverId,
  receiverName = 'Specialist',
  initialStatus = 'none',
  size = 'sm',
  className = '',
  onConnected,
}: ConnectButtonProps) {
  const [status, setStatus] = useState<'none' | 'pending' | 'accepted'>(initialStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { sendRequest, actionLoading, error } = useConnectionActions();

  const handleSend = async () => {
    try {
      await sendRequest(receiverId, message);
      setStatus('pending');
      setDialogOpen(false);
      setMessage('');
      if (onConnected) onConnected();
    } catch {
      // Error handled by hook
    }
  };

  if (status === 'accepted') {
    return (
      <Button
        size={size}
        variant="outline"
        disabled
        className={`text-xs font-semibold text-emerald-600 border-emerald-500/30 bg-emerald-500/10 ${className}`}
      >
        <Check className="size-3.5 mr-1" />
        <span>Connected</span>
      </Button>
    );
  }

  if (status === 'pending') {
    return (
      <Button
        size={size}
        variant="outline"
        disabled
        className={`text-xs font-semibold text-amber-600 border-amber-500/30 bg-amber-500/10 ${className}`}
      >
        <Clock className="size-3.5 mr-1 animate-pulse" />
        <span>Pending</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        size={size}
        onClick={() => setDialogOpen(true)}
        className={`text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer ${className}`}
      >
        <UserPlus className="size-3.5 mr-1" />
        <span>Connect</span>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Connect with {receiverName}</DialogTitle>
            <DialogDescription className="text-xs">
              Send an invitation request to expand your professional network and initiate collaboration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Personal Note (Optional)
              </label>
              <Textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I came across your portfolio showcase and would love to connect..."
                className="text-xs"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={actionLoading}
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="size-3.5 mr-1" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
