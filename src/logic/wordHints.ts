import { ALL_WORDS } from '../data';

// Буквы кириллицы + латиницы (с румынскими диакритиками) — всё остальное
// (знаки препинания, кавычки, вопросительные знаки и т.п.) считаем "не буквой"
// и отрезаем по краям слова.
const LETTERS = 'a-zA-ZĂÂÎȘȚăâîșțА-Яа-яЁё';
const TRIM_RE = new RegExp(`^[^${LETTERS}]+|[^${LETTERS}]+$`, 'g');

export function normalizeToken(raw: string): string {
  return raw.replace(TRIM_RE, '').toLowerCase().trim();
}

function buildSingleWordIndex(field: 'ru' | 'ro'): Map<string, string> {
  const other: 'ru' | 'ro' = field === 'ru' ? 'ro' : 'ru';
  const map = new Map<string, string>();
  for (const w of ALL_WORDS) {
    const text = w[field].trim();
    if (!text || /\s/.test(text)) continue; // берём только однословные словарные записи
    const key = normalizeToken(text);
    if (!key || map.has(key)) continue;
    map.set(key, w[other]);
  }
  return map;
}

const RU_WORD_TO_RO = buildSingleWordIndex('ru');
const RO_WORD_TO_RU = buildSingleWordIndex('ro');

/**
 * Перевод одного слова из фразы, если оно само по себе есть в словаре
 * как отдельная словарная запись. Для слов внутри многословных фраз,
 * которых нет в словаре по отдельности, вернёт undefined — тогда
 * показываем перевод всей фразы целиком (см. TappableWords).
 */
export function lookupWordHint(token: string, lang: 'ru' | 'ro'): string | undefined {
  const key = normalizeToken(token);
  if (!key) return undefined;
  return (lang === 'ru' ? RU_WORD_TO_RO : RO_WORD_TO_RU).get(key);
}
