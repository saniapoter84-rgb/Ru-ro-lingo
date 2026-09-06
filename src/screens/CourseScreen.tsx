import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, radius, spacing, softShadow, FLAG_NATIVE, FLAG_TARGET } from '../theme/colors';
import { COURSE, CourseChapter, GrammarLesson, countTasks } from '../data/course';
import { UNITS, getUnitById } from '../data';
import { LIVE_TEXTS } from '../data/texts';
import { DIALOGUES } from '../data/dialogues';
import { PLANNED_UNIT_IDS, PlanWeek } from '../data/plan';
import {
  ProgressState,
  isCourseLessonUnlocked,
  nextCourseLessonId,
} from '../logic/progress';
import {
  DailyLoad,
  PLAN_LENGTH_WEEKS,
  WORK_DAYS_PER_WEEK,
  WeekStatus,
  dailyLoad,
  dayGoalXp,
  formatDate,
  planStartLabel,
  planStatus,
} from '../logic/plan';
import { NextAction, nextAction } from '../logic/today';
import { rhythmSummary } from '../logic/rhythm';
import { ProgressBar } from '../components/ProgressBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { Panel } from '../components/Panel';
import { Press } from '../components/Press';
import { Reveal } from '../components/Reveal';
import { TodayCard } from '../components/TodayCard';
import { RhythmStrip } from '../components/RhythmStrip';
import { Lang, t } from '../i18n/strings';

interface Props {
  progress: ProgressState;
  lang: Lang;
  onOpenLesson: (lesson: GrammarLesson, chapter: CourseChapter) => void;
  onOpenReference: () => void;
  onOpenPlacement: () => void;
  onStartPlan: () => void;
  onOpenUnit: (unitId: string) => void;
  onOpenText: (textId: string) => void;
  onOpenDialogue: (dialogueId: string) => void;
  onRunAction: (action: NextAction) => void;
}

const PLAN_DAYS_TOTAL = PLAN_LENGTH_WEEKS * 7;

const LEVEL_COLOR: Record<PlanWeek['level'], string> = {
  A0: '#A78BFA',
  A1: '#22D3EE',
  A2: '#34D399',
  B1: '#F0ABFC',
};

