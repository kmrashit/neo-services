import { useEffect, useRef } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { IChatMessage, IConnectionUser } from '../types';

interface ChatMessageListProps {
  messages: IChatMessage[];
  currentUserId?: string;
  otherUser?: IConnectionUser;
  loading: boolean;
}

export function ChatMessageList({
  messages,
  currentUserId,
  otherUser,
  loading,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-purple-600 mb-2" />
        <p className="text-sm">Loading message history...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <div className="size-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
          <MessageSquare className="size-7 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">
          No messages yet
        </h3>
        <p className="text-xs max-w-sm">
          Say hello to {otherUser?.fullName || 'your connection'} to start exchanging insights, opportunities, or collaboration plans!
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4 py-3">
      <div className="space-y-1">
        {messages.map((msg, index) => {
          const senderIdStr =
            typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
          const isCurrentUser = Boolean(
            currentUserId && String(senderIdStr) === String(currentUserId),
          );

          return (
            <ChatMessageBubble
              key={msg._id || `temp-${index}`}
              message={msg}
              isCurrentUser={isCurrentUser}
              senderName={!isCurrentUser ? otherUser?.fullName : undefined}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
