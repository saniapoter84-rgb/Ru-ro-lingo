import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Press } from '../components/Press';
import { Reveal } from '../components/Reveal';
import { colors, radius, spacing } from '../theme/colors';
import { UNITS, getLessonsForUnit, Lesson } from '../data';
import {
  ProgressState,
  getDueWordIds,
  isLessonUnlocked,
  unitProgressRatio,
} from '../logic/progress';
import { ProgressBar } from '../components/ProgressBar';
import { Lang, t } from '../i18n/strings';
import { PrimaryButton } from '../components/PrimaryButton';
import { Panel } from '../components/Panel';

interface Props {
  progress: ProgressState;
  lang: Lang;
  onOpenLesson: (lesson: Lesson) => void;
  onStartReview: (wordIds: string[]) => void;
}

/** Сколько слов берём в одну сессию повторения — чтобы она не пугала объёмом. */
const REVIEW_BATCH = 15;

export function HomeScreen({ progress, lang, onOpenLesson, onStartReview }: Props) {
  const dueIds = getDueWordIds(progress);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t('home.title', lang)}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle', lang)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Panel active={dueIds.length > 0} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewCount}>{dueIds.length}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewTitle}>{t('review.title', lang)}</Text>
              <Text style={styles.reviewHint}>
                {dueIds.length > 0 ? t('review.due', lang) : t('review.none', lang)}
              </Text>
            </View>
          </View>
          {dueIds.length > 0 ? (
            <PrimaryButton
              title={t('review.start', lang)}
              small
              onPress={() => onStartReview(dueIds.slice(0, REVIEW_BATCH))}
              style={{ marginTop: spacing.md }}
            />
          ) : null}
        </Panel>

        {UNITS.map((unit, unitIndex) => {
          const lessons = getLessonsForUnit(unit.id);
          const ratio = unitProgressRatio(progress, unit.id);
          return (
            <Reveal key={unit.id} delay={Math.min(unitIndex, 8) * 25} style={styles.unitCard}>
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
                    <Press
                      key={lesson.id}
                      disabled={!unlocked}
                      onPress={() => onOpenLesson(lesson)}
                      feedback={unlocked ? 'select' : null}
                      scaleTo={0.9}
                      style={[
                        styles.node,
                        completed && styles.nodeCompleted,
                        !unlocked && styles.nodeLocked,
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
                    </Press>
                  );
                })}
              </View>
            </Reveal>
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

  reviewCard: { marginBottom: spacing.lg },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reviewCount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryBright,
    fontVariant: ['tabular-nums'],
    minWidth: 42,
  },
  reviewTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  reviewHint: { fontSize: 11, color: colors.textDim, marginTop: 3, lineHeight: 15 },
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
