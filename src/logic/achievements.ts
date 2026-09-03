// Ачивки. Часть выдаётся за очевидное («первый урок»), часть — за то,
// что человек сам бы не заметил («три дня подряд заходил утром до девяти»).
// Вторые ценнее: они превращают привычку в маленькое открытие.

export interface AchievementContext {
  xp: number;
  streak: number;
  longestStreak: number;
  totalCorrect: number;
  bestCombo: number;
  masteredWords: number;
  courseLessonsDone: number;
  bossesDone: number;
  chaptersDone: number;
  perfectLessons: number;
  dialoguesDone: number;
  immersionTasks: number;
  earlyBirdDays: number;
  nightOwlDays: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** Скрытые не показываются до получения — приятный сюрприз. */
  secret?: boolean;
  check: (ctx: AchievementContext) => boolean;
  /** Доля выполнения 0..1 для прогресс-бара на карточке. */
  progress?: (ctx: AchievementContext) => number;
}

const ratio = (value: number, target: number) => Math.min(1, value / target);

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Primul pas',
    description: 'Пройти первый урок курса',
    emoji: '🌱',
    check: (c) => c.courseLessonsDone >= 1,
    progress: (c) => ratio(c.courseLessonsDone, 1),
  },
  {
    id: 'chapter_one',
    title: 'Глава закрыта',
    description: 'Победить первого босса',
    emoji: '🏆',
    check: (c) => c.bossesDone >= 1,
    progress: (c) => ratio(c.bossesDone, 1),
  },
  {
    id: 'half_way',
    title: 'Полпути',
    description: 'Пройти половину курса «Тропа»',
    emoji: '🧗',
    check: (c) => c.courseLessonsDone >= 18,
    progress: (c) => ratio(c.courseLessonsDone, 18),
  },
  {
    id: 'the_path',
    title: 'Тропа пройдена',
    description: 'Закрыть все семь глав курса',
    emoji: '👑',
    check: (c) => c.chaptersDone >= 7,
    progress: (c) => ratio(c.chaptersDone, 7),
  },
  {
    id: 'flawless',
    title: 'Без единой',
    description: 'Пройти урок, не потеряв ни одного сердца',
    emoji: '💎',
    check: (c) => c.perfectLessons >= 1,
    progress: (c) => ratio(c.perfectLessons, 1),
  },
  {
    id: 'flawless_ten',
    title: 'Хирург',
    description: 'Десять уроков подряд без ошибок — суммарно',
    emoji: '🩺',
    check: (c) => c.perfectLessons >= 10,
    progress: (c) => ratio(c.perfectLessons, 10),
  },
  {
    id: 'combo_10',
    title: 'В ударе',
    description: 'Комбо из 10 правильных ответов подряд',
    emoji: '🔥',
    check: (c) => c.bestCombo >= 10,
    progress: (c) => ratio(c.bestCombo, 10),
  },
  {
    id: 'combo_25',
    title: 'Не остановить',
    description: 'Комбо из 25 правильных ответов подряд',
    emoji: '⚡',
    check: (c) => c.bestCombo >= 25,
    progress: (c) => ratio(c.bestCombo, 25),
  },
  {
    id: 'streak_7',
    title: 'Неделя',
    description: 'Семь дней подряд',
    emoji: '📅',
    check: (c) => c.longestStreak >= 7,
    progress: (c) => ratio(c.longestStreak, 7),
  },
  {
    id: 'streak_30',
    title: 'Месяц',
    description: 'Тридцать дней подряд',
    emoji: '🗓️',
    check: (c) => c.longestStreak >= 30,
    progress: (c) => ratio(c.longestStreak, 30),
  },
  {
    id: 'streak_100',
    title: 'Сто дней',
    description: 'Сто дней подряд — это уже не привычка, это характер',
    emoji: '💯',
    check: (c) => c.longestStreak >= 100,
    progress: (c) => ratio(c.longestStreak, 100),
  },
  {
    id: 'words_100',
    title: 'Сотня слов',
    description: 'Освоить 100 слов',
    emoji: '🧠',
    check: (c) => c.masteredWords >= 100,
    progress: (c) => ratio(c.masteredWords, 100),
  },
  {
    id: 'words_500',
    title: 'Полтысячи',
    description: 'Освоить 500 слов',
    emoji: '📚',
    check: (c) => c.masteredWords >= 500,
    progress: (c) => ratio(c.masteredWords, 500),
  },
  {
    id: 'immersion_first',
    title: 'Первое погружение',
    description: 'Разобрать сцену целиком в режиме погружения',
    emoji: '🤿',
    check: (c) => c.dialoguesDone >= 1,
    progress: (c) => ratio(c.dialoguesDone, 1),
  },
  {
    id: 'immersion_all',
    title: 'Свой человек',
    description: 'Разобрать все сцены погружения',
    emoji: '🎭',
    check: (c) => c.dialoguesDone >= 10,
    progress: (c) => ratio(c.dialoguesDone, 10),
  },
  {
    id: 'immersion_200',
    title: 'Думаю по-румынски',
    description: '200 заданий, решённых с выключенным русским',
    emoji: '🇷🇴',
    check: (c) => c.immersionTasks >= 200,
    progress: (c) => ratio(c.immersionTasks, 200),
  },
  {
    id: 'xp_1000',
    title: 'Тысячник',
    description: 'Набрать 1000 XP',
    emoji: '⭐',
    check: (c) => c.xp >= 1000,
    progress: (c) => ratio(c.xp, 1000),
  },
  {
    id: 'xp_10000',
    title: 'Десять тысяч',
    description: 'Набрать 10 000 XP',
    emoji: '🌟',
    check: (c) => c.xp >= 10000,
    progress: (c) => ratio(c.xp, 10000),
  },
  {
    id: 'early_bird',
    title: 'Dimineața',
    description: 'Позаниматься до девяти утра три дня',
    emoji: '🌅',
    secret: true,
    check: (c) => c.earlyBirdDays >= 3,
    progress: (c) => ratio(c.earlyBirdDays, 3),
  },
  {
    id: 'night_owl',
    title: 'Noaptea',
    description: 'Позаниматься после полуночи три раза',
    emoji: '🦉',
    secret: true,
    check: (c) => c.nightOwlDays >= 3,
    progress: (c) => ratio(c.nightOwlDays, 3),
  },
];

/** Возвращает id ачивок, которые выполнены, но ещё не были выданы. */
export function newlyUnlocked(ctx: AchievementContext, unlocked: string[]): string[] {
  const have = new Set(unlocked);
  return ACHIEVEMENTS.filter((a) => !have.has(a.id) && a.check(ctx)).map((a) => a.id);
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
