// File: components/AppButton.tsx
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading,
  icon,
  disabled
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const backgroundColor = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : colors.card;
  const textColor = variant === 'ghost' ? colors.text : '#fff';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          borderColor: variant === 'ghost' ? colors.border : backgroundColor
        }
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : icon}
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    alignSelf: 'stretch',
    paddingHorizontal: 20
  },
  text: { fontSize: 16, fontWeight: '700' }
});
