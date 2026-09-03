// Сердца — ограничитель темпа. Смысл не в наказании, а в том, чтобы
// урок ощущался как ставка: ошибаться можно, но не бесконечно.
// Восстанавливаются сами по времени, докупать ничего не нужно.

export const MAX_HEARTS = 5;
/** Одно сердце раз в 20 минут — полный запас копится примерно за полтора часа. */
export const HEART_REFILL_MS = 20 * 60 * 1000;
/** У боссов запас меньше: три ошибки — и заходишь заново. */
export const BOSS_HEARTS = 3;

export interface HeartsState {
  count: number;
  /** Когда «созреет» следующее сердце. null — запас полный. */
  regenAt: number | null;
}

export function createHearts(): HeartsState {
  return { count: MAX_HEARTS, regenAt: null };
}

/** Досчитывает сердца, накопившиеся с прошлого раза. */
export function syncHearts(state: HeartsState, now: number = Date.now()): HeartsState {
  if (state.count >= MAX_HEARTS) return { count: MAX_HEARTS, regenAt: null };
  if (state.regenAt == null) return { count: state.count, regenAt: now + HEART_REFILL_MS };
  if (now < state.regenAt) return state;

  const elapsedAfterFirst = now - state.regenAt;
  const gained = 1 + Math.floor(elapsedAfterFirst / HEART_REFILL_MS);
  const count = Math.min(MAX_HEARTS, state.count + gained);
  if (count >= MAX_HEARTS) return { count: MAX_HEARTS, regenAt: null };
  return { count, regenAt: state.regenAt + gained * HEART_REFILL_MS };
}

export function loseHeart(state: HeartsState, now: number = Date.now()): HeartsState {
  const synced = syncHearts(state, now);
  if (synced.count <= 0) return synced;
  return {
    count: synced.count - 1,
    regenAt: synced.regenAt ?? now + HEART_REFILL_MS,
  };
}

export function refillHearts(): HeartsState {
  return createHearts();
}

/** Сколько миллисекунд до следующего сердца (0 — уже полный запас). */
export function msUntilNextHeart(state: HeartsState, now: number = Date.now()): number {
  const synced = syncHearts(state, now);
  if (synced.count >= MAX_HEARTS || synced.regenAt == null) return 0;
  return Math.max(0, synced.regenAt - now);
}

/** «12:34» — для таймера над сердцами. */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