export function CourseScreen({
  progress,
  lang,
  onOpenLesson,
  onOpenReference,
  onOpenPlacement,
  onStartPlan,
  onOpenUnit,
  onOpenText,
  onOpenDialogue,
  onRunAction,
}: Props) {
  const status = useMemo(() => planStatus(progress), [progress]);
  const action = useMemo(() => nextAction(progress), [progress]);
  const rhythm = useMemo(() => rhythmSummary(progress), [progress]);
  const load = useMemo(() => dailyLoad(progress, status), [progress, status]);
  const nextId = useMemo(() => nextCourseLessonId(progress), [progress]);

  const [openWeek, setOpenWeek] = useState<number>(status.currentWeek);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>
            {FLAG_NATIVE} RU <Text style={styles.brandArrow}>→</Text> RO {FLAG_TARGET}
          </Text>
          <Text style={styles.title}>{t('course.title', lang)}</Text>
        </View>
        <Press onPress={onOpenReference} style={styles.refButton} feedback="select" hitSlop={8}>
          <Text style={styles.refIcon}>≡</Text>
        </Press>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TodayCard action={action} onPress={() => onRunAction(action)} />

        {status.started ? (
          <PlanBanner status={status} progress={progress} onRebase={onStartPlan} load={load} />
        ) : (
          <PlanInvite load={load} onStart={onStartPlan} />
        )}

        <Panel style={styles.rhythmCard}>
          <View style={styles.rhythmHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rhythmValue}>
                {rhythm.totalDays}
                <Text style={styles.rhythmUnit}>
                  {' '}
                  {plural(rhythm.totalDays, 'день', 'дня', 'дней')} с языком
                </Text>
              </Text>
              <Text style={styles.rhythmHint}>
                {rhythm.run > 1
                  ? `сейчас ${rhythm.run} подряд · лучший отрезок ${rhythm.best}`
                  : 'пропущенный день ничего не сжигает'}
              </Text>
            </View>
            <Text style={styles.rhythmWeek}>{rhythm.thisWeek}/7</Text>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <RhythmStrip days={rhythm.days} color={colors.primary} compact />
          </View>
        </Panel>

        {progress.placement === null ? (
          <Panel style={styles.testCard}>
            <Text style={styles.testTitle}>Уже что-то знаешь?</Text>
            <Text style={styles.testText}>
              Тест на уровень отметит недели, которые ты и так знаешь, и не заставит
              проходить их заново. Это единственный способ уложиться в два месяца, если
              начинаешь не с нуля.
            </Text>
            <PrimaryButton
              title="Пройти тест"
              small
              onPress={onOpenPlacement}
              style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
            />
          </Panel>
        ) : null}

        <Text style={styles.sectionTitle}>Восемь недель до B1</Text>

        {status.weeks.map((week, i) => (
          <Reveal key={week.week.index} delay={i * 30}>
            <WeekCard
              status={week}
              expanded={openWeek === week.week.index}
              isCurrent={status.currentWeek === week.week.index}
              calendarWeek={status.calendarWeek}
              planStarted={status.started}
              progress={progress}
              lang={lang}
              nextId={nextId}
              onToggle={() =>
                setOpenWeek((current) => (current === week.week.index ? -1 : week.week.index))
              }
              onOpenLesson={onOpenLesson}
              onOpenUnit={onOpenUnit}
              onOpenText={onOpenText}
              onOpenDialogue={onOpenDialogue}
            />
          </Reveal>
        ))}

        <ExtraUnits onOpenUnit={onOpenUnit} />
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

// --- Шапка плана --------------------------------------------------------

function PlanInvite({ load, onStart }: { load: DailyLoad; onStart: () => void }) {
  return (
    <Panel style={styles.planCard}>
      <Text style={styles.planKicker}>ПЛАН</Text>
      <Text style={styles.planTitle}>B1 за два месяца жизни</Text>
      <Text style={styles.planText}>
        Восемь недель календаря, а не восемь недель идеальной дисциплины. Норма
        разложена на {WORK_DAYS_PER_WEEK} дней в неделю — два дня заложены свободными
        заранее, и пропустить их значит выполнить план, а не сорвать его.
      </Text>

      <View style={styles.planRow}>
        <PlanStat label="в рабочий день" value={`${load.minutes} мин`} accent />
        <PlanStat label="уроков" value={String(load.lessons)} />
        <PlanStat label="слов" value={String(load.words)} />
      </View>

      <Text style={styles.planNote}>
        Если выпадет неделя — ничего не сгорит и не обнулится. Приложение просто
        пересчитает дату выхода на B1 по твоему настоящему темпу и покажет её честно.
      </Text>
      <PrimaryButton title="Начать план" onPress={onStart} style={{ marginTop: spacing.lg }} />
    </Panel>
  );
}

function PlanBanner({
  status,
  progress,
  load,
  onRebase,
}: {
  status: ReturnType<typeof planStatus>;
  progress: ProgressState;
  load: DailyLoad;
  onRebase: () => void;
}) {
  const week = status.weeks[Math.min(status.currentWeek, PLAN_LENGTH_WEEKS) - 1];
  const finished = status.overallRatio >= 0.999;
  const goal = dayGoalXp(load);
  const todayDone = progress.dailyXp >= goal;

  return (
    <Panel style={styles.planCard}>
      <View style={styles.planHead}>
        <Text style={styles.planKicker}>
          ПЛАН · СТАРТ {planStartLabel(progress)?.toUpperCase()}
        </Text>
        <Text style={styles.planDay}>день {status.dayOfPlan} из {PLAN_DAYS_TOTAL}</Text>
      </View>

      <Text style={styles.planTitle}>
        {finished
          ? 'План пройден'
          : `Неделя ${status.currentWeek} из ${PLAN_LENGTH_WEEKS} · ${week.week.title}`}
      </Text>

      <View style={{ marginTop: spacing.md }}>
        <ProgressBar ratio={status.overallRatio} height={6} />
      </View>
      <Text style={styles.planPercent}>
        {Math.round(status.overallRatio * 100)}% пути до B1
        {status.deadline ? ` · дедлайн ${formatDate(status.deadline)}` : ''}
      </Text>

      {finished ? (
        <Text style={styles.onTrackText}>
          Все восемь недель закрыты. Дальше язык держится живым текстом, сценами и
          повторением — курс для этого больше не нужен.
        </Text>
      ) : (
        <>
          {/* Сегодняшний день с явной границей: у занятия должен быть конец. */}
          <View style={[styles.todayBox, todayDone && styles.todayBoxDone]}>
            <View style={styles.todayHead}>
              <Text style={[styles.todayLabel, todayDone && { color: colors.success }]}>
                {todayDone ? '✓ на сегодня всё' : 'сегодня по плану'}
              </Text>
              <Text style={styles.todayValue}>
                {Math.min(progress.dailyXp, goal)}
                <Text style={styles.todayMax}>/{goal} XP</Text>
              </Text>
            </View>
            <ProgressBar
              ratio={goal === 0 ? 1 : progress.dailyXp / goal}
              color={todayDone ? colors.success : colors.primary}
              height={4}
            />
            <Text style={styles.todayHint}>
              {todayDone
                ? 'Дальше — только если самому хочется. Норма закрыта.'
                : `${load.lessons} ${plural(load.lessons, 'урок', 'урока', 'уроков')} и ~${load.words} слов · ${load.minutes} мин`}
            </Text>
          </View>

          <View style={styles.planRow}>
            <PlanStat
              label="эта неделя"
              value={`${status.daysThisWeek}/${WORK_DAYS_PER_WEEK}`}
            />
            <PlanStat
              label={status.bankedDays > 0 ? 'в запасе' : 'свободных дней'}
              value={
                status.bankedDays > 0
                  ? `+${status.bankedDays}`
                  : String(status.freeDaysLeft)
              }
            />
            <PlanStat
              label="выйдешь на B1"
              value={
                status.projectedFinish ? formatDate(status.projectedFinish) : 'пока рано судить'
              }
              accent
            />
          </View>

          {status.daysBehind > 2 ? (
            <View style={styles.behindBox}>
              <Text style={styles.behindText}>
                Свободные дни этой недели уже потрачены, и по факту накопилось около{' '}
                {status.daysBehind} {plural(status.daysBehind, 'дня', 'дней', 'дней')}{' '}
                отставания. Два выхода, оба нормальные: нагнать чуть большей нормой или
                сдвинуть дедлайн на сегодня и идти дальше своим темпом.
              </Text>
              <PrimaryButton
                title="Сдвинуть план на сегодня"
                small
                variant="ghost"
                onPress={onRebase}
                style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
              />
            </View>
          ) : (
            <Text style={styles.onTrackText}>
              {status.bankedDays > 0
                ? `Идёшь с запасом в ${status.bankedDays} ${plural(status.bankedDays, 'день', 'дня', 'дней')} — можно спокойно пропустить.`
                : 'Идёшь по графику. Осталось ' +
                  status.workDaysLeft +
                  ' ' +
                  plural(status.workDaysLeft, 'рабочий день', 'рабочих дня', 'рабочих дней') +
                  ' до дедлайна.'}
            </Text>
          )}
        </>
      )}
    </Panel>
  );
}

function PlanStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.planStat}>
      <Text style={[styles.planStatValue, accent && { color: colors.primaryBright }]}>
        {value}
      </Text>
      <Text style={styles.planStatLabel}>{label}</Text>
    </View>
  );
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

