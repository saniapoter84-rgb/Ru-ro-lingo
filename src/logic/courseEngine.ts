import { GrammarStep, RuleStep } from '../data/course';

export { checkAnswer, matchesAnswer, normalizeAnswer, stripDiacritics } from './answers';
export type { AnswerCheck } from './answers';

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

/** В тексте есть кириллица — значит это условие задания, а не румынский. */
function hasCyrillic(text: string): boolean {
  return /[А-Яа-яЁё]/.test(text);
}

/** Подставляет правильный вариант в пропуск: «Eu ___ student» → «Eu sunt student». */
function fillGap(prompt: string, answer: string): string {
  return prompt.replace(/_+/g, answer);
}

/**
 * Текст, который надо озвучить на этом шаге, — всегда правильный вариант
 * целиком.
 *
 * Раньше задание с пропуском не озвучивалось вовсе: в prompt стоит «___»,
 * и читать было нечего. Но пропуск — это как раз то место, ради которого
 * задание и существует, поэтому теперь верный ответ подставляется в фразу
 * и звучит вся строка. Молчим только там, где озвучивать реально нечего:
 * когда условие написано по-русски или исправление — это ремарка вроде
 * «(убрать «să»)», а не слово.
 */
export function speechTextForStep(step: GrammarStep): string | null {
  const text = speechCandidate(step);
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed || hasCyrillic(trimmed)) return null;
  return trimmed;
}

function speechCandidate(step: GrammarStep): string | null {
  switch (step.kind) {
    case 'listen':
      return step.ro;
    case 'build':
    case 'type':
    case 'transform':
      return step.answer;
    case 'spot':
      // Часть исправлений — это указание («убрать», «после слова»), а не слово.
      if (step.fix.startsWith('(')) return null;
      return step.tokens.map((t, i) => (i === step.wrongIndex ? step.fix : t)).join(' ');
    case 'choice':
      return fillGap(step.prompt, step.options[step.correct]);
    default:
      return null;
  }
}

/**
 * Чем объяснить ошибку на этом задании.
 *
 * У части заданий объяснение написано прямо в них, но у большинства его
 * нет — и раньше человек видел только «не совсем» и правильный ответ, без
 * единого слова о причине. Поэтому, если своего объяснения у задания нет,
 * поднимаемся вверх по уроку до ближайшей карточки правила: задание
 * всегда стоит после того правила, которое отрабатывает.
 */
export function explanationForStep(
  steps: GrammarStep[],
  index: number
): string | undefined {
  const step = steps[index];
  if (step && 'explain' in step && step.explain) return step.explain;
  const rule = ruleForStep(steps, index);
  return rule?.aha ?? rule?.body;
}

/**
 * Правило, к которому относится задание, — целиком, с таблицей и примерами.
 *
 * Нужно, чтобы при ошибке показать не сноску в три слова, а сам разбор:
 * человек ошибся именно в этом правиле, значит правило и надо открыть.
 */
export function ruleForStep(steps: GrammarStep[], index: number): RuleStep | undefined {
  for (let i = index - 1; i >= 0; i--) {
    const previous = steps[i];
    if (previous.kind === 'rule') return previous;
  }
  return undefined;
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
