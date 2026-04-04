// File: lib/constants.ts
import type { SubscriptionPlan } from '@/types';

export const APP_NAME = 'BiteFlow';
export const PLATFORM_COMMISSION_PERCENT = 0.18;
export const TAX_RATE = 0.07;

export const CUISINES = [
  'Pizza',
  'Burgers',
  'Sushi',
  'Healthy',
  'Desserts',
  'Mexican',
  'Italian',
  'Vegan'
];

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, { title: string; monthlyPrice: number; features: string[] }> = {
  basic: {
    title: 'Basic',
    monthlyPrice: 29,
    features: ['Storefront', 'Order management', 'Standard support']
  },
  pro: {
    title: 'Pro',
    monthlyPrice: 79,
    features: ['Featured listing', 'Analytics dashboard', 'Priority support']
  },
  enterprise: {
    title: 'Enterprise',
    monthlyPrice: 199,
    features: ['White label options', 'Dedicated onboarding', 'Lower negotiated commission']
  }
};
