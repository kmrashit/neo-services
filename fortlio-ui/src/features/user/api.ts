import api from '@/api/api';
import type {
  UserProfile,
  UpdateUserPayload,
  WatchAdResponse,
  CreditCardPaymentPayload,
  UpgradeProResponse,
  PurchaseCoinsResponse,
  TokenUsageResponse,
  Role,
  Privilege,
  UserApiResponse,
} from './types';

export const userApi = {
  getUserById: async (userId: string) => {
    const response = await api.get<UserApiResponse<UserProfile>>(
      `/user/getUserById?userId=${encodeURIComponent(userId)}`,
    );
    return response.data;
  },

  updateUser: async (payload: UpdateUserPayload) => {
    const response = await api.put<UserApiResponse<UserProfile>>(
      '/user/updateUserById',
      payload,
    );
    return response.data;
  },

  watchAd: async (userId?: string) => {
    const headers: Record<string, string> = {
      // General dev/test checksum header to satisfy middleware
      'x-checksum': 'dev-checksum',
    };
    if (userId) {
      headers.userId = userId;
    }

    const response = await api.post<UserApiResponse<WatchAdResponse>>(
      '/user/watch-ad',
      {},
      { headers },
    );
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get<UserApiResponse<Role[]>>('/role/getRoles');
    return response.data;
  },

  getRolesWithPrivileges: async () => {
    const response = await api.get<UserApiResponse<{ data: Role[]; total: number }>>(
      '/role/getRolesWithPrivileges?page=1&pageSize=100',
    );
    return response.data;
  },

  getPrivileges: async () => {
    const response = await api.get<UserApiResponse<{ data: Privilege[]; total: number }>>(
      '/role/getPrivileges?page=1&pageSize=100',
    );
    return response.data;
  },

  purchaseCoins: async (payload: CreditCardPaymentPayload) => {
    const response = await api.post<UserApiResponse<PurchaseCoinsResponse>>(
      '/user/purchase-coins',
      payload,
    );
    return response.data;
  },

  upgradeToPro: async (payload: CreditCardPaymentPayload) => {
    const response = await api.post<UserApiResponse<UpgradeProResponse>>(
      '/user/upgrade-pro',
      payload,
    );
    return response.data;
  },

  toggleAiOptIn: async (isAiOptedIn: boolean) => {
    const response = await api.post<UserApiResponse<{ isAiOptedIn: boolean; message: string }>>(
      '/user/toggle-ai-optin',
      { isAiOptedIn },
    );
    return response.data;
  },

  getTokenUsage: async () => {
    const response = await api.get<UserApiResponse<TokenUsageResponse>>('/user/token-usage');
    return response.data;
  },
};
