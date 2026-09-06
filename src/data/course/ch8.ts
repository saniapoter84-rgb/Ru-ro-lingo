import { CourseChapter } from './types';

// ГЛАВА 8. Порог B1. Здесь заканчивается «правильный учебный румынский»
// и начинается язык, на котором рассказывают истории: прошлое с оттенком
// («делал» против «сделал»), вежливое «бы», придаточные с «care» и
// нормальное будущее. Для русскоговорящего главная новость главы в том,
// что вид глагола, которого в румынском нет, прячется в выборе времени.

export const CHAPTER_8: CourseChapter = {
  id: 'ch8',
  title: 'Было и бывало',
  subtitle: 'Прошлое с оттенком, вежливое «бы» и придаточные',
  emoji: '🕰️',
  level: 'B1',
  color: '#38BDF8',
  lessons: [
    {
      id: 'ch8_l1',
      title: 'Делал или сделал',
      subtitle: 'Imperfect: фон, привычка и незаконченное действие',
      emoji: '🎞️',
      steps: [
        {
          kind: 'rule',
          title: 'В румынском нет вида — есть два прошедших',
          body:
            'Мы различаем «читал» и «прочитал» самим глаголом. В румынском глагол один, а разница уходит во время. Perfect compus (am citit) — про то, что произошло и закончилось. Imperfect (citeam) — про то, что длилось, повторялось или было фоном.',
          examples: [
            { ro: 'Ieri am citit cartea.', ru: 'Вчера я прочитал книгу.', note: 'один раз, до конца' },
            { ro: 'Seara citeam mereu.', ru: 'По вечерам я всегда читал.', note: 'привычка' },
            { ro: 'Citeam când ai sunat.', ru: 'Я читал, когда ты позвонил.', note: 'фон для события' },
          ],
          aha: 'Правило-подсказка: если по-русски можно вставить «бывало» или «в тот момент» — это imperfect.',
        },
        {
          kind: 'rule',
          title: 'Как он собирается',
          body:
            'Берём основу глагола и лепим окончания -am, -ai, -a, -am, -ați, -au. У глаголов на -a основа идёт напрямую, у всех остальных перед окончанием появляется -e-. Первое лицо единственного и множественного совпадают — их различают по местоимению.',
          examples: [
            { ro: 'a lucra → lucram, lucrai, lucra', ru: 'работать → я работал, ты работал, он работал' },
            { ro: 'a merge → mergeam, mergeai, mergea', ru: 'идти → я шёл, ты шёл, он шёл' },
            { ro: 'a citi → citeam, citeai, citea', ru: 'читать → я читал…' },
            { ro: 'a fi → eram, erai, era', ru: 'быть → я был, ты был, он был' },
            { ro: 'a avea → aveam, aveai, avea', ru: 'иметь → у меня было…' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Când ___ mic, mergeam la bunici.',
          ru: 'Когда я был маленьким, я ездил к бабушке с дедушкой.',
          options: ['eram', 'am fost', 'sunt', 'voi fi'],
          correct: 0,
          explain: '«Был маленьким» — это состояние, которое длилось. Значит imperfect: eram.',
        },
        {
          kind: 'choice',
          prompt: 'Ieri ___ la doctor.',
          ru: 'Вчера я сходил к врачу.',
          options: ['mergeam', 'am fost', 'eram', 'merg'],
          correct: 1,
          explain: 'Один законченный поход — perfect compus. Imperfect означал бы «ходил регулярно».',
        },
        {
          kind: 'transform',
          instruction: 'Поставь в imperfect (я)',
          from: 'lucrez',
          answer: 'lucram',
          ru: 'работаю → работал',
          explain: 'Глагол на -a: основа lucr- плюс -am.',
        },
        {
          kind: 'transform',
          instruction: 'Поставь в imperfect (я)',
          from: 'vorbesc',
          answer: 'vorbeam',
          ru: 'говорю → говорил',
          explain: 'Не на -a, поэтому перед окончанием встаёт -e-: vorb + e + am.',
        },
        {
          kind: 'build',
          ru: 'Шёл дождь, когда я вышел.',
          answer: 'Ploua când am ieșit',
          bank: ['a plouat', 'ies', 'eram'],
          explain: 'Дождь — фон (imperfect), выход — событие (perfect compus). Два времени в одной фразе.',
        },
        {
          kind: 'build',
          ru: 'Каждое лето мы ездили на море.',
          answer: 'În fiecare vară mergeam la mare',
          bank: ['am mers', 'merg'],
          explain: '«Каждое лето» — повтор, а повтор всегда imperfect.',
        },
        {
          kind: 'spot',
          tokens: ['Ieri', 'mergeam', 'la', 'magazin', 'și', 'am', 'cumpărat', 'pâine'],
          wrongIndex: 1,
          fix: 'am mers',
          ru: 'Вчера я сходил в магазин и купил хлеб.',
          explain: 'Оба действия однократные и законченные — значит оба в perfect compus.',
        },
        {
          kind: 'match',
          title: 'Времена и оттенки',
          pairs: [
            { ro: 'am citit', ru: 'прочитал' },
            { ro: 'citeam', ru: 'читал (бывало)' },
            { ro: 'eram', ru: 'я был' },
            { ro: 'am fost', ru: 'я побывал' },
            { ro: 'aveam', ru: 'у меня было' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Când eram copil, îmi plăcea să desenez.',
          options: [
            'Когда я был ребёнком, мне нравилось рисовать.',
            'Когда я был ребёнком, я нарисовал картину.',
            'Ребёнком я хочу рисовать.',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Я не знал, что ты здесь.',
          answer: 'Nu știam că ești aici',
          alt: ['nu stiam ca esti aici'],
          hint: 'знать → a ști, в imperfect — știam',
          explain: '«Не знал» — это состояние, оно длилось. Плюс придаточное с «că».',
        },
      ],
    },

    {
      id: 'ch8_l2',
      title: 'Я бы хотел',
      subtitle: 'Условное наклонение: вежливость и «если бы»',
      emoji: '🎩',
      steps: [
        {
          kind: 'rule',
          title: 'Одна частица — и фраза становится вежливой',
          body:
            'Русское «бы» в румынском живёт отдельным набором слов: aș, ai, ar, am, ați, ar. После них глагол стоит в инфинитиве, но без «a». Это же самая частая форма вежливости — в магазине и в кафе говорят именно так.',
          examples: [
            { ro: 'Vreau o cafea.', ru: 'Хочу кофе.', note: 'звучит резковато' },
            { ro: 'Aș vrea o cafea.', ru: 'Я бы хотел кофе.', note: 'нормальный тон' },
            { ro: 'Ai putea să mă ajuți?', ru: 'Ты не мог бы мне помочь?' },
            { ro: 'Ar fi bine să mergem.', ru: 'Было бы хорошо пойти.' },
          ],
          aha: '«Aș vrea» — самая полезная фраза главы. С ней можно заказать что угодно и никого не задеть.',
        },
        {
          kind: 'choice',
          prompt: '___ vrea un ceai, vă rog.',
          ru: 'Я бы хотел чай, пожалуйста.',
          options: ['Aș', 'Ai', 'Ar', 'Am'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: '___ putea să repeți?',
          ru: 'Ты не мог бы повторить?',
          options: ['Aș', 'Ai', 'Ar', 'Ați'],
          correct: 1,
        },
        {
          kind: 'rule',
          title: 'Если бы… то…',
          body:
            'В условии условное наклонение стоит в ОБЕИХ половинах фразы — и после «dacă», и в главной части. Это отличается от русского только тем, что «бы» здесь не одно слово, а форма.',
          examples: [
            { ro: 'Dacă aș avea timp, aș veni.', ru: 'Если бы у меня было время, я бы пришёл.' },
            { ro: 'Dacă ai vrea, am putea merge.', ru: 'Если бы ты захотел, мы могли бы пойти.' },
            { ro: 'Aș fi venit, dar am uitat.', ru: 'Я бы пришёл, но забыл.', note: 'прошедшее: aș fi + причастие' },
          ],
        },
        {
          kind: 'build',
          ru: 'Если бы у меня были деньги, я бы купил машину.',
          answer: 'Dacă aș avea bani aș cumpăra o mașină',
          bank: ['am', 'cumpăr'],
          explain: 'Обе половины — в условном: aș avea… aș cumpăra.',
        },
        {
          kind: 'transform',
          instruction: 'Сделай вежливым',
          from: 'Vreau să vorbesc cu tine.',
          answer: 'Aș vrea să vorbesc cu tine',
          alt: ['as vrea sa vorbesc cu tine'],
          ru: 'Я бы хотел с тобой поговорить.',
        },
        {
          kind: 'spot',
          tokens: ['Dacă', 'am', 'timp', 'aș', 'merge', 'la', 'mare'],
          wrongIndex: 1,
          fix: 'aș avea',
          ru: 'Если бы у меня было время, я бы поехал на море.',
          explain: 'В условии тоже нужно условное наклонение, а не настоящее время.',
        },
        {
          kind: 'match',
          title: 'Формы «бы»',
          pairs: [
            { ro: 'aș merge', ru: 'я бы пошёл' },
            { ro: 'ai merge', ru: 'ты бы пошёл' },
            { ro: 'ar merge', ru: 'он бы пошёл' },
            { ro: 'am merge', ru: 'мы бы пошли' },
            { ro: 'ați merge', ru: 'вы бы пошли' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Aș vrea să rezerv o masă pentru două persoane.',
          options: [
            'Я бы хотел забронировать столик на двоих.',
            'Я забронировал столик на двоих.',
            'У вас есть столик на двоих?',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Ты не мог бы говорить помедленнее?',
          answer: 'Ai putea să vorbești mai rar',
          alt: ['ai putea sa vorbesti mai rar', 'ai putea vorbi mai rar'],
          hint: 'медленнее (о речи) — mai rar',
        },
      ],
    },

    {
      id: 'ch8_l3',
      title: 'Тот, который',
      subtitle: 'Придаточные с care: соединяем короткие фразы в длинные',
      emoji: '🔗',
      steps: [
        {
          kind: 'rule',
          title: 'Одно слово вместо всех «который»',
          body:
            'В русском «который» склоняется: который, которого, которому. В румынском есть одно care — и оно не меняется. Меняется только то, что стоит перед ним: предлог или «pe».',
          examples: [
            { ro: 'Omul care stă acolo e vecinul meu.', ru: 'Человек, который там стоит, — мой сосед.' },
            { ro: 'Fata cu care vorbeai e sora mea.', ru: 'Девушка, с которой ты говорил, — моя сестра.' },
            { ro: 'Orașul în care locuiesc e mic.', ru: 'Город, в котором я живу, маленький.' },
          ],
          aha: 'Предлог в румынском стоит ПЕРЕД care, как в русском перед «которым». Порядок совпадает — редкая удача.',
        },
        {
          kind: 'rule',
          title: 'Когда care становится «pe care»',
          body:
            'Если «который» — это прямое дополнение (кого? что?), перед ним ставится pe. А в прошедшем времени причастие ещё и согласуется: появляется маленькое -o для женского рода.',
          examples: [
            { ro: 'Cartea pe care o citesc e bună.', ru: 'Книга, которую я читаю, хорошая.' },
            { ro: 'Filmul pe care l-am văzut e vechi.', ru: 'Фильм, который я посмотрел, старый.' },
            { ro: 'Cartea pe care am citit-o e bună.', ru: 'Книга, которую я прочитал, хорошая.' },
          ],
          aha: 'Проверка на «pe»: подставь «кого/что». Если подходит — нужен pe и удвоение местоимением.',
        },
        {
          kind: 'choice',
          prompt: 'Omul ___ lucrează aici e prietenul meu.',
          ru: 'Человек, который здесь работает, — мой друг.',
          options: ['care', 'pe care', 'ce', 'cine'],
          correct: 0,
          explain: 'Человек сам работает — он подлежащее, значит просто care.',
        },
        {
          kind: 'choice',
          prompt: 'Filmul ___ l-am văzut ieri a fost bun.',
          ru: 'Фильм, который я вчера посмотрел, был хорошим.',
          options: ['care', 'pe care', 'cu care', 'în care'],
          correct: 1,
          explain: 'Посмотрел что? Фильм — прямое дополнение, поэтому pe care.',
        },
        {
          kind: 'build',
          ru: 'Дом, в котором мы живём, старый.',
          answer: 'Casa în care locuim este veche',
          bank: ['pe care', 'cu care'],
        },
        {
          kind: 'build',
          ru: 'Девушка, с которой я говорил, — врач.',
          answer: 'Fata cu care am vorbit este medic',
          bank: ['pe care', 'în care'],
        },
        {
          kind: 'spot',
          tokens: ['Cartea', 'care', 'am', 'citit-o', 'este', 'foarte', 'bună'],
          wrongIndex: 1,
          fix: 'pe care',
          ru: 'Книга, которую я прочитал, очень хорошая.',
          explain: 'Прочитал что? Книгу. Прямое дополнение требует pe care.',
        },
        {
          kind: 'match',
          title: 'Связки',
          pairs: [
            { ro: 'care', ru: 'который (подлежащее)' },
            { ro: 'pe care', ru: 'которого (дополнение)' },
            { ro: 'cu care', ru: 'с которым' },
            { ro: 'în care', ru: 'в котором' },
            { ro: 'unde', ru: 'где' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Prietenul cu care am venit lucrează la spital.',
          options: [
            'Друг, с которым я пришёл, работает в больнице.',
            'Друг, который пришёл, работает в больнице.',
            'Я пришёл к другу в больницу.',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Это город, в котором я родился.',
          answer: 'Acesta este orașul în care m-am născut',
          alt: [
            'acesta este orasul in care m-am nascut',
            'ăsta e orașul în care m-am născut',
            'asta e orasul in care m-am nascut',
          ],
          hint: 'родиться — a se naște, «я родился» — m-am născut',
        },
      ],
    },

    {
      id: 'ch8_l4',
      title: 'Точно будет',
      subtitle: 'Два будущих времени и как звучать уверенно',
      emoji: '🔮',
      steps: [
        {
          kind: 'rule',
          title: 'Разговорное и книжное будущее',
          body:
            'Ты уже знаешь «o să merg» — так говорят каждый день. Но в письме, в новостях и в объявлениях используется другая форма: voi, vei, va, vom, veți, vor плюс инфинитив без «a». Смысл тот же, регистр разный.',
          examples: [
            { ro: 'O să merg mâine.', ru: 'Я пойду завтра.', note: 'разговорное' },
            { ro: 'Voi merge mâine.', ru: 'Я пойду завтра.', note: 'нейтрально, для письма' },
            { ro: 'Va ploua în toată țara.', ru: 'Дождь пройдёт по всей стране.', note: 'так говорят в прогнозе' },
            { ro: 'Vom vedea.', ru: 'Посмотрим.' },
          ],
          aha: 'В речи почти всегда «o să». Форму «voi merge» достаточно узнавать в тексте — но узнавать надо, иначе новости не читаются.',
        },
        {
          kind: 'choice',
          prompt: 'Mâine ___ ploua toată ziua.',
          ru: 'Завтра дождь будет идти весь день.',
          options: ['va', 'vei', 'vom', 'vor'],
          correct: 0,
          explain: 'Дождь — это «оно», третье лицо: va.',
        },
        {
          kind: 'choice',
          prompt: 'Noi ___ veni la ora șapte.',
          ru: 'Мы придём в семь.',
          options: ['voi', 'vei', 'vom', 'vor'],
          correct: 2,
        },
        {
          kind: 'transform',
          instruction: 'Переведи в разговорное будущее',
          from: 'Voi pleca mâine.',
          answer: 'O să plec mâine',
          alt: ['o sa plec maine'],
          ru: 'Я уеду завтра.',
          explain: 'После «o să» глагол спрягается: plec.',
        },
        {
          kind: 'rule',
          title: 'Сказать «наверное»',
          body:
            'Уверенность в румынском добавляется словами, а не интонацией. Их набор небольшой, и без него речь звучит категорично там, где ты этого не имел в виду.',
          examples: [
            { ro: 'Cred că vine.', ru: 'Думаю, он придёт.' },
            { ro: 'Probabil că a uitat.', ru: 'Наверное, он забыл.' },
            { ro: 'Poate vine mai târziu.', ru: 'Может быть, придёт попозже.' },
            { ro: 'Sigur o să reușești.', ru: 'Точно получится.' },
          ],
        },
        {
          kind: 'build',
          ru: 'Думаю, завтра будет холодно.',
          answer: 'Cred că mâine o să fie frig',
          bank: ['este', 'a fost'],
        },
        {
          kind: 'build',
          ru: 'Наверное, он забыл про встречу.',
          answer: 'Probabil că a uitat de întâlnire',
          bank: ['uită', 'o să uite'],
        },
        {
          kind: 'spot',
          tokens: ['Mâine', 'vom', 'să', 'mergem', 'la', 'munte'],
          wrongIndex: 2,
          fix: '(убрать «să»)',
          ru: 'Завтра мы поедем в горы.',
          explain: 'После vom идёт чистый инфинитив: vom merge. Частица «să» бывает только у «o să».',
        },
        {
          kind: 'match',
          title: 'Уверенность',
          pairs: [
            { ro: 'sigur', ru: 'точно' },
            { ro: 'probabil', ru: 'наверное' },
            { ro: 'poate', ru: 'может быть' },
            { ro: 'cred că', ru: 'думаю, что' },
            { ro: 'nici vorbă', ru: 'ни в коем случае' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Cred că va fi mai cald săptămâna viitoare.',
          options: [
            'Думаю, на следующей неделе будет теплее.',
            'На прошлой неделе было теплее.',
            'Надеюсь, сегодня будет тепло.',
          ],
          correct: 0,
        },
        {
          kind: 'type',
          ru: 'Может быть, я приду попозже.',
          answer: 'Poate o să vin mai târziu',
          alt: ['poate o sa vin mai tarziu', 'poate vin mai târziu', 'poate vin mai tarziu'],
        },
      ],
    },

    {
      id: 'ch8_boss',
      title: 'Босс: рассказ о себе',
      subtitle: 'Всё прошедшее, «бы» и придаточные в одном тексте',
      emoji: '👑',
      boss: true,
      steps: [
        {
          kind: 'rule',
          title: 'Проверка главы',
          body:
            'Сейчас будет то, ради чего вся глава: связный рассказ о прошлом с оценкой и планами. Это ровно тот объём речи, который отделяет A2 от B1 — не отдельные фразы, а история.',
          aha: 'Ошибка тут ничего не стоит: задание просто вернётся в конец, пока не разберёшься.',
        },
        {
          kind: 'build',
          ru: 'Когда я был студентом, я работал в кафе.',
          answer: 'Când eram student lucram într-o cafenea',
          bank: ['am fost', 'am lucrat'],
        },
        {
          kind: 'choice',
          prompt: 'Anul trecut ___ în România de trei ori.',
          ru: 'В прошлом году я был в Румынии три раза.',
          options: ['am fost', 'eram', 'sunt', 'voi fi'],
          correct: 0,
          explain: 'Три конкретных раза — счётное законченное действие, perfect compus.',
        },
        {
          kind: 'build',
          ru: 'Я бы хотел найти работу, которая мне нравится.',
          answer: 'Aș vrea să găsesc o muncă care îmi place',
          bank: ['pe care', 'vreau'],
        },
        {
          kind: 'spot',
          tokens: ['Dacă', 'aveam', 'timp', ',', 'aș', 'învăța', 'și', 'spaniolă'],
          wrongIndex: 1,
          fix: 'aș avea',
          ru: 'Если бы у меня было время, я бы учил ещё и испанский.',
          explain: 'Условие требует условного наклонения, а не imperfect.',
        },
        {
          kind: 'type',
          ru: 'Город, в котором я вырос, очень маленький.',
          answer: 'Orașul în care am crescut este foarte mic',
          alt: ['orasul in care am crescut este foarte mic', 'orașul în care am crescut e foarte mic'],
          hint: 'вырасти — a crește',
        },
        {
          kind: 'transform',
          instruction: 'Поставь в imperfect (мы)',
          from: 'am mers',
          answer: 'mergeam',
          ru: 'сходили → ходили',
        },
        {
          kind: 'listen',
          ro: 'Când locuiam la Cluj, mergeam des la munte.',
          options: [
            'Когда я жил в Клуже, я часто ездил в горы.',
            'Когда я приехал в Клуж, я поехал в горы.',
            'Я живу в Клуже и езжу в горы.',
          ],
          correct: 0,
        },
        {
          kind: 'build',
          ru: 'Думаю, в следующем году я перееду в Бухарест.',
          answer: 'Cred că anul viitor o să mă mut la București',
          bank: ['m-am mutat', 'mutam'],
        },
        {
          kind: 'type',
          ru: 'Я бы пришёл, но у меня не было времени.',
          answer: 'Aș fi venit dar nu am avut timp',
          alt: ['as fi venit dar nu am avut timp', 'aș fi venit, dar nu am avut timp'],
          hint: 'прошедшее условное: aș fi + причастие',
        },
      ],
    },
  ],
};
