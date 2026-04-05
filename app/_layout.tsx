// C:\Users\Valdemir Goncalves\Desktop\pROJETUS-2026\BiteFlow-SaaS-Expo-Router-v3-fixed-icons\app\_layout.tsx
import 'react-native-gesture-handler';
import { useEffect, useMemo } from 'react';
import { Slot, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, ActivityIndicator } from 'react-native';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { useAuthStore } from '@/store/auth-store';
import { registerPushToken } from '@/lib/notifications';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppShell() {
  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}

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

    registerPushToken(firebaseUser.uid).catch((error) => {
      console.log('registerPushToken error:', error);
    });

    const target =
      profile.isSuperAdmin || profile.role === 'super_admin'
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

  if (!ready) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            paddingHorizontal: 24
          }}
        >
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={{ marginTop: 16, fontSize: 24, fontWeight: '700', color: '#111827' }}>
            BiteFlow
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            Loading app...
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {publishableKey ? (
        <StripeProvider publishableKey={publishableKey}>
          <AppShell />
        </StripeProvider>
      ) : (
        <AppShell />
      )}
    </GestureHandlerRootView>
  );
}