// File: firebase/auth.ts
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { createUserProfile, getUserProfile, isSuperAdminEmail } from '@/firebase/firestore';
import type { AppUser, UserRole } from '@/types';

WebBrowser.maybeCompleteAuthSession();

export const loginWithEmail = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email.trim(), password);
};

export const signupWithEmail = async (payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) => {
  const result = await createUserWithEmailAndPassword(auth, payload.email.trim(), payload.password);
  await updateProfile(result.user, { displayName: payload.name });
  await sendEmailVerification(result.user).catch(() => undefined);
  await createUserProfile({
    id: result.user.uid,
    name: payload.name,
    email: payload.email.trim(),
    role: payload.role,
    isSuperAdmin: isSuperAdminEmail(payload.email.trim())
  });
};

export const loginWithFirebaseGoogleIdToken = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  const existing = await getUserProfile(result.user.uid);
  if (!existing) {
    await createUserProfile({
      id: result.user.uid,
      name: result.user.displayName || 'Google User',
      email: result.user.email || '',
      role: 'customer',
      photoURL: result.user.photoURL || undefined,
      isSuperAdmin: isSuperAdminEmail(result.user.email || '')
    });
  }
};

export const logout = () => signOut(auth);
export const forgotPassword = (email: string) => sendPasswordResetEmail(auth, email.trim());

export const onAuthChange = (
  callback: (payload: { user: User | null; profile: AppUser | null }) => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, profile: null });
      return;
    }

    let profile = await getUserProfile(user.uid);
    if (!profile) {
      profile = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        role: 'customer',
        isSuperAdmin: isSuperAdminEmail(user.email || '')
      };
      await createUserProfile(profile);
    }

    callback({ user, profile });
  });
};

export const googleClientIds = {
  iosClientId: Constants.expoConfig?.extra?.googleIosClientId as string | undefined,
  androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId as string | undefined,
  webClientId: Constants.expoConfig?.extra?.googleWebClientId as string | undefined
};
