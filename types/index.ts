// File: types/index.ts
export type UserRole = 'customer' | 'restaurant_owner' | 'super_admin';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'requires_payment' | 'paid' | 'failed' | 'refunded';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  isSuperAdmin?: boolean;
  restaurantIds?: string[];
  createdAt?: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface AppAddress extends LatLng {
  id: string;
  userId: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  cuisine: string;
  description: string;
  logoURL?: string;
  coverURL?: string;
  ratingAvg: number;
  reviewCount: number;
  deliveryFee: number;
  etaMinutes: number;
  priceLevel: number;
  isFeatured?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: 'inactive' | 'trialing' | 'active' | 'past_due' | 'cancelled';
  stripeAccountId?: string;
  stripeOnboardingComplete?: boolean;
  location: LatLng & { address: string };
}

export interface MenuOption {
  label: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  required?: boolean;
  maxSelect?: number;
  options: MenuOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  imageURL?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  customizationGroups?: CustomizationGroup[];
}

export interface CartCustomizationSelection {
  groupId: string;
  groupTitle: string;
  label: string;
  price: number;
}

export interface CartItem {
  itemId: string;
  restaurantId: string;
  name: string;
  imageURL?: string;
  basePrice: number;
  quantity: number;
  customizations: CartCustomizationSelection[];
}

export interface OrderLine {
  itemId: string;
  name: string;
  quantity: number;
  basePrice: number;
  customizations: CartCustomizationSelection[];
  lineTotal: number;
}

export interface OrderTracking {
  orderId: string;
  restaurantLocation: LatLng;
  customerLocation: LatLng;
  courierLocation: LatLng;
  status: OrderStatus;
  updatedAt?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  restaurantId: string;
  restaurantName: string;
  ownerId: string;
  items: OrderLine[];
  deliveryAddress: AppAddress;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  restaurantNetAmount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  orderStatus: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}
