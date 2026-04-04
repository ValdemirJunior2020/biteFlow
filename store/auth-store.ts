// File: store/auth-store.ts
import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { AppUser } from '@/types';

interface AuthState {
  ready: boolean;
  firebaseUser: User | null;
  profile: AppUser | null;
  setReady: (ready: boolean) => void;
  setSession: (firebaseUser: User | null, profile: AppUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  ready: false,
  firebaseUser: null,
  profile: null,
  setReady: (ready) => set({ ready }),
  setSession: (firebaseUser, profile) => set({ firebaseUser, profile })
}));
