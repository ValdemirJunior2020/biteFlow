// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'BiteFlow',
  slug: 'biteflow-saas',
  scheme: 'biteflow',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',

  // keep phone testing focused on native only for now
  platforms: ['ios', 'android'],

  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID || 'com.yourcompany.biteflow',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'BiteFlow uses your location to show nearby restaurants and delivery tracking.',
      NSCameraUsageDescription:
        'BiteFlow uses the camera so restaurant owners can upload food and restaurant images.',
      NSPhotoLibraryUsageDescription:
        'BiteFlow uses your photo library so you can select food and restaurant images.'
    }
  },

  android: {
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || 'com.yourcompany.biteflow',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'CAMERA',
      'READ_MEDIA_IMAGES'
    ]
  },

  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || 'YOUR_EAS_PROJECT_ID'
    },
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
  },

  plugins: [
    'expo-router',
    'expo-web-browser',
    '@stripe/stripe-react-native'
  ]
});