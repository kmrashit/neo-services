import api from '@/api/api';
import type {
  LoginPayload,
  RegisterPayload,
  LoginResponseData,
  AuthApiResponse,
} from './types';

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const response = await api.post<AuthApiResponse<{ message: string; user?: any }>>(
      '/auth/register',
      payload,
    );
    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await api.post<AuthApiResponse<LoginResponseData>>(
      '/auth/login',
      payload,
    );
    return response.data;
  },

  refreshToken: async (token: string) => {
    const response = await api.get<AuthApiResponse<{ accessToken: string }>>(
      '/auth/refreshToken',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  logout: async (userId: string) => {
    const response = await api.get<AuthApiResponse<{ message: string }>>(
      `/auth/logout?userId=${encodeURIComponent(userId)}`,
    );
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get<AuthApiResponse<{ message: string }>>(
      `/auth/verifyEmail?token=${encodeURIComponent(token)}`,
    );
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post<AuthApiResponse<{ message: string }>>(
      '/auth/resendVerification',
      { email },
    );
    return response.data;
  },
};
