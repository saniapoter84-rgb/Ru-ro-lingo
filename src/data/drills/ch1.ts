import { DrillPack } from './types';

export const DRILLS_CH1: DrillPack[] = [
  {
    id: 'ch1_l1',
    title: 'Глагол «быть»',
    rule:
      'Шесть форм: sunt / ești / este / suntem / sunteți / sunt. Форма «я» и форма «они» совпадают — различает их только местоимение. В живой речи «este» почти всегда звучит как «e».',
    transformInstruction: 'Поставь a fi в нужную форму',
    rows: [
      { sentence: 'Eu ___ student.', from: 'eu', ro: 'sunt', ru: 'Я студент.', traps: ['ești', 'este', 'suntem'] },
      { sentence: 'Tu ___ din Rusia.', from: 'tu', ro: 'ești', ru: 'Ты из России.', traps: ['sunt', 'este', 'sunteți'] },
      { sentence: 'El ___ medic.', from: 'el', ro: 'este', ru: 'Он врач.', traps: ['sunt', 'ești', 'suntem'] },
      { sentence: 'Noi ___ acasă.', from: 'noi', ro: 'suntem', ru: 'Мы дома.', traps: ['sunt', 'sunteți', 'este'] },
      { sentence: 'Voi ___ obosiți.', from: 'voi', ro: 'sunteți', ru: 'Вы устали.', traps: ['suntem', 'sunt', 'ești'] },
      { sentence: 'Ei ___ prieteni.', from: 'ei', ro: 'sunt', ru: 'Они друзья.', traps: ['este', 'suntem', 'sunteți'] },
      { sentence: 'Ea ___ profesoară.', from: 'ea', ro: 'este', ru: 'Она учительница.', traps: ['sunt', 'ești', 'suntem'] },
      { sentence: 'Cafeaua ___ caldă.', ro: 'este', ru: 'Кофе горячий.', traps: ['sunt', 'ești', 'suntem'], note: 'Один предмет — третье лицо единственного числа.' },
      { sentence: 'Copiii ___ la școală.', ro: 'sunt', ru: 'Дети в школе.', traps: ['este', 'suntem', 'ești'], note: 'Подлежащее во множественном — глагол тоже.' },
      { sentence: 'Unde ___ tu acum?', ro: 'ești', ru: 'Ты где сейчас?', traps: ['sunt', 'este', 'sunteți'] },
    ],
  },
  {
    id: 'ch1_l2',
    title: 'Род и неопределённый артикль',
    rule:
      'Артикль показывает род: un — мужской и средний, o — женский. Окончание «-ă» почти всегда женский род; согласная на конце — мужской или средний.',
    transformInstruction: 'Поставь un или o',
    rows: [
      { sentence: '___ casă', from: 'casă', ro: 'o', ru: 'дом (женский род)', traps: ['un', 'o casă', 'niște'], note: 'Окончание «-ă» почти всегда женский род.' },
      { sentence: '___ băiat', from: 'băiat', ro: 'un', ru: 'мальчик', traps: ['o', 'niște', 'unul'] },
      { sentence: '___ masă', from: 'masă', ro: 'o', ru: 'стол', traps: ['un', 'niște', 'una'] },
      { sentence: '___ oraș', from: 'oraș', ro: 'un', ru: 'город', traps: ['o', 'niște', 'unul'], note: 'Средний род в единственном числе ведёт себя как мужской.' },
      { sentence: '___ fată', from: 'fată', ro: 'o', ru: 'девочка', traps: ['un', 'niște', 'una'] },
      { sentence: '___ câine', from: 'câine', ro: 'un', ru: 'собака', traps: ['o', 'niște', 'unul'] },
      { sentence: '___ carte', from: 'carte', ro: 'o', ru: 'книга', traps: ['un', 'niște', 'una'], note: 'Окончание «-e» бывает и женским: carte — женский.' },
      { sentence: '___ scaun', from: 'scaun', ro: 'un', ru: 'стул', traps: ['o', 'niște', 'unul'] },
      { sentence: '___ apă', from: 'apă', ro: 'o', ru: 'вода', traps: ['un', 'niște', 'una'] },
      { sentence: '___ telefon', from: 'telefon', ro: 'un', ru: 'телефон', traps: ['o', 'niște', 'unul'] },
    ],
  },
  {
    id: 'ch1_l3',
    title: 'Вопросы',
    rule:
      'Вопросительное слово идёт первым, остальной порядок слов не меняется: cine (кто), ce (что), unde (где), cum (как), când (когда), cât (сколько), de ce (почему).',
    rows: [
      { sentence: '___ ești?', ro: 'Cine', ru: 'Кто ты?', traps: ['Ce', 'Unde', 'Cum'] },
      { sentence: '___ faci?', ro: 'Ce', ru: 'Что делаешь?', traps: ['Cine', 'Unde', 'Când'] },
      { sentence: '___ locuiești?', ro: 'Unde', ru: 'Где ты живёшь?', traps: ['Ce', 'Cine', 'Cum'] },
      { sentence: '___ te cheamă?', ro: 'Cum', ru: 'Как тебя зовут?', traps: ['Ce', 'Cine', 'Unde'], note: 'Дословно «как тебя зовётся» — вопрос идёт через cum.' },
      { sentence: '___ vii?', ro: 'Când', ru: 'Когда ты придёшь?', traps: ['Cum', 'Unde', 'Cine'] },
      { sentence: '___ costă?', ro: 'Cât', ru: 'Сколько стоит?', traps: ['Ce', 'Cum', 'Când'] },
      { sentence: '___ nu vii?', ro: 'De ce', ru: 'Почему ты не придёшь?', traps: ['Ce', 'Cum', 'Cine'] },
      { sentence: '___ este el?', ro: 'Cine', ru: 'Кто он?', traps: ['Ce', 'Cum', 'Unde'] },
      { sentence: 'Ești student, ___?', ro: 'nu', ru: 'Ты студент, да?', traps: ['da', 'ce', 'cum'], note: 'Переспрос в конце фразы — «nu?», как русское «да?».' },
      { sentence: '___ este baia?', ro: 'Unde', ru: 'Где туалет?', traps: ['Cum', 'Ce', 'Când'] },
    ],
  },
  {
    id: 'ch1_l4',
    title: 'Отрицание',
    rule:
      '«nu» ставится перед глаголом. Двойное отрицание работает как в русском: «Nu știu nimic» — «не знаю ничего», оба слова обязательны.',
    transformInstruction: 'Сделай отрицательным',
    rows: [
      { sentence: 'Eu ___ sunt student.', from: 'Eu sunt student.', ro: 'nu', ru: 'Я не студент.', traps: ['nici', 'niciun', 'ne'], alt: ['Eu nu sunt student'] },
      { sentence: 'El ___ vorbește rusește.', from: 'El vorbește rusește.', ro: 'nu', ru: 'Он не говорит по-русски.', traps: ['nici', 'ne', 'niciodată'], alt: ['El nu vorbește rusește'] },
      { sentence: 'Nu știu ___.', ro: 'nimic', ru: 'Я ничего не знаю.', traps: ['ceva', 'nimeni', 'niciodată'], note: 'Двойное отрицание — как в русском: «nu» и «nimic» стоят вместе.' },
      { sentence: 'Nu vine ___.', ro: 'nimeni', ru: 'Никто не придёт.', traps: ['cineva', 'nimic', 'niciodată'] },
      { sentence: 'Nu merg ___ acolo.', ro: 'niciodată', ru: 'Я туда никогда не хожу.', traps: ['nimic', 'nimeni', 'nicăieri'] },
      { sentence: 'Nu am ___ bani.', ro: 'deloc', ru: 'У меня совсем нет денег.', traps: ['nimic', 'nimeni', 'niciun'] },
      { sentence: 'Ea ___ are timp.', from: 'Ea are timp.', ro: 'nu', ru: 'У неё нет времени.', traps: ['nici', 'ne', 'nimic'], alt: ['Ea nu are timp'] },
      { sentence: 'Nu văd ___.', ro: 'nimic', ru: 'Я ничего не вижу.', traps: ['nimeni', 'niciodată', 'nicăieri'] },
      { sentence: 'Noi ___ suntem acasă.', from: 'Noi suntem acasă.', ro: 'nu', ru: 'Нас нет дома.', traps: ['nici', 'ne', 'nimic'], alt: ['Noi nu suntem acasă'] },
      { sentence: 'Nu-l găsesc ___.', ro: 'nicăieri', ru: 'Я его нигде не нахожу.', traps: ['nimic', 'nimeni', 'niciodată'] },
    ],
  },
];
