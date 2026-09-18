import { ALL_WORDS, Word } from '../data';
import { AnswerCheck, checkAnswer } from './answers';

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

/**
 * Все верные ответы на каждый вопрос — по обоим направлениям.
 *
 * Слово может значить не одно: «nepot» это и племянник, и внук, «sigur» —
 * и «конечно», и «безопасный». Причём второе значение живёт отдельной
 * карточкой, иногда в другой теме, а у «конечно» есть ещё и синоним
 * «desigur». Собираем индекс один раз и дальше сверяемся с ним.
 */
let answerIndex: { byRo: Map<string, Set<string>>; byRu: Map<string, Set<string>> } | null = null;

function answersFor(prompt: string, field: 'ru' | 'ro'): Set<string> {
  if (!answerIndex) {
    const byRo = new Map<string, Set<string>>();
    const byRu = new Map<string, Set<string>>();
    const add = (map: Map<string, Set<string>>, key: string, value: string) => {
      const set = map.get(key) ?? new Set<string>();
      set.add(value);
      map.set(key, set);
    };
    for (const w of ALL_WORDS) {
      const ro = w.ro.toLowerCase();
      const ru = w.ru.toLowerCase();
      add(byRo, ro, ru);
      add(byRu, ru, ro);
      for (const form of w.alt ?? []) add(byRo, form.toLowerCase(), ru);
    }
    answerIndex = { byRo, byRu };
  }
  // Спрашиваем румынское слово — верны его русские переводы, и наоборот.
  const map = field === 'ru' ? answerIndex.byRo : answerIndex.byRu;
  return map.get(prompt.toLowerCase()) ?? new Set<string>();
}

function pickDistractors(word: Word, unitWords: Word[], field: 'ru' | 'ro', n: number): Word[] {
  // Поле, которое человек видит в вопросе, и все ответы, которые на него
  // верны. Поставить любой из них в ловушки значит наказать за верный
  // ответ, поэтому такие кандидаты не берутся вовсе.
  const promptField: 'ru' | 'ro' = field === 'ru' ? 'ro' : 'ru';
  const forbidden = answersFor(word[promptField], field);

  const seenText = new Set([word[field].toLowerCase()]);
  const fromUnit = unitWords.filter((w) => w.id !== word.id);
  const rest = ALL_WORDS.filter((w) => w.id !== word.id && w.unitId !== word.unitId);
  const pool = shuffle([...shuffle(fromUnit), ...shuffle(rest)]);

  const result: Word[] = [];
  for (const candidate of pool) {
    const text = candidate[field].toLowerCase();
    if (forbidden.has(text)) continue;
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

export { stripDiacritics } from './answers';

/**
 * Проверка ответа в словарном уроке. Логика общая с курсом: записи вида
 * «acest / această» принимаются по любой из форм, уточнение в скобках
 * необязательно, а лишнее местоимение не считается ошибкой.
 */
export function checkWordAnswer(userInput: string, acceptable: string[]): AnswerCheck {
  const [first, ...rest] = acceptable;
  if (!first) return { correct: false };
  return checkAnswer(userInput, first, rest);
}

export function isAnswerCorrect(userInput: string, acceptable: string[]): boolean {
  return checkWordAnswer(userInput, acceptable).correct;
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
