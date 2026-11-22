import api from '@/api/api';
import type {
  IInterviewSession,
  IStartInterviewPayload,
  ISubmitResponsePayload,
  ITurnResponseResult,
  PaginatedResponse,
} from './types';

export async function startInterviewSession(
  payload: IStartInterviewPayload,
): Promise<IInterviewSession> {
  const response = await api.post('/interview/start', payload);
  return response.data?.data;
}

export async function submitInterviewTurn(
  sessionId: string,
  payload: ISubmitResponsePayload,
): Promise<ITurnResponseResult> {
  const response = await api.post(`/interview/session/${sessionId}/respond`, payload);
  return response.data?.data;
}

export async function concludeInterviewSession(
  sessionId: string,
): Promise<IInterviewSession> {
  const response = await api.post(`/interview/session/${sessionId}/conclude`);
  return response.data?.data;
}

export async function fetchInterviewReport(
  sessionId: string,
): Promise<IInterviewSession> {
  const response = await api.get(`/interview/report/${sessionId}`);
  return response.data?.data;
}

export async function fetchMyInterviewHistory(
  page = 1,
  pageSize = 10,
): Promise<{ sessions: IInterviewSession[]; totalCount: number }> {
  const response = await api.get('/interview/my-history', {
    params: { page, pageSize },
  });
  const payload = response.data?.data;

  if (payload && typeof payload === 'object' && Array.isArray((payload as PaginatedResponse<IInterviewSession>).data)) {
    return {
      sessions: (payload as PaginatedResponse<IInterviewSession>).data,
      totalCount: (payload as PaginatedResponse<IInterviewSession>).totalCount || 0,
    };
  }

  if (Array.isArray(payload)) {
    return {
      sessions: payload,
      totalCount: payload.length,
    };
  }

  return { sessions: [], totalCount: 0 };
}

export async function toggleInterviewVisibility(
  sessionId: string,
  isPublic: boolean,
): Promise<{ id: string; isPublic: boolean }> {
  const response = await api.put(`/interview/session/${sessionId}/visibility`, { isPublic });
  return response.data?.data;
}
