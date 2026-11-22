import { useState, type KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputBarProps {
  onSendMessage: (text: string) => Promise<void> | void;
  disabled?: boolean;
  sending?: boolean;
}

export function ChatInputBar({ onSendMessage, disabled, sending }: ChatInputBarProps) {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim() || disabled || sending) {
      return;
    }
    const value = text;
    setText('');
    try {
      await onSendMessage(value);
    } catch {
      setText(value); // Restore text on failure
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-border bg-card/60 backdrop-blur-sm flex items-center gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Press Enter to send)"
        disabled={disabled || sending}
        className="flex-1 h-11 bg-background text-sm rounded-xl focus-visible:ring-purple-500"
      />
      <Button
        onClick={handleSend}
        disabled={!text.trim() || disabled || sending}
        size="icon"
        className="size-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shrink-0 cursor-pointer shadow-sm transition-all"
      >
        {sending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Send className="size-5" />
        )}
      </Button>
    </div>
  );
}
