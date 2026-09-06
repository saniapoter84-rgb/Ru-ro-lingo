// Восьминедельный план до B1 — на два месяца жизни, а не на два месяца
// идеальной дисциплины.
//
// Раскладка: каждая неделя закрывает целую главу «Тропы» (первая, самая
// лёгкая, закрывает две), плюс словарные темы под эту грамматику, плюс
// живой текст, на котором виден результат. Но норма считается не на семь
// дней, а на пять: два дня в неделю заложены свободными изначально —
// работа, усталость, поездка. Пропустить их — это исполнение плана, а не
// срыв; кто занимался все семь, идёт с запасом.
//
// Отставание тоже не наказывается. Приложение показывает, где ты по факту,
// пересчитывает дату выхода на B1 по настоящему темпу и в любой момент
// даёт сдвинуть дедлайн на сегодня, не теряя прогресс.

export interface PlanWeek {
  index: number;
  title: string;
  /** Что человек сможет делать в конце недели. Формулировка от результата. */
  goal: string;
  level: 'A0' | 'A1' | 'A2' | 'B1';
  chapterIds: string[];
  unitIds: string[];
  textIds: string[];
  dialogueIds: string[];
}

export const PLAN_WEEKS: PlanWeek[] = [
  {
    index: 1,
    title: 'Ты уже говоришь',
    goal: 'Представиться, спросить «кто это?» и ответить отрицанием. Прочитать вывеску.',
    level: 'A0',
    chapterIds: ['ch1', 'ch2'],
    unitIds: ['greetings', 'pronouns', 'numbers', 'family', 'questions', 'colors'],
    textIds: ['hello', 'shop_sign'],
    dialogueIds: [],
  },
  {
    index: 2,
    title: 'Моё и твоё',
    goal: 'Сказать, что у тебя есть, описать вещь прилагательным и сравнить две вещи.',
    level: 'A1',
    chapterIds: ['ch3'],
    unitIds: ['food', 'house', 'clothes', 'adjectives', 'kitchen', 'sizes', 'quantity'],
    textIds: ['menu'],
    dialogueIds: ['cunostinta'],
  },
  {
    index: 3,
    title: 'Действие',
    goal: 'Спрягать глаголы всех четырёх групп и рассказать про обычный день.',
    level: 'A1',
    chapterIds: ['ch4'],
    unitIds: [
      'verbs',
      'more_verbs',
      'verbs_daily',
      'verbs_motion',
      'time',
      'calendar',
      'time_adverbs',
      'hygiene',
    ],
    textIds: ['neighbour', 'friend'],
    dialogueIds: ['cafenea'],
  },
  {
    index: 4,
    title: 'Где и куда',
    goal: 'Объяснить дорогу, назначить встречу и понять объявление на вокзале.',
    level: 'A1',
    chapterIds: ['ch5'],
    unitIds: [
      'city',
      'directions',
      'travel',
      'airport',
      'car',
      'station_words',
      'geography',
      'nature',
    ],
    textIds: ['directions', 'station'],
    dialogueIds: ['taxi', 'tren'],
  },
  {
    index: 5,
    title: 'Вчера и завтра',
    goal: 'Рассказать, что было вчера, и договориться о планах на завтра.',
    level: 'A2',
    chapterIds: ['ch6'],
    unitIds: [
      'shopping',
      'money',
      'restaurant',
      'dishes',
      'holidays',
      'weather2',
      'ordinals',
      'daily_phrases',
    ],
    textIds: ['market', 'note_home'],
    dialogueIds: ['piata', 'restaurant'],
  },
  {
    index: 6,
    title: 'Живая речь',
    goal: 'Говорить конъюнктивом, удваивать местоимения и звучать вежливо, а не по-учебниковому.',
    level: 'A2',
    chapterIds: ['ch7'],
    unitIds: [
      'communication',
      'smalltalk',
      'idioms',
      'emotions',
      'relations',
      'body',
      'health',
      'problems',
    ],
    textIds: ['call_later'],
    dialogueIds: ['vecina', 'farmacie'],
  },
  {
    index: 7,
    title: 'Было и бывало',
    goal: 'Рассказать историю о прошлом, попросить вежливо и связать фразы через «который».',
    level: 'B1',
    chapterIds: ['ch8'],
    unitIds: [
      'school',
      'jobs',
      'office',
      'work_life',
      'children',
      'character',
      'documents',
      'renting',
      'home_repair',
    ],
    textIds: ['rent'],
    dialogueIds: ['interviu'],
  },
  {
    index: 8,
    title: 'Порог B1',
    goal: 'Пересказать чужие слова, понять объявление и объяснить, почему ты так считаешь.',
    level: 'B1',
    chapterIds: ['ch9'],
    unitIds: [
      'abstract',
      'opinions',
      'connectors',
      'media',
      'internet',
      'technology',
      'music_art',
      'signs',
      'function_words',
      'verbs_mind',
    ],
    textIds: ['weather'],
    dialogueIds: ['planuri'],
  },
];

export const PLAN_LENGTH_WEEKS = PLAN_WEEKS.length;

/** Темы, не попавшие ни в одну неделю, — их можно брать в любой момент. */
export const PLANNED_UNIT_IDS = new Set(PLAN_WEEKS.flatMap((w) => w.unitIds));
