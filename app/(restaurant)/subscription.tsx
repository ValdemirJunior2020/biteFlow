// File: app/(restaurant)/subscription.tsx
import { Alert, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import { createSubscriptionCheckout } from '@/lib/stripe';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/hooks/useTheme';

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const profile = useAuthStore((s) => s.profile);

  return (
    <Screen>
      <SectionTitle title="Restaurant subscription" subtitle="Basic, Pro, and Enterprise monthly SaaS plans." />
      {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
        <View key={key} style={{ backgroundColor: colors.card, borderRadius: 22, padding: 18, gap: 10 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{plan.title}</Text>
          <Text style={{ color: colors.text, fontWeight: '700' }}>${plan.monthlyPrice}/month</Text>
          {plan.features.map((feature) => (
            <Text key={feature} style={{ color: colors.mutedText }}>• {feature}</Text>
          ))}
          <AppButton
            label={`Choose ${plan.title}`}
            onPress={async () => {
              if (!profile) return;
              try {
                const checkout = await createSubscriptionCheckout({
                  restaurantId: profile.restaurantIds?.[0] || profile.id,
                  restaurantName: profile.name,
                  restaurantEmail: profile.email,
                  plan: key as 'basic' | 'pro' | 'enterprise'
                });
                Alert.alert('Stripe checkout created', checkout.url || 'Open the returned URL in a webview or browser.');
              } catch (error: any) {
                Alert.alert('Subscription failed', error.message);
              }
            }}
          />
        </View>
      ))}
      <Text>
        Optional RevenueCat path: add your RevenueCat API keys in `.env` and wire them only if you want native in-app subscriptions. This template currently uses Firebase + Stripe for restaurant SaaS billing.
      </Text>
    </Screen>
  );
}
