import api from '@/api/api';
import type {
  IBlog,
  CreateBlogPayload,
  BlogFilterQuery,
  BlogApiResponse,
  BlogListResult,
} from './types';

export const blogApi = {
  listBlogs: async (params?: BlogFilterQuery) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.pageSize) query.append('pageSize', String(params.pageSize));
    if (params?.userId) query.append('userId', params.userId);

    const qs = query.toString();
    const url = `/candidate/blogs${qs ? `?${qs}` : ''}`;
    const response = await api.get<BlogApiResponse<BlogListResult>>(url);
    return response.data;
  },

  createBlog: async (payload: CreateBlogPayload) => {
    const response = await api.post<BlogApiResponse<IBlog>>(
      '/candidate/blog',
      payload
    );
    return response.data;
  },
};
