import type { IConnection, IConnectionUser } from '@/features/connections/types';

export interface IChatMessage {
  _id?: string;
  connectionId: string;
  senderId: string | IConnectionUser;
  receiverId?: string | IConnectionUser;
  message: string;
  createdAt: string | Date;
  readAt?: string | Date | null;
}

export interface SendMessageDTO {
  connectionId: string;
  message: string;
}

export interface ChatHistoryResponse {
  data: IChatMessage[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type { IConnection, IConnectionUser };
