// File: app/_layout.tsx
import 'react-native-gesture-handler';
import { useEffect, useMemo } from 'react';
import { Slot, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { useAuthStore } from '@/store/auth-store';
import { registerPushToken } from '@/lib/notifications';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  useAuthBootstrap();
  const router = useRouter();
  const rootState = useRootNavigationState();
  const segments = useSegments();
  const { ready, firebaseUser, profile } = useAuthStore();
  const publishableKey = Constants.expoConfig?.extra?.stripePublishableKey as string | undefined;

  const segmentRoot = useMemo(() => String(segments[0] ?? ''), [segments]);
  const isPublicRoute = segmentRoot === '(public)' || !segmentRoot;
  const isAdminRoute = segmentRoot === '(admin)';
  const isRestaurantRoute = segmentRoot === '(restaurant)';

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  useEffect(() => {
    if (!ready || !rootState?.key) return;

    if (!firebaseUser) {
      if (!isPublicRoute) {
        router.replace('/(public)/welcome');
      }
      return;
    }

    if (!profile) return;

    registerPushToken(firebaseUser.uid).catch(() => undefined);

    const target = profile.isSuperAdmin || profile.role === 'super_admin'
      ? '/(admin)/dashboard'
      : profile.role === 'restaurant_owner'
        ? '/(restaurant)/dashboard'
        : '/(customer)/(tabs)';

    if (isPublicRoute) {
      router.replace(target as never);
      return;
    }

    if (isAdminRoute && !(profile.isSuperAdmin || profile.role === 'super_admin')) {
      router.replace(target as never);
      return;
    }

    if (isRestaurantRoute && profile.role !== 'restaurant_owner' && !profile.isSuperAdmin) {
      router.replace(target as never);
    }
  }, [ready, rootState?.key, firebaseUser, profile, isPublicRoute, isAdminRoute, isRestaurantRoute, router]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={publishableKey || 'pk_test_replace_me'}>
        <StatusBar style="auto" />
        <Slot />
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
