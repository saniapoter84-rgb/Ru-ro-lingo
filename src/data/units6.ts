import { Unit } from './units';

// Слова, без которых не читается обычная городская письменность:
// объявление на подъезде, вывеска, расписание, меню в столовой.
// Именно они чаще всего оказываются единственным тёмным пятном в тексте,
// который в остальном уже понятен.

export const UNITS_6: Unit[] = [
  {
    id: 'signs',
    title: 'Вывески и объявления',
    emoji: '🪧',
    words: [
      { ru: 'срочный', ro: 'urgent', pos: 'adj' },
      { ru: 'вход', ro: 'intrare', pos: 'noun' },
      { ru: 'выход', ro: 'ieșire', pos: 'noun' },
      { ru: 'напротив', ro: 'vizavi', pos: 'adv', note: 'vizavi de parc — напротив парка' },
      { ru: 'в сторону, к', ro: 'spre', pos: 'other', note: 'trenul spre Cluj — поезд на Клуж' },
      { ru: 'ровно (о времени)', ro: 'fix', pos: 'adv', note: 'la opt fix — ровно в восемь' },
      { ru: 'около, примерно', ro: 'în jur de', alt: ['jur'], pos: 'phrase' },
      { ru: 'просить', ro: 'a ruga', pos: 'verb', note: 'vă rugăm — просим вас' },
      { ru: 'осторожность, забота', ro: 'grijă', pos: 'noun', note: 'ai grijă — будь осторожен' },
      { ru: 'включать (в себя)', ro: 'a include', pos: 'verb' },
      { ru: 'весь, вся', ro: 'tot', alt: ['toată', 'toți', 'toate'], pos: 'other' },
      { ru: 'снижаться, падать', ro: 'a scădea', alt: ['scad', 'scade'], pos: 'verb' },
      { ru: 'метеоролог', ro: 'meteorolog', pos: 'noun' },
      { ru: 'идти (о дожде)', ro: 'a ploua', alt: ['plouă'], pos: 'verb', note: 'plouă — идёт дождь' },
      { ru: 'оставлять', ro: 'a lăsa', pos: 'verb' },
      { ru: 'обязательно', ro: 'obligatoriu', pos: 'adv' },
    ],
  },
  {
    id: 'renting',
    title: 'Подъезд, аренда, коммуналка',
    emoji: '🏢',
    words: [
      { ru: 'этаж', ro: 'etaj', pos: 'noun' },
      { ru: 'управдом, администратор', ro: 'administrator', pos: 'noun' },
      { ru: 'содержание жилья, коммунальные', ro: 'întreținere', pos: 'noun' },
      { ru: 'снимать / сдавать жильё', ro: 'a închiria', pos: 'verb' },
      { ru: 'меблированный', ro: 'mobilat', pos: 'adj' },
      { ru: 'центр', ro: 'centru', pos: 'noun' },
      { ru: 'жилец, съёмщик', ro: 'chiriaș', pos: 'noun' },
      { ru: 'хозяин квартиры', ro: 'proprietar', pos: 'noun' },
      { ru: 'счётчик', ro: 'contor', pos: 'noun' },
      { ru: 'домофон', ro: 'interfon', pos: 'noun' },
      { ru: 'жильё', ro: 'locuință', pos: 'noun' },
      { ru: 'переезжать', ro: 'a se muta', pos: 'verb' },
    ],
  },
  {
    id: 'station_words',
    title: 'Вокзал и расписание',
    emoji: '🚉',
    words: [
      { ru: 'путь, платформа (номер)', ro: 'linie', pos: 'noun', note: 'linia trei — третий путь' },
      { ru: 'посадка', ro: 'urcare', pos: 'noun' },
      { ru: 'высадка', ro: 'coborâre', pos: 'noun' },
      { ru: 'перрон', ro: 'peron', pos: 'noun' },
      { ru: 'зал ожидания', ro: 'sală de așteptare', pos: 'phrase' },
      { ru: 'камера хранения', ro: 'bagaje de mână', pos: 'phrase' },
      { ru: 'проездной', ro: 'abonament', pos: 'noun' },
      { ru: 'контролёр', ro: 'controlor', pos: 'noun' },
      { ru: 'туда-обратно', ro: 'dus-întors', pos: 'phrase' },
    ],
  },
  {
    id: 'dishes',
    title: 'Блюда и как приготовлено',
    emoji: '🥣',
    words: [
      { ru: 'чорба (кислый суп)', ro: 'ciorbă', pos: 'noun', note: 'румынский суп с кислинкой' },
      { ru: 'сметана', ro: 'smântână', pos: 'noun' },
      { ru: 'жареный', ro: 'prăjit', pos: 'adj' },
      { ru: 'варёный', ro: 'fiert', pos: 'adj' },
      { ru: 'печёный', ro: 'copt', pos: 'adj' },
      { ru: 'на гриле', ro: 'la grătar', pos: 'phrase' },
      { ru: 'посуда (предмет)', ro: 'vas', alt: ['vase'], pos: 'noun' },
      { ru: 'гарнир', ro: 'garnitură', pos: 'noun' },
      { ru: 'острый (по вкусу)', ro: 'iute', pos: 'adj' },
      { ru: 'пресный, без соли', ro: 'nesărat', pos: 'adj' },
    ],
  },
];
