import api from '@/api/api';
import type { ICandidateInsights, FortiApiResponse } from './types';

export const fortiApi = {
  getInsights: async (candidateId: string) => {
    const response = await api.get<FortiApiResponse<ICandidateInsights>>(
      `/forti/insights/${candidateId}`
    );
    return response.data;
  },

  synthesizeInsights: async (candidateId: string) => {
    const response = await api.post<FortiApiResponse<ICandidateInsights>>(
      `/forti/insights/generate/${candidateId}`
    );
    return response.data;
  },
};
