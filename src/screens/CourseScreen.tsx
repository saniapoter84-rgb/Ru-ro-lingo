import React, { useMemo, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, softShadow, FLAG_NATIVE, FLAG_TARGET } from '../theme/colors';
import { COURSE, CourseChapter, GrammarLesson, countTasks } from '../data/course';
import {
  ProgressState,
  chapterRatio,
  isChapterComplete,
  isCourseLessonUnlocked,
  nextCourseLessonId,
} from '../logic/progress';
import { ProgressBar } from '../components/ProgressBar';
import { Hearts } from '../components/Hearts';
import { Lang, t } from '../i18n/strings';

interface Props {
  progress: ProgressState;
  lang: Lang;
  onOpenLesson: (lesson: GrammarLesson, chapter: CourseChapter) => void;
  /** Справочник — та же грамматика, но списком, без заданий. */
  onOpenReference: () => void;
}

export function CourseScreen({ progress, lang, onOpenLesson, onOpenReference }: Props) {
  const nextId = useMemo(() => nextCourseLessonId(progress), [progress]);
  const scrollRef = useRef<ScrollView>(null);

  const doneCount = COURSE.reduce(
    (sum, chapter) =>
      sum + chapter.lessons.filter((l) => progress.course[l.id]?.completed).length,
    0
  );
  const totalCount = COURSE.reduce((sum, chapter) => sum + chapter.lessons.length, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>
            {FLAG_NATIVE} RU <Text style={styles.brandArrow}>→</Text> RO {FLAG_TARGET}
          </Text>
          <Text style={styles.title}>{t('course.title', lang)}</Text>
        </View>
        <Pressable onPress={onOpenReference} style={styles.refButton} hitSlop={8}>
          <Text style={styles.refIcon}>≡</Text>
        </Pressable>
        <Hearts hearts={progress.hearts} />
      </View>

      <View style={styles.overallRow}>
        <ProgressBar ratio={totalCount === 0 ? 0 : doneCount / totalCount} height={4} />
        <Text style={styles.overallText}>
          {doneCount} {t('common.of', lang)} {totalCount} {t('course.lessons', lang)}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {COURSE.map((chapter, chapterIndex) => (
          <ChapterBlock
            key={chapter.id}
            chapter={chapter}
            chapterIndex={chapterIndex}
            progress={progress}
            lang={lang}
            nextId={nextId}
            onOpenLesson={onOpenLesson}
          />
        ))}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

function ChapterBlock({
  chapter,
  chapterIndex,
  progress,
  lang,
  nextId,
  onOpenLesson,
}: {
  chapter: CourseChapter;
  chapterIndex: number;
  progress: ProgressState;
  lang: Lang;
  nextId: string | null;
  onOpenLesson: (lesson: GrammarLesson, chapter: CourseChapter) => void;
}) {
  const ratio = chapterRatio(progress, chapter.id);
  const complete = isChapterComplete(progress, chapter.id);

  return (
    <View style={styles.chapter}>
      <View style={styles.chapterHeader}>
        <View style={[styles.chapterMark, { borderColor: chapter.color }]}>
          <Text style={styles.chapterEmoji}>{chapter.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.chapterTitleRow}>
            <Text style={styles.chapterIndex}>
              {String(chapterIndex + 1).padStart(2, '0')}
            </Text>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <View style={[styles.levelPill, { borderColor: chapter.color }]}>
              <Text style={[styles.levelText, { color: chapter.color }]}>{chapter.level}</Text>
            </View>
          </View>
          <Text style={styles.chapterSubtitle}>{chapter.subtitle}</Text>
        </View>
      </View>

      <View style={styles.chapterBar}>
        <ProgressBar ratio={ratio} color={chapter.color} height={3} />
      </View>

      {complete ? (
        <Text style={[styles.chapterDone, { color: chapter.color }]}>
          ✓ {t('course.chapterDone', lang)}
        </Text>
      ) : null}

      <View style={styles.lessonList}>
        {chapter.lessons.map((lesson, i) => {
          const unlocked = isCourseLessonUnlocked(progress, lesson.id);
          const entry = progress.course[lesson.id];
          return (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              index={i}
              chapter={chapter}
              unlocked={unlocked}
              completed={!!entry?.completed}
              perfect={!!entry?.perfect}
              isNext={nextId === lesson.id}
              lang={lang}
              onPress={() => onOpenLesson(lesson, chapter)}
            />
          );
        })}
      </View>
    </View>
  );
}

function LessonRow({
  lesson,
  index,
  chapter,
  unlocked,
  completed,
  perfect,
  isNext,
  lang,
  onPress,
}: {
  lesson: GrammarLesson;
  index: number;
  chapter: CourseChapter;
  unlocked: boolean;
  completed: boolean;
  perfect: boolean;
  isNext: boolean;
  lang: Lang;
  onPress: () => void;
}) {
  const boss = !!lesson.boss;

  return (
    <Pressable
      disabled={!unlocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.lessonRow,
        boss && styles.lessonRowBoss,
        isNext && [styles.lessonRowNext, { borderColor: chapter.color }, softShadow],
        !unlocked && styles.lessonRowLocked,
        pressed && unlocked && styles.lessonRowPressed,
      ]}
    >
      <View
        style={[
          styles.node,
          completed && { backgroundColor: chapter.color, borderColor: chapter.color },
          isNext && { borderColor: chapter.color },
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
          {completed ? '✓' : boss ? '★' : index + 1}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.lessonTitleRow}>
          <Text style={[styles.lessonTitle, !unlocked && styles.textLocked]} numberOfLines={1}>
            {lesson.title}
          </Text>
          {perfect ? <Text style={styles.perfectMark}>💎</Text> : null}
        </View>
        <Text style={[styles.lessonSubtitle, !unlocked && styles.textLocked]} numberOfLines={2}>
          {unlocked ? lesson.subtitle : t('course.locked', lang)}
        </Text>
      </View>

      <View style={styles.lessonMeta}>
        {boss ? (
          <Text style={[styles.bossTag, { color: chapter.color }]}>
            {t('course.boss', lang).toUpperCase()}
          </Text>
        ) : null}
        <Text style={styles.taskCount}>{countTasks(lesson)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  brand: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: colors.textFaint,
  },
  brandArrow: { color: colors.primaryBright },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 2 },
  refButton: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refIcon: { fontSize: 17, color: colors.textDim, fontWeight: '700' },
  overallRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: 6 },
  overallText: { fontSize: 11, color: colors.textFaint, fontWeight: '600' },
  scroll: { paddingHorizontal: spacing.lg },

  chapter: { marginBottom: spacing.xxl },
  chapterHeader: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  chapterMark: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  chapterEmoji: { fontSize: 20 },
  chapterTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chapterIndex: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textFaint,
    fontVariant: ['tabular-nums'],
  },
  chapterTitle: { fontSize: 17, fontWeight: '800', color: colors.text, flexShrink: 1 },
  levelPill: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  levelText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  chapterSubtitle: { fontSize: 12, color: colors.textDim, marginTop: 3 },
  chapterBar: { marginTop: spacing.md, marginBottom: spacing.sm },
  chapterDone: { fontSize: 11, fontWeight: '700', marginBottom: spacing.sm },
  lessonList: { gap: spacing.sm, marginTop: spacing.sm },

  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  lessonRowBoss: { backgroundColor: colors.bgElevated },
  lessonRowNext: { borderWidth: 1.5, backgroundColor: colors.cardHover },
  lessonRowLocked: { opacity: 0.45 },
  lessonRowPressed: { backgroundColor: colors.cardHover, transform: [{ scale: 0.995 }] },

  node: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
  },
  nodeLocked: { borderColor: colors.border },
  nodeText: { color: colors.textDim, fontWeight: '800', fontSize: 13 },
  nodeTextDone: { color: colors.bg },
  nodeTextLocked: { color: colors.textFaint },

  lessonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lessonTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  perfectMark: { fontSize: 11 },
  lessonSubtitle: { fontSize: 11, color: colors.textDim, marginTop: 2 },
  textLocked: { color: colors.textFaint },
  lessonMeta: { alignItems: 'flex-end', gap: 2 },
  bossTag: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  taskCount: { fontSize: 11, color: colors.textFaint, fontVariant: ['tabular-nums'] },
});
