import api from '@/api/api';
import type { IConnection, INotification } from './types';

export const connectionsApi = {
  getConnections: async (status?: string): Promise<IConnection[]> => {
    const params: Record<string, string> = {};
    if (status && status !== 'all') {
      params.status = status;
    }
    const response = await api.get<{ success: boolean; data: any }>(
      '/connections/list',
      { params },
    );
    const rawData = response.data?.data;
    return Array.isArray(rawData) ? rawData : (rawData?.data || []);
  },

  createConnection: async (receiverId: string, message?: string): Promise<IConnection> => {
    const response = await api.post<{ success: boolean; data: IConnection }>(
      '/connections/connect',
      { receiverId, message: message || '' },
    );
    return response.data?.data;
  },

  respondToConnection: async (
    connectionId: string,
    action: 'accept' | 'reject',
  ): Promise<IConnection> => {
    const response = await api.post<{ success: boolean; data: IConnection }>(
      `/connections/respond/${connectionId}`,
      { action },
    );
    return response.data?.data;
  },

  getNotifications: async (): Promise<INotification[]> => {
    const response = await api.get<{ success: boolean; data: any }>(
      '/connections/notifications',
    );
    const rawData = response.data?.data;
    return Array.isArray(rawData) ? rawData : (rawData?.data || []);
  },

  markNotificationAsRead: async (notificationId: string): Promise<INotification> => {
    const response = await api.post<{ success: boolean; data: INotification }>(
      `/connections/notifications/read/${notificationId}`,
    );
    return response.data?.data;
  },

  markAllNotificationsAsRead: async (): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean; data: { success: boolean } }>(
      '/connections/notifications/read-all',
    );
    return response.data?.data || { success: true };
  },
};
