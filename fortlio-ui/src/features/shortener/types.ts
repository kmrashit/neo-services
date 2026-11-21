export interface IShortLink {
  id?: string;
  _id?: string;
  shortCode: string;
  originalUrl: string;
  accessCount?: number;
  viewsCount?: number;
  totalTimeSpentSeconds?: number;
  averageTimeSpentSeconds?: number;
  targetType: 'resume' | 'blog' | 'custom';
  targetId?: string;
  createdBy?: string;
  lastAccessedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShortLinkPayload {
  originalUrl: string;
  customAlias?: string;
  targetType?: 'resume' | 'blog' | 'custom';
  targetId?: string;
}

export interface DwellTimePayload {
  shortCode: string;
  durationSeconds: number;
}

export interface ILinkAnalytics {
  shortCode: string;
  originalUrl: string;
  targetType: 'resume' | 'blog' | 'custom';
  targetId?: string;
  accessCount: number;
  viewsCount: number;
  totalTimeSpentSeconds: number;
  averageTimeSpentSeconds: number;
  lastAccessedAt?: string;
  createdAt?: string;
}

export interface MyLinksResponse {
  links: IShortLink[];
  total: number;
}
