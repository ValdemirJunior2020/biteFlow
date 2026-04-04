// File: components/EmptyState.tsx
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { useTheme } from '@/hooks/useTheme';

export function EmptyState({
  title,
  description,
  buttonLabel,
  onPress
}: {
  title: string;
  description: string;
  buttonLabel?: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.mutedText }]}>{description}</Text>
      {buttonLabel ? <AppButton label={buttonLabel} onPress={onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 22, borderWidth: 1, padding: 20, gap: 12 },
  title: { fontSize: 20, fontWeight: '800' },
  description: { fontSize: 15, lineHeight: 22 }
});
