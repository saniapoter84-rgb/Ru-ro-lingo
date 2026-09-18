import { CourseChapter } from './types';

// ГЛАВА 2. Определённый артикль-суффикс и множественное число.
// Самая «непохожая на русский» часть румынского — и одновременно та,
// без которой не прочитать ни одной вывески. Поэтому идёт сразу второй.

export const CHAPTER_2: CourseChapter = {
  id: 'ch2',
  title: 'Тот самый',
  subtitle: 'Артикль, который приклеивается сзади, и множественное число',
  emoji: '🔗',
  level: 'A0',
  color: '#22D3EE',
  lessons: [
    {
      id: 'ch2_l1',
      title: 'Артикль прилипает сзади',
      subtitle: 'casă → casa: главная странность румынского',
      emoji: '🧲',
      steps: [
        {
          kind: 'rule',
          title: 'Он не спереди. Он сзади.',
          body:
            'В английском «the house», во французском «la maison» — артикль стоит отдельным словом перед существительным. Румынский пошёл своим путём: определённый артикль здесь приклеивается К КОНЦУ слова и становится его частью. Отдельного слова просто нет.',
          examples: [
            { ro: 'o casă → casa', ru: 'какой-то дом → тот самый дом' },
            { ro: 'un băiat → băiatul', ru: 'какой-то мальчик → тот самый мальчик' },
          ],
          aha: 'Слово в словаре и слово на вывеске выглядят по-разному. Это не опечатка — это артикль прирос.',
        },
        {
          kind: 'rule',
          title: 'Три окончания, которые надо узнавать',
          body:
            'Мужской и средний род в единственном числе получают «-ul», а если слово уже кончается на «-e» — то просто «-le». Женский род получает «-a» (при этом конечное «-ă» вытесняется).',
          examples: [
            { ro: 'băiat → băiatul', ru: 'мальчик → тот самый мальчик' },
            { ro: 'câine → câinele', ru: 'собака → та самая собака', note: 'слово на «-e» → «-le»' },
            { ro: 'casă → casa', ru: 'дом → тот самый дом', note: '«-ă» уступает место «-a»' },
            { ro: 'carte → cartea', ru: 'книга → та самая книга', note: 'жен. род на «-e» → «-ea»' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Какая форма означает «тот самый поезд»?',
          options: ['tren', 'trenul', 'trena', 'un tren'],
          correct: 1,
          explain: 'tren — мужской/средний род → «-ul» → trenul.',
          forms: {
            trenul: 'поезд — тот самый',
            tren: 'поезд — без артикля',
            trena: 'такой формы нет — артикль этого слова «-ul»',
            'un tren': 'какой-то поезд — неопределённый артикль',
          },
        },
        {
          kind: 'choice',
          prompt: 'Какая форма означает «та самая улица»? (o stradă)',
          options: ['stradaul', 'strada', 'stradăle', 'stradale'],
          correct: 1,
          explain: 'Женский род на «-ă»: конечное «-ă» меняется на «-a» → strada.',
          forms: {
            strada: 'улица — та самая',
            stradaul: 'такой формы нет — «-ul» бывает только у мужского рода',
            'stradăle': 'такой формы нет',
            stradale: 'такой формы нет',
          },
        },
        {
          kind: 'transform',
          instruction: 'Добавь определённый артикль',
          from: 'un oraș',
          answer: 'orașul',
          ru: 'город → тот самый город',
          explain:
            'Средний род в единственном берёт «-ul», как и мужской: oraș → orașul. Неопределённый артикль при этом уходит — двух артиклей у слова не бывает.',
        },
        {
          kind: 'transform',
          instruction: 'Добавь определённый артикль',
          from: 'o masă',
          answer: 'masa',
          ru: 'стол → тот самый стол',
          explain:
            'Женский род: конечное «-ă» превращается в «-a». masă → masa. Слово при этом не удлиняется — меняется одна буква.',
        },
        {
          kind: 'transform',
          instruction: 'Добавь определённый артикль',
          from: 'un frate',
          answer: 'fratele',
          ru: 'брат → тот самый брат',
          explain: 'Слово уже кончается на «-e», поэтому берём «-le», а не «-ul».',
        },
        {
          kind: 'match',
          title: 'Без артикля → с артиклем',
          pairs: [
            { ro: 'casa', ru: 'тот самый дом' },
            { ro: 'băiatul', ru: 'тот самый мальчик' },
            { ro: 'fata', ru: 'та самая девочка' },
            { ro: 'câinele', ru: 'та самая собака' },
          ],
        },
        {
          kind: 'rule',
          title: 'Зачем это вообще нужно',
          body:
            'В русском разницу «дом / тот самый дом» мы передаём порядком слов и контекстом. Румынский требует показать её формой слова. Правило простое: первое упоминание — без артикля, всё последующее — с артиклем.',
          examples: [
            { ro: 'Văd o casă. Casa este mare.', ru: 'Вижу дом. Дом большой.' },
            { ro: 'Am un câine. Câinele e mic.', ru: 'У меня есть собака. Собака маленькая.' },
          ],
          aha: 'Ввёл новое — без артикля. Вернулся к нему — с артиклем.',
        },
        {
          kind: 'build',
          ru: 'Дом большой.',
          answer: 'Casa este mare',
          bank: ['o', 'un'],
          explain:
            'Говорим про конкретный дом → артикль приклеен к слову, отдельного «o» уже не нужно.',
        },
        {
          kind: 'spot',
          tokens: ['O', 'casa', 'este', 'mare'],
          fixed: 'Casa este mare',
          wrongIndex: 0,
          fix: '(убрать)',
          ru: 'Дом большой.',
          explain:
            'Два артикля сразу — так нельзя. Либо «o casă» (какой-то), либо «casa» (тот самый).',
        },
        {
          kind: 'listen',
          ro: 'Câinele este mic',
          options: ['Câinele este mic', 'Un câine mic', 'Casa este mică'],
          correct: 0,
          ru: 'Собака маленькая.',
          explain:
            '«Câinele» — с артиклем, тот самый пёс. «Un câine» значило бы «какой-то пёс», а «casa» это вообще другое слово.',
        },
      ],
    },
    {
      id: 'ch2_l2',
      title: 'Больше одного',
      subtitle: 'Множественное число: -e, -i, -uri',
      emoji: '➕',
      steps: [
        {
          kind: 'rule',
          title: 'Три рабочие модели',
          body:
            'Множественное число собирается тремя основными способами. Женский род на «-ă» обычно берёт «-e». Мужской род почти всегда берёт «-i». А средний род выбирает между «-e» и «-uri» — и вот его как раз приходится запоминать вместе со словом.',
          vocabulary: [
            { ro: 'flori', ru: 'цветы' },
            { ro: 'fete', ru: 'девочки' },
            { ro: 'băieți', ru: 'мальчики' },
            { ro: 'mari', ru: 'большие' },
            { ro: 'multe', ru: 'многие, много' },
            { ro: 'aici', ru: 'здесь, сюда' },
          ],
          examples: [
            { ro: 'o casă → două case', ru: 'дом → два дома', note: 'ж.р.: -ă → -e' },
            { ro: 'un student → doi studenți', ru: 'студент → два студента', note: 'м.р.: + -i' },
            { ro: 'un scaun → două scaune', ru: 'стул → два стула', note: 'ср.р.: + -e' },
            { ro: 'un tren → două trenuri', ru: 'поезд → два поезда', note: 'ср.р.: + -uri' },
          ],
          aha: '«-uri» — верный признак среднего рода. Увидел «-uri» — знаешь род.',
        },
        {
          kind: 'choice',
          prompt: 'o floare → ___',
          ru: 'цветок → цветы',
          options: ['floaruri', 'flori', 'floare', 'floari'],
          correct: 1,
          explain: 'Тут ещё и гласная в корне поменялась: floare → flori. Такое учат по словам.',
          forms: {
            flori: 'цветы',
            floaruri: 'такой формы нет — «floare» даёт «flori»',
            floare: 'цветок — один',
            floari: 'такой формы нет',
          },
        },
        {
          kind: 'choice',
          prompt: 'un oraș → ___',
          ru: 'город → города',
          options: ['orașe', 'orași', 'orașuri', 'orașele'],
          correct: 0,
          explain: 'oraș — средний род, множественное «orașe».',
          forms: {
            'orașe': 'города',
            'orași': 'такой формы нет — средний род даёт «-e»',
            'orașuri': 'такой формы нет',
            'orașele': 'города — те самые, с артиклем',
          },
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число',
          from: 'o fată',
          answer: 'fete',
          alt: ['două fete'],
          ru: 'девочка → девочки',
          explain: 'fată → fete: и окончание, и гласная в корне («a» → «e»).',
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число',
          from: 'un băiat',
          answer: 'băieți',
          alt: ['doi băieți'],
          ru: 'мальчик → мальчики',
          explain:
            'Мужской род во множественном берёт «-i», и в корне «a» переходит в «ie»: băiat → băieți. Два изменения разом.',
        },
        {
          kind: 'rule',
          title: 'Гласная в корне любит меняться',
          body:
            'В части слов при переходе во множественное меняется не только окончание, но и гласная внутри слова. Системы тут нет — эти пары запоминают целиком, как «человек → люди» в русском.',
          examples: [
            { ro: 'masă → mese', ru: 'стол → столы' },
            { ro: 'seară → seri', ru: 'вечер → вечера' },
            { ro: 'carte → cărți', ru: 'книга → книги' },
            { ro: 'om → oameni', ru: 'человек → люди', note: 'чемпион по неправильности' },
          ],
        },
        {
          kind: 'match',
          title: 'Ед. → мн.',
          pairs: [
            { ro: 'case', ru: 'дома' },
            { ro: 'cărți', ru: 'книги' },
            { ro: 'oameni', ru: 'люди' },
            { ro: 'trenuri', ru: 'поезда' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'un om → ___',
          ru: 'человек → люди',
          options: ['omi', 'omuri', 'oameni', 'ome'],
          correct: 2,
          explain:
            '«om» — исключение: во множественном от него почти ничего не остаётся, oameni. Такие слова учат целиком, по правилу их не вывести.',
          forms: {
            oameni: 'люди',
            omi: 'такой формы нет',
            omuri: 'такой формы нет',
            ome: 'такой формы нет',
          },
        },
        {
          kind: 'rule',
          title: 'Как сказать «какие-то»',
          body:
            'Во множественном числе неопределённый артикль просто исчезает. Если хочется подчеркнуть «какие-то, несколько», добавляют слово «niște».',
          examples: [
            { ro: 'Văd case.', ru: 'Вижу дома.' },
            { ro: 'Văd niște case.', ru: 'Вижу какие-то дома.' },
          ],
        },
        {
          kind: 'build',
          ru: 'Это большие дома.',
          answer: 'Acestea sunt case mari',
          bank: ['casa', 'mare'],
          explain: 'Прилагательное тоже во множественном: mare → mari.',
        },
        {
          kind: 'listen',
          ro: 'Sunt multe cărți aici',
          options: ['Sunt multe cărți aici', 'Este o carte aici', 'Sunt multe case aici'],
          correct: 0,
          ru: 'Здесь много книг.',
          explain: '«cărți» — множественное от «carte». «Case» на слух похоже, но это дома, другое слово.',
        },
        {
          kind: 'type',
          ru: 'два поезда',
          answer: 'două trenuri',
          hint: 'tren — средний род',
          explain:
            '«tren» среднего рода: в единственном он ведёт себя как мужской (un tren), а во множественном — как женский. Поэтому «două», а не «doi».',
        },
      ],
    },
    {
      id: 'ch2_l3',
      title: 'Те самые',
      subtitle: 'Определённый артикль во множественном числе',
      emoji: '🔗',
      steps: [
        {
          kind: 'rule',
          title: 'Ещё два окончания — и артикли закончились',
          body:
            'Во множественном числе артикль тоже приклеивается сзади. Мужской род добавляет «-i» (получается двойное «ii»), а женский и средний — «-le».',
          vocabulary: [
            { ro: 'parc', ru: 'парк' },
          ],
          examples: [
            { ro: 'băieți → băieții', ru: 'мальчики → те самые мальчики' },
            { ro: 'case → casele', ru: 'дома → те самые дома' },
            { ro: 'scaune → scaunele', ru: 'стулья → те самые стулья' },
            { ro: 'cărți → cărțile', ru: 'книги → те самые книги' },
          ],
          aha: 'Вся система артиклей — это ровно четыре хвостика: -ul/-le, -a, -i, -le.',
        },
        {
          kind: 'transform',
          instruction: 'Добавь определённый артикль',
          from: 'case',
          answer: 'casele',
          ru: 'дома → те самые дома',
          explain: 'Во множественном артикль тоже цепляется сзади: женский род берёт «-le». case → casele.',
        },
        {
          kind: 'transform',
          instruction: 'Добавь определённый артикль',
          from: 'studenți',
          answer: 'studenții',
          ru: 'студенты → те самые студенты',
          explain: 'Мужской род: к «-i» добавляется ещё «-i». Пишется «ii», читается долгое «и».',
        },
        {
          kind: 'choice',
          prompt: 'Какая форма значит «те самые книги»?',
          options: ['cărți', 'cărțile', 'cărțiile', 'cartea'],
          correct: 1,
          explain:
            'Множественное «cărți» плюс артикль «-le» даёт «cărțile». Одно «i», а не два: «cărțiile» не существует.',
          forms: {
            'cărțile': 'книги — те самые',
            'cărți': 'книги — без артикля',
            'cărțiile': 'такой формы нет — лишнее «i»',
            cartea: 'книга — та самая, одна',
          },
        },
        {
          kind: 'match',
          title: 'Все четыре клетки таблицы',
          pairs: [
            { ro: 'băiatul', ru: 'тот самый мальчик' },
            { ro: 'băieții', ru: 'те самые мальчики' },
            { ro: 'casa', ru: 'тот самый дом' },
            { ro: 'casele', ru: 'те самые дома' },
          ],
        },
        {
          kind: 'rule',
          title: 'Теперь видно средний род',
          body:
            'Вот и обещанный оборотень. Слово среднего рода в единственном числе берёт мужское «-ul», а во множественном — женское «-le». Одно слово, две стороны.',
          examples: [
            { ro: 'scaunul (как м.р.)', ru: 'тот самый стул' },
            { ro: 'scaunele (как ж.р.)', ru: 'те самые стулья' },
          ],
          aha: 'Средний род = мужской в единственном + женский во множественном. Всё.',
        },
        {
          kind: 'spot',
          tokens: ['Caseles', 'sunt', 'mari'],
          wrongIndex: 0,
          fix: 'Casele',
          ru: 'Дома большие.',
          explain: 'Артикль «-le» уже стоит на конце, добавлять к нему ничего не нужно.',
        },
        {
          kind: 'build',
          ru: 'Те самые студенты дома.',
          answer: 'Studenții sunt acasă',
          bank: ['student', 'este'],
          explain: 'Артикль внутри слова, отдельного слова-артикля в румынском не существует.',
        },
        {
          kind: 'choice',
          prompt: 'Copiii sunt în ___ .',
          ru: 'Дети в парке.',
          options: ['parc', 'parcul', 'parcuri', 'parcurile'],
          correct: 0,
          explain:
            'Ловушка на будущее: после предлога «în» артикль обычно пропадает. Подробно — в главе 5.',
          forms: {
            parc: 'парк — без артикля, как и положено после предлога',
            parcul: 'парк — тот самый, но после предлога артикль пропадает',
            parcuri: 'парки',
            parcurile: 'парки — те самые',
          },
        },
        {
          kind: 'listen',
          ro: 'Casele sunt mari',
          options: ['Casele sunt mari', 'Casa este mare', 'Cărțile sunt mari'],
          correct: 0,
          ru: 'Дома большие.',
          explain:
            '«Casele» — множественное с артиклем, и глагол тоже во множественном: sunt. У «casa este» было бы единственное.',
        },
        {
          kind: 'type',
          ru: 'те самые люди',
          answer: 'oamenii',
          hint: 'oameni + артикль мужского рода',
          explain:
            '«oameni» плюс артикль «-i» даёт «oamenii» — с двумя «i» на конце. Выглядит странно, но пишется именно так.',
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число вместе с артиклем',
          from: 'cartea',
          answer: 'cărțile',
          ru: 'та самая книга → те самые книги',
          explain: 'Меняется всё сразу: корень (carte → cărți) и артикль (-a → -le).',
        },
      ],
    },
    {
      id: 'ch2_l4',
      title: 'Сколько именно',
      subtitle: 'Числа с существительными и коварное «de»',
      emoji: '🔢',
      steps: [
        {
          kind: 'rule',
          title: 'Один и два знают про род',
          body:
            'Как и в русском («один дом» — «одна книга»), первые два числительных в румынском меняются по роду. Дальше — уже нет, все остальные числа одинаковые.',
          vocabulary: [
            { ro: 'frați', ru: 'братья' },
            { ro: 'zile', ru: 'дни' },
            { ro: 'surori', ru: 'сёстры' },
          ],
          examples: [
            { ro: 'un băiat / o fată', ru: 'один мальчик / одна девочка' },
            { ro: 'doi băieți / două fete', ru: 'два мальчика / две девочки' },
            { ro: 'trei băieți / trei fete', ru: 'три мальчика / три девочки', note: 'дальше род не важен' },
          ],
        },
        {
          kind: 'choice',
          prompt: '___ case',
          ru: 'два дома',
          options: ['doi', 'două', 'un', 'o'],
          correct: 1,
          explain: 'casă — женский род → «două».',
          forms: {
            'două': 'две — женский и средний род',
            doi: 'два — мужской род',
            un: 'один — мужской род',
            o: 'одна — женский род',
          },
        },
        {
          kind: 'choice',
          prompt: '___ frați',
          ru: 'два брата',
          options: ['doi', 'două', 'o', 'niște'],
          correct: 0,
          explain: '«frați» мужского рода — значит «doi». Женский род потребовал бы «două».',
          forms: {
            doi: 'два — мужской род',
            'două': 'две — женский и средний род',
            o: 'одна — женский род',
            'niște': 'несколько — без числа',
          },
        },
        {
          kind: 'rule',
          title: 'После 20 появляется «de»',
          body:
            'Вот правило, которого в русском нет вообще. Начиная с 20, между числом и существительным втискивается служебное слово «de». До 19 включительно его нет.',
          examples: [
            { ro: 'nouăsprezece case', ru: 'девятнадцать домов', note: 'ещё без «de»' },
            { ro: 'douăzeci de case', ru: 'двадцать домов', note: 'и вот оно' },
            { ro: 'o sută de ani', ru: 'сто лет' },
            { ro: 'mulți ani', ru: 'много лет', note: '«mulți» — не число, «de» не нужно' },
          ],
          aha: 'Граница ровно между 19 и 20. Запомни её один раз — и больше не ошибёшься.',
        },
        {
          kind: 'choice',
          prompt: 'douăzeci ___ oameni',
          ru: 'двадцать человек',
          options: ['de', '(ничего)', 'din', 'la'],
          correct: 0,
          explain:
            'От двадцати и выше между числом и существительным обязательно «de»: douăzeci de oameni. До двадцати оно не нужно вовсе.',
          forms: {
            de: 'нужно от двадцати и выше',
            '(ничего)': 'так говорят только до двадцати',
            din: 'из',
            la: 'к, в',
          },
        },
        {
          kind: 'choice',
          prompt: 'cincisprezece ___ zile',
          ru: 'пятнадцать дней',
          options: ['de', '(ничего)', 'din', 'niște'],
          correct: 1,
          explain: '15 меньше 20 → «de» не нужно.',
          forms: {
            '(ничего)': 'до двадцати «de» не ставят',
            de: 'нужно от двадцати и выше',
            din: 'из',
            'niște': 'несколько',
          },
        },
        {
          kind: 'match',
          title: 'Числа 1–10',
          pairs: [
            { ro: 'trei', ru: 'три' },
            { ro: 'cinci', ru: 'пять' },
            { ro: 'șapte', ru: 'семь' },
            { ro: 'zece', ru: 'десять' },
          ],
        },
        {
          kind: 'rule',
          title: 'Как считать от 11 до 19',
          body:
            'Числа второго десятка собираются по формуле «единица + spre + zece» — дословно «столько-то к десяти». Похоже на наше «один-на-дцать».',
          examples: [
            { ro: 'unsprezece', ru: 'одиннадцать', note: 'unu + spre + zece' },
            { ro: 'doisprezece / douăsprezece', ru: 'двенадцать', note: 'даже здесь помнит про род' },
            { ro: 'nouăsprezece', ru: 'девятнадцать' },
          ],
        },
        {
          kind: 'build',
          ru: 'У меня две книги.',
          answer: 'Am două cărți',
          bank: ['doi', 'carte'],
          explain: '«cărți» женского рода — значит «două», а не «doi». И «de» тут не нужно: два меньше двадцати.',
        },
        {
          kind: 'type',
          ru: 'тридцать дней',
          answer: 'treizeci de zile',
          hint: 'больше 20 — не забудь «de»',
          explain: 'Тридцать больше двадцати — значит «de» обязательно: treizeci de zile.',
        },
        {
          kind: 'spot',
          tokens: ['Am', 'douăzeci', 'ani'],
          wrongIndex: 2,
          fix: 'de ani',
          ru: 'Мне двадцать лет.',
          explain: 'После 20 обязательно «de»: «douăzeci de ani».',
        },
        {
          kind: 'listen',
          ro: 'Am două surori',
          options: ['Am două surori', 'Am doi frați', 'Am douăzeci de ani'],
          correct: 0,
          ru: 'У меня две сестры.',
          explain: '«două» — женский род: сёстры. У братьев было бы «doi frați».',
        },
      ],
    },
    {
      id: 'ch2_boss',
      title: 'Босс: Витрина',
      subtitle: 'Артикли, числа и множественное — всё вперемешку',
      emoji: '🏆',
      boss: true,
      steps: [
        {
          kind: 'rule',
          title: 'Что проверяем',
          body:
            'Вся вторая глава: определённый артикль приклеивается к концу слова, множественное число собирается по трём моделям, а начиная с 20 между числом и словом обязательно встаёт «de».',
          vocabulary: [
            { ro: 'frumoasă', ru: 'красивая' },
            { ro: 'frumoase', ru: 'красивые' },
          ],
          aha: 'Ошибка тут ничего не стоит: задание просто вернётся в конец очереди, пока не разберёшься.',
        },
        {
          kind: 'transform',
          instruction: 'Добавь определённый артикль',
          from: 'o carte',
          answer: 'cartea',
          ru: 'книга → та самая книга',
          explain: 'Женский род на «-e»: конечное «-e» меняется на «-ea». carte → cartea.',
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число с артиклем',
          from: 'trenul',
          answer: 'trenurile',
          ru: 'тот самый поезд → те самые поезда',
          explain:
            'Два шага по порядку: сначала множественное (trenuri), потом артикль (-le). Получается trenurile.',
        },
        {
          kind: 'choice',
          prompt: 'patruzeci ___ oameni',
          ru: 'сорок человек',
          options: ['de', '(ничего)', 'din', 'niște'],
          correct: 0,
          explain: 'Сорок больше двадцати — «de» обязательно.',
          forms: {
            de: 'нужно от двадцати и выше',
            '(ничего)': 'так говорят только до двадцати',
            din: 'из',
            'niște': 'несколько',
          },
        },
        {
          kind: 'spot',
          tokens: ['Un', 'casa', 'este', 'mare'],
          fixed: 'Casa este mare',
          wrongIndex: 0,
          fix: '(убрать)',
          ru: 'Дом большой.',
          explain:
            '«casa» уже с артиклем — второй артикль перед ней не нужен. Либо «o casă», либо «casa», но не оба сразу.',
        },
        {
          kind: 'build',
          ru: 'У меня две сестры и один брат.',
          answer: 'Am două surori și un frate',
          bank: ['doi', 'o'],
          explain: 'Две формы числа в одной фразе: «două» для сестёр (женский род) и «un» для брата (мужской).',
        },
        {
          kind: 'choice',
          prompt: 'un om → ___',
          ru: 'человек → люди',
          options: ['oameni', 'omuri', 'omi', 'omele'],
          correct: 0,
          explain: '«om → oameni» — исключение, которое встречается каждый день. По правилу такую форму не вывести.',
          forms: {
            oameni: 'люди',
            omuri: 'такой формы нет',
            omi: 'такой формы нет',
            omele: 'такой формы нет',
          },
        },
        {
          kind: 'match',
          title: 'Проверка артиклей',
          pairs: [
            { ro: 'o casă', ru: 'какой-то дом' },
            { ro: 'casa', ru: 'тот самый дом' },
            { ro: 'case', ru: 'дома' },
            { ro: 'casele', ru: 'те самые дома' },
          ],
        },
        {
          kind: 'type',
          ru: 'те самые книги',
          answer: 'cărțile',
          explain: 'Корень меняется, потом цепляется артикль: carte → cărți → cărțile.',
        },
        {
          kind: 'listen',
          ro: 'Am douăzeci de ani',
          options: ['Am douăzeci de ani', 'Am doi ani', 'Am două cărți'],
          correct: 0,
          ru: 'Мне двадцать лет.',
          explain: 'Именно «de» на слух отличает «двадцать лет» от «два года»: douăzeci de ani против doi ani.',
        },
        {
          kind: 'choice',
          prompt: 'Слово «trenuri» — какого рода?',
          options: ['мужского', 'женского', 'среднего'],
          correct: 2,
          explain: 'Окончание «-uri» бывает только у среднего рода.',
        },
        {
          kind: 'build',
          ru: 'Те самые студенты не дома.',
          answer: 'Studenții nu sunt acasă',
          bank: ['este', 'student'],
          explain:
            'Артикль на подлежащем (studenții), а «nu» — перед глаголом. Две разные части фразы, друг другу не мешают.',
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число',
          from: 'o floare frumoasă',
          answer: 'flori frumoase',
          alt: ['niște flori frumoase'],
          ru: 'красивый цветок → красивые цветы',
          explain: 'Прилагательное обязано пойти следом: frumoasă → frumoase.',
        },
      ],
    },
  ],
};
