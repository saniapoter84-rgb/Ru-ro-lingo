import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { UNITS } from '../data';
import { COURSE } from '../data/course';
import {
  ProgressState,
  chapterRatio,
  getNextRank,
  getRank,
  overallStats,
  rankRatio,
  unitProgressRatio,
  buildAchievementContext,
} from '../logic/progress';
import { ACHIEVEMENTS } from '../logic/achievements';
import { Quest, isQuestDone, questEmoji, questLabel, questReward } from '../logic/quests';
import { rhythmSummary } from '../logic/rhythm';
import { PLAN_LENGTH_WEEKS, dailyLoad, formatDate, planStatus } from '../logic/plan';
import { ProgressBar } from '../components/ProgressBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { Panel, SectionLabel } from '../components/Panel';
import { Press } from '../components/Press';
import { RhythmStrip } from '../components/RhythmStrip';
import { Lang, t } from '../i18n/strings';

interface Props {
  progress: ProgressState;
  lang: Lang;
  onToggleImmersion: () => void;
  onChangeGoal: (goal: number) => void;
  onOpenPlacement: () => void;
}

const GOALS = [30, 50, 100, 200];

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}

export function ProfileScreen({
  progress,
  lang,
  onToggleImmersion,
  onChangeGoal,
  onOpenPlacement,
}: Props) {
  const stats = overallStats(progress);
  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const ctx = buildAchievementContext(progress);
  const unlocked = new Set(progress.achievements);
  const goalRatio = stats.dailyGoal === 0 ? 0 : stats.dailyXp / stats.dailyGoal;
  const rhythm = rhythmSummary(progress);
  const plan = planStatus(progress);
  const load = dailyLoad(progress, plan);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.title', lang)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Ранг */}
        <Panel style={styles.rankCard}>
          <View style={styles.rankRow}>
            <Text style={styles.rankEmoji}>{rank.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rankLabel}>{t('profile.rank', lang)}</Text>
              <Text style={styles.rankName}>{lang === 'ru' ? rank.ru : rank.ro}</Text>
            </View>
            <Text style={styles.rankXp}>{progress.xp} XP</Text>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <ProgressBar ratio={rankRatio(progress.xp)} height={4} />
          </View>
          {nextRank ? (
            <Text style={styles.rankNext}>
              {nextRank.xp - progress.xp} XP {t('profile.toNextRank', lang)} ·{' '}
              {lang === 'ru' ? nextRank.ru : nextRank.ro}
            </Text>
          ) : null}
        </Panel>

        {/* Ритм: история занятий, которую нельзя потерять */}
        <Panel style={styles.rhythmCard}>
          <View style={styles.rhythmHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rhythmValue}>
                {rhythm.totalDays}
                <Text style={styles.rhythmUnit}> {pluralDays(rhythm.totalDays)} с языком</Text>
              </Text>
              <Text style={styles.rhythmHint}>
                Этот счётчик только растёт. Пропущенный день ничего не отнимает — он просто
                остаётся незакрашенным.
              </Text>
            </View>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <RhythmStrip days={rhythm.days} color={colors.primary} />
          </View>
          <View style={styles.rhythmFooter}>
            <Text style={styles.rhythmFoot}>сейчас подряд — {rhythm.run}</Text>
            <Text style={styles.rhythmFoot}>лучший отрезок — {rhythm.best}</Text>
          </View>
        </Panel>

        {/* План */}
        {plan.started ? (
          <Panel style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>
                План до B1 · неделя {plan.currentWeek} из {PLAN_LENGTH_WEEKS}
              </Text>
              <Text style={styles.goalValue}>{Math.round(plan.overallRatio * 100)}%</Text>
            </View>
            <ProgressBar ratio={plan.overallRatio} height={6} />
            <Text style={styles.settingHint}>
              Дедлайн — {plan.deadline ? formatDate(plan.deadline) : '—'}. При нынешнем темпе
              выйдешь на B1{' '}
              {plan.projectedFinish ? formatDate(plan.projectedFinish) : 'пока непонятно когда'}.
              Норма рабочего дня — {load.minutes} мин, свободных дней в неделе — два.
            </Text>
          </Panel>
        ) : null}

        {/* Цель дня */}
        <Panel style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{t('profile.dailyGoal', lang)}</Text>
            <Text style={styles.goalValue}>
              {stats.dailyXp}
              <Text style={styles.goalMax}>/{stats.dailyGoal}</Text>
            </Text>
          </View>
          <ProgressBar
            ratio={goalRatio}
            color={goalRatio >= 1 ? colors.success : colors.primary}
            height={8}
          />
          {goalRatio >= 1 ? (
            <Text style={styles.goalDone}>✓ {t('profile.goalDone', lang)}</Text>
          ) : null}
          <View style={styles.goalPicker}>
            {GOALS.map((goal) => (
              <Press
                key={goal}
                onPress={() => onChangeGoal(goal)}
                feedback="select"
                style={[styles.goalChip, stats.dailyGoal === goal && styles.goalChipActive]}
              >
                <Text
                  style={[
                    styles.goalChipText,
                    stats.dailyGoal === goal && styles.goalChipTextActive,
                  ]}
                >
                  {goal}
                </Text>
              </Press>
            ))}
          </View>
        </Panel>

        {/* Цифры */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="▲"
            tint={colors.warning}
            value={String(rhythm.totalDays)}
            label={t('profile.daysWithLanguage', lang)}
          />
          <StatCard
            icon="★"
            tint={colors.primaryBright}
            value={String(stats.xp)}
            label={t('profile.xp', lang)}
          />
          <StatCard
            icon="✓"
            tint={colors.success}
            value={`${stats.mastered}/${stats.total}`}
            label={t('profile.wordsMastered', lang)}
          />
          <StatCard
            icon="◆"
            tint={colors.accent}
            value={`${stats.courseDone}/${stats.courseTotal}`}
            label={t('course.title', lang)}
          />
        </View>

        {/* Задания дня */}
        <SectionLabel>{t('profile.quests', lang)}</SectionLabel>
        {progress.quests.quests.map((quest, i) => (
          <QuestRow key={`${quest.kind}-${i}`} quest={quest} />
        ))}

        {/* Курс */}
        <View style={{ height: spacing.xl }} />
        <SectionLabel>{t('profile.courseProgress', lang)}</SectionLabel>
        {COURSE.map((chapter) => {
          const ratio = chapterRatio(progress, chapter.id);
          return (
            <View key={chapter.id} style={styles.row}>
              <Text style={styles.rowEmoji}>{chapter.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{chapter.title}</Text>
                <ProgressBar ratio={ratio} color={chapter.color} height={3} />
              </View>
              <Text style={styles.rowPercent}>{Math.round(ratio * 100)}%</Text>
            </View>
          );
        })}

        {/* Ачивки */}
        <View style={{ height: spacing.xl }} />
        <SectionLabel>
          {t('profile.achievements', lang)} · {unlocked.size}/{ACHIEVEMENTS.length}
        </SectionLabel>
        <View style={styles.badgeGrid}>
          {ACHIEVEMENTS.map((achievement) => {
            const has = unlocked.has(achievement.id);
            const hidden = achievement.secret && !has;
            const ratio = achievement.progress ? achievement.progress(ctx) : has ? 1 : 0;
            return (
              <View
                key={achievement.id}
                style={[styles.badge, has && styles.badgeUnlocked]}
              >
                <Text style={[styles.badgeEmoji, !has && styles.badgeEmojiLocked]}>
                  {hidden ? '❔' : achievement.emoji}
                </Text>
                <Text style={[styles.badgeTitle, !has && styles.badgeTitleLocked]} numberOfLines={1}>
                  {hidden ? t('profile.secret', lang) : achievement.title}
                </Text>
                {!hidden ? (
                  <Text style={styles.badgeDesc} numberOfLines={2}>
                    {achievement.description}
                  </Text>
                ) : null}
                {!has && !hidden ? (
                  <View style={{ marginTop: 6 }}>
                    <ProgressBar ratio={ratio} height={2} color={colors.textFaint} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        {/* Словарь */}
        <View style={{ height: spacing.xl }} />
        <SectionLabel>{t('profile.byTopic', lang)}</SectionLabel>
        {UNITS.map((unit) => {
          const ratio = unitProgressRatio(progress, unit.id);
          return (
            <View key={unit.id} style={styles.row}>
              <Text style={styles.rowEmoji}>{unit.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{unit.title}</Text>
                <ProgressBar ratio={ratio} height={3} color={colors.accent} />
              </View>
              <Text style={styles.rowPercent}>{Math.round(ratio * 100)}%</Text>
            </View>
          );
        })}

        {/* Настройки */}
        <View style={{ height: spacing.xl }} />
        <SectionLabel>{t('profile.settings', lang)}</SectionLabel>
        <Panel>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>{t('immersion.title', lang)}</Text>
              <Text style={styles.settingHint}>{t('immersion.toggleHint', lang)}</Text>
            </View>
            <Switch
              value={progress.immersion}
              onValueChange={onToggleImmersion}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </Panel>

        <Panel style={{ marginTop: spacing.sm }}>
          <Text style={styles.settingTitle}>Тест на уровень</Text>
          <Text style={styles.settingHint}>
            {progress.placement
              ? `Пройден ${progress.placement.date}: зачтено глав — ${progress.placement.chapters}. Можно пройти заново, уже сделанное вручную не пострадает.`
              : 'Проверит текущий уровень и отметит главы, которые ты уже знаешь.'}
          </Text>
          <PrimaryButton
            title={progress.placement ? 'Пройти заново' : 'Пройти тест'}
            small
            variant="ghost"
            onPress={onOpenPlacement}
            style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
          />
        </Panel>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  tint,
}: {
  icon: string;
  value: string;
  label: string;
  tint: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statIcon, { color: tint }]}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuestRow({ quest }: { quest: Quest }) {
  const done = isQuestDone(quest);
  return (
    <View style={[styles.questRow, done && styles.questRowDone]}>
      <Text style={styles.questEmoji}>{questEmoji(quest)}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.questLabel, done && styles.questLabelDone]}>
          {questLabel(quest)}
        </Text>
        <View style={styles.questBar}>
          <ProgressBar
            ratio={quest.progress / quest.target}
            height={3}
            color={done ? colors.success : colors.primary}
          />
        </View>
      </View>
      <View style={styles.questRight}>
        <Text style={[styles.questCount, done && { color: colors.success }]}>
          {Math.min(quest.progress, quest.target)}/{quest.target}
        </Text>
        <Text style={styles.questReward}>+{questReward(quest)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  title: { flex: 1, fontSize: 24, fontWeight: '800', color: colors.text },
  scroll: { paddingHorizontal: spacing.lg },

  rankCard: { marginBottom: spacing.md },
  rhythmCard: { marginBottom: spacing.md },
  rhythmHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rhythmValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  rhythmUnit: { fontSize: 12, fontWeight: '600', color: colors.textDim },
  rhythmHint: { fontSize: 11, color: colors.textFaint, marginTop: 4, lineHeight: 16 },
  rhythmFooter: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  rhythmFoot: { fontSize: 10, color: colors.textFaint, fontWeight: '600' },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rankEmoji: { fontSize: 30 },
  rankLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  rankName: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 2 },
  rankXp: { fontSize: 13, fontWeight: '700', color: colors.primaryBright },
  rankNext: { fontSize: 11, color: colors.textFaint, marginTop: spacing.sm },

  goalCard: { marginBottom: spacing.lg },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  goalTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  goalValue: { fontSize: 17, fontWeight: '800', color: colors.text },
  goalMax: { fontSize: 13, color: colors.textFaint, fontWeight: '600' },
  goalDone: { fontSize: 11, color: colors.success, fontWeight: '700', marginTop: spacing.sm },
  goalPicker: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  goalChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goalChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDim },
  goalChipText: { fontSize: 12, color: colors.textDim, fontWeight: '700' },
  goalChipTextActive: { color: colors.primaryBright },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: {
    width: '47.6%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statIcon: { fontSize: 14, marginBottom: 6, fontWeight: '700' },
  statValue: { fontSize: 19, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textFaint, marginTop: 2 },

  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  questRowDone: { borderColor: colors.success, backgroundColor: colors.successDim },
  questEmoji: { fontSize: 14, color: colors.textDim, fontWeight: '700', width: 18, textAlign: 'center' },
  questLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  questLabelDone: { color: colors.textDim },
  questBar: { width: '100%' },
  questRight: { alignItems: 'flex-end' },
  questCount: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDim,
    fontVariant: ['tabular-nums'],
  },
  questReward: { fontSize: 10, color: colors.textFaint, marginTop: 2 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowEmoji: { fontSize: 16, width: 22 },
  rowTitle: { fontSize: 12, color: colors.textDim, marginBottom: 5 },
  rowPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textFaint,
    width: 34,
    textAlign: 'right',
  },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    width: '47.6%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    opacity: 0.6,
  },
  badgeUnlocked: { opacity: 1, borderColor: colors.primary, backgroundColor: colors.cardHover },
  badgeEmoji: { fontSize: 20 },
  badgeEmojiLocked: { opacity: 0.5 },
  badgeTitle: { fontSize: 12, fontWeight: '800', color: colors.text, marginTop: 6 },
  badgeTitleLocked: { color: colors.textDim },
  badgeDesc: { fontSize: 10, color: colors.textFaint, marginTop: 3, lineHeight: 14 },

  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  settingTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  settingHint: { fontSize: 11, color: colors.textDim, marginTop: 4, lineHeight: 16 },
});
