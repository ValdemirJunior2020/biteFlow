// File: hooks/useRealtimeOrder.ts
import { useEffect, useState } from 'react';
import { subscribeToOrderTracking } from '@/services/firestore';
import type { OrderTracking } from '@/types';

export const useRealtimeOrder = (orderId?: string) => {
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToOrderTracking(orderId, (value) => {
      setTracking(value);
      setLoading(false);
    });

    return unsubscribe;
  }, [orderId]);

  return { tracking, loading };
};
