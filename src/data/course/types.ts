// Типы для «Тропы» — игрового курса грамматики с нуля.
//
// Идея курса: не пересказывать учебник, а вести человека маленькими шагами,
// где каждый шаг — это либо короткое правило («карточка»), либо задание.
// Правила даются контрастивно: не «в румынском есть артикль», а «в русском
// вот так, а в румынском вот так — поэтому фраза и выглядит непривычно».

/** Карточка правила: то, что читают, а не решают. */
export interface RuleStep {
  kind: 'rule';
  title: string;
  body: string;
  examples?: { ro: string; ru: string; note?: string }[];
  /** «Ага-момент» — одна фраза, ради которой урок и существует. Показывается ярко. */
  aha?: string;
}

/** Выбор одного варианта. Если в prompt есть «___», рисуем пропуск. */
export interface ChoiceStep {
  kind: 'choice';
  prompt: string;
  /** Перевод задания. В режиме погружения прячется под тап. */
  ru?: string;
  options: string[];
  correct: number;
  explain?: string;
}

/** Собери фразу из слов — главное «залипательное» задание курса. */
export interface BuildStep {
  kind: 'build';
  ru: string;
  answer: string;
  /** Лишние слова-ловушки; слова самого ответа добавляются автоматически. */
  bank?: string[];
  explain?: string;
}

/** Напечатать перевод руками. */
export interface TypeStep {
  kind: 'type';
  ru: string;
  answer: string;
  alt?: string[];
  hint?: string;
  explain?: string;
}

/** Сопоставить румынское с русским. */
export interface MatchStep {
  kind: 'match';
  title?: string;
  pairs: { ro: string; ru: string }[];
}

/** Послушать и выбрать то, что прозвучало. */
export interface ListenStep {
  kind: 'listen';
  ro: string;
  options: string[];
  correct: number;
  ru?: string;
  explain?: string;
}

/** Найти в предложении единственное неправильное слово. */
export interface SpotStep {
  kind: 'spot';
  tokens: string[];
  wrongIndex: number;
  fix: string;
  ru?: string;
  explain?: string;
}

/** Преобразовать форму: ед.ч. → мн.ч., утверждение → отрицание и т.п. */
export interface TransformStep {
  kind: 'transform';
  instruction: string;
  from: string;
  answer: string;
  alt?: string[];
  ru?: string;
  explain?: string;
}

export type GrammarStep =
  | RuleStep
  | ChoiceStep
  | BuildStep
  | TypeStep
  | MatchStep
  | ListenStep
  | SpotStep
  | TransformStep;

export type StepKind = GrammarStep['kind'];

/** Задание, за которое начисляют опыт (всё, кроме карточек правил). */
export function isScorableStep(step: GrammarStep): boolean {
  return step.kind !== 'rule';
}

export interface GrammarLesson {
  id: string;
  title: string;
  /** Одна строка: что человек будет уметь после урока. */
  subtitle: string;
  emoji: string;
  /** Босс главы: меньше сердец, больше опыта, отдельная плашка на карте. */
  boss?: boolean;
  steps: GrammarStep[];
}

export interface CourseChapter {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  level: 'A0' | 'A1' | 'A2';
  /** Цвет главы — им красится её ветка на карте курса. */
  color: string;
  lessons: GrammarLesson[];
}
