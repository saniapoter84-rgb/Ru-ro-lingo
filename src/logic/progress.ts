import { MAX_LEVEL, WordProgress, isDue, isMastered, reviewWord } from './srs';
import { ALL_LESSONS, ALL_WORDS, Lesson, getLessonsForUnit } from '../data';
import { COURSE, COURSE_LESSONS } from '../data/course';
import { TOTAL_DIALOGUES } from '../data/dialogues';
import { HeartsState, createHearts, loseHeart, refillHearts, syncHearts } from './hearts';
import {
  QuestKind,
  QuestState,
  bumpQuests,
  claimFinishedQuests,
  createQuestState,
  ensureQuestsForDate,
} from './quests';
import { AchievementContext, newlyUnlocked } from './achievements';

export interface CourseLessonProgress {
  completed: boolean;
  /** Хоть раз пройден без единой ошибки. */
  perfect: boolean;
  bestAccuracy: number;
  timesPlayed: number;
}

export interface DialogueProgress {
  completed: boolean;
  bestScore: number;
}

export interface ProgressState {
  words: Record<string, WordProgress>;
  xp: number;
  streak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  completedLessonIds: string[];

  course: Record<string, CourseLessonProgress>;
  dialogues: Record<string, DialogueProgress>;

  hearts: HeartsState;
  quests: QuestState;
  achievements: string[];

  /** Опыт, набранный сегодня, и дневная цель — кольцо на профиле. */
  dailyXp: number;
  dailyGoal: number;

  /** Режим погружения: интерфейс на румынском, переводы спрятаны. */
  immersion: boolean;

  totalCorrect: number;
  bestCombo: number;
  longestStreak: number;
  perfectLessons: number;
  immersionTasks: number;
  daysActive: number;
  earlyBirdDays: number;
  nightOwlDays: number;
  lastEarlyDate: string | null;
  lastNightDate: string | null;
}

export const XP_PER_CORRECT = 10;
export const XP_PER_LESSON_BONUS = 20;
export const DEFAULT_DAILY_GOAL = 50;

export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createInitialProgress(): ProgressState {
  return {
    words: {},
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    completedLessonIds: [],
    course: {},
    dialogues: {},
    hearts: createHearts(),
    quests: createQuestState(toLocalDateString(new Date())),
    achievements: [],
    dailyXp: 0,
    dailyGoal: DEFAULT_DAILY_GOAL,
    immersion: false,
    totalCorrect: 0,
    bestCombo: 0,
    longestStreak: 0,
    perfectLessons: 0,
    immersionTasks: 0,
    daysActive: 0,
    earlyBirdDays: 0,
    nightOwlDays: 0,
    lastEarlyDate: null,
    lastNightDate: null,
  };
}

// --- Ранги --------------------------------------------------------------

export interface Rank {
  xp: number;
  ru: string;
  ro: string;
  emoji: string;
}

export const RANKS: Rank[] = [
  { xp: 0, ru: 'Новичок', ro: 'Începător', emoji: '🌱' },
  { xp: 300, ru: 'Турист', ro: 'Turist', emoji: '🧳' },
  { xp: 800, ru: 'Сосед', ro: 'Vecin', emoji: '🚪' },
  { xp: 1800, ru: 'Собеседник', ro: 'Interlocutor', emoji: '💬' },
  { xp: 3500, ru: 'Свой человек', ro: 'De-al casei', emoji: '🏠' },
  { xp: 6000, ru: 'Знаток', ro: 'Cunoscător', emoji: '🎓' },
  { xp: 10000, ru: 'Почти румын', ro: 'Aproape român', emoji: '🇷🇴' },
];

export function getRank(xp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.xp) current = rank;
  }
  return current;
}

export function getNextRank(xp: number): Rank | null {
  return RANKS.find((r) => r.xp > xp) ?? null;
}

/** Доля пройденного до следующего ранга (1, если ранг последний). */
export function rankRatio(xp: number): number {
  const current = getRank(xp);
  const next = getNextRank(xp);
  if (!next) return 1;
  return (xp - current.xp) / (next.xp - current.xp);
}

// --- Ежедневная синхронизация ------------------------------------------

