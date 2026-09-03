import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { UNITS, getLessonsForUnit, Lesson } from '../data';
import { ProgressState, isLessonUnlocked, unitProgressRatio } from '../logic/progress';
import { ProgressBar } from '../components/ProgressBar';
import { Hearts } from '../components/Hearts';
import { Lang, t } from '../i18n/strings';

interface Props {
  progress: ProgressState;
  lang: Lang;
  onOpenLesson: (lesson: Lesson) => void;
}

export function HomeScreen({ progress, lang, onOpenLesson }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t('home.title', lang)}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle', lang)}</Text>
        </View>
        <Hearts hearts={progress.hearts} showTimer={false} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {UNITS.map((unit) => {
          const lessons = getLessonsForUnit(unit.id);
          const ratio = unitProgressRatio(progress, unit.id);
          return (
            <View key={unit.id} style={styles.unitCard}>
              <View style={styles.unitHeader}>
                <View style={styles.unitEmojiBox}>
                  <Text style={styles.unitEmoji}>{unit.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <View style={styles.unitBar}>
                    <ProgressBar ratio={ratio} height={3} color={colors.accent} />
                  </View>
                </View>
                <Text style={styles.unitPercent}>{Math.round(ratio * 100)}%</Text>
              </View>

              <View style={styles.nodeRow}>
                {lessons.map((lesson, i) => {
                  const unlocked = isLessonUnlocked(progress, lesson);
                  const completed = progress.completedLessonIds.includes(lesson.id);
                  return (
                    <Pressable
                      key={lesson.id}
                      disabled={!unlocked}
                      onPress={() => onOpenLesson(lesson)}
                      style={({ pressed }) => [
                        styles.node,
                        completed && styles.nodeCompleted,
                        !unlocked && styles.nodeLocked,
                        pressed && unlocked && styles.nodePressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.nodeText,
                          completed && styles.nodeTextDone,
                          !unlocked && styles.nodeTextLocked,
                        ]}
                      >
                        {completed ? '✓' : i + 1}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12, color: colors.textDim, marginTop: 3 },
  scroll: { paddingHorizontal: spacing.lg },

  unitCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  unitHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  unitEmojiBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitEmoji: { fontSize: 17 },
  unitTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  unitBar: { marginTop: 6 },
  unitPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textFaint,
    fontVariant: ['tabular-nums'],
  },
  nodeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  node: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderBright,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCompleted: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  nodeLocked: { borderColor: colors.border, opacity: 0.4 },
  nodePressed: { backgroundColor: colors.cardHover },
  nodeText: { color: colors.textDim, fontWeight: '700', fontSize: 12 },
  nodeTextDone: { color: colors.accent },
  nodeTextLocked: { color: colors.textFaint },
});
