import { GrammarStep } from '../data/course';
import { stripDiacritics } from './exercises';

/** Нормализация для сравнения: без диакритик, без пунктуации, без лишних пробелов. */
export function normalizeAnswer(s: string): string {
  return stripDiacritics(s)
    .replace(/[.,!?;:"'«»()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesAnswer(input: string, answer: string, alt?: string[]): boolean {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;
  return [answer, ...(alt ?? [])].some((a) => normalizeAnswer(a) === normalized);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Слова для «собери фразу»: слова ответа плюс ловушки, всё вперемешку. */
export function buildTokenBank(answer: string, extra: string[] = []): string[] {
  const tokens = answer.split(/\s+/).filter(Boolean);
  return shuffle([...tokens, ...extra]);
}

/**
 * Текст, который надо озвучить на этом шаге. Пусто — значит озвучивать
 * нечего (например, задание целиком на русском).
 */
export function speechTextForStep(step: GrammarStep): string | null {
  switch (step.kind) {
    case 'listen':
      return step.ro;
    case 'build':
    case 'type':
      return step.answer;
    case 'transform':
      return step.answer;
    case 'spot':
      // Часть исправлений — это указание («убрать», «после слова»), а не слово.
      // Такое озвучивать нечего: получилась бы фраза с русской ремаркой внутри.
      if (step.fix.startsWith('(')) return null;
      return step.tokens.map((t, i) => (i === step.wrongIndex ? step.fix : t)).join(' ');
    case 'choice':
      return step.prompt.includes('___') ? null : step.prompt;
    default:
      return null;
  }
}

/** Короткая подпись «что от меня хотят» — заголовок над заданием. */
export function instructionForStep(step: GrammarStep): string {
  switch (step.kind) {
    case 'choice':
      return 'Выбери правильный вариант';
    case 'build':
      return 'Собери фразу';
    case 'type':
      return 'Напиши по-румынски';
    case 'match':
      return step.title ?? 'Сопоставь пары';
    case 'listen':
      return 'Послушай и выбери';
    case 'spot':
      return 'Найди ошибку';
    case 'transform':
      return step.instruction;
    default:
      return '';
  }
}

// --- Очки ---------------------------------------------------------------

export const XP_PER_TASK = 10;
export const XP_BOSS_MULTIPLIER = 2;
export const XP_LESSON_BONUS = 25;
export const XP_PERFECT_BONUS = 30;

/** Множитель за серию правильных ответов подряд: 3 подряд → x2, 6 → x3. */
export function comboMultiplier(combo: number): number {
  if (combo >= 9) return 4;
  if (combo >= 6) return 3;
  if (combo >= 3) return 2;
  return 1;
}

export function xpForCorrect(combo: number, boss: boolean): number {
  const base = XP_PER_TASK * comboMultiplier(combo);
  return boss ? base * XP_BOSS_MULTIPLIER : base;
}
