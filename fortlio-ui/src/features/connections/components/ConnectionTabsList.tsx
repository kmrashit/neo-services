import { useState } from 'react';
import {
  Users,
  UserCheck,
  Inbox,
  Send,
  Search,
  Sparkles,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConnectionCard } from './ConnectionCard';
import type { IConnection, IConnectionUser } from '../types';

interface ConnectionTabsListProps {
  connections: IConnection[];
  activeConnections: IConnection[];
  pendingReceived: IConnection[];
  pendingSent: IConnection[];
  currentUserId?: string;
  onAccept: (connectionId: string) => void;
  onReject: (connectionId: string) => void;
  actionLoading?: boolean;
}

export function ConnectionTabsList({
  connections,
  activeConnections,
  pendingReceived,
  pendingSent,
  currentUserId,
  onAccept,
  onReject,
  actionLoading = false,
}: ConnectionTabsListProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'received' | 'sent' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const filterConnections = (list: IConnection[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((c) => {
      const getTargetUserId = (target: any): string => {
        if (!target) return '';
        if (typeof target === 'string') return target;
        return target._id || '';
      };
      const isSender = currentUserId ? getTargetUserId(c.senderId) === currentUserId : false;
      const otherUser = (isSender ? c.receiverId : c.senderId) as IConnectionUser;
      const name = typeof otherUser === 'object' && otherUser?.fullName ? otherUser.fullName.toLowerCase() : '';
      const headline = typeof otherUser === 'object' && otherUser?.headline ? otherUser.headline.toLowerCase() : '';
      const profession = typeof otherUser === 'object' && otherUser?.profession ? otherUser.profession.toLowerCase() : '';
      const skills = typeof otherUser === 'object' && Array.isArray(otherUser?.skills)
        ? otherUser.skills.map((s) => s.toLowerCase()).join(' ')
        : '';

      return name.includes(q) || headline.includes(q) || profession.includes(q) || skills.includes(q);
    });
  };

  const filteredActive = filterConnections(activeConnections);
  const filteredReceived = filterConnections(pendingReceived);
  const filteredSent = filterConnections(pendingSent);
  const filteredAll = filterConnections(connections);

  const renderEmptyState = (title: string, subtitle: string, icon: React.ReactNode) => (
    <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center flex flex-col items-center justify-center space-y-3 bg-muted/20">
      <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-bold text-base text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full sm:w-auto">
          <TabsList className="bg-muted/60 p-1 w-full sm:w-auto">
            <TabsTrigger value="active" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <UserCheck className="size-3.5 text-emerald-500" />
              <span>Connected</span>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 ml-1">
                {activeConnections.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="received" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Inbox className="size-3.5 text-purple-600" />
              <span>Invitations</span>
              {pendingReceived.length > 0 && (
                <Badge className="bg-purple-600 text-white text-[10px] py-0 px-1.5 ml-1 animate-pulse">
                  {pendingReceived.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="sent" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Send className="size-3.5 text-amber-500" />
              <span>Pending Sent</span>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 ml-1">
                {pendingSent.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="all" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Users className="size-3.5" />
              <span>All ({connections.length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, headline, skill..."
            className="pl-9 text-xs h-9 bg-card"
          />
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === 'active' && (
        filteredActive.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActive.map((conn) => (
              <ConnectionCard
                key={conn._id}
                connection={conn}
                currentUserId={currentUserId}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        ) : (
          renderEmptyState(
            'No Active Connections Yet',
            'Connect with verified candidates, specialized professionals, and recruiters across the platform.',
            <Users className="size-6" />
          )
        )
      )}

      {activeTab === 'received' && (
        filteredReceived.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReceived.map((conn) => (
              <ConnectionCard
                key={conn._id}
                connection={conn}
                currentUserId={currentUserId}
                onAccept={onAccept}
                onReject={onReject}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        ) : (
          renderEmptyState(
            'No Pending Invitations',
            'You are all caught up! New connection requests from candidates and recruiters will appear here.',
            <Inbox className="size-6" />
          )
        )
      )}

      {activeTab === 'sent' && (
        filteredSent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSent.map((conn) => (
              <ConnectionCard
                key={conn._id}
                connection={conn}
                currentUserId={currentUserId}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        ) : (
          renderEmptyState(
            'No Outgoing Requests Pending',
            'Explore candidate portfolios and recruiter openings to initiate collaborative connections.',
            <Sparkles className="size-6" />
          )
        )
      )}

      {activeTab === 'all' && (
        filteredAll.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAll.map((conn) => (
              <ConnectionCard
                key={conn._id}
                connection={conn}
                currentUserId={currentUserId}
                onAccept={onAccept}
                onReject={onReject}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        ) : (
          renderEmptyState(
            'No Connections Record Found',
            'Start your professional network on Fortlio by reaching out to peers and talent in your industry.',
            <Users className="size-6" />
          )
        )
      )}
    </div>
  );
}
