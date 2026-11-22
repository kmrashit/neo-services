import api from '@/api/api';
import type { IChatMessage, ChatHistoryResponse } from './types';
import type { IConnection } from '@/features/connections/types';

export async function sendChatMessage(connectionId: string, message: string): Promise<IChatMessage> {
  const response = await api.post('/connections/chat/send', {
    connectionId,
    message,
  });
  return response.data?.data;
}

export async function fetchChatHistory(
  connectionId: string,
  page = 1,
  pageSize = 50,
): Promise<{ messages: IChatMessage[]; totalCount: number }> {
  const response = await api.get(`/connections/chat/history/${connectionId}`, {
    params: { page, pageSize },
  });

  const payload: ChatHistoryResponse | IChatMessage[] = response.data?.data;

  if (Array.isArray(payload)) {
    return {
      messages: payload,
      totalCount: payload.length,
    };
  }

  if (payload && typeof payload === 'object' && 'data' in payload && Array.isArray(payload.data)) {
    return {
      messages: payload.data,
      totalCount: payload.totalCount || 0,
    };
  }

  return { messages: [], totalCount: 0 };
}

export async function fetchActiveConnections(): Promise<IConnection[]> {
  const response = await api.get('/connections/list', {
    params: { status: 'accepted' },
  });
  const data = response.data?.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object' && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
}
