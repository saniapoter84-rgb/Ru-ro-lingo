import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  ratio: number; // 0..1
  color?: string;
  height?: number;
}

export function ProgressBar({ ratio, color = colors.primary, height = 10 }: Props) {
  const clamped = Math.max(0, Math.min(1, ratio));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped * 100}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
