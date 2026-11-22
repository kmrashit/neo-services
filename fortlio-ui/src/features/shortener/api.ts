import api from '@/api/api';
import type {
  CreateShortLinkPayload,
  DwellTimePayload,
  ILinkAnalytics,
  MyLinksResponse,
  IShortLink,
} from './types';

export const shortenerApi = {
  createShortUrl: async (payload: CreateShortLinkPayload) => {
    const response = await api.post<{ success: boolean; data: { shortCode: string; originalUrl: string; link: IShortLink } }>(
      '/services/shorten/shortIt',
      payload,
    );
    return response.data;
  },

  createShortUrlByGuest: async (payload: CreateShortLinkPayload) => {
    const response = await api.post<{ success: boolean; data: { shortCode: string; originalUrl: string } }>(
      '/services/shorten/shortItByGuest',
      payload,
    );
    return response.data;
  },

  recordDwellTime: async (payload: DwellTimePayload) => {
    const response = await api.post<{ success: boolean; data: { recorded: boolean } }>(
      '/services/shorten/analytics/dwell-time',
      payload,
    );
    return response.data;
  },

  getLinkAnalytics: async (shortCode: string) => {
    const response = await api.get<{ success: boolean; data: ILinkAnalytics }>(
      `/services/shorten/analytics/${shortCode}`,
    );
    return response.data;
  },

  getMyLinks: async () => {
    const response = await api.get<{ success: boolean; data: MyLinksResponse }>(
      '/services/shorten/my-links',
    );
    return response.data;
  },

  checkAvailability: async (alias: string) => {
    const response = await api.get<{ success: boolean; data: { isAvailable: boolean } }>(
      `/services/shorten/isAvailable?alias=${encodeURIComponent(alias)}`,
    );
    return response.data;
  },
};
