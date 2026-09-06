import { PLAN_WEEKS, PLAN_LENGTH_WEEKS, PlanWeek } from '../data/plan';
import { COURSE } from '../data/course';
import { ALL_WORDS } from '../data';
import { LIVE_TEXTS } from '../data/texts';
import { ProgressState, toLocalDateString } from './progress';
import { READABLE_RATIO, analyzeText } from './comprehension';

/**
 * Состояние плана «до B1 за два месяца ЖИЗНИ».
 *
 * Ключевое слово — жизни. План считается не на 56 идеальных дней подряд,
 * а на два календарных месяца, внутри которых человек работает, болеет,
 * уезжает и просто не хочет. Поэтому норма распределяется на пять дней в
 * неделю, а два дня заложены свободными изначально: пропустить их — не
 * сбой плана, а его исполнение. Кто занимался все семь — идёт с запасом.
 *
 * Дедлайн при этом остаётся календарным: восемь недель от старта дают
 * конкретную дату. Если темп не дотягивает, приложение не ругается, а
 * пересчитывает прогноз по факту и показывает честную дату выхода на B1.
 */

/** Уровень SRS, с которого слово считаем выученным для целей плана. */
const LEARNED_LEVEL = 3;

/**
 * Рабочих дней в неделе. Остальные заложены свободными — именно они
 * превращают «два месяца занятий» в «два месяца жизни».
 */
export const WORK_DAYS_PER_WEEK = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface WeekStatus {
  week: PlanWeek;
  lessonsDone: number;
  lessonsTotal: number;
  wordsLearned: number;
  wordsTotal: number;
  textsReadable: number;
  textsTotal: number;
  dialoguesDone: number;
  dialoguesTotal: number;
  /** Общий прогресс недели, 0..1. */
  ratio: number;
  complete: boolean;
}

function lessonsOfWeek(week: PlanWeek) {
  return COURSE.filter((c) => week.chapterIds.includes(c.id)).flatMap((c) => c.lessons);
}

function wordsOfWeek(week: PlanWeek) {
  return ALL_WORDS.filter((w) => week.unitIds.includes(w.unitId));
}

export function weekStatus(week: PlanWeek, state: ProgressState): WeekStatus {
  const lessons = lessonsOfWeek(week);
  const lessonsDone = lessons.filter((l) => state.course[l.id]?.completed).length;

  const words = wordsOfWeek(week);
  const wordsLearned = words.filter((w) => (state.words[w.id]?.level ?? 0) >= LEARNED_LEVEL).length;

  const texts = LIVE_TEXTS.filter((t) => week.textIds.includes(t.id));
  const textsReadable = texts.filter(
    (t) => analyzeText(t, state).ratio >= READABLE_RATIO
  ).length;

  const dialoguesDone = week.dialogueIds.filter((id) => state.dialogues[id]?.completed).length;

  // Грамматика — это половина недели: без неё словарь не складывается
  // во фразы. Остальное делят слова, тексты и сцены. Разделы, которых на
  // неделе нет, из расчёта выпадают целиком: иначе неделя без сцен
  // показывала бы прогресс ещё до того, как к ней притронулись.
  const parts: { done: number; total: number; weight: number }[] = [
    { done: lessonsDone, total: lessons.length, weight: 0.5 },
    { done: wordsLearned, total: words.length, weight: 0.3 },
    { done: textsReadable, total: texts.length, weight: 0.1 },
    { done: dialoguesDone, total: week.dialogueIds.length, weight: 0.1 },
  ].filter((part) => part.total > 0);

  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0);
  const ratio =
    totalWeight === 0
      ? 0
      : parts.reduce((sum, part) => sum + (part.done / part.total) * part.weight, 0) / totalWeight;

  return {
    week,
    lessonsDone,
    lessonsTotal: lessons.length,
    wordsLearned,
    wordsTotal: words.length,
    textsReadable,
    textsTotal: texts.length,
    dialoguesDone,
    dialoguesTotal: week.dialogueIds.length,
    ratio,
    // Неделя закрыта, когда сделана грамматика и большая часть слов.
    complete:
      lessonsDone === lessons.length &&
      (words.length === 0 || wordsLearned / words.length >= 0.8),
  };
}

