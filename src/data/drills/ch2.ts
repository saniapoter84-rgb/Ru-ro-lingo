import { DrillPack } from './types';

export const DRILLS_CH2: DrillPack[] = [
  {
    id: 'ch2_l1',
    title: 'Артикль приклеивается сзади',
    rule:
      'Определённый артикль приклеивается к концу слова, а не стоит впереди: casă → casa, băiat → băiatul, câine → câinele. Женский род берёт «-a», мужской и средний — «-ul» или «-le».',
    transformInstruction: 'Добавь определённый артикль',
    rows: [
      { sentence: 'Unde e ___?', from: 'casă', ro: 'casa', ru: 'Где дом?', traps: ['casă', 'casele', 'casei'] },
      { sentence: '___ este acasă.', from: 'băiat', ro: 'băiatul', ru: 'Мальчик дома.', traps: ['băiata', 'băieții', 'băiate'] },
      { sentence: '___ doarme.', from: 'câine', ro: 'câinele', ru: 'Собака спит.', traps: ['câinul', 'câinea', 'câinii'] },
      { sentence: '___ e mare.', from: 'masă', ro: 'masa', ru: 'Стол большой.', traps: ['masă', 'mesele', 'masei'] },
      { sentence: '___ e frumos.', from: 'oraș', ro: 'orașul', ru: 'Город красивый.', traps: ['orașa', 'orașe', 'orașele'] },
      { sentence: '___ e pe masă.', from: 'carte', ro: 'cartea', ru: 'Книга на столе.', traps: ['carta', 'cartele', 'cărțile'] },
      { sentence: '___ nu merge.', from: 'telefon', ro: 'telefonul', ru: 'Телефон не работает.', traps: ['telefona', 'telefone', 'telefoanele'] },
      { sentence: '___ citește.', from: 'fată', ro: 'fata', ru: 'Девочка читает.', traps: ['fată', 'fetele', 'fetei'] },
      { sentence: '___ doarme deja.', from: 'copil', ro: 'copilul', ru: 'Ребёнок уже спит.', traps: ['copila', 'copiii', 'copile'] },
      { sentence: '___ e rece.', from: 'apă', ro: 'apa', ru: 'Вода холодная.', traps: ['apă', 'apele', 'apei'] },
    ],
  },
  {
    id: 'ch2_l2',
    title: 'Множественное число',
    rule:
      'Три рабочие модели: женский «-ă → -e» (casă → case), мужской «→ -i» (băiat → băieți), средний «→ -uri» или «-e» (oraș → orașe). Гласная в корне при этом часто меняется.',
    transformInstruction: 'Поставь во множественное число',
    rows: [
      { sentence: 'Aici sunt două ___.', from: 'casă', ro: 'case', ru: 'Здесь два дома.', traps: ['casele', 'casă', 'casuri'] },
      { sentence: 'Sunt doi ___.', from: 'băiat', ro: 'băieți', ru: 'Это два мальчика.', traps: ['băiate', 'băiatul', 'băiaturi'] },
      { sentence: 'Sunt trei ___.', from: 'masă', ro: 'mese', ru: 'Это три стола.', traps: ['mesele', 'măse', 'masuri'] },
      { sentence: 'Am văzut multe ___.', from: 'oraș', ro: 'orașe', ru: 'Я видел много городов.', traps: ['orașuri', 'orașii', 'orașul'] },
      { sentence: 'Am cumpărat două ___.', from: 'carte', ro: 'cărți', ru: 'Я купил две книги.', traps: ['carte', 'cartele', 'cărțile'] },
      { sentence: 'Au trei ___.', from: 'copil', ro: 'copii', ru: 'У них трое детей.', traps: ['copiii', 'copile', 'copiluri'] },
      { sentence: 'Am cumpărat ___.', from: 'floare', ro: 'flori', ru: 'Я купил цветы.', traps: ['florile', 'floare', 'floruri'] },
      { sentence: 'Sunt patru ___.', from: 'scaun', ro: 'scaune', ru: 'Это четыре стула.', traps: ['scauni', 'scaunele', 'scaunuri'] },
      { sentence: 'Am mulți ___.', from: 'prieten', ro: 'prieteni', ru: 'У меня много друзей.', traps: ['prietenii', 'prietene', 'prietenuri'] },
      { sentence: 'Mai sunt două ___.', from: 'zi', ro: 'zile', ru: 'Осталось два дня.', traps: ['zii', 'zilele', 'ziuri'] },
    ],
  },
  {
    id: 'ch2_l3',
    title: 'Артикль во множественном',
    rule:
      'К форме множественного числа добавляется «-le» для женского и среднего рода (case → casele) и «-i» для мужского (băieți → băieții).',
    transformInstruction: 'Добавь определённый артикль',
    rows: [
      { sentence: '___ de pe stradă sunt vechi.', from: 'case', ro: 'casele', ru: 'Дома на улице старые.', traps: ['casei', 'case', 'casale'] },
      { sentence: '___ joacă afară.', from: 'băieți', ro: 'băieții', ru: 'Мальчики играют на улице.', traps: ['băieți', 'băiețele', 'băiatul'] },
      { sentence: '___ mari sunt scumpe.', from: 'orașe', ro: 'orașele', ru: 'Большие города дорогие.', traps: ['orașii', 'orașuri', 'orașul'] },
      { sentence: '___ sunt pe raft.', from: 'cărți', ro: 'cărțile', ru: 'Книги на полке.', traps: ['cărți', 'cartele', 'cărțele'] },
      { sentence: '___ dorm deja.', from: 'copii', ro: 'copiii', ru: 'Дети уже спят.', traps: ['copii', 'copiile', 'copilii'] },
      { sentence: '___ s-au ofilit.', from: 'flori', ro: 'florile', ru: 'Цветы завяли.', traps: ['flori', 'floarele', 'flororile'] },
      { sentence: '___ sunt libere.', from: 'scaune', ro: 'scaunele', ru: 'Стулья свободны.', traps: ['scaunii', 'scauneleu', 'scaune'] },
      { sentence: '___ mei vin diseară.', from: 'prieteni', ro: 'prietenii', ru: 'Мои друзья придут вечером.', traps: ['prieteni', 'prietenele', 'prietenul'] },
      { sentence: '___ trec repede.', from: 'zile', ro: 'zilele', ru: 'Дни идут быстро.', traps: ['zile', 'ziile', 'zilei'] },
      { sentence: '___ sunt ocupate.', from: 'mese', ro: 'mesele', ru: 'Столы заняты.', traps: ['mese', 'mesile', 'masele'] },
    ],
  },
  {
    id: 'ch2_l4',
    title: 'Числа и «de»',
    rule:
      'До 19 число стоит прямо перед словом. Начиная с 20 между ними обязательно «de»: douăzeci de ani. Числа «один» и «два» согласуются с родом: doi frați, но două surori.',
    rows: [
      { sentence: 'Am ___ ani.', ro: 'douăzeci și cinci de', ru: 'Мне двадцать пять лет.', traps: ['douăzeci și cinci', 'douăzeci cinci de', 'douăzeci și cinci ani'], note: 'После 20 между числом и словом всегда встаёт «de».' },
      { sentence: 'Sunt ___ studenți.', ro: 'doisprezece', ru: 'Здесь двенадцать студентов.', traps: ['doisprezece de', 'douăsprezece', 'doispe de'], note: 'До 20 «de» не нужно.' },
      { sentence: 'Costă ___ lei.', ro: 'treizeci de', ru: 'Стоит тридцать лей.', traps: ['treizeci', 'trezeci de', 'treizeci și'] },
      { sentence: 'Am ___ frați.', ro: 'doi', ru: 'У меня два брата.', traps: ['două', 'doi de', 'doisprezece'], note: 'Числа «один» и «два» согласуются с родом.' },
      { sentence: 'Am ___ surori.', ro: 'două', ru: 'У меня две сестры.', traps: ['doi', 'două de', 'douăzeci'] },
      { sentence: 'E ora ___.', ro: 'unu', ru: 'Сейчас час.', traps: ['un', 'una', 'unul'] },
      { sentence: 'Sunt ___ cărți.', ro: 'unsprezece', ru: 'Здесь одиннадцать книг.', traps: ['unsprezece de', 'unspe de', 'unusprezece'] },
      { sentence: 'Am plătit ___ lei.', ro: 'o sută de', ru: 'Я заплатил сто лей.', traps: ['o sută', 'un sută de', 'una sută de'] },
      { sentence: 'Mai sunt ___ zile.', ro: 'șapte', ru: 'Осталось семь дней.', traps: ['șapte de', 'șaptesprezece', 'șaptezeci'] },
      { sentence: 'Are ___ ani.', ro: 'patruzeci de', ru: 'Ему сорок лет.', traps: ['patruzeci', 'patru zeci de', 'paisprezece'] },
    ],
  },
];
