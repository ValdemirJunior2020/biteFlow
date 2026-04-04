// File: store/cart-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartCustomizationSelection, CartItem, MenuItem, Restaurant } from '@/types';

interface CartState {
  restaurant: Pick<Restaurant, 'id' | 'name' | 'deliveryFee'> | null;
  items: CartItem[];
  setRestaurant: (restaurant: Pick<Restaurant, 'id' | 'name' | 'deliveryFee'>) => void;
  addItem: (item: MenuItem, quantity?: number, customizations?: CartCustomizationSelection[]) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurant: null,
      items: [],
      setRestaurant: (restaurant) => set({ restaurant }),
      addItem: (item, quantity = 1, customizations = []) => {
        const state = get();
        const existing = state.items.find((entry) => entry.itemId === item.id);
        if (existing) {
          set({
            items: state.items.map((entry) =>
              entry.itemId === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry
            )
          });
          return;
        }
        set({
          items: [
            ...state.items,
            {
              itemId: item.id,
              restaurantId: item.restaurantId,
              name: item.name,
              imageURL: item.imageURL,
              basePrice: item.price,
              quantity,
              customizations
            }
          ]
        });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          return set({ items: get().items.filter((entry) => entry.itemId !== itemId) });
        }
        set({
          items: get().items.map((entry) => (entry.itemId === itemId ? { ...entry, quantity } : entry))
        });
      },
      removeItem: (itemId) => set({ items: get().items.filter((entry) => entry.itemId !== itemId) }),
      clearCart: () => set({ restaurant: null, items: [] })
    }),
    {
      name: 'biteflow-cart',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
