import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, radius } from '../theme/colors';

interface Props {
  ratio: number; // 0..1
  color?: string;
  height?: number;
  /** Плавно догонять новое значение вместо мгновенного скачка. */
  animated?: boolean;
}

export function ProgressBar({ ratio, color = colors.primary, height = 6, animated = true }: Props) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const width = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    if (!animated) {
      width.setValue(clamped);
      return;
    }
    Animated.timing(width, {
      toValue: clamped,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [clamped, animated, width]);

  const widthPercent = width.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.fill,
          { width: widthPercent, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

/** Сегментированный индикатор — по одному делению на шаг урока. */
export function SegmentBar({ total, done }: { total: number; done: number }) {
  return (
    <View style={styles.segments}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.segment, i < done ? styles.segmentDone : styles.segmentIdle]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: { height: '100%' },
  segments: { flexDirection: 'row', gap: 3 },
  segment: { flex: 1, height: 4, borderRadius: radius.sm },
  segmentDone: { backgroundColor: colors.primary },
  segmentIdle: { backgroundColor: colors.border },
});
