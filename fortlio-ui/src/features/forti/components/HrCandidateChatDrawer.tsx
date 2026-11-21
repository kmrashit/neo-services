import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, Sparkles, User, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SuggestedQuestionsList } from './SuggestedQuestionsList';
import { useCandidateAiChat } from '../hooks/useCandidateAiChat';

interface HrCandidateChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  candidateName?: string;
  candidateHeadline?: string;
}

export function HrCandidateChatDrawer({
  isOpen,
  onClose,
  userId,
  candidateName = 'Alex Mercer',
  candidateHeadline = 'Staff Systems Engineer & Distributed Architect',
}: HrCandidateChatDrawerProps) {
  const {
    messages,
    inputQuestion,
    setInputQuestion,
    sendMessage,
    isStreaming,
    clearChat,
  } = useCandidateAiChat(userId, candidateName);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex flex-col h-full sm:max-w-md md:max-w-lg p-0">
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                <Bot className="size-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold flex items-center gap-1.5">
                  Chat with Candidate Profile
                  <Badge variant="outline" className="text-[10px] gap-1 border-purple-500/30 text-purple-600 dark:text-purple-400">
                    <Sparkles className="size-2.5 text-purple-500" />
                    Forti AI
                  </Badge>
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground truncate max-w-xs">
                  {candidateName} • {candidateHeadline}
                </SheetDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              title="Reset conversation"
              className="size-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="size-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="size-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-br-xs'
                      : 'bg-muted/70 border border-border/60 text-foreground rounded-bl-xs'
                  }`}
                >
                  {isUser ? (
                    <p>{msg.content}</p>
                  ) : (
                    <div className="prose dark:prose-invert text-xs max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || '...'}
                      </ReactMarkdown>
                    </div>
                  )}

                  {msg.timestamp && (
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isUser ? 'text-white/70' : 'text-muted-foreground'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <User className="size-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-medium pl-9">
              <Sparkles className="size-3.5 animate-spin" />
              <span>Forti AI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer with Suggested Questions & Input */}
        <SheetFooter className="p-4 border-t border-border/60 bg-card space-y-3 block">
          <SuggestedQuestionsList
            onSelectQuestion={(q) => sendMessage(q)}
            disabled={isStreaming}
          />

          <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
            <Input
              placeholder={`Ask anything about ${candidateName.split(' ')[0]}'s experience or blogs...`}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isStreaming}
              className="text-xs h-9 rounded-xl"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isStreaming || !inputQuestion.trim()}
              className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer shrink-0"
            >
              <Send className="size-3.5" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
