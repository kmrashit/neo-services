export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface IConnectionUser {
  _id: string;
  fullName: string;
  email?: string;
  headline?: string;
  profession?: string;
  skills?: string[];
  avatarUrl?: string;
}

export interface IConnection {
  _id: string;
  senderId: IConnectionUser | string;
  receiverId: IConnectionUser | string;
  status: ConnectionStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'new_message'
  | 'system';

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: {
    connectionId?: string;
    senderId?: string;
    receiverId?: string;
    messageId?: string;
  };
  createdAt: string;
  updatedAt: string;
}