/**
 * Вызывается один раз при старте сессии: обновляет стрик, подтягивает
 * восстановившиеся сердца, при необходимости выдаёт новые задания дня
 * и обнуляет дневной счётчик опыта.
 */
export function syncDaily(state: ProgressState, now: Date = new Date()): ProgressState {
  const today = toLocalDateString(now);
  const nowMs = now.getTime();
  const hearts = syncHearts(state.hearts, nowMs);

  if (state.lastActiveDate === today) {
    const quests = ensureQuestsForDate(state.quests, today, state.daysActive);
    return { ...state, hearts, quests };
  }

  const yesterday = toLocalDateString(new Date(nowMs - 24 * 60 * 60 * 1000));
  const streak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  const daysActive = state.daysActive + 1;

  return {
    ...state,
    hearts,
    streak,
    longestStreak: Math.max(state.longestStreak, streak),
    lastActiveDate: today,
    daysActive,
    dailyXp: 0,
    quests: ensureQuestsForDate(undefined, today, daysActive),
  };
}

/** Отмечает «жаворонка» и «сову» — по одному разу в день. */
export function markTimeOfDay(state: ProgressState, now: Date = new Date()): ProgressState {
  const today = toLocalDateString(now);
  const hour = now.getHours();

  if (hour < 9 && state.lastEarlyDate !== today) {
    return { ...state, earlyBirdDays: state.earlyBirdDays + 1, lastEarlyDate: today };
  }
  if (hour >= 0 && hour < 4 && state.lastNightDate !== today) {
    return { ...state, nightOwlDays: state.nightOwlDays + 1, lastNightDate: today };
  }
  return state;
}

// --- Опыт и задания -----------------------------------------------------

function addXp(state: ProgressState, amount: number): ProgressState {
  if (amount <= 0) return state;
  const next = { ...state, xp: state.xp + amount, dailyXp: state.dailyXp + amount };
  return { ...next, quests: bumpQuests(next.quests, 'xp', amount) };
}

function bump(state: ProgressState, kind: QuestKind, amount = 1): ProgressState {
  return { ...state, quests: bumpQuests(state.quests, kind, amount) };
}

/** Выдаёт награды за закрытые задания дня и разблокированные ачивки. */
export function settleRewards(state: ProgressState): {
  state: ProgressState;
  unlockedAchievements: string[];
} {
  const { state: quests, xp } = claimFinishedQuests(state.quests);
  let next: ProgressState = { ...state, quests };
  if (xp > 0) {
    next = { ...next, xp: next.xp + xp, dailyXp: next.dailyXp + xp };
  }

  const unlocked = newlyUnlocked(buildAchievementContext(next), next.achievements);
  if (unlocked.length > 0) {
    next = { ...next, achievements: [...next.achievements, ...unlocked] };
  }
  return { state: next, unlockedAchievements: unlocked };
}

// --- Словарные упражнения (старый поток) --------------------------------

export function recordAnswer(
  state: ProgressState,
  wordId: string,
  correct: boolean,
  now: number = Date.now()
): ProgressState {
  const nextProgress = reviewWord(state.words[wordId], correct, now);
  let next: ProgressState = {
    ...state,
    words: { ...state.words, [wordId]: nextProgress },
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
  };
  next = bump(next, 'words');
  if (correct) {
    next = bump(next, 'tasks');
    next = addXp(next, XP_PER_CORRECT);
  }
  return next;
}

export function completeLesson(state: ProgressState, lessonId: string): ProgressState {
  const next = addXp(state, XP_PER_LESSON_BONUS);
  if (next.completedLessonIds.includes(lessonId)) return next;
  return { ...next, completedLessonIds: [...next.completedLessonIds, lessonId] };
}

export function getWordProgress(state: ProgressState, wordId: string): WordProgress | undefined {
  return state.words[wordId];
}

export function getDueWordIdsForLesson(
  state: ProgressState,
  lesson: Lesson,
  now: number = Date.now()
): string[] {
  return lesson.wordIds.filter((id) => isDue(state.words[id], now));
}

