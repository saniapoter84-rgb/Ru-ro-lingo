import { CourseChapter } from './types';

// ГЛАВА 9. Финал курса. Здесь появляется речь о речи (пересказ чужих слов),
// безличные конструкции, которыми написана половина объявлений и инструкций,
// и связки, которые превращают набор предложений в аргумент. После этой
// главы можно не только сказать, но и объяснить — а это и есть B1.

export const CHAPTER_9: CourseChapter = {
  id: 'ch9',
  title: 'Сложная речь',
  subtitle: 'Пересказ, безличность и умение объяснять',
  emoji: '🗝️',
  level: 'B1',
  color: '#F0ABFC',
  lessons: [
    {
      id: 'ch9_l1',
      title: 'Он сказал, что',
      subtitle: 'Косвенная речь без сдвига времён',
      emoji: '💭',
      steps: [
        {
          kind: 'rule',
          title: 'Хорошая новость: время не сдвигается',
          body:
            'В английском «he said he was coming» — время уезжает назад. В румынском, как и в русском, ничего не уезжает: что человек сказал, то и остаётся. Меняются только лицо и, если надо, наречия времени.',
          examples: [
            { ro: '«Vin mâine.» → A spus că vine mâine.', ru: '«Приду завтра» → Он сказал, что придёт завтра.' },
            { ro: '«Sunt obosit.» → A zis că e obosit.', ru: '«Я устал» → Он сказал, что устал.' },
            { ro: '«Am terminat.» → A spus că a terminat.', ru: '«Я закончил» → Он сказал, что закончил.' },
          ],
          aha: 'Переводи буквально с русского — и попадёшь. Это тот случай, когда родной язык помогает, а не мешает.',
        },
        {
          kind: 'rule',
          title: 'Пересказ вопроса',
          body:
            'Вопрос «да/нет» пересказывается через dacă («ли»). Вопрос со словом сохраняет своё слово: ce, unde, când, cine. Порядок слов при этом становится обычным, повествовательным.',
          examples: [
            { ro: 'M-a întrebat dacă am timp.', ru: 'Он спросил, есть ли у меня время.' },
            { ro: 'M-a întrebat unde locuiesc.', ru: 'Он спросил, где я живу.' },
            { ro: 'Nu știu ce vrea.', ru: 'Я не знаю, чего он хочет.' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Mi-a spus ___ nu poate veni.',
          ru: 'Он сказал мне, что не может прийти.',
          options: ['că', 'dacă', 'ce', 'care'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: 'M-a întrebat ___ vorbesc românește.',
          ru: 'Он спросил, говорю ли я по-румынски.',
          options: ['că', 'dacă', 'ce', 'cine'],
          correct: 1,
          explain: 'Вопрос «да/нет» → dacă. Это и есть русское «ли».',
        },
        {
          kind: 'build',
          ru: 'Она сказала, что живёт в Бухаресте.',
          answer: 'Ea a spus că locuiește în București',
          bank: ['dacă', 'locuiesc'],
        },
        {
          kind: 'build',
          ru: 'Я не знаю, когда он придёт.',
          answer: 'Nu știu când vine',
          bank: ['că', 'dacă'],
        },
        {
          kind: 'spot',
          tokens: ['M-a', 'întrebat', 'că', 'am', 'bilet'],
          wrongIndex: 2,
          fix: 'dacă',
          ru: 'Он спросил, есть ли у меня билет.',
          explain: 'Спросил — значит вопрос. «Что» тут не подходит, нужно «ли» — dacă.',
        },
        {
          kind: 'transform',
          instruction: 'Перескажи чужие слова',
          from: '«Sunt acasă.»',
          answer: 'A spus că e acasă',
          alt: ['a spus ca e acasa', 'a spus că este acasă', 'a zis că e acasă'],
          ru: 'Он сказал, что он дома.',
        },
        {
          kind: 'match',
          title: 'Слова пересказа',
          pairs: [
            { ro: 'că', ru: 'что' },
            { ro: 'dacă', ru: 'ли; если' },
            { ro: 'a întreba', ru: 'спрашивать' },
            { ro: 'a răspunde', ru: 'отвечать' },
            { ro: 'a zice', ru: 'говорить, сказать' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Vecina a spus că nu are apă caldă de două zile.',
          options: [
            'Соседка сказала, что у неё два дня нет горячей воды.',
            'Соседка спросила, есть ли горячая вода.',
            'У соседки два дня не было света.',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Он спросил, где я работаю.',
          answer: 'M-a întrebat unde lucrez',
          alt: ['m-a intrebat unde lucrez'],
          hint: 'вопросительное слово сохраняется, порядок слов обычный',
        },
      ],
    },

    {
      id: 'ch9_l2',
      title: 'Здесь говорят',
      subtitle: 'Безличные обороты и пассив: язык объявлений',
      emoji: '📋',
      steps: [
        {
          kind: 'rule',
          title: 'Кто делает — неважно',
          body:
            'Русское «здесь продают», «говорят», «нельзя» в румынском собирается частицей se. Получается ровно наша безличность: se vinde — «продаётся», se spune — «говорят». Этой конструкцией написана половина вывесок и инструкций.',
          vocabulary: [
            { ro: 'fumează', ru: 'курит' },
          ],
          examples: [
            { ro: 'Aici se vorbește românește.', ru: 'Здесь говорят по-румынски.' },
            { ro: 'Se vinde pâine proaspătă.', ru: 'Продаётся свежий хлеб.' },
            { ro: 'Nu se poate intra.', ru: 'Входить нельзя.' },
            { ro: 'Cum se spune «спасибо»?', ru: 'Как сказать «спасибо»?' },
          ],
          aha: 'Se здесь — не «себя». Это тот же оборот, что в русском «дом строится»: деятель просто не назван.',
        },
        {
          kind: 'rule',
          title: 'Настоящий пассив',
          body:
            'Когда важен результат, а не процесс, берут a fi плюс причастие. Причастие при этом согласуется с подлежащим — как прилагательное.',
          examples: [
            { ro: 'Ușa este închisă.', ru: 'Дверь закрыта.' },
            { ro: 'Magazinul este deschis.', ru: 'Магазин открыт.' },
            { ro: 'Casa a fost construită în 1920.', ru: 'Дом был построен в 1920 году.' },
            { ro: 'Biletele sunt vândute.', ru: 'Билеты проданы.' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Aici ___ vinde cafea bună.',
          ru: 'Здесь продают хороший кофе.',
          options: ['se', 'este', 'sunt', 'a fi'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: 'Ușa ___ închisă.',
          ru: 'Дверь закрыта.',
          options: ['se', 'este', 'are', 'a'],
          correct: 1,
        },
        {
          kind: 'build',
          ru: 'Здесь курить нельзя.',
          answer: 'Aici nu se fumează',
          bank: ['este', 'fumez'],
        },
        {
          kind: 'build',
          ru: 'Магазин открыт до восьми.',
          answer: 'Magazinul este deschis până la opt',
          bank: ['se', 'deschide'],
        },
        {
          kind: 'rule',
          title: 'Надо, можно, нельзя',
          body:
            'Три слова, без которых не обойтись ни дня. Все три требуют после себя să и спрягаемый глагол — привычка из седьмой главы работает и здесь.',
          examples: [
            { ro: 'Trebuie să plec.', ru: 'Мне надо идти.' },
            { ro: 'Se poate să intru?', ru: 'Можно войти?' },
            { ro: 'Nu trebuie să vii.', ru: 'Тебе не нужно приходить.' },
            { ro: 'E interzis să parchezi aici.', ru: 'Здесь парковаться запрещено.' },
          ],
        },
        {
          kind: 'spot',
          tokens: ['Trebuie', 'plec', 'acum', 'la', 'serviciu'],
          wrongIndex: 1,
          fix: 'să plec',
          ru: 'Мне надо сейчас идти на работу.',
          explain: 'После trebuie обязательно să плюс спрягаемый глагол.',
        },
        {
          kind: 'match',
          title: 'Язык объявлений',
          pairs: [
            { ro: 'se închiriază', ru: 'сдаётся' },
            { ro: 'se vinde', ru: 'продаётся' },
            { ro: 'este interzis', ru: 'запрещено' },
            { ro: 'trebuie să', ru: 'надо' },
            { ro: 'se poate', ru: 'можно' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Se închiriază apartament mobilat în centru.',
          options: [
            'Сдаётся меблированная квартира в центре.',
            'Продаётся квартира в центре.',
            'Я снимаю квартиру в центре.',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Как это говорится по-румынски?',
          answer: 'Cum se spune asta în română',
          alt: ['cum se spune asta in romana', 'cum se zice asta în română'],
        },
      ],
    },

    {
      id: 'ch9_l3',
      title: 'Идя по улице',
      subtitle: 'Герундий и связки времени',
      emoji: '⏳',
      steps: [
        {
          kind: 'rule',
          title: 'Деепричастие на -ând',
          body:
            'Русское «идя», «увидев», «работая» в румынском собирается окончанием -ând (после мягких основ -ind). Это одна форма на все лица, и она не меняется.',
          vocabulary: [
            { ro: 'cheile', ru: 'ключи — те самые' },
            { ro: 'găteam', ru: 'я готовил — imperfect' },
            { ro: 'geamul', ru: 'окно — то самое' },
            { ro: 'treaba', ru: 'дело, работа' },
          ],
          examples: [
            { ro: 'a merge → mergând', ru: 'идти → идя' },
            { ro: 'a vorbi → vorbind', ru: 'говорить → говоря' },
            { ro: 'a fi → fiind', ru: 'быть → будучи' },
            { ro: 'Mergând pe stradă, l-am văzut.', ru: 'Идя по улице, я его увидел.' },
          ],
          aha: 'Форма одна на всех — согласовывать не с чем. Реже, чем в русском, но в письменной речи встречается постоянно.',
        },
        {
          kind: 'rule',
          title: 'До, после и пока',
          body:
            'Три связки, у которых у каждой свой режим. После «după ce» стоит обычное прошедшее. После «înainte să» — обязательно să. «În timp ce» ставит фон и любит imperfect.',
          examples: [
            { ro: 'După ce am mâncat, am plecat.', ru: 'После того как поел, я ушёл.' },
            { ro: 'Înainte să plec, te sun.', ru: 'Перед тем как уйти, я тебе позвоню.' },
            { ro: 'În timp ce vorbeam, a intrat.', ru: 'Пока мы разговаривали, он вошёл.' },
            { ro: 'De când locuiesc aici, e liniște.', ru: 'С тех пор как я тут живу, тихо.' },
          ],
        },
        {
          kind: 'choice',
          prompt: '___ ce am terminat, am ieșit afară.',
          ru: 'После того как я закончил, я вышел на улицу.',
          options: ['După', 'Înainte', 'În timp', 'De'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: 'Înainte ___ plec, îmi iau cheile.',
          ru: 'Перед тем как уйти, я беру ключи.',
          options: ['că', 'să', 'ce', 'de'],
          correct: 1,
          explain: 'Înainte всегда требует să — это устойчивая пара.',
        },
        {
          kind: 'transform',
          instruction: 'Сделай деепричастие',
          from: 'a lucra',
          answer: 'lucrând',
          ru: 'работать → работая',
        },
        {
          kind: 'transform',
          instruction: 'Сделай деепричастие',
          from: 'a citi',
          answer: 'citind',
          ru: 'читать → читая',
          explain: 'После мягкой основы окончание становится -ind.',
        },
        {
          kind: 'build',
          ru: 'Пока я готовил, зазвонил телефон.',
          answer: 'În timp ce găteam a sunat telefonul',
          bank: ['după ce', 'am gătit'],
        },
        {
          kind: 'spot',
          tokens: ['Înainte', 'ce', 'plec', ',', 'închid', 'geamul'],
          wrongIndex: 1,
          fix: 'să',
          ru: 'Перед тем как уйти, я закрываю окно.',
          explain: '«După ce», но «înainte să» — связки не взаимозаменяемы.',
        },
        {
          kind: 'match',
          title: 'Связки времени',
          pairs: [
            { ro: 'după ce', ru: 'после того как' },
            { ro: 'înainte să', ru: 'перед тем как' },
            { ro: 'în timp ce', ru: 'пока, в то время как' },
            { ro: 'de când', ru: 'с тех пор как' },
            { ro: 'până când', ru: 'до тех пор пока' },
          ],
        },
        {
          kind: 'listen',
          ro: 'După ce termin treaba, o să vin la tine.',
          options: [
            'Когда закончу дела, приду к тебе.',
            'Перед тем как начать, приду к тебе.',
            'Пока я работаю, приходи ко мне.',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Перед тем как уйти, позвони мне.',
          answer: 'Înainte să pleci sună-mă',
          alt: ['inainte sa pleci suna-ma', 'înainte să pleci, sună-mă'],
        },
      ],
    },

    {
      id: 'ch9_l4',
      title: 'Лучше, чем вчера',
      subtitle: 'Степени сравнения и связки аргумента',
      emoji: '📊',
      steps: [
        {
          kind: 'rule',
          title: 'Больше, самый, такой же',
          body:
            'Румынское сравнение собирается из кубиков и не меняет само прилагательное. mai — «более», cel mai — «самый», la fel de — «такой же». Сравниваемое присоединяется через decât или ca.',
          vocabulary: [
            { ro: 'plimbare', ru: 'прогулка' },
          ],
          examples: [
            { ro: 'Azi e mai cald decât ieri.', ru: 'Сегодня теплее, чем вчера.' },
            { ro: 'E cea mai bună cafea din oraș.', ru: 'Это лучший кофе в городе.' },
            { ro: 'E la fel de scump ca acolo.', ru: 'Так же дорого, как там.' },
            { ro: 'mai puțin greu', ru: 'менее тяжёлый' },
          ],
          aha: 'Слово «bun» не превращается в «лучше» — просто «mai bun». Никаких неправильных форм, как в русском.',
        },
        {
          kind: 'choice',
          prompt: 'Cartea asta e ___ interesantă decât cealaltă.',
          ru: 'Эта книга интереснее той.',
          options: ['mai', 'cel mai', 'la fel de', 'foarte'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: 'E ___ mare oraș din țară.',
          ru: 'Это самый большой город в стране.',
          options: ['mai', 'cel mai', 'la fel de', 'prea'],
          correct: 1,
        },
        {
          kind: 'rule',
          title: 'Связки, которые держат аргумент',
          body:
            'Разница между «умею говорить» и «умею объяснять» — вот в этих пяти словах. Они соединяют не слова, а мысли, и именно их ждут на уровне B1.',
          examples: [
            { ro: 'Deși e frig, ies afară.', ru: 'Хотя холодно, я выхожу на улицу.' },
            { ro: 'Deoarece a plouat, am rămas acasă.', ru: 'Так как шёл дождь, я остался дома.' },
            { ro: 'În schimb, e mai ieftin.', ru: 'Зато дешевле.' },
            { ro: 'De aceea am întârziat.', ru: 'Поэтому я опоздал.' },
            { ro: 'În plus, e aproape.', ru: 'К тому же это близко.' },
          ],
        },
        {
          kind: 'build',
          ru: 'Хотя было холодно, мы пошли гулять.',
          answer: 'Deși era frig am mers la plimbare',
          bank: ['deoarece', 'a fost'],
        },
        {
          kind: 'build',
          ru: 'Эта квартира дороже, зато она в центре.',
          answer: 'Apartamentul ăsta e mai scump în schimb e în centru',
          bank: ['deși', 'cel mai'],
        },
        {
          kind: 'spot',
          tokens: ['Astăzi', 'e', 'mai', 'bine', 'ca', 'mai', 'ieri'],
          wrongIndex: 5,
          fix: '(убрать второе «mai»)',
          ru: 'Сегодня лучше, чем вчера.',
          explain: 'Сравнительная степень строится один раз: mai bine ca ieri.',
        },
        {
          kind: 'match',
          title: 'Связки мысли',
          pairs: [
            { ro: 'deși', ru: 'хотя' },
            { ro: 'deoarece', ru: 'так как' },
            { ro: 'de aceea', ru: 'поэтому' },
            { ro: 'în schimb', ru: 'зато' },
            { ro: 'în plus', ru: 'к тому же' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Deși costă mai mult, calitatea e mult mai bună.',
          options: [
            'Хотя стоит дороже, качество намного лучше.',
            'Стоит дешевле, но качество хуже.',
            'Так как качество лучше, я купил.',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Здесь дешевле, чем в центре.',
          answer: 'Aici e mai ieftin decât în centru',
          alt: ['aici e mai ieftin decat in centru', 'aici este mai ieftin decât în centru'],
        },
      ],
    },

    {
      id: 'ch9_boss',
      title: 'Босс: объясни свою позицию',
      subtitle: 'Финал курса — связная речь с аргументом',
      emoji: '👑',
      boss: true,
      steps: [
        {
          kind: 'rule',
          title: 'Последняя проверка',
          body:
            'B1 — это не «знаю много слов», а «могу объяснить, почему я так думаю». Дальше язык растёт уже не по учебнику, а по разговорам, сериалам и переписке. Осталось десять заданий.',
          vocabulary: [
            { ro: 'gândesc', ru: 'думаю' },
            { ro: 'văzând', ru: 'видя — деепричастие' },
            { ro: 'varianta', ru: 'вариант — тот самый' },
          ],
          aha: 'После этого босса «Тропа» закончится. Живой текст, сцены и повторение никуда не денутся — язык дальше держится ими.',
        },
        {
          kind: 'build',
          ru: 'Он сказал, что не сможет прийти, потому что работает.',
          answer: 'A spus că nu poate veni deoarece lucrează',
          bank: ['dacă', 'deși'],
        },
        {
          kind: 'choice',
          prompt: 'Aici ___ vorbește și rusește.',
          ru: 'Здесь говорят и по-русски.',
          options: ['se', 'este', 'are', 'a fi'],
          correct: 0,
        },
        {
          kind: 'build',
          ru: 'Перед тем как решить, я бы хотел подумать.',
          answer: 'Înainte să decid aș vrea să mă gândesc',
          bank: ['după ce', 'vreau'],
        },
        {
          kind: 'spot',
          tokens: ['M-a', 'întrebat', 'că', 'vreau', 'cafea'],
          wrongIndex: 2,
          fix: 'dacă',
          ru: 'Он спросил, хочу ли я кофе.',
        },
        {
          kind: 'type',
          ru: 'Это самая интересная книга, которую я прочитал.',
          answer: 'Este cea mai interesantă carte pe care am citit-o',
          alt: [
            'este cea mai interesanta carte pe care am citit-o',
            'e cea mai interesantă carte pe care am citit-o',
          ],
          hint: 'превосходная степень + придаточное с pe care',
        },
        {
          kind: 'transform',
          instruction: 'Сделай деепричастие',
          from: 'a vedea',
          answer: 'văzând',
          ru: 'видеть → видя',
        },
        {
          kind: 'listen',
          ro: 'Deși e mai scump, aș alege oricum varianta asta.',
          options: [
            'Хотя дороже, я всё равно выбрал бы этот вариант.',
            'Так как дешевле, я выбираю этот вариант.',
            'Этот вариант дороже, поэтому я его не беру.',
          ],
          correct: 0,
        },
        {
          kind: 'build',
          ru: 'Пока я жил там, я каждый день говорил по-румынски.',
          answer: 'În timp ce locuiam acolo vorbeam românește în fiecare zi',
          bank: ['am locuit', 'am vorbit'],
        },
        {
          kind: 'type',
          ru: 'Я думаю, что это лучшее решение.',
          answer: 'Cred că asta e cea mai bună soluție',
          alt: ['cred ca asta e cea mai buna solutie', 'cred că aceasta e cea mai bună soluție'],
        },
      ],
    },
  ],
};
