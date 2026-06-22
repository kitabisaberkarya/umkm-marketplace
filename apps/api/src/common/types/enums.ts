export enum UserRole {
  buyer = 'buyer',
  seller = 'seller',
  admin = 'admin',
}

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  suspended = 'suspended',
}

export enum ProductStatus {
  draft = 'draft',
  active = 'active',
  inactive = 'inactive',
}

export enum OrderStatus {
  pending_payment = 'pending_payment',
  paid = 'paid',
  processing = 'processing',
  shipped = 'shipped',
  completed = 'completed',
  cancelled = 'cancelled',
  refunded = 'refunded',
}

export enum VerificationStatus {
  pending = 'pending',
  verified = 'verified',
  rejected = 'rejected',
}
