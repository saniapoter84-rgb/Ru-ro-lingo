// Ежедневные задания — то, ради чего открываешь приложение «на минутку».
// Набор на день собирается детерминированно из даты: у одного и того же
// дня всегда одни и те же три задания, так что список не «прыгает»
// при каждом перезапуске.

export type QuestKind = 'xp' | 'tasks' | 'lessons' | 'perfect' | 'combo' | 'dialogue' | 'words';

export interface Quest {
  kind: QuestKind;
  target: number;
  progress: number;
  /** Награда уже начислена — чтобы не выдать её дважды. */
  claimed: boolean;
}

export interface QuestState {
  /** 'YYYY-MM-DD' — день, на который собран набор. */
  date: string;
  quests: Quest[];
}

interface QuestDef {
  kind: QuestKind;
  emoji: string;
  targets: number[];
  reward: number;
  label: (target: number) => string;
}

const DEFS: QuestDef[] = [
  {
    kind: 'xp',
    emoji: '⭐',
    targets: [50, 80, 120],
    reward: 30,
    label: (n) => `Заработай ${n} XP`,
  },
  {
    kind: 'tasks',
    emoji: '✅',
    targets: [15, 25, 40],
    reward: 25,
    label: (n) => `Реши ${n} заданий`,
  },
  {
    kind: 'lessons',
    emoji: '📗',
    targets: [1, 2, 3],
    reward: 30,
    label: (n) => (n === 1 ? 'Пройди урок курса' : `Пройди ${n} урока курса`),
  },
  {
    kind: 'perfect',
    emoji: '💎',
    targets: [1, 2],
    reward: 40,
    label: (n) => (n === 1 ? 'Пройди урок без ошибок' : `Пройди ${n} урока без ошибок`),
  },
  {
    kind: 'combo',
    emoji: '🔥',
    targets: [5, 8, 12],
    reward: 35,
    label: (n) => `Собери комбо из ${n} подряд`,
  },
  {
    kind: 'dialogue',
    emoji: '🎧',
    targets: [1, 2],
    reward: 35,
    label: (n) => (n === 1 ? 'Разбери одну сцену в погружении' : `Разбери ${n} сцены в погружении`),
  },
  {
    kind: 'words',
    emoji: '🧠',
    targets: [10, 20, 30],
    reward: 25,
    label: (n) => `Повтори ${n} слов`,
  },
];

const DEFS_BY_KIND = new Map(DEFS.map((d) => [d.kind, d]));

export function questLabel(quest: Quest): string {
  const def = DEFS_BY_KIND.get(quest.kind);
  return def ? def.label(quest.target) : '';
}

export function questEmoji(quest: Quest): string {
  return DEFS_BY_KIND.get(quest.kind)?.emoji ?? '🎯';
}

export function questReward(quest: Quest): number {
  return DEFS_BY_KIND.get(quest.kind)?.reward ?? 20;
}

export function isQuestDone(quest: Quest): boolean {
  return quest.progress >= quest.target;
}

/** Простой детерминированный генератор: одинаковая дата → одинаковый набор. */
function seedFromDate(date: string): number {
  let hash = 2166136261;
  for (let i = 0; i < date.length; i++) {
    hash ^= date.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextRandom(seed: number): [number, number] {
  // xorshift32 — быстрый и достаточный для выбора трёх заданий.
  let x = seed;
  x ^= x << 13;
  x >>>= 0;
  x ^= x >> 17;
  x ^= x << 5;
  x >>>= 0;
  return [x / 0xffffffff, x];
}

/** Три задания на день: разные по типу, сложность растёт со временем. */
export function generateQuests(date: string, dayIndex: number = 0): Quest[] {
  let seed = seedFromDate(date);
  const pool = [...DEFS];
  const chosen: Quest[] = [];

  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const [roll, nextSeed] = nextRandom(seed);
    seed = nextSeed;
    const def = pool.splice(Math.floor(roll * pool.length), 1)[0];

    // Чем дольше человек в игре, тем выше планка — но не выше максимума.
    const tier = Math.min(def.targets.length - 1, Math.floor(dayIndex / 7));
    chosen.push({ kind: def.kind, target: def.targets[tier], progress: 0, claimed: false });
  }
  return chosen;
}

export function createQuestState(date: string, dayIndex: number = 0): QuestState {
  return { date, quests: generateQuests(date, dayIndex) };
}

/** Если наступил новый день — собираем свежий набор. */
export function ensureQuestsForDate(
  state: QuestState | undefined,
  date: string,
  dayIndex: number = 0
): QuestState {
  if (state && state.date === date) return state;
  return createQuestState(date, dayIndex);
}

/**
 * Двигает прогресс задания нужного типа. Для «комбо» берётся максимум за
 * день, для остальных — сумма.
 */
export function bumpQuests(state: QuestState, kind: QuestKind, amount: number = 1): QuestState {
  let changed = false;
  const quests = state.quests.map((q) => {
    if (q.kind !== kind) return q;
    const progress = kind === 'combo' ? Math.max(q.progress, amount) : q.progress + amount;
    if (progress === q.progress) return q;
    changed = true;
    return { ...q, progress: Math.min(progress, q.target) };
  });
  return changed ? { ...state, quests } : state;
}

/** Забирает награду за выполненные, но ещё не оплаченные задания. */
export function claimFinishedQuests(state: QuestState): { state: QuestState; xp: number } {
  let xp = 0;
  let changed = false;
  const quests = state.quests.map((q) => {
    if (q.claimed || !isQuestDone(q)) return q;
    xp += questReward(q);
    changed = true;
    return { ...q, claimed: true };
  });
  return changed ? { state: { ...state, quests }, xp } : { state, xp: 0 };
}
