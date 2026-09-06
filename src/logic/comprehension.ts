import { ALL_WORDS } from '../data';
import { COURSE } from '../data/course';
import { GrammarStep } from '../data/course/types';
import { LIVE_TEXTS, LiveText } from '../data/texts';
import { normalizeToken } from './wordHints';
import { ProgressState } from './progress';

/**
 * Сколько живого текста человек уже узнаёт.
 *
 * Считается честно и по двум источникам сразу: слова, закреплённые
 * интервальным повторением, и слова, реально встречавшиеся в пройденных
 * уроках «Тропы». Ничего не начисляется «за старание» — если слово
 * ни разу не попадалось, оно так и останется тусклым, и это нормально:
 * весь смысл экрана в том, чтобы через неделю тот же текст засветился
 * сильнее без единой подкрутки.
 */

export type TokenState = 'known' | 'seen' | 'new';

export interface AnalyzedToken {
  /** Как слово выглядит в тексте, со знаками препинания. */
  raw: string;
  key: string;
  state: TokenState;
  /** Слово ли это вообще: числа и тире не считаем. */
  countable: boolean;
  gloss?: string;
}

export interface AnalyzedLine {
  tokens: AnalyzedToken[];
  ru: string;
}

export interface TextAnalysis {
  lines: AnalyzedLine[];
  total: number;
  known: number;
  seen: number;
  /** Доля узнаваемых слов: твёрдые + встречавшиеся. */
  ratio: number;
  solidRatio: number;
  /** Слова текста, которые пока совсем новые, — по одному разу. */
  newWords: AnalyzedToken[];
}

// --- Индексы ------------------------------------------------------------

/** Румынское слово → id словарной записи. */
const RO_TO_WORD_ID = (() => {
  const map = new Map<string, string>();
  for (const word of ALL_WORDS) {
    const forms = [word.ro, ...(word.alt ?? [])];
    for (const form of forms) {
      // Многословные записи («bună ziua») разбираем и на части: в тексте
      // они встречаются по отдельности.
      const cleaned = form.replace(/\([^)]*\)/g, ' ');
      for (const part of cleaned.split(/[\s/]+/)) {
        const key = normalizeToken(part);
        if (key.length > 1 && !map.has(key)) map.set(key, word.id);
      }
    }
  }
  return map;
})();

function stepTokens(step: GrammarStep): string[] {
  switch (step.kind) {
    case 'rule':
      return (step.examples ?? []).map((ex) => ex.ro);
    case 'choice':
      return [step.prompt, ...step.options];
    case 'build':
      return [step.answer, ...(step.bank ?? [])];
    case 'type':
      return [step.answer, ...(step.alt ?? [])];
    case 'match':
      return step.pairs.map((p) => p.ro);
    case 'listen':
      return [step.ro, ...step.options];
    case 'spot':
      return [...step.tokens, step.fix];
    case 'transform':
      return [step.from, step.answer, ...(step.alt ?? [])];
    default:
      return [];
  }
}

/** Румынское слово → в скольких уроках курса оно встречается. */
const COURSE_WORD_LESSONS = (() => {
  const map = new Map<string, Set<string>>();
  for (const chapter of COURSE) {
    for (const lesson of chapter.lessons) {
      for (const step of lesson.steps) {
        for (const text of stepTokens(step)) {
          for (const piece of text.split(/[\s—–-]+/)) {
            const key = normalizeToken(piece);
            // Односимвольные слова тоже считаем: «o» и «e» — это артикль
            // и связка, они держат половину румынской фразы.
            if (key.length < 1) continue;
            let set = map.get(key);
            if (!set) map.set(key, (set = new Set()));
            set.add(lesson.id);
          }
        }
      }
    }
  }
  return map;
})();

/**
 * Румынская морфология «на глазок».
 *
 * Словарь хранит начальные формы, а в живом тексте слова стоят в живых:
 * к существительному приклеен артикль, прилагательное согласовано, глагол
 * спрягается или стоит причастием. Полноценный морфоанализатор сюда не
 * поместится, но десятка правил хватает, чтобы `cumpărat` нашёл `cumpăra`,
 * а `temperaturile` — `temperatură`. Правила работают только на понижение
 * (форма → основа), поэтому ложных срабатываний почти нет: если основы
 * нет в словаре, слово честно останется новым.
 */
