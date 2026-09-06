import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { RhythmDay } from '../logic/rhythm';

const WEEKDAYS = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'];

interface Props {
  days: RhythmDay[];
  /** Цвет закрашенных дней — по умолчанию акцент приложения. */
  color?: string;
  compact?: boolean;
}

/**
 * Календарь занятий. Сознательно без красного, без «пропущено» и без огня:
 * закрашенная клетка значит «в этот день я занимался», пустая не значит
 * ничего. Смотреть на такую сетку приятно даже после недели перерыва —
 * а именно в этот момент человека обычно и теряют.
 */
export function RhythmStrip({ days, color = colors.primary, compact }: Props) {
  const weeks: RhythmDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <View>
      {!compact ? (
        <View style={styles.row}>
          {WEEKDAYS.map((label, i) => (
            <Text key={i} style={styles.weekday}>
              {label}
            </Text>
          ))}
        </View>
      ) : null}

      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.row}>
            {week.map((day) => (
              <View key={day.date} style={styles.cellWrap}>
                <View
                  style={[
                    styles.cell,
                    day.active && { backgroundColor: color, borderColor: color },
                    day.today && !day.active && { borderColor: color },
                    day.future && styles.cellFuture,
                  ]}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 5 },
  row: { flexDirection: 'row', gap: 5 },
  cellWrap: { flex: 1 },
  cell: {
    height: 18,
    borderRadius: radius.sm - 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  cellFuture: { opacity: 0.35, borderStyle: 'dashed' },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    color: colors.textFaint,
    marginBottom: spacing.xs,
  },
});
