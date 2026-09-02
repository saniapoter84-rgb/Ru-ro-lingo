import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { UNITS, getLessonsForUnit, Lesson } from '../data';
import { ProgressState, isLessonUnlocked, unitProgressRatio, overallStats } from '../logic/progress';
import { ProgressBar } from '../components/ProgressBar';

interface Props {
  progress: ProgressState;
  onOpenLesson: (lesson: Lesson) => void;
  onOpenStats: () => void;
}

export function HomeScreen({ progress, onOpenLesson, onOpenStats }: Props) {
  const stats = overallStats(progress);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>RU 🇷🇺 → RO 🇷🇴</Text>
        <Pressable onPress={onOpenStats} style={styles.statsPill} hitSlop={6}>
          <Text style={styles.statsPillText}>🔥 {stats.streak}</Text>
        </Pressable>
        <Pressable onPress={onOpenStats} style={styles.statsPill} hitSlop={6}>
          <Text style={styles.statsPillText}>⭐ {stats.xp}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {UNITS.map((unit) => {
          const lessons = getLessonsForUnit(unit.id);
          const ratio = unitProgressRatio(progress, unit.id);
          return (
            <View key={unit.id} style={styles.unitCard}>
              <View style={styles.unitHeader}>
                <Text style={styles.unitEmoji}>{unit.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <ProgressBar ratio={ratio} />
                </View>
              </View>
              <View style={styles.lessonRow}>
                {lessons.map((lesson, i) => {
                  const unlocked = isLessonUnlocked(progress, lesson);
                  const completed = progress.completedLessonIds.includes(lesson.id);
                  return (
                    <Pressable
                      key={lesson.id}
                      disabled={!unlocked}
                      onPress={() => onOpenLesson(lesson)}
                      style={[
                        styles.node,
                        completed && styles.nodeCompleted,
                        !unlocked && styles.nodeLocked,
                      ]}
                    >
                      <Text style={styles.nodeText}>{completed ? '✓' : i + 1}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  appTitle: { fontSize: 18, fontWeight: '800', color: colors.text, flex: 1 },
  statsPill: {
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsPillText: { fontWeight: '700', color: colors.text },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  unitCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  unitEmoji: { fontSize: 28 },
  unitTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 6 },
  lessonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  node: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCompleted: { backgroundColor: colors.primary },
  nodeLocked: { backgroundColor: colors.locked },
  nodeText: { color: colors.white, fontWeight: '800' },
});
