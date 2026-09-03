import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, glow } from '../theme/colors';

type Variant = 'primary' | 'ghost' | 'success' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  /** Компактный вариант — для плотных рядов кнопок. */
  small?: boolean;
}

const FILL: Record<Variant, string> = {
  primary: colors.primary,
  ghost: 'transparent',
  success: colors.success,
  danger: colors.danger,
};

const LABEL: Record<Variant, string> = {
  primary: colors.white,
  ghost: colors.text,
  success: colors.bg,
  danger: colors.white,
};

export function PrimaryButton({
  title,
  onPress,
  disabled,
  variant = 'primary',
  style,
  small,
}: Props) {
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        {
          backgroundColor: disabled ? colors.locked : FILL[variant],
          borderColor: isGhost ? colors.borderBright : 'transparent',
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        // Свечение только у активной основной кнопки — чтобы взгляд сразу
        // находил единственное «главное» действие на экране.
        variant === 'primary' && !disabled && glow,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          small && styles.textSmall,
          { color: disabled ? colors.textFaint : LABEL[variant] },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  small: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.sm },
  text: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  textSmall: { fontSize: 13 },
});
