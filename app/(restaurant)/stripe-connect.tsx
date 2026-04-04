// File: app/(restaurant)/stripe-connect.tsx
import { Alert, Linking, Text } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { createStripeConnectLink } from '@/lib/stripe';
import { useAuthStore } from '@/store/auth-store';

export default function StripeConnectScreen() {
  const profile = useAuthStore((s) => s.profile);

  return (
    <Screen>
      <SectionTitle title="Stripe Connect" subtitle="Onboard restaurants for automatic payouts while BiteFlow keeps its commission." />
      <Text>
        This screen is already wired to call your backend endpoint. Add your Stripe secret key in the Firebase Functions folder, set the return URLs, and owners can finish onboarding here.
      </Text>
      <AppButton
        label="Start Stripe onboarding"
        onPress={async () => {
          if (!profile) return;
          try {
            const payload = await createStripeConnectLink({
              restaurantId: profile.restaurantIds?.[0] || profile.id,
              ownerEmail: profile.email,
              ownerName: profile.name
            });
            await Linking.openURL(payload.url);
          } catch (error: any) {
            Alert.alert('Stripe connect failed', error.message);
          }
        }}
      />
    </Screen>
  );
}
