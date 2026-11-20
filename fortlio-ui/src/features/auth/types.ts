export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roleId?: string;
  role?: 'candidate' | 'hr' | 'admin';
  isOnboarded?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role?: 'candidate' | 'hr';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    _id?: string;
    id?: string;
    email: string;
    fullName: string;
    roleId?: string;
    isOnboarded?: boolean;
    [key: string]: any;
  };
}

export interface AuthApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}
