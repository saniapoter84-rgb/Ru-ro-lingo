import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, radius, spacing, glow } from '../theme/colors';
import { NextAction } from '../logic/today';
import { Press } from '../components/Press';

interface Props {
  action: NextAction;
  onPress: () => void;
}

const KIND_MARK: Record<NextAction['kind'], string> = {
  lesson: '◆',
  review: '↻',
  dialogue: '◉',
  reading: '▤',
};

/**
 * Главная кнопка приложения: одна, всегда знает, куда вести, и всегда
 * говорит, что за ней будет.
 *
 * Обещание сформулировано как «сейчас откроется вот это», а не как долг.
 * Разница в одном слове, но именно она решает, открывают приложение
 * из интереса или из чувства вины.
 */
export function TodayCard({ action, onPress }: Props) {
  // Медленное «дыхание» подсветки: карточка живая, но не мигает и не
  // требует внимания рывком.
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const haloOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.halo, { opacity: haloOpacity }]} pointerEvents="none" />

      <View style={styles.card}>
        <View style={styles.head}>
          <Text style={styles.mark}>{KIND_MARK[action.kind]}</Text>
          <Text style={styles.kicker}>{action.title.toUpperCase()}</Text>
          <Text style={styles.meta}>{action.meta}</Text>
        </View>

        <Text style={styles.teaser}>{action.teaser}</Text>

        <Press onPress={onPress} style={[styles.button, glow]} feedback="select" scaleTo={0.975}>
          <Text style={styles.buttonText}>{action.action}</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </Press>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  halo: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 10,
    bottom: -4,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryGlow,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderBright,
    padding: spacing.lg,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mark: { fontSize: 12, color: colors.primaryBright, fontWeight: '800' },
  kicker: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  meta: { fontSize: 10, color: colors.textFaint, fontWeight: '700' },
  teaser: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 25,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
  },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  buttonArrow: { color: colors.white, fontSize: 15, fontWeight: '800' },
});
