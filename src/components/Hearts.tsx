import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { HeartsState, MAX_HEARTS, formatCountdown, msUntilNextHeart, syncHearts } from '../logic/hearts';

interface Props {
  hearts: HeartsState;
  /** Сколько сердец доступно в этом бою (у боссов меньше). */
  max?: number;
  /** Показывать таймер до следующего сердца. */
  showTimer?: boolean;
}

/** Ряд сердец + таймер восстановления. */
export function Hearts({ hearts, max = MAX_HEARTS, showTimer = true }: Props) {
  const [, setTick] = useState(0);
  const synced = syncHearts(hearts);
  const remaining = msUntilNextHeart(hearts);

  // Таймер тикает только когда есть что показывать.
  useEffect(() => {
    if (!showTimer || remaining <= 0) return;
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [showTimer, remaining]);

  const count = Math.min(synced.count, max);

  return (
    <View style={styles.row}>
      <View style={styles.pill}>
        <Text style={styles.heart}>{'♥'}</Text>
        <Text style={styles.count}>
          {count}
          <Text style={styles.countMax}>/{max}</Text>
        </Text>
      </View>
      {showTimer && remaining > 0 ? (
        <Text style={styles.timer}>{formatCountdown(remaining)}</Text>
      ) : null}
    </View>
  );
}

/** Компактный вариант для шапки урока: точки вместо цифр. */
export function HeartDots({ count, max }: { count: number; max: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={[styles.dot, i < count ? styles.dotFull : styles.dotEmpty]}>
          {'♥'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dangerDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  heart: { color: colors.danger, fontSize: 13 },
  count: { color: colors.text, fontWeight: '700', fontSize: 13 },
  countMax: { color: colors.textFaint, fontWeight: '600' },
  timer: { color: colors.textFaint, fontSize: 12, fontVariant: ['tabular-nums'] },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { fontSize: 15 },
  dotFull: { color: colors.danger },
  dotEmpty: { color: colors.border },
});
