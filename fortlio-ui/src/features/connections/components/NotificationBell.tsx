import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Users,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return <Users className="size-3.5 text-purple-600" />;
      case 'connection_accepted':
        return <CheckCircle2 className="size-3.5 text-emerald-500" />;
      case 'new_message':
        return <MessageSquare className="size-3.5 text-indigo-500" />;
      default:
        return <Sparkles className="size-3.5 text-amber-500" />;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-9 rounded-xl text-muted-foreground hover:text-foreground relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-purple-600 ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 shadow-xl">
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-purple-600/10 text-purple-600 border-purple-500/20 text-[10px] px-1.5 py-0">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              className="text-[11px] text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Check className="size-3" />
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="max-h-[300px] overflow-y-auto space-y-1 py-1">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((n) => (
              <DropdownMenuItem
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`p-2 rounded-lg cursor-pointer flex items-start gap-2.5 transition-colors ${
                  !n.isRead ? 'bg-purple-500/5 hover:bg-purple-500/10' : 'hover:bg-muted/60'
                }`}
              >
                <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs truncate ${!n.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="size-1.5 rounded-full bg-purple-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{n.message}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No notifications at this time
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        <Link to="/notifications" className="block w-full">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-500/10 justify-between cursor-pointer h-8"
          >
            <span>View All Notifications</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
