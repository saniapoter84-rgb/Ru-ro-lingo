import { CourseChapter } from './types';

// ГЛАВА 1. Самое начало: глагол «быть», род слова, вопрос и отрицание.
// Цель главы — чтобы человек смог сказать о себе три-четыре фразы и задать
// встречный вопрос. Ни одного термина без немедленного примера.

export const CHAPTER_1: CourseChapter = {
  id: 'ch1',
  title: 'Я есть',
  subtitle: 'Первые фразы о себе: кто ты, откуда и как дела',
  emoji: '🌱',
  level: 'A0',
  color: '#A78BFA',
  lessons: [
    {
      id: 'ch1_l1',
      title: 'Румын не молчит',
      subtitle: 'Глагол «быть», который нельзя выбросить',
      emoji: '🧍',
      steps: [
        {
          kind: 'rule',
          title: 'Главное отличие от русского',
          body:
            'По-русски мы говорим «Я студент» — и никакого глагола там нет. В румынском так нельзя: глагол «быть» (a fi) обязан присутствовать. Выбросишь его — фраза рассыпется, как «Я — студент» без тире и без смысла.',
          examples: [
            { ro: 'Eu sunt student.', ru: 'Я студент.', note: 'дословно: «я есть студент»' },
            { ro: 'Tu ești acasă.', ru: 'Ты дома.' },
            { ro: 'El este obosit.', ru: 'Он устал.' },
          ],
          aha: 'Русский «есть» невидимый. Румынский — обязательный.',
        },
        {
          kind: 'choice',
          prompt: 'Eu ___ din Rusia.',
          ru: 'Я из России.',
          options: ['sunt', 'ești', 'este', 'suntem'],
          correct: 0,
          explain: 'eu sunt — «я есть». Форма для «я» совпадает с формой для «они».',
        },
        {
          kind: 'choice',
          prompt: 'Tu ___ acasă?',
          ru: 'Ты дома?',
          options: ['sunt', 'ești', 'este', 'sunteți'],
          correct: 1,
          explain: 'tu ești — «ты есть». Буква «ș» читается как «ш»: «ешть».',
        },
        {
          kind: 'build',
          ru: 'Она врач.',
          answer: 'Ea este medic',
          bank: ['sunt', 'sunteți', 'el'],
          explain: 'ea este — «она есть». В разговоре часто сокращают до «ea e».',
        },
        {
          kind: 'rule',
          title: 'Все шесть форм разом',
          body:
            'Глагол a fi неправильный — его формы просто запоминают. Хорошая новость: он один из самых частых в языке, так что запомнится сам собой за пару дней.',
          examples: [
            { ro: 'eu sunt', ru: 'я есть' },
            { ro: 'tu ești', ru: 'ты есть' },
            { ro: 'el / ea este', ru: 'он / она есть' },
            { ro: 'noi suntem', ru: 'мы есть' },
            { ro: 'voi sunteți', ru: 'вы есть' },
            { ro: 'ei / ele sunt', ru: 'они есть' },
          ],
          aha: 'Форма «sunt» работает и для «я», и для «они» — по контексту не спутаешь.',
        },
        {
          kind: 'match',
          title: 'Собери пары',
          pairs: [
            { ro: 'eu sunt', ru: 'я есть' },
            { ro: 'tu ești', ru: 'ты есть' },
            { ro: 'noi suntem', ru: 'мы есть' },
            { ro: 'voi sunteți', ru: 'вы есть' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Noi ___ prieteni.',
          ru: 'Мы друзья.',
          options: ['sunt', 'este', 'suntem', 'sunteți'],
          correct: 2,
          explain: 'noi suntem — «мы есть».',
        },
        {
          kind: 'spot',
          tokens: ['Eu', 'ești', 'student'],
          wrongIndex: 1,
          fix: 'sunt',
          ru: 'Я студент.',
          explain: '«ești» — это форма для «tu». Для «eu» нужна форма «sunt».',
        },
        {
          kind: 'listen',
          ro: 'Ei sunt acasă',
          options: ['Ei sunt acasă', 'Eu sunt acasă', 'Tu ești acasă'],
          correct: 0,
          ru: 'Они дома.',
        },
        {
          kind: 'rule',
          title: 'В жизни «este» звучит как «e»',
          body:
            'В обычной разговорной речи «este» почти всегда сокращают до «e». Так говорят все, и это не считается ошибкой или небрежностью — просто живая норма.',
          examples: [
            { ro: 'El e bine.', ru: 'У него всё хорошо.' },
            { ro: 'Ce e asta?', ru: 'Что это?' },
          ],
        },
        {
          kind: 'type',
          ru: 'Мы дома.',
          answer: 'Noi suntem acasă',
          alt: ['Suntem acasă'],
          hint: 'acasă — дома',
          explain: 'Местоимение можно и опустить: «Suntem acasă» — тоже верно.',
        },
        {
          kind: 'build',
          ru: 'Вы устали?',
          answer: 'Voi sunteți obosiți',
          bank: ['suntem', 'este'],
          explain: 'obosiți — «уставшие» (мн.ч., м.р.). Вопрос делает интонация.',
        },
      ],
    },
    {
      id: 'ch1_l2',
      title: 'Un или o',
      subtitle: 'Род слова и неопределённый артикль',
      emoji: '🎲',
      steps: [
        {
          kind: 'rule',
          title: 'У каждого слова есть «паспорт»',
          body:
            'В румынском, как и в русском, у существительного есть род. Но перед словом ставится маленькое слово-артикль, которого в русском нет вообще: «un» — для мужского рода, «o» — для женского. Переводится примерно как «какой-то, один».',
          examples: [
            { ro: 'un băiat', ru: 'мальчик (какой-то)' },
            { ro: 'o fată', ru: 'девочка (какая-то)' },
            { ro: 'un oraș', ru: 'город' },
            { ro: 'o casă', ru: 'дом' },
          ],
          aha: 'Учи слово сразу с артиклем: не «casă», а «o casă». Тогда род запомнится бесплатно.',
        },
        {
          kind: 'rule',
          title: 'Подсказка: окончание «-ă»',
          body:
            'Правила без исключений тут нет, но есть очень рабочая примета: слова на «-ă» почти всегда женского рода. Остальные чаще мужского или среднего — и им достаётся «un».',
          examples: [
            { ro: 'o masă, o ușă, o floare', ru: 'стол, дверь, цветок — все женского' },
            { ro: 'un scaun, un tren, un câine', ru: 'стул, поезд, собака — все с «un»' },
          ],
        },
        {
          kind: 'choice',
          prompt: '___ pisică',
          ru: 'кошка',
          options: ['un', 'o'],
          correct: 1,
          explain: 'pisică оканчивается на «-ă» → женский род → «o pisică».',
        },
        {
          kind: 'choice',
          prompt: '___ telefon',
          ru: 'телефон',
          options: ['un', 'o'],
          correct: 0,
          explain: 'telefon — не на «-ă», род не женский → «un telefon».',
        },
        {
          kind: 'choice',
          prompt: '___ problemă',
          ru: 'проблема',
          options: ['un', 'o'],
          correct: 1,
          explain: 'Окончание «-ă» выдаёт женский род: «o problemă».',
        },
        {
          kind: 'match',
          title: 'Что с каким артиклем',
          pairs: [
            { ro: 'un oraș', ru: 'город' },
            { ro: 'o stradă', ru: 'улица' },
            { ro: 'un prieten', ru: 'друг' },
            { ro: 'o prietenă', ru: 'подруга' },
          ],
        },
        {
          kind: 'rule',
          title: 'Третий род — оборотень',
          body:
            'Есть слова, которые в единственном числе ведут себя как мужской род («un»), а во множественном — как женский. Это средний род. Пока просто знай, что он есть: подробно разберём его в следующей главе, когда дойдём до множественного числа.',
          examples: [
            { ro: 'un scaun → două scaune', ru: 'стул → два стула' },
            { ro: 'un tren → două trenuri', ru: 'поезд → два поезда' },
          ],
          aha: 'Средний род — не «оно», как в русском. Это слово, которое меняет сторону во множественном числе.',
        },
        {
          kind: 'build',
          ru: 'Я студент.',
          answer: 'Eu sunt student',
          bank: ['un', 'o'],
          explain:
            'Ловушка: при названии профессии артикль НЕ ставят. «Eu sunt student», а не «un student».',
        },
        {
          kind: 'rule',
          title: 'Профессия — без артикля',
          body:
            'Когда говорят «я врач», «она учительница», артикль пропадает — совсем как в русском. Артикль вернётся, только если добавить описание: «он хороший врач».',
          examples: [
            { ro: 'Ea este profesoară.', ru: 'Она учительница.' },
            { ro: 'El este un medic bun.', ru: 'Он хороший врач.', note: 'появилось описание — вернулся «un»' },
          ],
        },
        {
          kind: 'listen',
          ro: 'o casă mare',
          options: ['o casă mare', 'un câine mare', 'o masă mare'],
          correct: 0,
          ru: 'большой дом',
        },
        {
          kind: 'type',
          ru: 'какая-то книга',
          answer: 'o carte',
          hint: 'carte — книга, женского рода',
        },
        {
          kind: 'spot',
          tokens: ['Eu', 'sunt', 'o', 'profesoară'],
          wrongIndex: 2,
          fix: '(ничего)',
          ru: 'Я учительница.',
          explain: 'Перед профессией артикль не нужен: «Eu sunt profesoară».',
        },
      ],
    },
    {
      id: 'ch1_l3',
      title: 'Да, нет и вопрос',
      subtitle: 'Спросить и ответить, не меняя порядок слов',
      emoji: '❓',
      steps: [
        {
          kind: 'rule',
          title: 'Вопрос делает голос, а не слова',
          body:
            'Хорошая новость для нас: чтобы задать вопрос «да/нет», в румынском ничего переставлять не нужно. Порядок слов остаётся точно таким же, как в утверждении, — работает только интонация. Ровно как в русском: «Ты дома.» → «Ты дома?»',
          examples: [
            { ro: 'Tu ești acasă.', ru: 'Ты дома.' },
            { ro: 'Tu ești acasă?', ru: 'Ты дома?', note: 'те же слова, другой голос' },
          ],
          aha: 'В английском пришлось бы городить «Are you...?». Здесь — ничего, просто подними голос.',
        },
        {
          kind: 'rule',
          title: 'Da, nu и вежливое «не знаю»',
          body: 'Минимальный набор для ответа на любой вопрос.',
          examples: [
            { ro: 'Da.', ru: 'Да.' },
            { ro: 'Nu.', ru: 'Нет.' },
            { ro: 'Nu știu.', ru: 'Не знаю.' },
            { ro: 'Poate.', ru: 'Может быть.' },
            { ro: 'Sigur!', ru: 'Конечно!' },
          ],
        },
        {
          kind: 'build',
          ru: 'Ты студент?',
          answer: 'Tu ești student',
          bank: ['este', 'sunt'],
          explain: 'Слова те же, что и в утверждении. Вопрос — это только знак и интонация.',
        },
        {
          kind: 'rule',
          title: 'Вопросительные слова идут вперёд',
          body:
            'Если вопрос не про «да/нет», а про «что / где / как», вопросительное слово встаёт в начало фразы — как и в русском.',
          examples: [
            { ro: 'Ce faci?', ru: 'Что делаешь?' },
            { ro: 'Unde ești?', ru: 'Где ты?' },
            { ro: 'Cum te cheamă?', ru: 'Как тебя зовут?' },
            { ro: 'Cine este?', ru: 'Кто это?' },
            { ro: 'De ce?', ru: 'Почему?' },
          ],
        },
        {
          kind: 'match',
          title: 'Вопросительные слова',
          pairs: [
            { ro: 'ce', ru: 'что' },
            { ro: 'unde', ru: 'где' },
            { ro: 'cum', ru: 'как' },
            { ro: 'cine', ru: 'кто' },
            { ro: 'de ce', ru: 'почему' },
          ],
        },
        {
          kind: 'choice',
          prompt: '___ ești? — Sunt acasă.',
          ru: 'Где ты? — Я дома.',
          options: ['Ce', 'Unde', 'Cine', 'Cum'],
          correct: 1,
          explain: 'Ответ «дома» — значит спрашивали про место: unde.',
        },
        {
          kind: 'choice',
          prompt: '___ te cheamă? — Mă cheamă Ana.',
          ru: 'Как тебя зовут? — Меня зовут Ана.',
          options: ['Cum', 'Ce', 'Unde', 'De ce'],
          correct: 0,
          explain:
            'Дословно «cum te cheamă» — «как тебя зовёт(ся)». Это устойчивая фраза, её просто запоминают.',
        },
        {
          kind: 'listen',
          ro: 'Ce faci?',
          options: ['Ce faci?', 'Cine ești?', 'Unde ești?'],
          correct: 0,
          ru: 'Что делаешь?',
        },
        {
          kind: 'type',
          ru: 'Кто это?',
          answer: 'Cine este',
          alt: ['Cine e', 'Cine este?', 'Cine e?'],
          hint: 'cine — кто',
        },
        {
          kind: 'build',
          ru: 'Как дела?',
          answer: 'Ce mai faci',
          bank: ['unde', 'cine'],
          explain:
            'Дословно «что ещё делаешь» — так спрашивают «как дела» между своими. Формально: «Ce mai faceți?»',
        },
        {
          kind: 'transform',
          instruction: 'Сделай из утверждения вопрос',
          from: 'El este acasă.',
          answer: 'El este acasă?',
          alt: ['El este acasă', 'El e acasă?', 'El e acasă'],
          ru: 'Он дома. → Он дома?',
          explain: 'Ничего не переставляем — меняется только знак в конце и интонация.',
        },
      ],
    },
    {
      id: 'ch1_l4',
      title: 'Ничего не знаю',
      subtitle: 'Отрицание — и приятный сюрприз для русскоговорящих',
      emoji: '🚫',
      steps: [
        {
          kind: 'rule',
          title: 'Одно слово «nu» — и всё',
          body:
            'Отрицание в румынском устроено проще некуда: ставим «nu» прямо перед глаголом. Никаких вспомогательных слов, как в английском «do not», не требуется.',
          examples: [
            { ro: 'Eu nu sunt acasă.', ru: 'Я не дома.' },
            { ro: 'Nu știu.', ru: 'Не знаю.' },
            { ro: 'El nu este medic.', ru: 'Он не врач.' },
          ],
          aha: '«nu» — это и «нет», и «не». Ровно как в русском.',
        },
        {
          kind: 'choice',
          prompt: 'Eu ___ sunt obosit.',
          ru: 'Я не устал.',
          options: ['nu', 'nici', 'fără', 'ne'],
          correct: 0,
        },
        {
          kind: 'transform',
          instruction: 'Поставь фразу в отрицание',
          from: 'Ea este acasă.',
          answer: 'Ea nu este acasă',
          alt: ['Ea nu e acasă', 'Nu este acasă', 'Nu e acasă'],
          ru: 'Она дома. → Она не дома.',
          explain: '«nu» встаёт перед глаголом, остальное не трогаем.',
        },
        {
          kind: 'rule',
          title: 'Двойное отрицание — как у нас!',
          body:
            'Вот место, где русскоговорящим везёт. По-английски «I know nothing» — одно отрицание, и добавлять второе нельзя. В румынском, как и в русском, отрицание удваивается: слова «ничего», «никогда», «никто» ТРЕБУЮТ ещё и «nu» перед глаголом.',
          examples: [
            { ro: 'Nu știu nimic.', ru: 'Я ничего не знаю.' },
            { ro: 'Nu vine niciodată.', ru: 'Он никогда не приходит.' },
            { ro: 'Nu e nimeni acasă.', ru: 'Дома никого нет.' },
          ],
          aha: 'Переводи с русского буквально — и попадёшь в точку. Редкий случай, когда так можно.',
        },
        {
          kind: 'match',
          title: 'Отрицательные слова',
          pairs: [
            { ro: 'nimic', ru: 'ничего' },
            { ro: 'niciodată', ru: 'никогда' },
            { ro: 'nimeni', ru: 'никто' },
            { ro: 'nicăieri', ru: 'нигде' },
          ],
        },
        {
          kind: 'build',
          ru: 'Я ничего не знаю.',
          answer: 'Nu știu nimic',
          bank: ['este', 'da'],
          explain: 'Два отрицания в одной фразе — «nu» и «nimic». Именно так и надо.',
        },
        {
          kind: 'spot',
          tokens: ['Eu', 'știu', 'nimic'],
          wrongIndex: 1,
          fix: 'nu știu',
          ru: 'Я ничего не знаю.',
          explain: 'Потеряли «nu». Со словом «nimic» отрицание перед глаголом обязательно.',
        },
        {
          kind: 'rule',
          title: 'В речи «nu» слипается',
          body:
            'Перед гласной «nu» часто сокращается до «n-» и приклеивается к глаголу через дефис. Понимать это надо обязательно, а говорить так — по желанию.',
          examples: [
            { ro: 'Nu am timp. → N-am timp.', ru: 'У меня нет времени.' },
            { ro: 'Nu are bani. → N-are bani.', ru: 'У него нет денег.' },
          ],
        },
        {
          kind: 'listen',
          ro: 'Nu știu nimic',
          options: ['Nu știu nimic', 'Știu totul', 'Nu sunt acasă'],
          correct: 0,
          ru: 'Я ничего не знаю.',
        },
        {
          kind: 'type',
          ru: 'Он никогда не дома.',
          answer: 'El nu este niciodată acasă',
          alt: ['El nu e niciodată acasă', 'Nu este niciodată acasă', 'El niciodată nu este acasă'],
          hint: 'niciodată — никогда',
        },
        {
          kind: 'choice',
          prompt: 'Nu e ___ acasă.',
          ru: 'Дома никого нет.',
          options: ['nimic', 'nimeni', 'niciodată', 'nicăieri'],
          correct: 1,
          explain: '«nimeni» — про людей (никто), «nimic» — про вещи (ничего).',
        },
      ],
    },
    {
      id: 'ch1_boss',
      title: 'Босс: Знакомство',
      subtitle: 'Всё из главы разом — и без подсказок-правил',
      emoji: '🏆',
      boss: true,
      steps: [
        {
          kind: 'rule',
          title: 'Что проверяем',
          body:
            'Вся первая глава в одном месте: шесть форм «a fi», род существительного через un и o, вопрос, который делает интонация, а не порядок слов, и отрицание через «nu» перед глаголом.',
          aha: 'Ошибка тут ничего не стоит: задание просто вернётся в конец очереди, пока не разберёшься.',
        },
        {
          kind: 'build',
          ru: 'Меня зовут Александр.',
          answer: 'Mă cheamă Alexandru',
          bank: ['sunt', 'este'],
        },
        {
          kind: 'choice',
          prompt: 'Eu ___ din Rusia, dar acum ___ în România.',
          ru: 'Я из России, но сейчас я в Румынии.',
          options: ['sunt / sunt', 'ești / este', 'sunt / este', 'suntem / sunt'],
          correct: 0,
          explain: 'Оба раза говорим про «я» — значит оба раза «sunt».',
        },
        {
          kind: 'type',
          ru: 'Я не студент.',
          answer: 'Eu nu sunt student',
          alt: ['Nu sunt student'],
        },
        {
          kind: 'spot',
          tokens: ['Tu', 'sunt', 'acasă', '?'],
          wrongIndex: 1,
          fix: 'ești',
          ru: 'Ты дома?',
        },
        {
          kind: 'listen',
          ro: 'Cum te cheamă?',
          options: ['Cum te cheamă?', 'Ce mai faci?', 'Unde ești?'],
          correct: 0,
          ru: 'Как тебя зовут?',
        },
        {
          kind: 'choice',
          prompt: '___ mașină',
          ru: 'машина',
          options: ['un', 'o'],
          correct: 1,
          explain: 'mașină оканчивается на «-ă» → женский род.',
        },
        {
          kind: 'build',
          ru: 'Мы не дома.',
          answer: 'Noi nu suntem acasă',
          bank: ['este', 'sunteți'],
        },
        {
          kind: 'match',
          title: 'Финальная проверка',
          pairs: [
            { ro: 'Nu știu.', ru: 'Не знаю.' },
            { ro: 'Ce faci?', ru: 'Что делаешь?' },
            { ro: 'Ea este medic.', ru: 'Она врач.' },
            { ro: 'Nu e nimeni.', ru: 'Никого нет.' },
          ],
        },
        {
          kind: 'transform',
          instruction: 'Поставь в отрицание',
          from: 'Voi sunteți obosiți.',
          answer: 'Voi nu sunteți obosiți',
          alt: ['Nu sunteți obosiți'],
          ru: 'Вы устали. → Вы не устали.',
        },
        {
          kind: 'type',
          ru: 'Где ты?',
          answer: 'Unde ești',
          alt: ['Unde ești?'],
        },
        {
          kind: 'build',
          ru: 'Он хороший врач.',
          answer: 'El este un medic bun',
          bank: ['o', 'sunt'],
          explain: 'С описанием артикль возвращается: «un medic bun».',
        },
        {
          kind: 'choice',
          prompt: 'Nu vine ___.',
          ru: 'Он никогда не приходит.',
          options: ['nimic', 'nimeni', 'niciodată', 'nu'],
          correct: 2,
        },
      ],
    },
  ],
};
