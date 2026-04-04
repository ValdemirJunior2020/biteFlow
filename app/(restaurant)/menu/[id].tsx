// File: app/(restaurant)/menu/[id].tsx
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { getMenuByRestaurant, getRestaurantsByOwner, saveMenuItem } from '@/firebase/firestore';
import { useAuthStore } from '@/store/auth-store';
import type { MenuItem } from '@/types';

export default function EditMenuItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useAuthStore((s) => s.profile);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (!profile) return;
    getRestaurantsByOwner(profile.id).then(async (restaurants) => {
      if (!restaurants[0]) return;
      const menu = await getMenuByRestaurant(restaurants[0].id);
      const found = menu.find((entry) => entry.id === id) || null;
      setItem(found);
      setName(found?.name || '');
      setDescription(found?.description || '');
      setPrice(String(found?.price || ''));
      setCategory(found?.category || '');
    });
  }, [profile, id]);

  if (!item) return <LoadingView label="Loading menu item..." />;

  return (
    <Screen>
      <AppInput label="Name" value={name} onChangeText={setName} />
      <AppInput label="Description" value={description} onChangeText={setDescription} />
      <AppInput label="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
      <AppInput label="Category" value={category} onChangeText={setCategory} />
      <AppButton
        label="Save changes"
        onPress={async () => {
          try {
            await saveMenuItem({
              restaurantId: item.restaurantId,
              name,
              description,
              price: Number(price),
              category,
              isAvailable: item.isAvailable
            }, item.id);
            Alert.alert('Saved', 'Menu item updated.');
            router.back();
          } catch (error: any) {
            Alert.alert('Save failed', error.message);
          }
        }}
      />
    </Screen>
  );
}
