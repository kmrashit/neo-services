import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '../api';
import type { LoginPayload } from '../types';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogin = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(payload);
      const data = response.data;

      if (!data?.accessToken) {
        throw new Error('Authentication failed: Missing access token');
      }

      const user = {
        id: data.user?._id || data.user?.id || '',
        email: data.user?.email || payload.email,
        fullName: data.user?.fullName || '',
        roleId: data.user?.roleId,
        isOnboarded: data.user?.isOnboarded ?? false,
      };

      login(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        user
      );

      navigate('/candidate-profile', { replace: true });
      return true;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to log in. Please check your credentials.';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login: executeLogin,
    isLoading,
    error,
    setError,
  };
}