/**
 * Слова, которые SRS считает созревшими для повторения. Берём только уже
 * встречавшиеся: новые слова осваиваются через уроки, а не через повторение.
 */
export function getDueWordIds(state: ProgressState, now: number = Date.now()): string[] {
  return ALL_WORDS.filter((w) => {
    const p = state.words[w.id];
    return !!p && p.seenCount > 0 && isDue(p, now);
  })
    // Сначала самые «просроченные» — они ближе всего к тому, чтобы забыться.
    .sort((a, b) => (state.words[a.id]!.dueAt ?? 0) - (state.words[b.id]!.dueAt ?? 0))
    .map((w) => w.id);
}

/** Повторение не привязано к уроку, поэтому в completedLessonIds не пишем. */
export function completeReview(state: ProgressState): ProgressState {
  return addXp(state, XP_PER_LESSON_BONUS);
}

const UNIT_ORDER = Array.from(new Set(ALL_LESSONS.map((l) => l.unitId)));

export function isLessonUnlocked(state: ProgressState, lesson: Lesson): boolean {
  const unitLessons = getLessonsForUnit(lesson.unitId);
  const posInUnit = unitLessons.findIndex((l) => l.id === lesson.id);

  if (posInUnit > 0) {
    return state.completedLessonIds.includes(unitLessons[posInUnit - 1].id);
  }

  const unitIdx = UNIT_ORDER.indexOf(lesson.unitId);
  if (unitIdx <= 0) return true;

  const prevUnitLessons = getLessonsForUnit(UNIT_ORDER[unitIdx - 1]);
  const lastPrev = prevUnitLessons[prevUnitLessons.length - 1];
  return !lastPrev || state.completedLessonIds.includes(lastPrev.id);
}

export function unitProgressRatio(state: ProgressState, unitId: string): number {
  const words = ALL_WORDS.filter((w) => w.unitId === unitId);
  if (words.length === 0) return 0;
  const masteredCount = words.filter((w) => isMastered(state.words[w.id])).length;
  return masteredCount / words.length;
}

// --- Курс грамматики ----------------------------------------------------

/** Уроки курса открываются строго по порядку — это и есть «тропа». */
export function isCourseLessonUnlocked(state: ProgressState, lessonId: string): boolean {
  const index = COURSE_LESSONS.findIndex((ref) => ref.lesson.id === lessonId);
  if (index <= 0) return index === 0;
  const previous = COURSE_LESSONS[index - 1].lesson.id;
  return !!state.course[previous]?.completed;
}

/** Первый непройденный урок — на него указывает кнопка «продолжить». */
export function nextCourseLessonId(state: ProgressState): string | null {
  const next = COURSE_LESSONS.find((ref) => !state.course[ref.lesson.id]?.completed);
  return next ? next.lesson.id : null;
}

export function chapterRatio(state: ProgressState, chapterId: string): number {
  const chapter = COURSE.find((c) => c.id === chapterId);
  if (!chapter || chapter.lessons.length === 0) return 0;
  const done = chapter.lessons.filter((l) => state.course[l.id]?.completed).length;
  return done / chapter.lessons.length;
}

export function isChapterComplete(state: ProgressState, chapterId: string): boolean {
  return chapterRatio(state, chapterId) >= 1;
}

export interface CourseResult {
  lessonId: string;
  correct: number;
  total: number;
  xpEarned: number;
  perfect: boolean;
  bestCombo: number;
  immersionTasks: number;
}

export function recordCourseResult(state: ProgressState, result: CourseResult): ProgressState {
  const accuracy = result.total === 0 ? 100 : Math.round((result.correct / result.total) * 100);
  const previous = state.course[result.lessonId];

  const entry: CourseLessonProgress = {
    completed: true,
    perfect: (previous?.perfect ?? false) || result.perfect,
    bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, accuracy),
    timesPlayed: (previous?.timesPlayed ?? 0) + 1,
  };

  let next: ProgressState = {
    ...state,
    course: { ...state.course, [result.lessonId]: entry },
    totalCorrect: state.totalCorrect + result.correct,
    bestCombo: Math.max(state.bestCombo, result.bestCombo),
    immersionTasks: state.immersionTasks + result.immersionTasks,
    perfectLessons:
      state.perfectLessons + (result.perfect && !(previous?.perfect ?? false) ? 1 : 0),
  };

  next = addXp(next, result.xpEarned);
  next = bump(next, 'tasks', result.correct);
  next = bump(next, 'combo', result.bestCombo);
  // Урок засчитывается в задание дня только в первый раз — иначе можно
  // было бы фармить одну и ту же лёгкую лекцию по кругу.
  if (!previous?.completed) {
    next = bump(next, 'lessons');
  }
  if (result.perfect) {
    next = bump(next, 'perfect');
  }
  return next;
}

