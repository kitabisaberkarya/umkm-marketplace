import type { UserRole } from './auth';

export type UserStatus = 'active' | 'inactive' | 'suspended';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  province?: string;
  verificationStatus: VerificationStatus;
  averageRating: number;
  totalProducts: number;
  createdAt: string;
}
