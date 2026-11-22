import api from '@/api/api';
import type {
  IJobPost,
  IJobCreatePayload,
  IJobSearchParams,
  IJobApplicant,
  JobStatus,
  PaginatedResponse,
} from './types';

export async function createJobPost(payload: IJobCreatePayload): Promise<IJobPost> {
  const response = await api.post('/job/create', payload);
  return response.data?.data;
}

export async function fetchMyJobPosts(
  page = 1,
  pageSize = 20,
): Promise<{ jobs: IJobPost[]; totalCount: number }> {
  const response = await api.get('/job/hr/my-posts', {
    params: { page, pageSize },
  });
  const payload = response.data?.data;

  if (payload && typeof payload === 'object' && Array.isArray((payload as PaginatedResponse<IJobPost>).data)) {
    return {
      jobs: (payload as PaginatedResponse<IJobPost>).data,
      totalCount: (payload as PaginatedResponse<IJobPost>).totalCount || 0,
    };
  }

  if (Array.isArray(payload)) {
    return {
      jobs: payload,
      totalCount: payload.length,
    };
  }

  return { jobs: [], totalCount: 0 };
}

export async function updateJobPostStatus(jobId: string, status: JobStatus): Promise<IJobPost> {
  const response = await api.put(`/job/${jobId}/status`, { status });
  return response.data?.data;
}

export async function searchJobPosts(
  params: IJobSearchParams = {},
): Promise<{ jobs: IJobPost[]; totalCount: number }> {
  const response = await api.get('/job/search', { params });
  const payload = response.data?.data;

  if (payload && typeof payload === 'object' && Array.isArray((payload as PaginatedResponse<IJobPost>).data)) {
    return {
      jobs: (payload as PaginatedResponse<IJobPost>).data,
      totalCount: (payload as PaginatedResponse<IJobPost>).totalCount || 0,
    };
  }

  if (Array.isArray(payload)) {
    return {
      jobs: payload,
      totalCount: payload.length,
    };
  }

  return { jobs: [], totalCount: 0 };
}

export async function fetchJobSuggestions(): Promise<IJobPost[]> {
  const response = await api.get('/job/suggestions');
  const payload = response.data?.data;

  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object' && Array.isArray((payload as PaginatedResponse<IJobPost>).data)) {
    return (payload as PaginatedResponse<IJobPost>).data;
  }
  return [];
}

export async function applyForJob(jobId: string, coverNote?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`/job/apply/${jobId}`, { coverNote });
  return response.data;
}

export async function fetchJobApplicants(
  jobId: string,
  page = 1,
  pageSize = 20,
): Promise<{ applicants: IJobApplicant[]; totalCount: number }> {
  const response = await api.get(`/job/${jobId}/applicants`, {
    params: { page, pageSize },
  });
  const payload = response.data?.data;

  if (payload && typeof payload === 'object' && Array.isArray((payload as PaginatedResponse<IJobApplicant>).data)) {
    return {
      applicants: (payload as PaginatedResponse<IJobApplicant>).data,
      totalCount: (payload as PaginatedResponse<IJobApplicant>).totalCount || 0,
    };
  }

  if (Array.isArray(payload)) {
    return {
      applicants: payload,
      totalCount: payload.length,
    };
  }

  return { applicants: [], totalCount: 0 };
}
