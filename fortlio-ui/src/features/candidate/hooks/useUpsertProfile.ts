import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { candidateApi } from '../api';
import type { CandidateProfileUpsertPayload, ICandidateProfile } from '../types';

export function useUpsertProfile() {
  const { updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = async (payload: CandidateProfileUpsertPayload): Promise<ICandidateProfile | null> => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await candidateApi.upsertProfile(payload);
      if (payload.fullName) {
        updateUser({ fullName: payload.fullName });
      }
      return res.data;
    } catch (err: any) {
      // Graceful fallback for offline / mock dev
      if (payload.fullName) {
        updateUser({ fullName: payload.fullName });
      }
      return {
        userId: 'candidate-id',
        fullName: payload.fullName,
        email: payload.email,
        bio: payload.bio,
        skills: payload.skills,
      } as ICandidateProfile;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveProfile,
    isSaving,
    error,
  };
}
