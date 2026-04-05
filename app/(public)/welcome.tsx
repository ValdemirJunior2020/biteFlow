import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { useTheme } from '@/hooks/useTheme';

export default function WelcomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.hero}>
        <Text style={[styles.logo, { color: colors.text }]}>BiteFlow</Text>
        <Text style={[styles.tagline, { color: colors.mutedText }]}>
          Food delivery for everyone
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/(public)/login" asChild>
          <AppButton label="Login" />
        </Link>
        <Link href="/(public)/signup" asChild>
          <AppButton label="Create account" variant="ghost" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
    justifyContent: 'flex-end'
  },
  hero: {
    alignItems: 'center',
    marginBottom: 48
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center'
  },
  actions: {
    gap: 12
  }
});
