// File: firebase/firestore.ts
import Constants from 'expo-constants';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '@/services/config';
import { PLATFORM_COMMISSION_PERCENT, TAX_RATE } from '@/lib/constants';
import type { AppAddress, AppUser, CartItem, MenuItem, Order, OrderTracking, Restaurant } from '@/types';

const superAdminEmail = (Constants.expoConfig?.extra?.superAdminEmail as string | undefined) || 'you@example.com';

export const isSuperAdminEmail = (email?: string) => email?.toLowerCase() === superAdminEmail.toLowerCase();

export async function createUserProfile(profile: AppUser) {
  await setDoc(doc(db, 'users', profile.id), { ...profile, createdAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(userId: string) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as AppUser) : null;
}

export async function getRestaurants() {
  const snap = await getDocs(query(collection(db, 'restaurants'), orderBy('ratingAvg', 'desc')));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Restaurant));
}

export async function getRestaurant(id: string) {
  const snap = await getDoc(doc(db, 'restaurants', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Restaurant) : null;
}

export async function getRestaurantsByOwner(ownerId: string) {
  const snap = await getDocs(query(collection(db, 'restaurants'), where('ownerId', '==', ownerId), limit(20)));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Restaurant));
}

export async function saveRestaurant(payload: Partial<Restaurant> & Pick<Restaurant, 'ownerId' | 'name' | 'cuisine' | 'description' | 'location'>, restaurantId?: string) {
  if (restaurantId) {
    await updateDoc(doc(db, 'restaurants', restaurantId), { ...payload, updatedAt: serverTimestamp() });
    return restaurantId;
  }

  const ref = await addDoc(collection(db, 'restaurants'), {
    ...payload,
    ratingAvg: 4.8,
    reviewCount: 0,
    deliveryFee: payload.deliveryFee ?? 3.99,
    etaMinutes: payload.etaMinutes ?? 25,
    priceLevel: payload.priceLevel ?? 2,
    subscriptionPlan: payload.subscriptionPlan ?? 'basic',
    subscriptionStatus: payload.subscriptionStatus ?? 'trialing',
    stripeOnboardingComplete: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function getMenuByRestaurant(restaurantId: string) {
  const snap = await getDocs(
    query(collection(db, 'menuItems'), where('restaurantId', '==', restaurantId), orderBy('category', 'asc'))
  );
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as MenuItem));
}

export async function saveMenuItem(payload: Partial<MenuItem> & Pick<MenuItem, 'restaurantId' | 'name' | 'description' | 'price' | 'category' | 'isAvailable'>, itemId?: string) {
  if (itemId) {
    await updateDoc(doc(db, 'menuItems', itemId), { ...payload, updatedAt: serverTimestamp() });
    return itemId;
  }

  const ref = await addDoc(collection(db, 'menuItems'), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function getAddresses(userId: string) {
  const snap = await getDocs(query(collection(db, 'addresses'), where('userId', '==', userId)));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as AppAddress));
}

export async function saveAddress(address: Omit<AppAddress, 'id'>) {
  const ref = await addDoc(collection(db, 'addresses'), { ...address, createdAt: serverTimestamp() });
  return ref.id;
}

function lineTotal(item: CartItem) {
  const customizationTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
  return (item.basePrice + customizationTotal) * item.quantity;
}

export async function createOrderFromCart(payload: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  ownerId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  address: AppAddress;
  deliveryFee: number;
}) {
  const subtotal = payload.items.reduce((sum, item) => sum + lineTotal(item), 0);
  const taxAmount = subtotal * TAX_RATE;
  const commissionAmount = subtotal * PLATFORM_COMMISSION_PERCENT;
  const total = subtotal + taxAmount + payload.deliveryFee;

  const orderDoc = await addDoc(collection(db, 'orders'), {
    customerId: payload.customerId,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    ownerId: payload.ownerId,
    restaurantId: payload.restaurantId,
    restaurantName: payload.restaurantName,
    items: payload.items.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      basePrice: item.basePrice,
      customizations: item.customizations,
      lineTotal: lineTotal(item)
    })),
    deliveryAddress: payload.address,
    subtotal,
    deliveryFee: payload.deliveryFee,
    taxAmount,
    commissionPercent: PLATFORM_COMMISSION_PERCENT,
    commissionAmount,
    restaurantNetAmount: subtotal - commissionAmount,
    total,
    paymentStatus: 'requires_payment',
    orderStatus: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await setDoc(doc(db, 'tracking', orderDoc.id), {
    orderId: orderDoc.id,
    status: 'pending',
    restaurantLocation: {
      latitude: payload.address.latitude + 0.01,
      longitude: payload.address.longitude + 0.01
    },
    customerLocation: {
      latitude: payload.address.latitude,
      longitude: payload.address.longitude
    },
    courierLocation: {
      latitude: payload.address.latitude + 0.005,
      longitude: payload.address.longitude + 0.005
    },
    updatedAt: serverTimestamp()
  });

  return orderDoc.id;
}

export async function getCustomerOrders(customerId: string) {
  const snap = await getDocs(query(collection(db, 'orders'), where('customerId', '==', customerId), orderBy('createdAt', 'desc')));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Order));
}

export async function getRestaurantOrders(ownerId: string) {
  const snap = await getDocs(query(collection(db, 'orders'), where('ownerId', '==', ownerId), orderBy('createdAt', 'desc')));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Order));
}

export async function getAllOrders() {
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Order));
}

export async function getAllUsers() {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as AppUser));
}

export async function getAllSubscriptions() {
  const snap = await getDocs(query(collection(db, 'restaurants'), orderBy('createdAt', 'desc')));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Restaurant));
}

export async function updateOrderStatus(orderId: string, status: Order['orderStatus']) {
  await updateDoc(doc(db, 'orders', orderId), { orderStatus: status, updatedAt: serverTimestamp() });
  await updateDoc(doc(db, 'tracking', orderId), { status, updatedAt: serverTimestamp() });
}

export function subscribeToOrderTracking(orderId: string, callback: (value: OrderTracking | null) => void) {
  return onSnapshot(doc(db, 'tracking', orderId), (snap) => {
    callback(snap.exists() ? ({ ...snap.data() } as OrderTracking) : null);
  });
}
