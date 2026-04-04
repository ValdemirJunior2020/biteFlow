// File: hooks/useAuthBootstrap.ts
import { useEffect } from 'react';
import { onAuthChange } from '@/firebase/auth';
import { useAuthStore } from '@/store/auth-store';

export const useAuthBootstrap = () => {
  const setReady = useAuthStore((s) => s.setReady);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (payload) => {
      setSession(payload.user, payload.profile);
      setReady(true);
    });

    return unsubscribe;
  }, [setReady, setSession]);
};
