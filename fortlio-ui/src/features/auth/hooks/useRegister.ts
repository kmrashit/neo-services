import { useState } from 'react';
import { authApi } from '../api';
import type { RegisterPayload } from '../types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const executeRegister = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await authApi.register(payload);
      const msg =
        response.data?.message ||
        response.message ||
        'Account created successfully! Please check your email to verify your account.';
      setSuccessMessage(msg);
      return true;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register: executeRegister,
    isLoading,
    error,
    successMessage,
    setError,
    setSuccessMessage,
  };
}
