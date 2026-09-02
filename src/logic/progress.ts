import { MAX_LEVEL, WordProgress, isDue, isMastered, reviewWord } from './srs';
import { ALL_LESSONS, ALL_WORDS, Lesson, getLessonsForUnit } from '../data';

export interface ProgressState {
  words: Record<string, WordProgress>;
  xp: number;
  streak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  completedLessonIds: string[];
}

export const XP_PER_CORRECT = 10;
export const XP_PER_LESSON_BONUS = 20;

export function createInitialProgress(): ProgressState {
  return {
    words: {},
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    completedLessonIds: [],
  };
}

function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Обновляет дневной стрик; вызывается один раз за сессию, при её начале. */
export function touchDailyStreak(state: ProgressState, now: Date = new Date()): ProgressState {
  const today = toLocalDateString(now);
  if (state.lastActiveDate === today) return state;

  const yesterday = toLocalDateString(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const nextStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;

  return { ...state, streak: nextStreak, lastActiveDate: today };
}

export function recordAnswer(
  state: ProgressState,
  wordId: string,
  correct: boolean,
  now: number = Date.now()
): ProgressState {
  const nextProgress = reviewWord(state.words[wordId], correct, now);
  return {
    ...state,
    words: { ...state.words, [wordId]: nextProgress },
    xp: state.xp + (correct ? XP_PER_CORRECT : 0),
  };
}

export function completeLesson(state: ProgressState, lessonId: string): ProgressState {
  if (state.completedLessonIds.includes(lessonId)) {
    return { ...state, xp: state.xp + XP_PER_LESSON_BONUS };
  }
  return {
    ...state,
    xp: state.xp + XP_PER_LESSON_BONUS,
    completedLessonIds: [...state.completedLessonIds, lessonId],
  };
}

export function getWordProgress(state: ProgressState, wordId: string): WordProgress | undefined {
  return state.words[wordId];
}

/** Слова урока, которые пора повторить прямо сейчас (плюс все новые). */
export function getDueWordIdsForLesson(
  state: ProgressState,
  lesson: Lesson,
  now: number = Date.now()
): string[] {
  return lesson.wordIds.filter((id) => isDue(state.words[id], now));
}

const UNIT_ORDER = Array.from(new Set(ALL_LESSONS.map((l) => l.unitId)));

export function isLessonUnlocked(state: ProgressState, lesson: Lesson): boolean {
  const unitLessons = getLessonsForUnit(lesson.unitId);
  const posInUnit = unitLessons.findIndex((l) => l.id === lesson.id);

  if (posInUnit > 0) {
    // Не первый урок юнита — открывается после предыдущего урока того же юнита.
    return state.completedLessonIds.includes(unitLessons[posInUnit - 1].id);
  }

  // Первый урок юнита — открывается после последнего урока предыдущего юнита.
  const unitIdx = UNIT_ORDER.indexOf(lesson.unitId);
  if (unitIdx <= 0) return true; // самый первый юнит всегда открыт

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

export function overallStats(state: ProgressState) {
  const total = ALL_WORDS.length;
  const mastered = ALL_WORDS.filter((w) => isMastered(state.words[w.id])).length;
  const learning = ALL_WORDS.filter((w) => {
    const p = state.words[w.id];
    return p && p.level > 0 && p.level < MAX_LEVEL;
  }).length;
  return { total, mastered, learning, xp: state.xp, streak: state.streak };
}
