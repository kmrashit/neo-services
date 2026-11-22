import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveConversation } from '../hooks/useActiveConversation';
import { useChatMessages } from '../hooks/useChatMessages';
import { ChatConversationList } from './ChatConversationList';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputBar } from './ChatInputBar';

export function ChatContainer() {
  const { user } = useAuth();
  const currentUserId = user?.id || (user as { _id?: string })?._id;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialConnectionId = searchParams.get('connectionId');

  const {
    connections,
    activeConnection,
    activeConnectionId,
    setActiveConnectionId,
    searchQuery,
    setSearchQuery,
    loading: connectionsLoading,
    getOtherUser,
  } = useActiveConversation(initialConnectionId, currentUserId);

  const {
    messages,
    loading: messagesLoading,
    sending,
    isConnected,
    sendMessage,
  } = useChatMessages({
    connectionId: activeConnectionId || undefined,
    currentUserId,
  });

  // Mobile responsiveness: toggle conversation drawer on small screens
  const [showMobileList, setShowMobileList] = useState(!initialConnectionId);

  const handleSelectConnection = (id: string) => {
    setActiveConnectionId(id);
    setSearchParams({ connectionId: id });
    setShowMobileList(false);
  };

  const otherUser = activeConnection ? getOtherUser(activeConnection) : undefined;

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
    <Card className="h-[calc(100vh-140px)] min-h-[500px] flex overflow-hidden border-border shadow-sm rounded-2xl bg-card">
      {/* Left Sidebar: Conversations List */}
      <div
        className={`${
          showMobileList ? 'flex' : 'hidden'
        } md:flex flex-col w-full md:w-80 lg:w-96 shrink-0 h-full`}
      >
        <ChatConversationList
          connections={connections}
          activeConnectionId={activeConnectionId}
          onSelectConnection={handleSelectConnection}
          getOtherUser={getOtherUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          loading={connectionsLoading}
        />
      </div>

      {/* Right Pane: Active Chat */}
      <div
        className={`${
          !showMobileList ? 'flex' : 'hidden'
        } md:flex flex-col flex-1 h-full bg-background/50 overflow-hidden`}
      >
        {activeConnection && otherUser ? (
          <>
            {/* Active Chat Header */}
            <div className="h-16 px-4 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden size-9 shrink-0 text-muted-foreground"
                >
                  <ArrowLeft className="size-5" />
                </Button>

                <Avatar className="size-10 shrink-0 border border-border/80">
                  <AvatarImage src={otherUser.avatarUrl} alt={otherUser.fullName} />
                  <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-bold">
                    {getInitials(otherUser.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground truncate">
                      {otherUser.fullName}
                    </h3>
                    {otherUser.profession && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                        {otherUser.profession}
                      </Badge>
                    )}
                  </div>
                  {otherUser.headline && (
                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {otherUser.headline}
                    </p>
                  )}
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2 py-0.5 gap-1.5 font-normal ${
                    isConnected
                      ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      : 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <Wifi className="size-3" />
                      <span className="hidden sm:inline">Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="size-3" />
                      <span className="hidden sm:inline">Connecting</span>
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {/* Message Stream */}
            <ChatMessageList
              messages={messages}
              currentUserId={currentUserId}
              otherUser={otherUser}
              loading={messagesLoading}
            />

            {/* Input Bar */}
            <ChatInputBar
              onSendMessage={sendMessage}
              sending={sending}
              disabled={!activeConnectionId}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <ArrowLeft className="size-8 text-muted-foreground/60 hidden md:inline" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              Select a conversation
            </h3>
            <p className="text-xs max-w-sm">
              Choose a connection from the list on the left to view messages and collaborate directly.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
