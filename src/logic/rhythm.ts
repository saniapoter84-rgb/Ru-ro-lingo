import { ProgressState, toLocalDateString } from './progress';

/**
 * «Ритм» — история занятий без наказания.
 *
 * Обычный стрик устроен как долг: чем он длиннее, тем страшнее его
 * потерять, и в какой-то момент приложение открывают не чтобы учиться,
 * а чтобы откупиться. Здесь другое: показывается только то, что уже
 * сделано. Пропущенный день не сгорает и ничего не обнуляет — он просто
 * остаётся незакрашенным квадратом, а число «дней с языком» продолжает
 * расти с того места, где остановилось.
 */

export interface RhythmDay {
  date: string;
  /** В этот день приложение открывали. */
  active: boolean;
  today: boolean;
  /** День ещё не наступил — хвост текущей недели. */
  future: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Понедельник как начало недели — так календарь читается привычно. */
function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/**
 * Сетка последних `weeks` недель, по неделе в строке, заканчивая той,
 * в которой мы находимся сейчас.
 */
export function buildRhythm(
  activeDates: string[],
  weeks: number = 5,
  now: Date = new Date()
): RhythmDay[] {
  const active = new Set(activeDates);
  const today = toLocalDateString(now);

  // Начало текущей недели, затем отступаем на нужное число недель назад.
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  startOfWeek.setTime(startOfWeek.getTime() - mondayIndex(now) * DAY_MS);
  const first = new Date(startOfWeek.getTime() - (weeks - 1) * 7 * DAY_MS);

  const days: RhythmDay[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const date = toLocalDateString(new Date(first.getTime() + i * DAY_MS));
    days.push({
      date,
      active: active.has(date),
      today: date === today,
      future: date > today,
    });
  }
  return days;
}

/** Сколько дней подряд занимались, считая от сегодня назад. */
export function currentRun(activeDates: string[], now: Date = new Date()): number {
  const active = new Set(activeDates);
  let run = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (active.has(toLocalDateString(cursor))) {
    run++;
    cursor.setTime(cursor.getTime() - DAY_MS);
  }
  return run;
}

/** Сколько дней на этой неделе уже закрыто. */
export function daysThisWeek(activeDates: string[], now: Date = new Date()): number {
  return buildRhythm(activeDates, 1, now).filter((d) => d.active).length;
}

export interface RhythmSummary {
  /** Всего дней с языком — число, которое никогда не уменьшается. */
  totalDays: number;
  /** Дней подряд прямо сейчас. Показывается как факт, а не как ставка. */
  run: number;
  /** Самый длинный отрезок за всё время — личный рекорд. */
  best: number;
  thisWeek: number;
  days: RhythmDay[];
}

export function rhythmSummary(state: ProgressState, now: Date = new Date()): RhythmSummary {
  const dates = state.activeDates;
  const run = currentRun(dates, now);
  return {
    totalDays: Math.max(state.daysActive, dates.length),
    run,
    best: Math.max(state.longestStreak, run),
    thisWeek: daysThisWeek(dates, now),
    days: buildRhythm(dates, 5, now),
  };
}
