export interface IBlogAuthor {
  userId?: string;
  fullName: string;
  email?: string;
  headline?: string;
  avatarUrl?: string;
}

export interface IBlog {
  id: string;
  _id?: string;
  candidateId?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  blogKeywords: string[];
  tags?: string[];
  status: 'draft' | 'published';
  author?: string | any;
  authorDetails?: IBlogAuthor;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  readTime?: string;
  views?: number;
  fortiAnalysisScore?: number;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  blogKeywords?: string[];
  status?: 'draft' | 'published';
}

export interface BlogFilterQuery {
  page?: number;
  pageSize?: number;
  userId?: string;
  tag?: string;
  search?: string;
}

export interface ImproveBlogPayload {
  title: string;
  content: string;
  aspect?: 'clarity' | 'technical_depth' | 'structure' | 'headline';
}

export interface ImproveBlogResult {
  title: string;
  content: string;
  suggestions: string[];
  aspect: string;
  authenticInputNote: string;
}

export interface BlogApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface BlogListResult {
  data: IBlog[];
  totalCount: number;
  page?: number;
  pageSize?: number;
}
