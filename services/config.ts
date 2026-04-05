// C:\Users\Valdemir Goncalves\Desktop\pROJETUS-2026\BiteFlow-SaaS-Expo-Router-v3-fixed-icons\firebase\config.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const extra = Constants.expoConfig?.extra ?? {};

export const firebaseConfig = {
  apiKey: String(extra.firebaseApiKey ?? ''),
  authDomain: String(extra.firebaseAuthDomain ?? ''),
  projectId: String(extra.firebaseProjectId ?? ''),
  storageBucket: String(extra.firebaseStorageBucket ?? ''),
  messagingSenderId: String(extra.firebaseMessagingSenderId ?? ''),
  appId: String(extra.firebaseAppId ?? ''),
  measurementId: String(extra.firebaseMeasurementId ?? '')
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance: Auth;

if (Platform.OS === 'web') {
  authInstance = getAuth(app);
} else {
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch {
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
);