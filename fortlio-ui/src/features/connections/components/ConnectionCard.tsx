import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Check,
  X,
  Clock,
  Sparkles,
  Building,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IConnection, IConnectionUser } from '../types';

interface ConnectionCardProps {
  connection: IConnection;
  currentUserId?: string;
  onAccept?: (connectionId: string) => void;
  onReject?: (connectionId: string) => void;
  actionLoading?: boolean;
}

export function ConnectionCard({
  connection,
  currentUserId,
  onAccept,
  onReject,
  actionLoading = false,
}: ConnectionCardProps) {
  const navigate = useNavigate();

  const getTargetUserId = (target: any): string => {
    if (!target) return '';
    if (typeof target === 'string') return target;
    return target._id || '';
  };

  const senderIdStr = getTargetUserId(connection.senderId);
  const isSender = currentUserId ? senderIdStr === currentUserId : false;

  const otherUserObj: IConnectionUser = (isSender ? connection.receiverId : connection.senderId) as IConnectionUser;
  const otherName = (typeof otherUserObj === 'object' && otherUserObj?.fullName) ? otherUserObj.fullName : 'Connected Professional';
  const otherHeadline = (typeof otherUserObj === 'object' && otherUserObj?.headline) ? otherUserObj.headline : 'Verified Fortlio Specialist';
  const otherProfession = (typeof otherUserObj === 'object' && otherUserObj?.profession) ? otherUserObj.profession : 'Engineering & Technology';
  const otherSkills = (typeof otherUserObj === 'object' && Array.isArray(otherUserObj?.skills)) ? otherUserObj.skills : [];
  const otherInitial = otherName.charAt(0).toUpperCase();

  const isAccepted = connection.status === 'accepted';
  const isPending = connection.status === 'pending';

  return (
    <Card className="hover:border-purple-500/40 hover:shadow-md transition-all duration-200 bg-card/90 backdrop-blur-sm border-border/80">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* Top: Avatar and Profile Info */}
        <div className="flex items-start gap-3.5">
          <Avatar className="size-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shrink-0 shadow-sm">
            <AvatarFallback className="bg-transparent text-white font-bold text-sm">
              {otherInitial}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-sm text-foreground truncate hover:text-purple-600 transition-colors">
                {otherName}
              </h3>
              {isAccepted && (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] font-bold py-0 shrink-0">
                  <Check className="size-3 mr-1" />
                  Connected
                </Badge>
              )}
              {isPending && isSender && (
                <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold py-0 shrink-0">
                  <Clock className="size-3 mr-1" />
                  Request Sent
                </Badge>
              )}
              {isPending && !isSender && (
                <Badge className="bg-purple-600/10 text-purple-600 border-purple-500/30 text-[10px] font-bold py-0 shrink-0">
                  <Sparkles className="size-3 mr-1" />
                  Invited You
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground truncate">{otherHeadline}</p>

            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building className="size-3 text-purple-500" />
                {otherProfession}
              </span>
            </div>
          </div>
        </div>

        {/* Note if provided */}
        {connection.message && (
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs text-muted-foreground italic line-clamp-2">
            "{connection.message}"
          </div>
        )}

        {/* Skills Pills */}
        {otherSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {otherSkills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-[10px] py-0 px-1.5 font-normal bg-muted/20">
                {skill}
              </Badge>
            ))}
            {otherSkills.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{otherSkills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
          {isAccepted ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/chat?connectionId=${connection._id}`)}
              className="w-full text-xs font-semibold text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10 cursor-pointer"
            >
              <MessageSquare className="size-3.5 mr-1.5" />
              <span>Direct Message</span>
            </Button>
          ) : isPending && !isSender ? (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                size="sm"
                disabled={actionLoading}
                onClick={() => onAccept && onAccept(connection._id)}
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Check className="size-3.5 mr-1" />
                <span>Accept</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={actionLoading}
                onClick={() => onReject && onReject(connection._id)}
                className="text-xs font-semibold text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 cursor-pointer"
              >
                <X className="size-3.5 mr-1" />
                <span>Decline</span>
              </Button>
            </div>
          ) : (
            <div className="w-full text-center py-1">
              <span className="text-xs text-muted-foreground font-mono flex items-center justify-center gap-1.5">
                <Clock className="size-3 text-amber-500" />
                Awaiting Recipient Response
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
