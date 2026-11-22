import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  UserPlus,
  Mail,
  Phone,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@/features/connections';
import type { ICandidateSearchResult } from '../types';

interface CandidateResultCardProps {
  candidate: ICandidateSearchResult;
  onOpenChat?: (candidate: ICandidateSearchResult) => void;
  onConnect?: (candidate: ICandidateSearchResult) => void;
}

export const CandidateResultCard: React.FC<CandidateResultCardProps> = ({
  candidate,
  onOpenChat,
  onConnect,
}) => {
  const initials = candidate.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="flex flex-col justify-between hover:border-purple-500/50 hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm group border-border/80">
      <CardHeader className="p-5 pb-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-purple-500/20">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground group-hover:text-purple-600 transition-colors">
                  {candidate.fullName}
                </h3>
                <span title="Verified Portfolio">
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                {candidate.headline || candidate.profession}
              </p>
            </div>
          </div>

          {candidate.profession && (
            <Badge variant="secondary" className="text-[10px] font-semibold shrink-0">
              {candidate.profession}
            </Badge>
          )}
        </div>

        {/* Experience & Location row */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
          {candidate.experience !== undefined && (
            <span className="flex items-center gap-1.5 font-medium">
              <Briefcase className="size-3.5 text-purple-500" />
              {candidate.experience} yrs experience
            </span>
          )}
          {candidate.location && (
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="size-3.5 text-indigo-500" />
              {candidate.location}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {candidate.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {candidate.bio}
          </p>
        )}

        {/* Forti AI Velocity & Trajectory Pill */}
        {candidate.learningVelocityScore && (
          <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
              <Sparkles className="size-3.5 text-purple-600 animate-pulse" />
              Forti Velocity: {candidate.learningVelocityScore}/100
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Authentic Trajectory Verified
            </span>
          </div>
        )}

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {candidate.skills?.slice(0, 5).map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="text-[11px] font-medium py-0.5 px-2 bg-muted/40 hover:bg-muted"
            >
              {skill}
            </Badge>
          ))}
          {candidate.skills && candidate.skills.length > 5 && (
            <span className="text-[10px] font-medium text-muted-foreground self-center">
              +{candidate.skills.length - 5} more
            </span>
          )}
        </div>

        {/* Masked Contact Info */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Mail className="size-3 text-muted-foreground/70" />
            {candidate.email || '***@fortlio.dev'}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="size-3 text-muted-foreground/70" />
            {candidate.mobileNumber || '+1 (***) ***-****'}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-border/40 mt-2">
        <Link
          to={`/candidate-profile?candidateId=${candidate.userId || candidate.id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-semibold hover:border-purple-500 hover:text-purple-600 cursor-pointer"
          >
            <ExternalLink className="size-3.5 mr-1.5" />
            View Portfolio
          </Button>
        </Link>

        {onOpenChat && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChat(candidate)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 cursor-pointer shrink-0"
            title="Chat with profile using Forti AI"
          >
            <MessageSquare className="size-3.5 mr-1" />
            AI Chat
          </Button>
        )}

        {onConnect ? (
          <Button
            size="sm"
            onClick={() => onConnect(candidate)}
            className="text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shrink-0"
          >
            <UserPlus className="size-3.5 mr-1" />
            Connect
          </Button>
        ) : (
          <ConnectButton
            receiverId={candidate.userId || candidate.id}
            receiverName={candidate.fullName}
          />
        )}
      </CardFooter>
    </Card>
  );
};
