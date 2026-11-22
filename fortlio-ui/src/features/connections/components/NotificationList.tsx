import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  Users,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationList() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayedNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return <Users className="size-4 text-purple-600" />;
      case 'connection_accepted':
        return <CheckCircle2 className="size-4 text-emerald-500" />;
      case 'new_message':
        return <MessageSquare className="size-4 text-indigo-500" />;
      default:
        return <Sparkles className="size-4 text-amber-500" />;
    }
  };

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) {
      markAsRead(n._id);
    }
    if (n.type === 'connection_request' || n.type === 'connection_accepted') {
      navigate('/connections');
    } else if (n.type === 'new_message') {
      navigate('/chat');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-background p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600/20 text-purple-600 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-0.5">
                <Bell className="size-3 mr-1" />
                Activity & Alerts
              </Badge>
              {unreadCount > 0 && (
                <Badge className="bg-purple-600 text-white text-xs px-2 py-0.5 font-bold">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              Notification Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Stay informed about connection invitations, mutual acceptances, and direct messages from domain experts and recruiters.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="text-xs font-semibold border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer shrink-0"
            >
              <Check className="size-3.5 mr-1.5" />
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center justify-between gap-4">
        <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="all" className="text-xs font-semibold cursor-pointer">
              <span>All Notifications ({notifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs font-semibold cursor-pointer">
              <span>Unread ({unreadCount})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          Loading notifications...
        </div>
      ) : displayedNotifications.length > 0 ? (
        <div className="space-y-3">
          {displayedNotifications.map((n) => (
            <Card
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`hover:border-purple-500/40 hover:shadow-sm transition-all duration-200 cursor-pointer ${
                !n.isRead
                  ? 'bg-purple-500/5 border-purple-500/30'
                  : 'bg-card/90 border-border/80'
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm truncate ${!n.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      {!n.isRead && (
                        <span className="size-2 rounded-full bg-purple-600 shrink-0" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>

                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      <span>View details</span>
                      <ArrowRight className="size-3" />
                    </span>
                    {!n.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n._id);
                        }}
                        className="text-[11px] text-muted-foreground hover:text-foreground font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center flex flex-col items-center justify-center space-y-3 bg-muted/20">
          <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Bell className="size-6" />
          </div>
          <h3 className="font-bold text-base text-foreground">
            {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications Yet'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            {filter === 'unread'
              ? 'You are caught up with all your latest messages and invitations!'
              : 'As you interact with peers, recruiters, and teams, your updates will show up here.'}
          </p>
        </div>
      )}
    </div>
  );
}
