import { MAX_LEVEL, WordProgress, isDue, isMastered, masteryRatio, reviewWord } from './srs';
import { ALL_LESSONS, ALL_WORDS, Lesson, getLessonsForUnit } from '../data';
import { COURSE, COURSE_LESSONS } from '../data/course';
import { TOTAL_DIALOGUES } from '../data/dialogues';
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
  /** Зачтён тестом на уровень, а не пройден руками. Урок открыт и его
   * можно пройти по-настоящему в любой момент. */
  viaTest?: boolean;
}

/** Результат теста на определение уровня. */
export interface PlacementResult {
  /** Сколько глав тест признал уже известными. */
  chapters: number;
  date: string;
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
  /**
   * Дни, в которые вообще открывали приложение, — 'YYYY-MM-DD', по
   * возрастанию. Это принципиально другой счётчик, чем стрик: он только
   * растёт и не может «сгореть», поэтому пропущенный день здесь ничего
   * не отнимает, а просто остаётся незакрашенной клеткой.
   */
  activeDates: string[];
  completedLessonIds: string[];

  course: Record<string, CourseLessonProgress>;
  /**
   * Интервальное повторение для грамматики: ключ — id темы тренажёра.
   * Правила забываются ровно так же, как слова, и точно так же требуют
   * возврата — только напоминание короче, пять заданий вместо двадцати.
   */
  rules: Record<string, WordProgress>;
  dialogues: Record<string, DialogueProgress>;

  quests: QuestState;
  achievements: string[];

  /** null — тест ни разу не проходили. */
  placement: PlacementResult | null;

  /**
   * День, с которого отсчитывается восьминедельный план до B1.
   * null — план ещё не запускали.
   */
  planStart: string | null;

  /** Опыт, набранный сегодня, и дневная цель — кольцо на профиле. */
  dailyXp: number;
  dailyGoal: number;

  /** Режим погружения: интерфейс на румынском, переводы спрятаны. */
  immersion: boolean;

