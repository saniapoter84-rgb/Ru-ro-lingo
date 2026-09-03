import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, radius, spacing, softShadow } from '../theme/colors';
import { getAchievement } from '../logic/achievements';
import { Lang, t } from '../i18n/strings';

interface Props {
  ids: string[];
  lang: Lang;
  onDismiss: () => void;
}

/** Всплывашка о новой ачивке. Сама уезжает через несколько секунд. */
export function AchievementToast({ ids, lang, onDismiss }: Props) {
  const slide = useRef(new Animated.Value(0)).current;
  const id = ids[0];

  useEffect(() => {
    if (!id) return;
    slide.setValue(0);
    Animated.spring(slide, { toValue: 1, friction: 7, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(slide, { toValue: 0, duration: 200, useNativeDriver: true }).start(
        onDismiss
      );
    }, 3600);
    return () => clearTimeout(timer);
  }, [id, slide, onDismiss]);

  if (!id) return null;
  const achievement = getAchievement(id);
  if (!achievement) return null;

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] });

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY }], opacity: slide }]}>
      <Pressable style={styles.card} onPress={onDismiss}>
        <Text style={styles.emoji}>{achievement.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{t('lesson.newAchievement', lang)}</Text>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>
            {achievement.description}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 8,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 50,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.cardHover,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.md,
    ...softShadow,
  },
  emoji: { fontSize: 30 },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primaryBright,
  },
  title: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 2 },
  desc: { fontSize: 12, color: colors.textDim, marginTop: 1 },
});
