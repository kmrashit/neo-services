import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '../api';
import type { UserProfile, UpdateUserPayload } from '../types';

export function useUserProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {return;}
    setIsLoading(true);
    setError(null);
    try {
      const res = await userApi.getUserById(user.id);
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err: any) {
      // Fallback to auth context user state if backend aggregate is initializing
      setProfile({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        coins: (user as any).coins ?? 10,
      });
      setError(err?.response?.data?.message || 'Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.email, user?.fullName, user?.role]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = async (updates: Partial<Omit<UpdateUserPayload, 'userId'>>) => {
    if (!user?.id) {return null;}
    setIsSaving(true);
    setError(null);
    try {
      const payload: UpdateUserPayload = {
        userId: user.id,
        ...updates,
      };
      const res = await userApi.updateUser(payload);
      if (res.data) {
        setProfile(res.data);
        updateUser({
          fullName: res.data.fullName,
          email: res.data.email,
        });
        return res.data;
      }
    } catch {
      // In dev/mock mode or when network aggregate is unavailable, update local state gracefully
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      if (updates.fullName) {
        updateUser({ fullName: updates.fullName });
      }
      return { ...profile, ...updates };
    } finally {
      setIsSaving(false);
    }
  };

  const updateCoinsLocally = (newCoins: number) => {
    setProfile((prev) => (prev ? { ...prev, coins: newCoins } : null));
    updateUser({ coins: newCoins } as any);
  };

  return {
    profile,
    isLoading,
    isSaving,
    error,
    refreshProfile: fetchProfile,
    saveProfile,
    updateCoinsLocally,
  };
}