  /** Полный экран: скрыты системные часы и панель навигации Android. */
  fullscreen: boolean;

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
    activeDates: [],
    completedLessonIds: [],
    course: {},
    rules: {},
    dialogues: {},
    quests: createQuestState(toLocalDateString(new Date())),
    achievements: [],
    placement: null,
    planStart: null,
    dailyXp: 0,
    dailyGoal: DEFAULT_DAILY_GOAL,
    immersion: false,
    fullscreen: true,
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

/** Сколько дней истории держим — ровно столько, сколько рисуем на экране. */
export const RHYTHM_WINDOW = 119;

function appendActiveDate(dates: string[], today: string): string[] {
  if (dates[dates.length - 1] === today) return dates;
  const next = dates.includes(today) ? dates : [...dates, today];
  return next.length > RHYTHM_WINDOW ? next.slice(next.length - RHYTHM_WINDOW) : next;
}

/**
 * Вызывается один раз при старте сессии: обновляет счётчики дня, при
 * необходимости выдаёт новые задания дня и обнуляет дневной опыт.
 */
export function syncDaily(state: ProgressState, now: Date = new Date()): ProgressState {
  const today = toLocalDateString(now);
  const nowMs = now.getTime();

  if (state.lastActiveDate === today) {
    const quests = ensureQuestsForDate(state.quests, today, state.daysActive);
    return { ...state, quests };
  }

  const yesterday = toLocalDateString(new Date(nowMs - 24 * 60 * 60 * 1000));
  const streak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  const daysActive = state.daysActive + 1;

  return {
    ...state,
    streak,
    longestStreak: Math.max(state.longestStreak, streak),
    lastActiveDate: today,
    activeDates: appendActiveDate(state.activeDates, today),
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

/**
 * Уровень интервального повторения, с которого слово считается выученным.
 *
 * Не максимальный: до шестого уровня слово идёт месяцами, и требовать его
 * для галочки «выучено» значит месяцами показывать ноль. Третий уровень —
 * это слово, которое человек уже трижды вспомнил правильно.
 */
export const KNOWN_LEVEL = 3;

export function isWordKnown(progress: WordProgress | undefined): boolean {
  return (progress?.level ?? 0) >= KNOWN_LEVEL;
}

/**
 * Прогресс по теме — средняя освоенность её слов, а не доля доведённых до
 * максимума. Раньше здесь стоял `isMastered`, то есть шестой уровень SRS:
 * после целого пройденного урока полоска честно показывала ноль, потому
 * что слова были на первом. Выглядело как «ничего не засчиталось».
 */
export function unitProgressRatio(state: ProgressState, unitId: string): number {
  const words = ALL_WORDS.filter((w) => w.unitId === unitId);
  if (words.length === 0) return 0;
  const total = words.reduce((sum, w) => sum + masteryRatio(state.words[w.id]), 0);
  return total / words.length;
}

/** Сколько слов темы уже выучено — для подписи рядом с полоской. */
export function unitKnownCount(state: ProgressState, unitId: string): number {
  return ALL_WORDS.filter((w) => w.unitId === unitId && isWordKnown(state.words[w.id])).length;
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

/**
 * Отмечает главы, которые тест признал известными. Уже пройденные вручную
 * уроки не трогаем: у них честная статистика, и затирать её результатом
 * теста нельзя. Опыт за такие уроки НЕ начисляется — иначе получилось бы,
 * что тест накручивает прогресс.
 */
export function applyPlacement(
  state: ProgressState,
  knownChapters: number,
  now: Date = new Date()
): ProgressState {
  const course = { ...state.course };

  for (const chapter of COURSE.slice(0, knownChapters)) {
    for (const lesson of chapter.lessons) {
      if (course[lesson.id]?.completed) continue;
      course[lesson.id] = {
        completed: true,
        perfect: false,
        bestAccuracy: 0,
        timesPlayed: 0,
        viaTest: true,
      };
    }
  }

  return {
    ...state,
    course,
    placement: { chapters: knownChapters, date: toLocalDateString(now) },
  };
}

// --- Тренажёр грамматики ------------------------------------------------

/** Доля верных ответов, начиная с которой тема считается закреплённой. */
const DRILL_PASS = 0.7;

/**
 * Итог блока практики. Тема уходит на следующий интервал только если её
 * действительно вытянули: провалить двадцать заданий и всё равно получить
 * «увидимся через месяц» — так себе повторение.
 */
export function recordDrillResult(
  state: ProgressState,
  packId: string,
  correct: number,
  total: number,
  xpEarned: number,
  now: number = Date.now()
): ProgressState {
  const passed = total === 0 || correct / total >= DRILL_PASS;
  const next: ProgressState = {
    ...state,
    rules: { ...state.rules, [packId]: reviewWord(state.rules[packId], passed, now) },
    totalCorrect: state.totalCorrect + correct,
  };
  return bump(addXp(next, xpEarned), 'tasks', correct);
}

/** Темы, которые пора напомнить. Самые просроченные — первыми. */
export function getDueRuleIds(
  state: ProgressState,
  packIds: string[],
  now: number = Date.now()
): string[] {
  return packIds
    .filter((id) => {
      const progress = state.rules[id];
      // Ни разу не тренированные темы сюда не попадают: их место сразу
      // после теории, а не в напоминаниях.
      return !!progress && progress.seenCount > 0 && isDue(progress, now);
    })
    .sort((a, b) => (state.rules[a]!.dueAt ?? 0) - (state.rules[b]!.dueAt ?? 0));
}

/** Тема пройдена хотя бы раз — значит, теорию уже закрепляли. */
export function isRuleTrained(state: ProgressState, packId: string): boolean {
  return (state.rules[packId]?.seenCount ?? 0) > 0;
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

export function setFullscreen(state: ProgressState, on: boolean): ProgressState {
  return { ...state, fullscreen: on };
}

export function setDailyGoal(state: ProgressState, goal: number): ProgressState {
  return { ...state, dailyGoal: Math.max(10, goal) };
}

// --- План -------------------------------------------------------------

/**
 * Запускает или сдвигает план на сегодня. Прогресс при сдвиге не теряется:
 * двигается только точка отсчёта, чтобы недели снова совпали с календарём.
 * Это принципиально: отставание должно лечиться одной кнопкой, а не
 * ощущением, что всё пропало.
 */
export function startPlan(state: ProgressState, now: Date = new Date()): ProgressState {
  return { ...state, planStart: toLocalDateString(now) };
}

export function stopPlan(state: ProgressState): ProgressState {
  return { ...state, planStart: null };
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
    daysActive: state.daysActive,
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
  // «Знаешь» — это третий уровень повторения, а не шестой: иначе счётчик
  // неделями стоит на нуле и выглядит сломанным.
  const mastered = ALL_WORDS.filter((w) => isWordKnown(state.words[w.id])).length;
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
