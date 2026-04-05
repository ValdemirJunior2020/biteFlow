// C:\Users\Valdemir Goncalves\Desktop\pROJETUS-2026\BiteFlow-SaaS-Expo-Router-v3-fixed-icons\app.config.ts
import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'BiteFlow',
  slug: 'biteflow-saas',
  scheme: 'biteflow',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  experiments: { typedRoutes: true },
  platforms: ['ios', 'android'],
  icon: './assets/icon.png',

  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID || 'com.yourcompany.biteflow',
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_IOS_GOOGLE_MAPS_API_KEY
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'BiteFlow uses your location to show nearby restaurants, delivery distance, and address selection.',
      NSPhotoLibraryUsageDescription:
        'BiteFlow uses your photo library so restaurant owners can upload food and brand images.',
      NSCameraUsageDescription:
        'BiteFlow uses the camera to let restaurant owners upload menu photos and users update avatars.'
    }
  },

  android: {
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || 'com.yourcompany.biteflow',
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#ffffff'
    },
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY
      }
    },
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'CAMERA',
      'READ_MEDIA_IMAGES'
    ]
  },

  plugins: [
    'expo-router',
    'expo-font',
    'expo-notifications',
    'expo-web-browser',
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier:
          process.env.EXPO_PUBLIC_APPLE_MERCHANT_ID || 'merchant.com.yourcompany.biteflow',
        enableGooglePay: false
      }
    ]
  ],

  extra: {
    eas: {
      projectId: '023f676b-d56a-4dab-8d95-166cd777c6d9'
    },

    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,

    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,

    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    superAdminEmail: process.env.EXPO_PUBLIC_SUPER_ADMIN_EMAIL ?? 'infojr.83@gmail.com',

    revenueCatApiKeyIos: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '',
    revenueCatApiKeyAndroid: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? ''
  }
};

export default config;