function stripEndings(key: string): string[] {
  const out: string[] = [];
  const cut = (n: number, ...add: string[]) => {
    const stem = key.slice(0, -n);
    if (stem.length < 2) return;
    out.push(stem, ...add.map((suffix) => stem + suffix));
  };

  // Существительное: приклеенный артикль и падежные формы.
  if (key.endsWith('urile')) cut(5);
  if (key.endsWith('urilor')) cut(6);
  if (key.endsWith('ului')) cut(4);
  if (key.endsWith('elor')) cut(4, 'ă', 'e');
  if (key.endsWith('ilor')) cut(4, 'ă', 'e');
  if (key.endsWith('ile')) cut(3, 'ă', 'e');
  if (key.endsWith('ele')) cut(3, 'ă', 'e');
  if (key.endsWith('uri')) cut(3);
  if (key.endsWith('lui')) cut(3, 'e');
  if (key.endsWith('ul')) cut(2);
  if (key.endsWith('le')) cut(2, 'e');
  if (key.endsWith('ii')) cut(2, 'ă', 'ie', 'e');
  if (key.endsWith('ea')) cut(2, 'e');

  // Причастия: -at → -a, -it → -i, -ut → -e/-ea.
  if (/(at|ată|ați|ate)$/.test(key)) cut(key.endsWith('at') ? 2 : 3, 'a');
  if (/(it|ită|iți|ite)$/.test(key)) cut(key.endsWith('it') ? 2 : 3, 'i');
  if (/(ut|ută|uți|ute)$/.test(key)) cut(key.endsWith('ut') ? 2 : 3, 'e', 'ea');

  // Личные окончания настоящего времени.
  if (key.endsWith('ează')) cut(4, 'a');
  if (key.endsWith('ez')) cut(2, 'a');
  if (key.endsWith('ește')) cut(4, 'i');
  if (key.endsWith('ești')) cut(4, 'i');
  if (key.endsWith('esc')) cut(3, 'i');
  if (key.endsWith('ăm')) cut(2, 'a');
  if (key.endsWith('ați')) cut(3, 'a');
  if (key.endsWith('eți')) cut(3, 'e');
  if (key.endsWith('iți')) cut(3, 'i');
  if (key.endsWith('im')) cut(2, 'i');
  if (key.endsWith('em')) cut(2, 'e');

  // Согласование прилагательных и 3-е лицо: -ă / -i / -e.
  if (key.endsWith('ă')) cut(1, 'a');
  if (key.endsWith('i')) cut(1, 'e', 't');
  if (key.endsWith('e')) cut(1, 'ă');
  if (key.endsWith('ți')) cut(2, 't');
  if (key.endsWith('și')) cut(2, 's');
  if (key.endsWith('a')) cut(1, 'ă', 'e');

  return out;
}

/** Чередование в корне: pleacă → pleca, poate → putea. */
function flatten(key: string): string[] {
  const out = [key];
  if (key.includes('ea')) out.push(key.replace(/ea/g, 'e'));
  if (key.includes('oa')) out.push(key.replace(/oa/g, 'o'));
  return out;
}

function baseCandidates(key: string): string[] {
  const seeds = flatten(key);
  const out = new Set<string>();

  for (const seed of seeds) {
    for (const stem of stripEndings(seed)) out.add(stem);
    // Основа глагола без окончания: merg → merge, spun → spune.
    for (const suffix of ['e', 'a', 'ă', 'i']) out.add(seed + suffix);
  }
  out.delete(key);
  return [...out].filter((c) => c.length > 1);
}

// --- Разбор -------------------------------------------------------------

/** Уровень SRS, начиная с которого слово считается твёрдо знакомым. */
const SOLID_LEVEL = 3;
/** В скольких пройденных уроках слово должно встретиться, чтобы стать «своим». */
const SOLID_LESSONS = 3;

interface Knowledge {
  wordLevel: (key: string) => number | null;
  courseHits: (key: string) => number;
}

function buildKnowledge(state: ProgressState): Knowledge {
  const doneLessons = new Set(
    Object.entries(state.course)
      .filter(([, entry]) => entry?.completed)
      .map(([id]) => id)
  );

  const levelFor = (key: string): number | null => {
    const id = RO_TO_WORD_ID.get(key);
    if (!id) return null;
    const progress = state.words[id];
    if (!progress || progress.seenCount === 0) return null;
    return progress.level;
  };

  return {
    wordLevel: (key) => {
      const direct = levelFor(key);
      if (direct !== null) return direct;
      for (const candidate of baseCandidates(key)) {
        const level = levelFor(candidate);
        if (level !== null) return level;
      }
      return null;
    },
    courseHits: (key) => {
      const lessons = COURSE_WORD_LESSONS.get(key);
      if (!lessons) return 0;
      let hits = 0;
      for (const id of lessons) if (doneLessons.has(id)) hits++;
      return hits;
    },
  };
}

