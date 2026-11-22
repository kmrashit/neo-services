export type UserRole = 'candidate' | 'hr' | 'admin';

export interface Role {
  roleId: string;
  roleName: string;
  description?: string;
  rolePrivileges?: string[];
  createdBy?: string;
  [key: string]: any;
}

export interface Privilege {
  id: string;
  name: string;
  tag: string;
  description?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  lastName?: string;
  mobileNumber?: string;
  roleId?: string | Role;
  role?: UserRole;
  coins?: number;
  isAiOptedIn?: boolean;
  isPro?: boolean;
  tokensUsed?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreditCardPaymentPayload {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  cardholderName: string;
  plan?: string;
  coinPackageId?: string;
  coins?: number;
  amountPaid: number;
}

export interface UpgradeProResponse {
  isPro: boolean;
  isAiOptedIn: boolean;
  coins: number;
  message: string;
}

export interface PurchaseCoinsResponse {
  coins: number;
  coinsAdded: number;
  message: string;
}

export interface TokenUsageResponse {
  userId: string;
  tokensUsed: number;
  coins: number;
  isPro: boolean;
  isAiOptedIn: boolean;
}

export interface UpdateUserPayload {
  userId: string;
  email?: string;
  fullName?: string;
  lastName?: string;
  mobileNumber?: string;
  roleId?: string;
}

export interface WatchAdResponse {
  coins: number;
  message: string;
}

export interface UserApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}
