/**
 * Проверка введённого ответа.
 *
 * Одна точка на всё приложение: и словарные уроки, и курс, и тренажёр.
 * Раньше проверок было две, и обе сравнивали введённое со строкой из
 * данных буквально. А в данных словарная запись — это не всегда одно
 * слово: «acest / această» — это две формы через слэш, «счёт (в банке)» —
 * слово с уточнением. Буквальное сравнение требовало вводить всю запись
 * целиком, вместе со слэшем и скобками, и любой нормальный ответ считался
 * ошибкой.
 */

/** Убирает румынские диакритики — ответ без «ș/ț/ă/â/î» тоже засчитывается. */
export function stripDiacritics(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[șş]/g, 's')
    .replace(/[țţ]/g, 't')
    .replace(/[ăâ]/g, 'a')
    .replace(/î/g, 'i')
    .trim();
}

/** Приведение к виду, в котором сравниваются ответы. */
export function normalizeAnswer(s: string): string {
  return stripDiacritics(s)
    .replace(/[.,!?;:"'«»()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Все написания, которые считаются этим же ответом.
 *
 * Запись «acest / această» даёт три варианта: обе формы по отдельности и
 * запись целиком. Запись «счёт (в банке)» — и со скобкой, и без неё:
 * уточнение в скобках существует для человека, а не для проверки.
 */
export function answerVariants(text: string): string[] {
  const out = new Set<string>();

  const add = (value: string) => {
    const trimmed = value.replace(/\s+/g, ' ').trim();
    if (trimmed) out.add(trimmed);
  };

  // Слэш встречается в двух разных ролях, и путать их нельзя.
  //
  // «acest / această» — это две самостоятельные записи, разделённые
  // слэшем с пробелами. А «el/ea este» — выбор внутри одного слова, и
  // разрезать фразу целиком тут нельзя: получится «el» и «ea este», а
  // правильный ответ «el este» не примется.
  const phrases = /\s[/\\]\s/.test(text) ? text.split(/\s[/\\]\s/) : [text];

  for (const phrase of phrases) {
    for (const expanded of expandInlineSlashes(phrase)) {
      add(expanded);
      // Уточнение в скобках необязательно: засчитываем и с ним, и без него.
      add(expanded.replace(/\([^)]*\)/g, ' '));
      add(expanded.replace(/[()]/g, ' '));
    }
  }
  add(text);

  return [...out];
}

/** Сколько вариантов максимум разворачиваем — защита от комбинаторики. */
const MAX_VARIANTS = 16;

/** «el/ea este» → «el este» и «ea este». */
function expandInlineSlashes(phrase: string): string[] {
  const tokens = phrase.split(/\s+/);
  let results: string[][] = [[]];

  for (const token of tokens) {
    const options = token.includes('/') || token.includes('\\')
      ? token.split(/[/\\]/).filter(Boolean)
      : [token];
    const next: string[][] = [];
    for (const prefix of results) {
      for (const option of options) {
        if (next.length >= MAX_VARIANTS) break;
        next.push([...prefix, option]);
      }
    }
    results = next.length > 0 ? next : results;
  }

  return results.map((parts) => parts.join(' '));
}

/**
 * Подлежащие-местоимения. В румынском их обычно опускают: окончание
 * глагола и так показывает лицо. Но сказать с местоимением не ошибка —
 * это ровно то, что делает русскоговорящий по привычке, и заворачивать
 * такой ответ было бы прямым враньём.
 */
const SUBJECT_PRONOUNS = ['eu', 'tu', 'el', 'ea', 'noi', 'voi', 'ei', 'ele'];

export interface AnswerCheck {
  correct: boolean;
  /** Что сказать сверх «верно»: ответ принят, но есть нюанс. */
  note?: string;
}

const PRONOUN_NOTE =
  'Так тоже правильно. Но местоимение обычно опускают: окончание глагола и так показывает, о ком речь, и носители говорят короче.';

function withoutLeadingPronoun(normalized: string): string | null {
  for (const pronoun of SUBJECT_PRONOUNS) {
    if (normalized.startsWith(pronoun + ' ')) return normalized.slice(pronoun.length + 1);
  }
  return null;
}

export function checkAnswer(input: string, answer: string, alt?: string[]): AnswerCheck {
  const normalizedInput = normalizeAnswer(input);
  if (!normalizedInput) return { correct: false };

  const accepted = new Set<string>();
  for (const source of [answer, ...(alt ?? [])]) {
    for (const variant of answerVariants(source)) {
      const normalized = normalizeAnswer(variant);
      if (normalized) accepted.add(normalized);
    }
  }

  if (accepted.has(normalizedInput)) return { correct: true };

  // Человек добавил местоимение, которого в ответе нет.
  const stripped = withoutLeadingPronoun(normalizedInput);
  if (stripped && accepted.has(stripped)) return { correct: true, note: PRONOUN_NOTE };

  // Или наоборот — опустил его, как и делают носители.
  for (const candidate of accepted) {
    const withoutPronoun = withoutLeadingPronoun(candidate);
    if (withoutPronoun && withoutPronoun === normalizedInput) return { correct: true };
  }

  return { correct: false };
}

/** Короткая форма, когда нюанс не нужен. */
export function matchesAnswer(input: string, answer: string, alt?: string[]): boolean {
  return checkAnswer(input, answer, alt).correct;
}