export interface PlanStatus {
  started: boolean;
  weeks: WeekStatus[];
  /** Какая неделя идёт по календарю, 1..N. Может выйти за длину плана. */
  calendarWeek: number;
  /** Первая незакрытая неделя — там человек находится на самом деле. */
  currentWeek: number;
  /** День плана, начиная с 1. */
  dayOfPlan: number;
  /** Сколько дней осталось до конца восьми недель (может быть отрицательным). */
  daysLeft: number;
  /** Отставание в днях; 0 — идём по графику или впереди. */
  daysBehind: number;
  onTrack: boolean;
  /** Общий прогресс по всему плану, 0..1. */
  overallRatio: number;
  /** Прогноз выхода на B1 при текущем темпе. null — темпа ещё нет. */
  projectedFinish: Date | null;
  /** Дата, к которой план обещает B1. */
  deadline: Date | null;
  /** Рабочих дней осталось до дедлайна — на них и делится нагрузка. */
  workDaysLeft: number;
  /** Сколько дней на этой неделе уже закрыто занятиями. */
  daysThisWeek: number;
  /**
   * Свободных дней осталось на этой неделе. Отрицательного значения тут
   * не бывает: перевыполнение уходит в запас, а не в укор.
   */
  freeDaysLeft: number;
  /** Занимались больше нормы — в запасе столько дней. */
  bankedDays: number;
}

export const PLAN_DAYS = PLAN_LENGTH_WEEKS * 7;
export const PLAN_WORK_DAYS = PLAN_LENGTH_WEEKS * WORK_DAYS_PER_WEEK;

function daysBetween(from: string, now: Date): number {
  const [y, m, d] = from.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today.getTime() - start.getTime()) / DAY_MS);
}

/** Сколько рабочих дней укладывается в отрезок календарных дней. */
function workDaysIn(days: number): number {
  const fullWeeks = Math.floor(days / 7);
  const rest = days % 7;
  return fullWeeks * WORK_DAYS_PER_WEEK + Math.min(rest, WORK_DAYS_PER_WEEK);
}

/** Сколько дней из истории занятий попадает в окно плана. */
function studyDaysSince(activeDates: string[], start: string): number {
  return activeDates.filter((d) => d >= start).length;
}

export function planStatus(state: ProgressState, now: Date = new Date()): PlanStatus {
  const weeks = PLAN_WEEKS.map((w) => weekStatus(w, state));
  const overallRatio = weeks.reduce((sum, w) => sum + w.ratio, 0) / weeks.length;

  const firstOpen = weeks.findIndex((w) => !w.complete);
  const currentWeek = firstOpen === -1 ? PLAN_LENGTH_WEEKS : firstOpen + 1;
  const remainingLessons = totalLessons() - doneLessons(state);

  if (!state.planStart) {
    return {
      started: false,
      weeks,
      calendarWeek: 1,
      currentWeek,
      dayOfPlan: 0,
      daysLeft: PLAN_DAYS,
      daysBehind: 0,
      onTrack: true,
      overallRatio,
      projectedFinish: null,
      deadline: null,
      workDaysLeft: PLAN_WORK_DAYS,
      daysThisWeek: 0,
      freeDaysLeft: 7 - WORK_DAYS_PER_WEEK,
      bankedDays: 0,
    };
  }

  const elapsed = Math.max(0, daysBetween(state.planStart, now));
  const dayOfPlan = elapsed + 1;
  const calendarWeek = Math.floor(elapsed / 7) + 1;
  const daysLeft = PLAN_DAYS - elapsed;

  // Нагрузка делится на рабочие дни, а не на календарные: два дня в неделю
  // изначально ничьи, и планировать на них ничего нельзя.
  const workDaysLeft = Math.max(1, PLAN_WORK_DAYS - workDaysIn(elapsed));

  // Отставание считаем по доле плана, но мерим её в рабочих днях —
  // иначе выходные выглядели бы провалом.
  const expectedRatio = Math.min(1, workDaysIn(elapsed) / PLAN_WORK_DAYS);
  const daysBehind = Math.max(0, Math.round((expectedRatio - overallRatio) * PLAN_WORK_DAYS));

  // Запас: сколько дней человек занимался сверх нормы «пять из семи».
  const studied = studyDaysSince(state.activeDates, state.planStart);
  const bankedDays = Math.max(0, studied - workDaysIn(dayOfPlan));

  const thisWeek = daysThisWeekCount(state.activeDates, now);
  const freeDaysLeft = Math.max(0, 7 - WORK_DAYS_PER_WEEK - Math.max(0, weekdaysPassed(now) - thisWeek));

  let projectedFinish: Date | null = null;
  if (overallRatio > 0.02 && elapsed >= 1) {
    // Темп меряется по календарю, а значит уже включает в себя все
    // пропущенные дни — прогноз получается про жизнь, а не про идеал.
    const pacePerDay = overallRatio / elapsed;
    const daysNeeded = Math.ceil((1 - overallRatio) / pacePerDay);
    projectedFinish = new Date(now.getTime() + daysNeeded * DAY_MS);
  }

  const [sy, sm, sd] = state.planStart.split('-').map(Number);
  const deadline = new Date(sy, sm - 1, sd + PLAN_DAYS);

  return {
    started: true,
    weeks,
    calendarWeek,
    currentWeek,
    dayOfPlan,
    daysLeft,
    daysBehind,
    onTrack: daysBehind <= 2,
    overallRatio,
    projectedFinish,
    deadline,
    workDaysLeft,
    daysThisWeek: thisWeek,
    freeDaysLeft,
    bankedDays,
  };
}

