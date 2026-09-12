import { DrillPack } from './types';

export const DRILLS_CH2: DrillPack[] = [
  {
    id: 'ch2_l1',
    title: 'Артикль приклеивается сзади',
    rule:
      'Определённый артикль не стоит впереди, как английское the. Он прирастает к концу слова.',
    table: [
      { form: 'casă → casa', meaning: 'женский род берёт «-a»' },
      { form: 'băiat → băiatul', meaning: 'мужской и средний — «-ul»' },
      { form: 'câine → câinele', meaning: 'слова на «-e» — «-le»' },
      { form: 'casă', meaning: 'форма без артикля: просто «дом», а не «тот самый»' },
      { form: 'casei', meaning: 'падежная форма: «дома», «дому» — другое задание' },
    ],
    transformInstruction: 'Добавь определённый артикль',
    rows: [
      { sentence: 'Unde e ___?', from: 'casă', ro: 'casa', ru: 'Где дом?', traps: ['casă', 'casele', 'casei'], note: 'Женский род: конечное «-ă» превращается в «-a». casele — это множественное, casei — падежная форма.' },
      { sentence: '___ este acasă.', from: 'băiat', ro: 'băiatul', ru: 'Мальчик дома.', traps: ['băiata', 'băieții', 'băiate'], note: 'Мужской род на согласную берёт «-ul». Форм băiata и băiate не существует.' },
      { sentence: '___ doarme.', from: 'câine', ro: 'câinele', ru: 'Собака спит.', traps: ['câinul', 'câinea', 'câinii'], note: 'Слова на «-e» берут «-le», а не «-ul»: câine → câinele. câinii — это множественное.' },
      { sentence: '___ e mare.', from: 'masă', ro: 'masa', ru: 'Стол большой.', traps: ['masă', 'mesele', 'masei'], note: 'Как и casă: «-ă» меняется на «-a». mesele — уже множественное с артиклем.' },
      { sentence: '___ e frumos.', from: 'oraș', ro: 'orașul', ru: 'Город красивый.', traps: ['orașa', 'orașe', 'orașele'], note: 'Средний род в единственном числе ведёт себя как мужской, поэтому «-ul». orașe и orașele — множественное.' },
      { sentence: '___ e pe masă.', from: 'carte', ro: 'cartea', ru: 'Книга на столе.', traps: ['carta', 'cartele', 'cărțile'], note: 'Женский род на «-e» берёт «-a»: carte → cartea. cărțile — это множественное.' },
      { sentence: '___ nu merge.', from: 'telefon', ro: 'telefonul', ru: 'Телефон не работает.', traps: ['telefona', 'telefone', 'telefoanele'], note: 'Согласная на конце — значит «-ul». telefoanele — множественное.' },
      { sentence: '___ citește.', from: 'fată', ro: 'fata', ru: 'Девочка читает.', traps: ['fată', 'fetele', 'fetei'], note: '«-ă» меняется на «-a». fetele — множественное, fetei — падежная форма.' },
      { sentence: '___ doarme deja.', from: 'copil', ro: 'copilul', ru: 'Ребёнок уже спит.', traps: ['copila', 'copiii', 'copile'], note: 'Согласная на конце — «-ul». copiii с тремя «i» — это множественное с артиклем.' },
      { sentence: '___ e rece.', from: 'apă', ro: 'apa', ru: 'Вода холодная.', traps: ['apă', 'apele', 'apei'], note: '«-ă» меняется на «-a». apele — множественное, apei — падежная форма.' },
    ],
  },
  {
    id: 'ch2_l2',
    title: 'Множественное число',
    rule:
      'Множественное число собирается по трём моделям — какая именно, зависит от рода.',
    table: [
      { form: 'casă → case', meaning: 'женский: «-ă» меняется на «-e»' },
      { form: 'băiat → băieți', meaning: 'мужской: добавляется «-i»' },
      { form: 'oraș → orașe', meaning: 'средний: «-e» или «-uri»' },
      { form: 'masă → mese', meaning: 'гласная в корне при этом часто меняется' },
    ],
    transformInstruction: 'Поставь во множественное число',
    rows: [
      { sentence: 'Aici sunt două ___.', from: 'casă', ro: 'case', ru: 'Здесь два дома.', traps: ['casele', 'casă', 'casuri'], note: 'Женский род: «-ă» меняется на «-e». casele — это уже форма с артиклем.' },
      { sentence: 'Sunt doi ___.', from: 'băiat', ro: 'băieți', ru: 'Это два мальчика.', traps: ['băiate', 'băiatul', 'băiaturi'], note: 'Мужской род берёт «-i», и в корне «a» переходит в «ie»: băiat → băieți.' },
      { sentence: 'Sunt trei ___.', from: 'masă', ro: 'mese', ru: 'Это три стола.', traps: ['mesele', 'măse', 'masuri'], note: '«-ă» меняется на «-e», плюс чередование в корне: masă → mese.' },
      { sentence: 'Am văzut multe ___.', from: 'oraș', ro: 'orașe', ru: 'Я видел много городов.', traps: ['orașuri', 'orașii', 'orașul'], note: 'Средний род чаще берёт «-e». Окончание «-uri» тоже бывает, но не у этого слова.' },
      { sentence: 'Am cumpărat două ___.', from: 'carte', ro: 'cărți', ru: 'Я купил две книги.', traps: ['carte', 'cartele', 'cărțile'], note: 'Женский род на «-e» берёт «-i», и в корне «a» переходит в «ă»: carte → cărți.' },
      { sentence: 'Au trei ___.', from: 'copil', ro: 'copii', ru: 'У них трое детей.', traps: ['copiii', 'copile', 'copiluri'], note: 'Мужской род на «-i»: copil → copii. Три «i» — это уже форма с артиклем.' },
      { sentence: 'Am cumpărat ___.', from: 'floare', ro: 'flori', ru: 'Я купил цветы.', traps: ['florile', 'floare', 'floruri'], note: 'В корне «oa» сжимается в «o»: floare → flori.' },
      { sentence: 'Sunt patru ___.', from: 'scaun', ro: 'scaune', ru: 'Это четыре стула.', traps: ['scauni', 'scaunele', 'scaunuri'], note: 'Средний род берёт «-e». Формы scauni не существует.' },
      { sentence: 'Am mulți ___.', from: 'prieten', ro: 'prieteni', ru: 'У меня много друзей.', traps: ['prietenii', 'prietene', 'prietenuri'], note: 'Мужской род: просто «-i». prietenii — это уже с артиклем.' },
      { sentence: 'Mai sunt două ___.', from: 'zi', ro: 'zile', ru: 'Осталось два дня.', traps: ['zii', 'zilele', 'ziuri'], note: 'Нерегулярная пара: zi → zile. zilele — с артиклем.' },
    ],
  },
  {
    id: 'ch2_l3',
    title: 'Артикль во множественном',
    rule:
      'Артикль во множественном числе работает так же — приклеивается сзади, но к форме множественного.',
    table: [
      { form: 'case → casele', meaning: 'женский и средний: «-le»' },
      { form: 'băieți → băieții', meaning: 'мужской: ещё одна «-i»' },
      { form: 'copii → copiii', meaning: 'три «i» подряд — это нормально' },
    ],
    transformInstruction: 'Добавь определённый артикль',
    rows: [
      { sentence: '___ de pe stradă sunt vechi.', from: 'case', ro: 'casele', ru: 'Дома на улице старые.', traps: ['casei', 'case', 'casale'], note: 'К форме множественного числа добавляется «-le»: case → casele.' },
      { sentence: '___ joacă afară.', from: 'băieți', ro: 'băieții', ru: 'Мальчики играют на улице.', traps: ['băieți', 'băiețele', 'băiatul'], note: 'Мужской род: к «-i» добавляется ещё одна «-i».' },
      { sentence: '___ mari sunt scumpe.', from: 'orașe', ro: 'orașele', ru: 'Большие города дорогие.', traps: ['orașii', 'orașuri', 'orașul'], note: 'Средний род во множественном ведёт себя как женский: «-le».' },
      { sentence: '___ sunt pe raft.', from: 'cărți', ro: 'cărțile', ru: 'Книги на полке.', traps: ['cărți', 'cartele', 'cărțele'], note: 'Формы на «-i» берут «-le», вместе получается «-ile»: cărți → cărțile.' },
      { sentence: '___ dorm deja.', from: 'copii', ro: 'copiii', ru: 'Дети уже спят.', traps: ['copii', 'copiile', 'copilii'], note: 'Три «i» подряд — это нормально: copii плюс «-i».' },
      { sentence: '___ s-au ofilit.', from: 'flori', ro: 'florile', ru: 'Цветы завяли.', traps: ['flori', 'floarele', 'flororile'], note: '«-i» плюс «-le» даёт «-ile»: flori → florile.' },
      { sentence: '___ sunt libere.', from: 'scaune', ro: 'scaunele', ru: 'Стулья свободны.', traps: ['scaunii', 'scauneleu', 'scaune'], note: 'Средний род: «-le» к форме на «-e».' },
      { sentence: '___ mei vin diseară.', from: 'prieteni', ro: 'prietenii', ru: 'Мои друзья придут вечером.', traps: ['prieteni', 'prietenele', 'prietenul'], note: 'Ещё одна «-i» к мужскому множественному: prieteni → prietenii.' },
      { sentence: '___ trec repede.', from: 'zile', ro: 'zilele', ru: 'Дни идут быстро.', traps: ['zile', 'ziile', 'zilei'], note: '«-le» к форме множественного числа: zile → zilele.' },
      { sentence: '___ sunt ocupate.', from: 'mese', ro: 'mesele', ru: 'Столы заняты.', traps: ['mese', 'mesile', 'masele'], note: 'То же самое: mese плюс «-le».' },
    ],
  },
  {
    id: 'ch2_l4',
    title: 'Числа и «de»',
    rule:
      'Главное правило главы одно: начиная с двадцати между числом и словом появляется «de».',
    table: [
      { form: 'до 19', meaning: 'число стоит прямо перед словом: doisprezece studenți' },
      { form: 'от 20', meaning: 'между ними обязательно «de»: douăzeci de ani' },
      { form: 'doi / două', meaning: '«два» согласуется с родом: doi frați, două surori' },
      { form: 'un / o / unu', meaning: 'перед словом — un и o, а «час» — это ora unu' },
    ],
    rows: [
      { sentence: 'Am ___ ani.', ro: 'douăzeci și cinci de', ru: 'Мне двадцать пять лет.', traps: ['douăzeci și cinci', 'douăzeci cinci de', 'douăzeci și cinci ani'], note: 'После 20 между числом и словом всегда встаёт «de».' },
      { sentence: 'Sunt ___ studenți.', ro: 'doisprezece', ru: 'Здесь двенадцать студентов.', traps: ['doisprezece de', 'douăsprezece', 'doispe de'], note: 'До 20 «de» не нужно.' },
      { sentence: 'Costă ___ lei.', ro: 'treizeci de', ru: 'Стоит тридцать лей.', traps: ['treizeci', 'trezeci de', 'treizeci și'], note: 'Тридцать больше двадцати — значит «de».' },
      { sentence: 'Am ___ frați.', ro: 'doi', ru: 'У меня два брата.', traps: ['două', 'doi de', 'doisprezece'], note: 'Числа «один» и «два» согласуются с родом.' },
      { sentence: 'Am ___ surori.', ro: 'două', ru: 'У меня две сестры.', traps: ['doi', 'două de', 'douăzeci'], note: '«Сёстры» женского рода, поэтому două.' },
      { sentence: 'E ora ___.', ro: 'unu', ru: 'Сейчас час.', traps: ['un', 'una', 'unul'], note: 'В ответе на «который час» используется unu — не un и не una.' },
      { sentence: 'Sunt ___ cărți.', ro: 'unsprezece', ru: 'Здесь одиннадцать книг.', traps: ['unsprezece de', 'unspe de', 'unusprezece'], note: 'Одиннадцать меньше двадцати, «de» не нужно.' },
      { sentence: 'Am plătit ___ lei.', ro: 'o sută de', ru: 'Я заплатил сто лей.', traps: ['o sută', 'un sută de', 'una sută de'], note: 'Сто — это «o sută», и после сотни тоже идёт «de».' },
      { sentence: 'Mai sunt ___ zile.', ro: 'șapte', ru: 'Осталось семь дней.', traps: ['șapte de', 'șaptesprezece', 'șaptezeci'], note: 'Семь меньше двадцати — без «de».' },
      { sentence: 'Are ___ ani.', ro: 'patruzeci de', ru: 'Ему сорок лет.', traps: ['patruzeci', 'patru zeci de', 'paisprezece'], note: 'Сорок больше двадцати — значит «de».' },
    ],
  },
];
