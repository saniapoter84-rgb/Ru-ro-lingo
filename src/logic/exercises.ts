import { ALL_WORDS, Word } from '../data';

export type ExerciseKind = 'choice_ro' | 'choice_ru' | 'type_ro' | 'listen_ro';

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface ChoiceExercise {
  kind: 'choice_ro' | 'choice_ru';
  word: Word;
  prompt: string;
  options: ChoiceOption[];
  correctId: string;
}

/** Слышишь румынское слово, выбираешь русский перевод. Текста нет вообще. */
export interface ListenExercise {
  kind: 'listen_ro';
  word: Word;
  /** Что произносим. */
  audio: string;
  options: ChoiceOption[];
  correctId: string;
}

export interface TypeExercise {
  kind: 'type_ro';
  word: Word;
  prompt: string;
  answer: string;
  acceptable: string[];
}

export type Exercise = ChoiceExercise | ListenExercise | TypeExercise;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(word: Word, unitWords: Word[], field: 'ru' | 'ro', n: number): Word[] {
  const seenText = new Set([word[field].toLowerCase()]);
  const fromUnit = unitWords.filter((w) => w.id !== word.id);
  const rest = ALL_WORDS.filter((w) => w.id !== word.id && w.unitId !== word.unitId);
  const pool = shuffle([...shuffle(fromUnit), ...shuffle(rest)]);

  const result: Word[] = [];
  for (const candidate of pool) {
    const text = candidate[field].toLowerCase();
    if (seenText.has(text)) continue;
    seenText.add(text);
    result.push(candidate);
    if (result.length === n) break;
  }
  return result;
}

function buildChoiceExercise(
  kind: 'choice_ro' | 'choice_ru',
  word: Word,
  unitWords: Word[]
): ChoiceExercise {
  const field = kind === 'choice_ro' ? 'ro' : 'ru';
  const promptField = kind === 'choice_ro' ? 'ru' : 'ro';
  const distractors = pickDistractors(word, unitWords, field, 3);
  const options = shuffle([word, ...distractors]).map((w) => ({ id: w.id, text: w[field] }));
  return {
    kind,
    word,
    prompt: word[promptField],
    options,
    correctId: word.id,
  };
}

/** Убирает румынские диакритики — чтобы ответ без "ș/ț/ă/â/î" тоже засчитывался. */
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

function normalizeForCompare(s: string): string {
  return stripDiacritics(s)
    .replace(/[.,!?;:"'()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAnswerCorrect(userInput: string, acceptable: string[]): boolean {
  const normalizedInput = normalizeForCompare(userInput);
  if (!normalizedInput) return false;
  return acceptable.some((a) => normalizeForCompare(a) === normalizedInput);
}

function buildListenExercise(word: Word, unitWords: Word[]): ListenExercise {
  const distractors = pickDistractors(word, unitWords, 'ru', 3);
  const options = shuffle([word, ...distractors]).map((w) => ({ id: w.id, text: w.ru }));
  return { kind: 'listen_ro', word, audio: word.ro, options, correctId: word.id };
}

function buildTypeExercise(word: Word): TypeExercise {
  return {
    kind: 'type_ro',
    word,
    prompt: word.ru,
    answer: word.ro,
    acceptable: [word.ro, ...(word.alt ?? [])],
  };
}

/**
 * Строит очередь упражнений для набора слов (обычно — слова одного урока).
 *
 * В режиме погружения смесь смещается в сторону аудирования: слово сначала
 * слышишь и только потом видишь. Так тренируется распознавание на слух,
 * которое иначе отстаёт от чтения на месяцы.
 */
export function buildExercisesForWords(
  words: Word[],
  unitWords: Word[],
  immersion = false
): Exercise[] {
  return shuffle(words).map((word) => {
    const roll = Math.random();
    if (immersion) {
      if (roll < 0.4) return buildListenExercise(word, unitWords);
      if (roll < 0.7) return buildChoiceExercise('choice_ru', word, unitWords);
      return buildTypeExercise(word);
    }
    if (roll < 0.12) return buildListenExercise(word, unitWords);
    if (roll < 0.42) return buildChoiceExercise('choice_ro', word, unitWords);
    if (roll < 0.68) return buildChoiceExercise('choice_ru', word, unitWords);
    return buildTypeExercise(word);
  });
}
