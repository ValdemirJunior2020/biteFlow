// File: app/(admin)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { Buildings, CreditCard, HouseLine, ListChecks, UsersThree } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function AdminDrawer() {
  const { colors } = useTheme();
  return (
    <Drawer screenOptions={{ headerShown: false, drawerActiveTintColor: colors.primary }}>
      <Drawer.Screen name="dashboard" options={{ title: 'Dashboard', drawerIcon: ({ color, size }) => <HouseLine color={color} size={size} /> }} />
      <Drawer.Screen name="restaurants" options={{ title: 'Restaurants', drawerIcon: ({ color, size }) => <Buildings color={color} size={size} /> }} />
      <Drawer.Screen name="orders" options={{ title: 'Orders', drawerIcon: ({ color, size }) => <ListChecks color={color} size={size} /> }} />
      <Drawer.Screen name="subscriptions" options={{ title: 'Subscriptions', drawerIcon: ({ color, size }) => <CreditCard color={color} size={size} /> }} />
      <Drawer.Screen name="users" options={{ title: 'Users', drawerIcon: ({ color, size }) => <UsersThree color={color} size={size} /> }} />
    </Drawer>
  );
}
