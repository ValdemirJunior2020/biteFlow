// File: app/(public)/welcome.tsx
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { useTheme } from '@/hooks/useTheme';

export default function WelcomeScreen() {
  const { colors } = useTheme();

  return (
    <Screen scroll={false}>
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1500&auto=format&fit=crop' }}
          style={styles.image}
        />
      </View>
      <SectionTitle title="BiteFlow" subtitle="Multi-tenant food delivery SaaS for customers, restaurants, and platform admins." />
      <Text style={{ color: colors.mutedText, fontSize: 15, lineHeight: 22 }}>
        Order fast, manage restaurants, and run your platform with subscriptions, commissions, analytics, and live tracking.
      </Text>
      <AppButton label="Login" onPress={() => router.push('/(public)/login')} />
      <AppButton label="Create account" variant="ghost" onPress={() => router.push('/(public)/signup')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 28, overflow: 'hidden' },
  image: { width: '100%', height: 300, borderRadius: 28 }
});
