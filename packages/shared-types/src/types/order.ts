export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  productName: string;
  productImageUrl?: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  buyerId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
