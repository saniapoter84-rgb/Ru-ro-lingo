import { UNITS as CORE_UNITS, Unit, WordEntry } from './units';
import { EXTRA_UNITS } from './units2';
import { UNITS_3 } from './units3';
import { UNITS_4 } from './units4';
import { UNITS_5 } from './units5';
import { UNITS_6 } from './units6';

export type { PartOfSpeech, WordEntry, Unit } from './units';

export const UNITS: Unit[] = [
  ...CORE_UNITS,
  ...EXTRA_UNITS,
  ...UNITS_3,
  ...UNITS_4,
  ...UNITS_5,
  ...UNITS_6,
];

export interface Word extends WordEntry {
  id: string;
  unitId: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  index: number;
  title: string;
  wordIds: string[];
}

const WORDS_PER_LESSON = 8;
// Если в юните остаётся меньше слов, чем это число, последний "хвост"
// приклеивается к предыдущему уроку, а не образует урок-огрызок.
const MIN_TAIL = 4;

function chunkWordIds(ids: string[]): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += WORDS_PER_LESSON) {
    chunks.push(ids.slice(i, i + WORDS_PER_LESSON));
  }
  if (chunks.length > 1 && chunks[chunks.length - 1].length < MIN_TAIL) {
    const tail = chunks.pop()!;
    chunks[chunks.length - 1].push(...tail);
  }
  return chunks;
}

function buildWords(): Word[] {
  const words: Word[] = [];
  for (const unit of UNITS) {
    unit.words.forEach((w, i) => {
      words.push({ ...w, id: `${unit.id}_${i}`, unitId: unit.id });
    });
  }
  return words;
}

function buildLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  for (const unit of UNITS) {
    const ids = unit.words.map((_, i) => `${unit.id}_${i}`);
    const chunks = chunkWordIds(ids);
    chunks.forEach((chunk, i) => {
      lessons.push({
        id: `${unit.id}_l${i + 1}`,
        unitId: unit.id,
        index: i,
        title: chunks.length > 1 ? `${unit.title} ${i + 1}` : unit.title,
        wordIds: chunk,
      });
    });
  }
  return lessons;
}

export const ALL_WORDS: Word[] = buildWords();
export const ALL_LESSONS: Lesson[] = buildLessons();

const WORDS_BY_ID = new Map(ALL_WORDS.map((w) => [w.id, w]));
const UNITS_BY_ID = new Map(UNITS.map((u) => [u.id, u]));

export function getWordById(id: string): Word | undefined {
  return WORDS_BY_ID.get(id);
}

export function getUnitById(id: string): Unit | undefined {
  return UNITS_BY_ID.get(id);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return ALL_LESSONS.filter((l) => l.unitId === unitId);
}

export function getWordsForLesson(lesson: Lesson): Word[] {
  return lesson.wordIds.map((id) => WORDS_BY_ID.get(id)!).filter(Boolean);
}

export const TOTAL_WORD_COUNT = ALL_WORDS.length;
export const TOTAL_LESSON_COUNT = ALL_LESSONS.length;
