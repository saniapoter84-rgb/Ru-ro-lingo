import { DrillPack, DrillRow } from '../data/drills/types';
import { ChoiceStep, GrammarLesson, GrammarStep } from '../data/course/types';
import { normalizeAnswer } from './courseEngine';

/**
 * Сборка заданий из строк тренажёра.
 *
 * Одна строка даёт до трёх разных упражнений, и это не экономия, а метод:
 * узнать нужную форму среди похожих, получить её из другой формы и написать
 * с нуля — три разных навыка. Человек, который уверенно выбирает вариант,
 * очень часто не может ту же форму воспроизвести.
 */

/** Сколько заданий в полном блоке практики после теории. */
export const DRILL_FULL = 20;
/** Сколько — в коротком напоминании, когда тема всплывает позже. */
export const DRILL_SHORT = 5;

/** Детерминированный генератор: одна и та же тема в один день — один набор. */
function makeRandom(seed: number): () => number {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 0xffffffff;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Задание на выбор: правильная форма среди тех ошибок, которые реально делают. */
function toChoice(row: DrillRow, pack: DrillPack, random: () => number): ChoiceStep {
  const options = shuffled([row.ro, ...row.traps.slice(0, 3)], random);
  const prompt = row.sentence
    ? row.sentence
    : row.from
      ? `${row.from} → ___`
      : row.ru;

  return {
    kind: 'choice',
    prompt,
    // Русский перевод не показываем, когда он и есть само задание.
    ru: row.sentence || row.from ? row.ru : undefined,
    options,
    correct: options.indexOf(row.ro),
    explain: row.note,
  };
}

function toTransform(row: DrillRow, pack: DrillPack): GrammarStep | null {
  if (!row.from) return null;
  // Приложение честно разрешает не ставить диакритику, поэтому пара вроде
  // «casă → casa» на вводе неотличима. Такие случаи отрабатываются только
  // выбором варианта, где разница видна глазом.
  if (normalizeAnswer(row.from) === normalizeAnswer(row.ro)) return null;
  return {
    kind: 'transform',
    instruction: pack.transformInstruction ?? 'Поставь в нужную форму',
    from: row.from,
    answer: row.ro,
    alt: row.alt,
    ru: row.ru,
    explain: row.note,
  };
}

/** Сколько слов во фразе ещё разумно просить набрать руками целиком. */
const TYPEABLE_WORDS = 6;

function toType(row: DrillRow): GrammarStep | null {
  if (!row.sentence) {
    return { kind: 'type', ru: row.ru, answer: row.ro, alt: row.alt, hint: row.note };
  }

  // Фразу из пропуска можно просить набрать целиком — но только короткую:
  // длинное предложение проверяет терпение, а не грамматику.
  const filled = row.sentence.replace('___', row.ro);
  if (filled.split(/\s+/).length > TYPEABLE_WORDS) return null;
  return {
    kind: 'type',
    ru: row.ru,
    answer: filled,
    alt: row.alt,
    hint: row.note,
  };
}

/**
 * Полный набор заданий по теме. Порядок перемешан, но детерминирован:
 * при возврате в тот же урок практика не пересобирается заново.
 */
export function buildDrillSteps(pack: DrillPack, count: number, salt = ''): GrammarStep[] {
  const random = makeRandom(hash(pack.id + salt));

  // Сначала по одному упражнению на каждую строку — чтобы охватить все
  // случаи, прежде чем повторять любой из них.
  const rounds: GrammarStep[][] = [[], [], []];
  for (const row of shuffled(pack.rows, random)) {
    rounds[0].push(toChoice(row, pack, random));
    const transform = toTransform(row, pack);
    const type = toType(row);
    if (transform) rounds[1].push(transform);
    if (type) rounds[transform ? 2 : 1].push(type);
  }

  const steps: GrammarStep[] = [];
  for (const round of rounds) {
    for (const step of round) {
      if (steps.length >= count) return steps;
      steps.push(step);
    }
  }

  // Строк не хватило на нужный объём — до конца добираем повторами выбора
  // с другой раскладкой вариантов.
  let guard = 0;
  while (steps.length < count && pack.rows.length > 0 && guard < count * 3) {
    const row = pack.rows[guard % pack.rows.length];
    steps.push(toChoice(row, pack, random));
    guard++;
  }
  return steps;
}

/**
 * Синтетический «урок» из практики — чтобы напоминание проигрывалось тем же
 * экраном, что и обычный урок, со всеми его комбо, разбором и очередью
 * неверных ответов.
 */
export function drillLesson(
  packs: DrillPack[],
  count: number,
  options: { title: string; subtitle: string; emoji: string; salt?: string }
): GrammarLesson {
  const perPack = Math.max(1, Math.round(count / Math.max(1, packs.length)));
  const steps: GrammarStep[] = [];
  for (const pack of packs) {
    steps.push(...buildDrillSteps(pack, perPack, options.salt ?? ''));
  }
  return {
    id: `drill_${packs.map((p) => p.id).join('_')}`,
    title: options.title,
    subtitle: options.subtitle,
    emoji: options.emoji,
    steps,
  };
}
