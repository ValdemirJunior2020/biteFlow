// File: lib/stripe.ts
import Constants from 'expo-constants';
import { PLATFORM_COMMISSION_PERCENT } from '@/lib/constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;

async function post(path: string, body: unknown) {
  if (!apiBaseUrl) {
    throw new Error('Missing EXPO_PUBLIC_API_BASE_URL. Point it to your Firebase Functions API base URL.');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Stripe API request failed');
  }

  return response.json();
}

export const createPaymentIntent = (payload: {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  amount: number;
  customerEmail: string;
}) =>
  post('/create-payment-intent', {
    ...payload,
    platformCommissionPercent: PLATFORM_COMMISSION_PERCENT
  });

export const createSubscriptionCheckout = (payload: {
  restaurantId: string;
  restaurantName: string;
  restaurantEmail: string;
  plan: 'basic' | 'pro' | 'enterprise';
}) => post('/create-subscription-checkout', payload);

export const createStripeConnectLink = (payload: { restaurantId: string; ownerEmail: string; ownerName: string }) =>
  post('/create-stripe-connect-link', payload);