// --- Погружение ---------------------------------------------------------

export function recordDialogueResult(
  state: ProgressState,
  dialogueId: string,
  score: number,
  total: number,
  xpEarned: number
): ProgressState {
  const previous = state.dialogues[dialogueId];
  const entry: DialogueProgress = {
    completed: true,
    bestScore: Math.max(previous?.bestScore ?? 0, score),
  };

  let next: ProgressState = {
    ...state,
    dialogues: { ...state.dialogues, [dialogueId]: entry },
    totalCorrect: state.totalCorrect + score,
    immersionTasks: state.immersionTasks + total,
  };
  next = addXp(next, xpEarned);
  next = bump(next, 'tasks', score);
  if (!previous?.completed) {
    next = bump(next, 'dialogue');
  }
  return next;
}

export function setImmersion(state: ProgressState, on: boolean): ProgressState {
  return { ...state, immersion: on };
}

export function setDailyGoal(state: ProgressState, goal: number): ProgressState {
  return { ...state, dailyGoal: Math.max(10, goal) };
}

// --- Сердца -------------------------------------------------------------

export function spendHeart(state: ProgressState, now: number = Date.now()): ProgressState {
  return { ...state, hearts: loseHeart(state.hearts, now) };
}

export function restoreHearts(state: ProgressState): ProgressState {
  return { ...state, hearts: refillHearts() };
}

// --- Сводки -------------------------------------------------------------

export function buildAchievementContext(state: ProgressState): AchievementContext {
  const courseLessonsDone = COURSE_LESSONS.filter(
    (ref) => state.course[ref.lesson.id]?.completed
  ).length;
  const bossesDone = COURSE_LESSONS.filter(
    (ref) => ref.lesson.boss && state.course[ref.lesson.id]?.completed
  ).length;
  const chaptersDone = COURSE.filter((c) => isChapterComplete(state, c.id)).length;
  const dialoguesDone = Object.values(state.dialogues).filter((d) => d.completed).length;
  const masteredWords = ALL_WORDS.filter((w) => isMastered(state.words[w.id])).length;

  return {
    xp: state.xp,
    streak: state.streak,
    longestStreak: state.longestStreak,
    totalCorrect: state.totalCorrect,
    bestCombo: state.bestCombo,
    masteredWords,
    courseLessonsDone,
    bossesDone,
    chaptersDone,
    perfectLessons: state.perfectLessons,
    dialoguesDone,
    immersionTasks: state.immersionTasks,
    earlyBirdDays: state.earlyBirdDays,
    nightOwlDays: state.nightOwlDays,
  };
}

export function overallStats(state: ProgressState) {
  const total = ALL_WORDS.length;
  const mastered = ALL_WORDS.filter((w) => isMastered(state.words[w.id])).length;
  const learning = ALL_WORDS.filter((w) => {
    const p = state.words[w.id];
    return p && p.level > 0 && p.level < MAX_LEVEL;
  }).length;

  const courseDone = COURSE_LESSONS.filter((ref) => state.course[ref.lesson.id]?.completed).length;
  const dialoguesDone = Object.values(state.dialogues).filter((d) => d.completed).length;

  return {
    total,
    mastered,
    learning,
    xp: state.xp,
    streak: state.streak,
    courseDone,
    courseTotal: COURSE_LESSONS.length,
    dialoguesDone,
    dialoguesTotal: TOTAL_DIALOGUES,
    dailyXp: state.dailyXp,
    dailyGoal: state.dailyGoal,
  };
}
