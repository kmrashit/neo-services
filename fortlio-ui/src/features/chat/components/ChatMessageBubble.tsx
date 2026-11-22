import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: IChatMessage;
  isCurrentUser: boolean;
  senderName?: string;
}

export function ChatMessageBubble({ message, isCurrentUser, senderName }: ChatMessageBubbleProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'flex w-full my-1.5',
        isCurrentUser ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'max-w-[80%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm text-sm break-words transition-all',
          isCurrentUser
            ? 'bg-purple-600 text-white rounded-br-sm shadow-purple-600/10'
            : 'bg-muted/80 text-foreground rounded-bl-sm border border-border/40',
        )}
      >
        {!isCurrentUser && senderName && (
          <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mb-1">
            {senderName}
          </p>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-1 text-[10px]',
            isCurrentUser ? 'text-white/80' : 'text-muted-foreground',
          )}
        >
          <span>{formattedTime}</span>
          {isCurrentUser && (
            <span>
              {message.readAt ? (
                <CheckCheck className="size-3 text-white" />
              ) : (
                <Check className="size-3 text-white/80" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
