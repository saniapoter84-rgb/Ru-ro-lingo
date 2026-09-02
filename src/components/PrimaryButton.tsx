import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ title, onPress, disabled, variant = 'primary', style }: Props) {
  const bg = disabled
    ? colors.locked
    : variant === 'primary'
    ? colors.primary
    : variant === 'danger'
    ? colors.red
    : colors.white;
  const textColor = variant === 'secondary' && !disabled ? colors.text : colors.white;
  const borderColor = variant === 'secondary' ? colors.border : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderColor, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
