import api from '@/api/api';
import type {
  ISearchFilter,
  ISearchHistoryItem,
  IViewedProfileItem,
  IHrProfile,
  ISearchApiResponse,
} from './types';

export const hrApi = {
  searchCandidates: async (filter: ISearchFilter): Promise<ISearchApiResponse> => {
    const params: Record<string, string> = {};
    if (filter.searchKey) params.searchKey = filter.searchKey;
    if (filter.minExperience !== undefined && filter.minExperience > 0) {
      params.minExperience = String(filter.minExperience);
    }
    if (filter.skills && filter.skills.length > 0) {
      params.skills = filter.skills.join(',');
    }

    const response = await api.get<{ success: boolean; data: ISearchApiResponse }>(
      '/hr/search',
      {
        params,
        headers: {
          'x-checksum': 'dev-checksum',
        },
      }
    );

    return response.data?.data || { candidates: [], remainingCoins: 0 };
  },

  getSearchHistory: async (): Promise<ISearchHistoryItem[]> => {
    const response = await api.get<{ success: boolean; data: ISearchHistoryItem[] }>(
      '/hr/history/searches'
    );
    return response.data?.data || [];
  },

  getViewedProfiles: async (): Promise<IViewedProfileItem[]> => {
    const response = await api.get<{ success: boolean; data: IViewedProfileItem[] }>(
      '/hr/history/viewed-profiles'
    );
    return response.data?.data || [];
  },

  getHrProfile: async (userId: string): Promise<IHrProfile | null> => {
    const response = await api.get<{ success: boolean; data: IHrProfile }>(
      `/hr/profile/${userId}`
    );
    return response.data?.data || null;
  },

  upsertHrProfile: async (data: Partial<IHrProfile>): Promise<IHrProfile> => {
    const response = await api.post<{ success: boolean; data: IHrProfile }>(
      '/hr/profile',
      data
    );
    return response.data?.data;
  },

  watchAdReward: async (userId?: string): Promise<{ coins: number; message: string }> => {
    const headers: Record<string, string> = {
      'x-checksum': 'dev-checksum',
    };
    if (userId) {
      headers.userId = userId;
    }
    const response = await api.post<{ success: boolean; data: { coins: number; message: string } }>(
      '/user/watch-ad',
      {},
      { headers }
    );
    return response.data?.data || { coins: 10, message: 'Ad reward claimed' };
  },
};
