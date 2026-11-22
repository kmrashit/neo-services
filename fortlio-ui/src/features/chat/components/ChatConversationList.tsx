import { Search, UserCheck, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { IConnection, IConnectionUser } from '../types';

interface ChatConversationListProps {
  connections: IConnection[];
  activeConnectionId: string | null;
  onSelectConnection: (id: string) => void;
  getOtherUser: (conn: IConnection) => IConnectionUser;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
}

export function ChatConversationList({
  connections,
  activeConnectionId,
  onSelectConnection,
  getOtherUser,
  searchQuery,
  onSearchChange,
  loading,
}: ChatConversationListProps) {
  const getInitials = (name?: string) => {
    if (!name) {
      return 'U';
    }
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full border-r border-border bg-card/40">
      {/* Search Header */}
      <div className="p-3.5 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="size-4 text-purple-600 dark:text-purple-400" />
            <span>Messages</span>
          </h2>
          <Badge variant="outline" className="text-[11px] font-mono px-1.5 py-0">
            {connections.length} {connections.length === 1 ? 'chat' : 'chats'}
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search contacts..."
            className="pl-9 h-9 text-xs bg-background rounded-lg focus-visible:ring-purple-500"
          />
        </div>
      </div>

      {/* Conversations Stream */}
      <ScrollArea className="flex-1">
        {loading && connections.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            Loading conversations...
          </div>
        ) : connections.length === 0 ? (
          <div className="p-6 text-center space-y-2 text-muted-foreground">
            <UserCheck className="size-8 mx-auto text-muted-foreground/50" />
            <p className="text-xs font-medium">No active connections found</p>
            <p className="text-[11px] text-muted-foreground/80">
              {searchQuery ? 'Try matching another name or skill' : 'Connect with peers on the platform to start chatting.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {connections.map((conn) => {
              const other = getOtherUser(conn);
              const isActive = conn._id === activeConnectionId;

              return (
                <button
                  key={conn._id}
                  onClick={() => onSelectConnection(conn._id)}
                  className={cn(
                    'w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-accent/50',
                    isActive && 'bg-purple-500/10 dark:bg-purple-950/30 border-l-3 border-purple-600',
                  )}
                >
                  <Avatar className="size-10 shrink-0 border border-border/60">
                    <AvatarImage src={other.avatarUrl} alt={other.fullName} />
                    <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-bold">
                      {getInitials(other.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={cn('text-sm font-semibold truncate', isActive ? 'text-purple-600 dark:text-purple-400' : 'text-foreground')}>
                        {other.fullName || 'Anonymous'}
                      </h4>
                    </div>

                    {other.profession && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal text-muted-foreground mb-1">
                        {other.profession}
                      </Badge>
                    )}

                    <p className="text-xs text-muted-foreground truncate">
                      {other.headline || conn.message || 'Click to open conversation'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
