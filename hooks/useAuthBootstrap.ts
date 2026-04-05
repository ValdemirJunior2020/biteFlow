// C:\Users\Valdemir Goncalves\Desktop\pROJETUS-2026\BiteFlow-SaaS-Expo-Router-v3-fixed-icons\hooks\useAuthBootstrap.ts
import { useEffect } from 'react';
import { onAuthChange } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';

export const useAuthBootstrap = () => {
  const setReady = useAuthStore((s) => s.setReady);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      const unsubscribe = onAuthChange(async (payload) => {
        try {
          setSession(payload?.user ?? null, payload?.profile ?? null);
        } catch (error) {
          console.log('useAuthBootstrap setSession error:', error);
          setSession(null, null);
        } finally {
          setReady(true);
          if (timeoutId) clearTimeout(timeoutId);
        }
      });

      timeoutId = setTimeout(() => {
        console.log('useAuthBootstrap fallback: auth listener did not respond in time');
        setSession(null, null);
        setReady(true);
      }, 3000);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch (error) {
      console.log('useAuthBootstrap auth listener setup error:', error);
      setSession(null, null);
      setReady(true);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [setReady, setSession]);
};