const ORDER: Record<TokenState, number> = { new: 0, seen: 1, known: 2 };

function classifySimple(key: string, knowledge: Knowledge): TokenState {
  const level = knowledge.wordLevel(key);
  if (level !== null && level >= SOLID_LEVEL) return 'known';

  const hits = knowledge.courseHits(key);
  if (hits >= SOLID_LESSONS) return 'known';
  if (level !== null || hits > 0) return 'seen';
  return 'new';
}

function classify(key: string, knowledge: Knowledge): TokenState {
  const direct = classifySimple(key, knowledge);
  if (direct !== 'new' || !key.includes('-')) return direct;

  // Слитные формы с клитикой («ți-am», «scrie-mi») в словаре не лежат,
  // но состоят из слов, которые человек вполне может знать. Считаем такую
  // форму настолько же знакомой, насколько знакома её слабейшая половина.
  const parts = key.split('-').filter(Boolean);
  if (parts.length < 2) return direct;

  let worst: TokenState = 'known';
  for (const part of parts) {
    const state = classifySimple(part, knowledge);
    if (ORDER[state] < ORDER[worst]) worst = state;
  }
  return worst;
}

const HAS_LETTER = /[a-zăâîșțA-ZĂÂÎȘȚ]/;

export function analyzeText(text: LiveText, state: ProgressState): TextAnalysis {
  const knowledge = buildKnowledge(state);
  const proper = new Set((text.proper ?? []).map(normalizeToken));
  const lines: AnalyzedLine[] = [];
  const newWords: AnalyzedToken[] = [];
  const newSeen = new Set<string>();

  let total = 0;
  let known = 0;
  let seen = 0;

  for (const line of text.lines) {
    const tokens: AnalyzedToken[] = [];
    for (const raw of line.ro.split(/\s+/)) {
      if (!raw) continue;
      const key = normalizeToken(raw);
      const countable = key.length > 0 && HAS_LETTER.test(key);
      if (!countable) {
        tokens.push({ raw, key, state: 'new', countable: false });
        continue;
      }

      // Имена и города учить не надо: «Cluj» понятен и в первый день.
      const state_ = proper.has(key) ? 'known' : classify(key, knowledge);
      total++;
      if (state_ === 'known') known++;
      else if (state_ === 'seen') seen++;

      const token: AnalyzedToken = {
        raw,
        key,
        state: state_,
        countable: true,
        gloss: text.gloss[key],
      };
      tokens.push(token);

      if (state_ === 'new' && !newSeen.has(key)) {
        newSeen.add(key);
        newWords.push(token);
      }
    }
    lines.push({ tokens, ru: line.ru });
  }

  return {
    lines,
    total,
    known,
    seen,
    ratio: total === 0 ? 0 : (known + seen) / total,
    solidRatio: total === 0 ? 0 : known / total,
    newWords,
  };
}

export interface ComprehensionSummary {
  /** Средняя узнаваемость по всем текстам, 0..1. */
  ratio: number;
  /** Текст, который прямо сейчас читается легче всего и при этом не пуст. */
  best: LiveText;
  bestRatio: number;
  /** Сколько текстов уже читаются почти целиком. */
  readable: number;
  total: number;
}

/** Порог, после которого текст можно считать «читаемым». */
export const READABLE_RATIO = 0.8;

export function comprehensionSummary(state: ProgressState): ComprehensionSummary {
  let sum = 0;
  let best = LIVE_TEXTS[0];
  let bestRatio = -1;
  let readable = 0;

  for (const text of LIVE_TEXTS) {
    const { ratio } = analyzeText(text, state);
    sum += ratio;
    if (ratio >= READABLE_RATIO) readable++;
    // Лучший — самый понятный из ещё не дочитанных «в ноль».
    if (ratio > bestRatio && ratio < 1) {
      bestRatio = ratio;
      best = text;
    }
  }

  return {
    ratio: LIVE_TEXTS.length === 0 ? 0 : sum / LIVE_TEXTS.length,
    best,
    bestRatio: Math.max(bestRatio, 0),
    readable,
    total: LIVE_TEXTS.length,
  };
}