// --- Неделя -------------------------------------------------------------

function WeekCard({
  status,
  expanded,
  isCurrent,
  calendarWeek,
  planStarted,
  progress,
  lang,
  nextId,
  onToggle,
  onOpenLesson,
  onOpenUnit,
  onOpenText,
  onOpenDialogue,
}: {
  status: WeekStatus;
  expanded: boolean;
  isCurrent: boolean;
  calendarWeek: number;
  planStarted: boolean;
  progress: ProgressState;
  lang: Lang;
  nextId: string | null;
  onToggle: () => void;
  onOpenLesson: (lesson: GrammarLesson, chapter: CourseChapter) => void;
  onOpenUnit: (unitId: string) => void;
  onOpenText: (textId: string) => void;
  onOpenDialogue: (dialogueId: string) => void;
}) {
  const week = status.week;
  const tint = LEVEL_COLOR[week.level];
  const chapters = COURSE.filter((c) => week.chapterIds.includes(c.id));

  return (
    <View
      style={[
        styles.weekCard,
        isCurrent && [styles.weekCardCurrent, { borderColor: tint }, softShadow],
        status.complete && styles.weekCardDone,
      ]}
    >
      <Press onPress={onToggle} feedback="select" scaleTo={0.99} style={styles.weekHead}>
        <View style={[styles.weekBadge, { borderColor: tint }]}>
          <Text style={[styles.weekBadgeText, { color: tint }]}>
            {status.complete ? '✓' : week.index}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.weekTitleRow}>
            <Text style={styles.weekTitle}>{week.title}</Text>
            <View style={[styles.levelPill, { borderColor: tint }]}>
              <Text style={[styles.levelText, { color: tint }]}>{week.level}</Text>
            </View>
          </View>
          <Text style={styles.weekGoal} numberOfLines={expanded ? undefined : 2}>
            {week.goal}
          </Text>
        </View>

        <Text style={styles.weekChevron}>{expanded ? '▾' : '▸'}</Text>
      </Press>

      <View style={styles.weekBar}>
        <ProgressBar ratio={status.ratio} color={tint} height={3} />
      </View>

      <View style={styles.weekMetrics}>
        <Metric label="уроки" done={status.lessonsDone} total={status.lessonsTotal} tint={tint} />
        <Metric label="слова" done={status.wordsLearned} total={status.wordsTotal} tint={tint} />
        {status.textsTotal > 0 ? (
          <Metric label="тексты" done={status.textsReadable} total={status.textsTotal} tint={tint} />
        ) : null}
        {status.dialoguesTotal > 0 ? (
          <Metric
            label="сцены"
            done={status.dialoguesDone}
            total={status.dialoguesTotal}
            tint={tint}
          />
        ) : null}
      </View>

      {planStarted && !status.complete && calendarWeek > week.index ? (
        <Text style={styles.weekLate}>эта неделя по календарю уже прошла</Text>
      ) : null}

      {expanded ? (
        <View style={styles.weekBody}>
          <Text style={styles.blockLabel}>ГРАММАТИКА</Text>
          {chapters.map((chapter) =>
            chapter.lessons.map((lesson, i) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={i}
                chapter={chapter}
                tint={tint}
                unlocked={isCourseLessonUnlocked(progress, lesson.id)}
                entry={progress.course[lesson.id]}
                isNext={nextId === lesson.id}
                lang={lang}
                onPress={() => onOpenLesson(lesson, chapter)}
              />
            ))
          )}

          <Text style={[styles.blockLabel, { marginTop: spacing.lg }]}>СЛОВА НЕДЕЛИ</Text>
          <View style={styles.chipWrap}>
            {week.unitIds.map((id) => {
              const unit = getUnitById(id);
              if (!unit) return null;
              return (
                <Press
                  key={id}
                  onPress={() => onOpenUnit(id)}
                  style={styles.unitChip}
                  feedback="select"
                >
                  <Text style={styles.unitChipEmoji}>{unit.emoji}</Text>
                  <Text style={styles.unitChipText}>{unit.title}</Text>
                </Press>
              );
            })}
          </View>

          {week.textIds.length > 0 ? (
            <>
              <Text style={[styles.blockLabel, { marginTop: spacing.lg }]}>
                ПРОВЕРКА НА ЖИВОМ ТЕКСТЕ
              </Text>
              <View style={styles.chipWrap}>
                {week.textIds.map((id) => {
                  const text = LIVE_TEXTS.find((item) => item.id === id);
                  if (!text) return null;
                  return (
                    <Press
                      key={id}
                      onPress={() => onOpenText(id)}
                      style={styles.unitChip}
                      feedback="select"
                    >
                      <Text style={styles.unitChipEmoji}>{text.emoji}</Text>
                      <Text style={styles.unitChipText}>{text.title}</Text>
                    </Press>
                  );
                })}
              </View>
            </>
          ) : null}

          {week.dialogueIds.length > 0 ? (
            <>
              <Text style={[styles.blockLabel, { marginTop: spacing.lg }]}>СЦЕНЫ</Text>
              <View style={styles.chipWrap}>
                {week.dialogueIds.map((id) => {
                  const scene = DIALOGUES.find((item) => item.id === id);
                  if (!scene) return null;
                  return (
                    <Press
                      key={id}
                      onPress={() => onOpenDialogue(id)}
                      style={styles.unitChip}
                      feedback="select"
                    >
                      <Text style={styles.unitChipEmoji}>{scene.emoji}</Text>
                      <Text style={styles.unitChipText}>{scene.title}</Text>
                    </Press>
                  );
                })}
              </View>
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function Metric({
  label,
  done,
  total,
  tint,
}: {
  label: string;
  done: number;
  total: number;
  tint: string;
}) {
  const complete = total > 0 && done >= total;
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, complete && { color: tint }]}>
        {done}
        <Text style={styles.metricMax}>/{total}</Text>
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function LessonRow({
  lesson,
  index,
  chapter,
  tint,
  unlocked,
  entry,
  isNext,
  lang,
  onPress,
}: {
  lesson: GrammarLesson;
  index: number;
  chapter: CourseChapter;
  tint: string;
  unlocked: boolean;
  entry?: { completed: boolean; perfect: boolean; viaTest?: boolean };
  isNext: boolean;
  lang: Lang;
  onPress: () => void;
}) {
  const completed = !!entry?.completed;
  const boss = !!lesson.boss;

  return (
    <Press
      disabled={!unlocked}
      onPress={onPress}
      feedback={unlocked ? 'select' : null}
      scaleTo={0.985}
      style={[
        styles.lessonRow,
        boss && styles.lessonRowBoss,
        isNext && [styles.lessonRowNext, { borderColor: tint }],
        !unlocked && styles.lessonRowLocked,
      ]}
    >
      <View
        style={[
          styles.node,
          completed && { backgroundColor: tint, borderColor: tint },
          isNext && { borderColor: tint },
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
          {entry?.perfect ? <Text style={styles.perfectMark}>💎</Text> : null}
        </View>
        <Text style={[styles.lessonSubtitle, !unlocked && styles.textLocked]} numberOfLines={2}>
          {unlocked ? lesson.subtitle : t('course.locked', lang)}
        </Text>
      </View>

      <View style={styles.lessonMeta}>
        {boss ? <Text style={[styles.bossTag, { color: tint }]}>БОСС</Text> : null}
        {entry?.viaTest ? <Text style={styles.testTag}>ТЕСТ</Text> : null}
        <Text style={styles.taskCount}>{countTasks(lesson)}</Text>
      </View>
    </Press>
  );
}

/** Темы, которые в план не вошли: их берут по желанию, а не по расписанию. */
function ExtraUnits({ onOpenUnit }: { onOpenUnit: (unitId: string) => void }) {
  const extra = UNITS.filter((u) => !PLANNED_UNIT_IDS.has(u.id));
  if (extra.length === 0) return null;

  return (
    <View style={styles.extraBlock}>
      <Text style={styles.sectionTitle}>Вне плана</Text>
      <Text style={styles.extraHint}>
        Эти темы к B1 не обязательны — берёшь, когда захочется, без расписания.
      </Text>
      <View style={styles.chipWrap}>
        {extra.map((unit) => (
          <Press
            key={unit.id}
            onPress={() => onOpenUnit(unit.id)}
            style={styles.unitChip}
            feedback="select"
          >
            <Text style={styles.unitChipEmoji}>{unit.emoji}</Text>
            <Text style={styles.unitChipText}>{unit.title}</Text>
          </Press>
        ))}
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
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  brand: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: colors.textFaint },
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
  scroll: { paddingHorizontal: spacing.lg },

  planCard: { marginBottom: spacing.lg },
  planHead: { flexDirection: 'row', alignItems: 'center' },
  planKicker: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  planDay: { fontSize: 10, fontWeight: '700', color: colors.textFaint },
  planTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  planText: { fontSize: 13, color: colors.textDim, lineHeight: 19, marginTop: spacing.sm },
  planNote: { fontSize: 11, color: colors.textFaint, lineHeight: 16, marginTop: spacing.sm },
  planPercent: { fontSize: 11, color: colors.textFaint, fontWeight: '700', marginTop: 6 },
  planRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  planStat: { flex: 1 },
  planStatValue: { fontSize: 15, fontWeight: '800', color: colors.text },
  planStatLabel: { fontSize: 10, color: colors.textFaint, marginTop: 2 },
  todayBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  todayBoxDone: { borderColor: colors.success, backgroundColor: colors.successDim },
  todayHead: { flexDirection: 'row', alignItems: 'flex-end' },
  todayLabel: { flex: 1, fontSize: 12, fontWeight: '800', color: colors.text },
  todayValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  todayMax: { fontSize: 11, color: colors.textFaint, fontWeight: '600' },
  todayHint: { fontSize: 11, color: colors.textDim, lineHeight: 16 },
  behindBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.borderBright,
  },
  behindText: { fontSize: 12, color: colors.textDim, lineHeight: 18 },
  onTrackText: { fontSize: 12, color: colors.textDim, lineHeight: 18, marginTop: spacing.lg },

  rhythmCard: { marginBottom: spacing.lg },
  rhythmHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rhythmValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  rhythmUnit: { fontSize: 12, fontWeight: '600', color: colors.textDim },
  rhythmHint: { fontSize: 11, color: colors.textFaint, marginTop: 3 },
  rhythmWeek: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textFaint,
    fontVariant: ['tabular-nums'],
  },

  testCard: { marginBottom: spacing.lg },
  testTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  testText: { fontSize: 12, color: colors.textDim, marginTop: 6, lineHeight: 17 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textFaint,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },

  weekCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  weekCardCurrent: { borderWidth: 1.5, backgroundColor: colors.cardHover },
  weekCardDone: { opacity: 0.82 },
  weekHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  weekBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
  },
  weekBadgeText: { fontSize: 14, fontWeight: '800' },
  weekTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weekTitle: { fontSize: 15, fontWeight: '800', color: colors.text, flexShrink: 1 },
  levelPill: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 1 },
  levelText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  weekGoal: { fontSize: 11, color: colors.textDim, marginTop: 3, lineHeight: 16 },
  weekChevron: { fontSize: 12, color: colors.textFaint, width: 14, textAlign: 'center' },
  weekBar: { marginTop: spacing.md },
  weekMetrics: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  metric: {},
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDim,
    fontVariant: ['tabular-nums'],
  },
  metricMax: { fontSize: 10, color: colors.textFaint, fontWeight: '600' },
  metricLabel: { fontSize: 9, color: colors.textFaint, marginTop: 1 },
  weekLate: { fontSize: 10, color: colors.warning, marginTop: spacing.sm },

  weekBody: { marginTop: spacing.lg },
  blockLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: colors.textFaint,
    marginBottom: spacing.sm,
  },

  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lessonRowBoss: { backgroundColor: colors.bg },
  lessonRowNext: { borderWidth: 1.5, backgroundColor: colors.cardHover },
  lessonRowLocked: { opacity: 0.45 },
  node: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  nodeText: { color: colors.textDim, fontWeight: '800', fontSize: 12 },
  nodeTextDone: { color: colors.bg },
  nodeTextLocked: { color: colors.textFaint },
  lessonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lessonTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  perfectMark: { fontSize: 11 },
  lessonSubtitle: { fontSize: 11, color: colors.textDim, marginTop: 2 },
  textLocked: { color: colors.textFaint },
  lessonMeta: { alignItems: 'flex-end', gap: 2 },
  bossTag: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  testTag: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8, color: colors.textFaint },
  taskCount: { fontSize: 11, color: colors.textFaint, fontVariant: ['tabular-nums'] },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  unitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  unitChipEmoji: { fontSize: 12 },
  unitChipText: { fontSize: 11, color: colors.textDim, fontWeight: '600' },

  extraBlock: { marginTop: spacing.xxl },
  extraHint: { fontSize: 11, color: colors.textFaint, marginBottom: spacing.md, lineHeight: 16 },
});
