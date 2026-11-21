import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Share2,
  Edit3,
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ICandidateProfile } from '../types';

interface CandidateProfileCardProps {
  profile: ICandidateProfile;
  isEditable?: boolean;
}

export const CandidateProfileCard: React.FC<CandidateProfileCardProps> = ({
  profile,
  isEditable = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const initial = (profile.fullName || 'Candidate').charAt(0).toUpperCase();

  return (
    <Card className="overflow-hidden border border-border/80 shadow-md bg-card/90">
      {/* Banner Backdrop */}
      <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 relative">
        <div className="absolute inset-0 bg-radial from-white/10 to-transparent" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Badge className="bg-background/80 text-foreground backdrop-blur-md border border-border/60 text-xs py-1 px-3">
            <CheckCircle2 className="size-3 text-purple-600 dark:text-purple-400 mr-1.5" />
            <span>Verified Candidate</span>
          </Badge>
        </div>
      </div>

      <CardContent className="px-6 pb-6 pt-0 relative">
        {/* Avatar + Main Details Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-5">
          <div className="flex items-end gap-4">
            <div className="size-28 sm:size-32 rounded-2xl border-4 border-card bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-xl">
              {initial}
            </div>

            <div className="space-y-1 pb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {profile.fullName}
              </h1>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {profile.headline || 'Professional Specialist'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                <span>{profile.location || 'Location Not Specified'}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShare}
              className="gap-1.5 text-xs font-semibold rounded-xl h-9 cursor-pointer"
            >
              {copied ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
              <span>{copied ? 'Link Copied' : 'Share Profile'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 text-xs font-semibold rounded-xl h-9 cursor-pointer"
            >
              <Link to="/editor">
                <Download className="size-4" />
                <span>PDF Resume</span>
              </Link>
            </Button>

            {isEditable && (
              <Button
                size="sm"
                asChild
                className="gap-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-9 cursor-pointer shadow-sm"
              >
                <Link to="/edit-profile">
                  <Edit3 className="size-4" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl mb-5">
            {profile.bio}
          </p>
        )}

        {/* Contact Info Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
          {profile.email && (
            <div className="flex items-center gap-1.5 bg-muted/50 py-1 px-2.5 rounded-lg border border-border/50">
              <Mail className="size-3.5 text-primary" />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.mobileNumber && (
            <div className="flex items-center gap-1.5 bg-muted/50 py-1 px-2.5 rounded-lg border border-border/50">
              <Phone className="size-3.5 text-primary" />
              <span>{profile.mobileNumber}</span>
            </div>
          )}
          {profile.social?.website && (
            <a
              href={profile.social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-muted/50 hover:bg-accent py-1 px-2.5 rounded-lg border border-border/50 transition-colors"
            >
              <Globe className="size-3.5 text-primary" />
              <span>Portfolio Website</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
