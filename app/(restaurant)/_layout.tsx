// File: app/(restaurant)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { CurrencyDollar, Gear, HouseLine, ListChecks, Storefront, CreditCard } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function RestaurantDrawer() {
  const { colors } = useTheme();
  return (
    <Drawer screenOptions={{ headerShown: false, drawerActiveTintColor: colors.primary }}>
      <Drawer.Screen name="dashboard" options={{ title: 'Dashboard', drawerIcon: ({ color, size }) => <HouseLine color={color} size={size} /> }} />
      <Drawer.Screen name="restaurant-profile" options={{ title: 'Restaurant', drawerIcon: ({ color, size }) => <Storefront color={color} size={size} /> }} />
      <Drawer.Screen name="menu" options={{ title: 'Menu', drawerIcon: ({ color, size }) => <Storefront color={color} size={size} /> }} />
      <Drawer.Screen name="orders" options={{ title: 'Orders', drawerIcon: ({ color, size }) => <ListChecks color={color} size={size} /> }} />
      <Drawer.Screen name="earnings" options={{ title: 'Earnings', drawerIcon: ({ color, size }) => <CurrencyDollar color={color} size={size} /> }} />
      <Drawer.Screen name="stripe-connect" options={{ title: 'Stripe Connect', drawerIcon: ({ color, size }) => <CreditCard color={color} size={size} /> }} />
      <Drawer.Screen name="subscription" options={{ title: 'Subscription', drawerIcon: ({ color, size }) => <CreditCard color={color} size={size} /> }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings', drawerIcon: ({ color, size }) => <Gear color={color} size={size} /> }} />
      <Drawer.Screen name="menu/new" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="menu/[id]" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}
