// File: firebase/config.ts
import Constants from 'expo-constants';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || 'YOUR_API_KEY',
  authDomain: extra.firebaseAuthDomain || 'your-project.firebaseapp.com',
  projectId: extra.firebaseProjectId || 'your-project',
  storageBucket: extra.firebaseStorageBucket || 'your-project.firebasestorage.app',
  messagingSenderId: extra.firebaseMessagingSenderId || 'xxxxxxxx',
  appId: extra.firebaseAppId || '1:xxxxxxxx:web:xxxxxxxx',
  measurementId: extra.firebaseMeasurementId || 'G-XXXXXXXXXX'
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