/** Сколько дней текущей недели уже закрыто занятиями. */
function daysThisWeekCount(activeDates: string[], now: Date): number {
  const active = new Set(activeDates);
  const mondayOffset = (now.getDay() + 6) % 7;
  let count = 0;
  for (let i = 0; i <= mondayOffset; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset + i);
    if (active.has(toLocalDateString(d))) count++;
  }
  return count;
}

/** Сколько дней текущей недели уже прошло, считая сегодняшний. */
function weekdaysPassed(now: Date): number {
  return ((now.getDay() + 6) % 7) + 1;
}

function totalLessons(): number {
  return COURSE.reduce((sum, c) => sum + c.lessons.length, 0);
}

function doneLessons(state: ProgressState): number {
  return COURSE.reduce(
    (sum, c) => sum + c.lessons.filter((l) => state.course[l.id]?.completed).length,
    0
  );
}

/** Норма на сегодня: столько уроков и слов, чтобы уложиться в две недели. */
export interface DailyLoad {
  lessons: number;
  words: number;
  minutes: number;
}

export function dailyLoad(state: ProgressState, status: PlanStatus): DailyLoad {
  // Делим на рабочие дни: норма должна быть выполнима в тот день, когда
  // человек вообще садится заниматься.
  const days = Math.max(1, status.started ? status.workDaysLeft : PLAN_WORK_DAYS);

  const remainingLessons = totalLessons() - doneLessons(state);
  let remainingWords = 0;
  for (const week of status.weeks) {
    remainingWords += Math.max(0, week.wordsTotal - week.wordsLearned);
  }

  const lessons = Math.max(1, Math.round(remainingLessons / days));
  const words = Math.max(5, Math.round(remainingWords / days));
  // Порядок величин из практики: урок «Тропы» с карточками правил — минут
  // девять, новое слово с проверкой — около полуминуты.
  return { lessons, words, minutes: lessons * 9 + Math.round(words * 0.45) };
}

/**
 * Дневная норма в опыте — по ней видно, закрыт ли сегодняшний день.
 * Нужна именно граница: без неё занятие не имеет конца, и «ещё немного»
 * превращается в источник вины вместо чувства сделанного дела.
 */
export function dayGoalXp(load: DailyLoad): number {
  return load.lessons * 150 + load.words * 8;
}

export function formatDate(d: Date): string {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export function planStartLabel(state: ProgressState): string | null {
  if (!state.planStart) return null;
  const [y, m, d] = state.planStart.split('-').map(Number);
  return formatDate(new Date(y, m - 1, d));
}

export { PLAN_WEEKS, PLAN_LENGTH_WEEKS, toLocalDateString };
export type { PlanWeek };
