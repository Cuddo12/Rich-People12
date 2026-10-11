export type ProductCategory = 
  | 'Shirts'
  | 'Panjabi'
  | 'Rich People Exclusives'
  | 'Premium Shirts'
  | 'Casual Shirts'
  | 'Full Sleeve Shirts'
  | 'Half Sleeve Shirts'
  | 'Cuban Collar Shirts'
  | 'Overshirts'
  | 'Premium Panjabi'
  | 'Eid Collection'
  | 'New Arrivals'
  | 'Sale';

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductVariant {
  id: string;
  productId: string;
  size: ProductSize;
  color?: string;
  stockQuantity: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: ProductCategory | string;
  collection: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  discount?: number; // percentage
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  sizes: ProductSize[];
  colors: string[];
  fabric: string;
  fit: string;
  weight?: string;
  images: string[];
  featuredImage: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  banner?: string;
  isActive: boolean;
}

export interface CartItem {
  id: string; // unique item composite key: productId-size-color
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: ProductSize;
  color: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxStock: number;
}

export type PaymentMethod = 'bKash' | 'Nagad';

export type PaymentStatus = 'PENDING_VERIFICATION' | 'PAID' | 'REJECTED' | 'REFUNDED';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_UNDER_REVIEW'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED';

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: ProductSize;
  color: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ShippingAddress {
  customerName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  postCode?: string;
  notes?: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string; // format: RICH-2026-00001
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  deliveryMethod: 'Inside Dhaka' | 'Outside Dhaka';
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  advancePaid: number;
  remainingCOD: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  senderPhone: string;
  paymentScreenshot?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusEvent[];
  adminNotes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Offer {
  id: string;
  name: string;
  offerType: 'percentage' | 'fixed' | 'category' | 'flash_sale' | 'eid_sale';
  discountAmount: number;
  applicableCategories?: string[];
  applicableProductIds?: string[];
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  orderId?: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: 'sale' | 'restock' | 'manual_adjustment' | 'cancellation_restock';
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logo: string;
  favicon: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  announcementBar: {
    text: string;
    enabled: boolean;
  };
  freeShippingThreshold: number;
  shippingChargeInsideDhaka: number;
  shippingChargeOutsideDhaka: number;
  advancePaymentAmount: number;
  bkashNumber: string;
  nagadNumber: string;
  paymentInstructions: string;
  footerText: string;
  heroSection: {
    title: string;
    subtitle: string;
    tagline: string;
    ctaTextPrimary: string;
    ctaLinkPrimary: string;
    ctaTextSecondary: string;
    ctaLinkSecondary: string;
    image: string;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  savedAddress?: ShippingAddress;
  createdAt: string;
}
