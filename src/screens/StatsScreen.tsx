import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { UNITS } from '../data';
import { ProgressState, overallStats, unitProgressRatio } from '../logic/progress';
import { ProgressBar } from '../components/ProgressBar';

interface Props {
  progress: ProgressState;
  onBack: () => void;
}

export function StatsScreen({ progress, onBack }: Props) {
  const stats = overallStats(progress);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Мой прогресс</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatCard emoji="🔥" label="Дней подряд" value={String(stats.streak)} />
          <StatCard emoji="⭐" label="Очки опыта" value={String(stats.xp)} />
          <StatCard emoji="✅" label="Слов освоено" value={`${stats.mastered}/${stats.total}`} />
          <StatCard emoji="📚" label="Учу сейчас" value={String(stats.learning)} />
        </View>

        <Text style={styles.sectionTitle}>По темам</Text>
        {UNITS.map((unit) => {
          const ratio = unitProgressRatio(progress, unit.id);
          return (
            <View key={unit.id} style={styles.unitRow}>
              <Text style={styles.unitEmoji}>{unit.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <ProgressBar ratio={ratio} />
              </View>
              <Text style={styles.unitPercent}>{Math.round(ratio * 100)}%</Text>
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  back: { fontSize: 22, color: colors.text },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textLight, marginBottom: 10 },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitEmoji: { fontSize: 20 },
  unitTitle: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  unitPercent: { fontSize: 13, fontWeight: '700', color: colors.textLight },
});
