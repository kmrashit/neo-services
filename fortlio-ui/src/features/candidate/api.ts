import api from '@/api/api';
import type {
  ICandidateProfile,
  CandidateProfileUpsertPayload,
  MdToPdfPayload,
  IResumeOcrResult,
  CandidateApiResponse,
} from './types';

export const candidateApi = {
  getProfile: async (userId: string) => {
    const response = await api.get<CandidateApiResponse<ICandidateProfile>>(
      `/candidate/profile/${encodeURIComponent(userId)}`,
    );
    return response.data;
  },

  upsertProfile: async (payload: CandidateProfileUpsertPayload) => {
    const response = await api.post<CandidateApiResponse<ICandidateProfile>>(
      '/candidate/profile',
      payload,
    );
    return response.data;
  },

  convertMdToPdf: async (payload: MdToPdfPayload) => {
    const response = await api.post('/candidate/md-to-pdf', payload, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  resumeOcr: async (payload: { resumeText?: string; fileBase64?: string; fileName?: string }) => {
    const response = await api.post<CandidateApiResponse<IResumeOcrResult>>(
      '/candidate/resume/ocr',
      payload,
    );
    return response.data;
  },
};
