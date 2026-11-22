import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Inbox,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  ConnectionTabsList,
  useConnections,
  useConnectionActions,
} from '@/features/connections';

export default function ConnectionsList() {
  const { user } = useAuth();
  const currentUserId = user?.id || (user as any)?._id || (user as any)?.userId;

  const {
    connections,
    activeConnections,
    pendingReceived,
    pendingSent,
    refresh,
  } = useConnections(currentUserId);

  const { respondToRequest, actionLoading } = useConnectionActions(refresh);

  const handleAccept = async (id: string) => {
    await respondToRequest(id, 'accept');
  };

  const handleReject = async (id: string) => {
    await respondToRequest(id, 'reject');
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-background p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600/20 text-purple-600 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-0.5">
                <Users className="size-3 mr-1" />
                Universal Professional Network
              </Badge>
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-mono">
                Direct Networking
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              Connections & Network
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect and collaborate with verified professionals across engineering, medicine, law, design, science, and leadership disciplines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/candidates">
              <Button
                size="sm"
                className="h-10 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold cursor-pointer shadow-md"
              >
                <UserPlus className="size-4 mr-1.5" />
                <span>Find Professionals</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/80 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Connected Peers
            </span>
            <UserCheck className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {activeConnections.length}
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Pending Invitations
            </span>
            <Inbox className="size-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2 flex items-center gap-2">
            <span>{pendingReceived.length}</span>
            {pendingReceived.length > 0 && (
              <Badge className="bg-purple-600 text-white text-[10px] py-0 px-1.5">
                Action Required
              </Badge>
            )}
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Outgoing Requests
            </span>
            <Sparkles className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-2">
            {pendingSent.length}
          </div>
        </Card>
      </div>

      {/* Main Tabs List */}
      <ConnectionTabsList
        connections={connections}
        activeConnections={activeConnections}
        pendingReceived={pendingReceived}
        pendingSent={pendingSent}
        currentUserId={currentUserId}
        onAccept={handleAccept}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </div>
  );
}
