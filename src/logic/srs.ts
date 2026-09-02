// Простая система интервального повторения (в духе SM-2 / Duolingo).
// Каждое слово имеет "уровень" 0..MAX_LEVEL — чем выше, тем реже его нужно показывать.

export const MAX_LEVEL = 6;

export interface WordProgress {
  level: number;
  dueAt: number; // epoch ms — когда слово нужно показать снова
  seenCount: number;
  correctCount: number;
}

export function newWordProgress(now: number = Date.now()): WordProgress {
  return { level: 0, dueAt: now, seenCount: 0, correctCount: 0 };
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Интервал до следующего показа, индекс = уровень ПОСЛЕ правильного ответа.
const INTERVAL_MS = [0, DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS, 30 * DAY_MS, 90 * DAY_MS];

// Если ответили неправильно — слово возвращается довольно быстро.
const RETRY_MS = 10 * 60 * 1000;

export function reviewWord(
  progress: WordProgress | undefined,
  correct: boolean,
  now: number = Date.now()
): WordProgress {
  const base = progress ?? newWordProgress(now);
  if (correct) {
    const level = Math.min(base.level + 1, MAX_LEVEL);
    return {
      level,
      dueAt: now + INTERVAL_MS[level],
      seenCount: base.seenCount + 1,
      correctCount: base.correctCount + 1,
    };
  }
  const level = Math.max(base.level - 1, 0);
  return {
    level,
    dueAt: now + RETRY_MS,
    seenCount: base.seenCount + 1,
    correctCount: base.correctCount,
  };
}

export function isDue(progress: WordProgress | undefined, now: number = Date.now()): boolean {
  if (!progress) return true;
  return progress.dueAt <= now;
}

export function isMastered(progress: WordProgress | undefined): boolean {
  return !!progress && progress.level >= MAX_LEVEL;
}

/** Доля освоенности слова от 0 до 1 — удобно для прогресс-баров. */
export function masteryRatio(progress: WordProgress | undefined): number {
  if (!progress) return 0;
  return progress.level / MAX_LEVEL;
}
