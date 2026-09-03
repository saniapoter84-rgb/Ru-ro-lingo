import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Подсветить рамку акцентом — для активного/выбранного состояния. */
  active?: boolean;
  onPress?: () => void;
  padded?: boolean;
}

/** Базовая «стеклянная» панель: тёмная поверхность с тонкой светлой рамкой. */
export function Panel({ children, style, active, onPress, padded = true }: Props) {
  const content = (
    <View
      style={[
        styles.panel,
        padded && styles.padded,
        active && styles.active,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : null)}>
      {content}
    </Pressable>
  );
}

/** Заголовок секции: мелкие прописные буквы, приглушённый цвет. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  padded: { padding: spacing.lg },
  active: {
    borderColor: colors.primary,
    backgroundColor: colors.cardHover,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textFaint,
    marginBottom: spacing.md,
  },
});
