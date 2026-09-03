import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme/colors';
import { comboMultiplier } from '../logic/courseEngine';

interface Props {
  combo: number;
  lang: 'ru' | 'ro';
}

/**
 * Значок серии. Появляется только с третьего правильного ответа подряд —
 * до этого он бы просто мельтешил и обесценивал сам себя.
 */
export function ComboBadge({ combo, lang }: Props) {
  const multiplier = comboMultiplier(combo);
  const scale = useRef(new Animated.Value(0)).current;
  const visible = multiplier > 1;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: visible ? 1 : 0,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [visible, combo, scale]);

  if (!visible) return null;

  const color = multiplier >= 4 ? colors.pink : multiplier >= 3 ? colors.warning : colors.primaryBright;

  return (
    <Animated.View style={[styles.badge, { borderColor: color, transform: [{ scale }] }]}>
      <Text style={[styles.text, { color }]}>
        {combo} {lang === 'ru' ? 'подряд' : 'la rând'} · x{multiplier}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    backgroundColor: colors.glass,
  },
  text: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
});
