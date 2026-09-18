import { CourseChapter } from './types';

// ГЛАВА 3. Обладание и описание: a avea, притяжательные, прилагательные.
// Тут два «ага-момента»: притяжательное согласуется с ПРЕДМЕТОМ, а не
// с владельцем; и прилагательное стоит ПОСЛЕ существительного.

export const CHAPTER_3: CourseChapter = {
  id: 'ch3',
  title: 'Моё и твоё',
  subtitle: 'Что у тебя есть и какое оно',
  emoji: '🎒',
  level: 'A1',
  color: '#C084FC',
  lessons: [
    {
      id: 'ch3_l1',
      title: 'У меня есть',
      subtitle: 'Глагол a avea — второй по важности в языке',
      emoji: '🤲',
      steps: [
        {
          kind: 'rule',
          title: 'Не «у меня есть», а «я имею»',
          body:
            'В русском обладание описывают через место: «У меня есть собака». В румынском — через действие, как в европейских языках: «Я имею собаку». Конструкция другая, но глагол всего один, и он частотный.',
          examples: [
            { ro: 'Eu am un câine.', ru: 'У меня есть собака.', note: 'дословно: «я имею собаку»' },
            { ro: 'Tu ai timp?', ru: 'У тебя есть время?' },
            { ro: 'El are o mașină.', ru: 'У него есть машина.' },
          ],
          aha: 'Перестань переводить «у меня». Начинай фразу сразу с «am».',
        },
        {
          kind: 'rule',
          title: 'Шесть форм a avea',
          body: 'Тоже неправильный глагол — и тоже запоминается сам собой, потому что нужен постоянно.',
          examples: [
            { ro: 'eu am', ru: 'у меня есть' },
            { ro: 'tu ai', ru: 'у тебя есть' },
            { ro: 'el / ea are', ru: 'у него / неё есть' },
            { ro: 'noi avem', ru: 'у нас есть' },
            { ro: 'voi aveți', ru: 'у вас есть' },
            { ro: 'ei / ele au', ru: 'у них есть' },
          ],
        },
        {
          kind: 'match',
          title: 'Собери пары',
          pairs: [
            { ro: 'am', ru: 'у меня есть' },
            { ro: 'ai', ru: 'у тебя есть' },
            { ro: 'are', ru: 'у него есть' },
            { ro: 'avem', ru: 'у нас есть' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Ea ___ doi frați.',
          ru: 'У неё два брата.',
          options: ['am', 'ai', 'are', 'au'],
          correct: 2,
          explain:
            'Обладание в румынском описывается как «она имеет двух братьев». Третье лицо единственного — «are».',
          forms: {
            are: 'он, она имеет',
            am: 'я имею',
            ai: 'ты имеешь',
            au: 'они имеют',
          },
        },
        {
          kind: 'choice',
          prompt: 'Noi ___ o casă mare.',
          ru: 'У нас большой дом.',
          options: ['avem', 'aveți', 'au', 'are'],
          correct: 0,
          explain: 'У «мы» своя форма — «avem». Не «am»: это только «я», хотя рука тянется поставить её.',
          forms: {
            avem: 'мы имеем',
            'aveți': 'вы имеете',
            au: 'они имеют',
            are: 'он, она имеет',
          },
        },
        {
          kind: 'build',
          ru: 'У меня нет времени.',
          answer: 'Nu am timp',
          bank: ['este', 'un'],
          explain: 'Отрицание работает как обычно: «nu» перед глаголом. В речи — «n-am timp».',
        },
        {
          kind: 'rule',
          title: 'Возраст тоже «имеют»',
          body:
            'Ещё одна конструкция, где румынский расходится с русским: возраст не «есть», его «имеют». «Мне двадцать лет» → «Я имею двадцать лет».',
          examples: [
            { ro: 'Am douăzeci de ani.', ru: 'Мне двадцать лет.' },
            { ro: 'Câți ani ai?', ru: 'Сколько тебе лет?' },
          ],
          aha: 'Голод, жажда и страх — тоже «имеют»: mi-e foame, mi-e frică. Но это уже другая история.',
        },
        {
          kind: 'type',
          ru: 'Сколько тебе лет?',
          answer: 'Câți ani ai',
          alt: ['Câți ani ai?'],
          hint: 'câți — сколько (для мужского рода мн.ч.)',
          explain:
            'Возраст в румынском не «есть», а «имеют»: «сколько лет ты имеешь». И «câți» — мужской род множественного, потому что считаем годы.',
        },
        {
          kind: 'spot',
          tokens: ['Eu', 'sunt', 'douăzeci', 'de', 'ani'],
          wrongIndex: 1,
          fix: 'am',
          ru: 'Мне двадцать лет.',
          explain: 'Возраст «имеют», а не «есть». Нужно «am», а не «sunt».',
        },
        {
          kind: 'listen',
          ro: 'Am o soră și un frate',
          options: ['Am o soră și un frate', 'Are o soră mare', 'Am două surori'],
          correct: 0,
          ru: 'У меня есть сестра и брат.',
          explain:
            '«Am» — это «я имею». У «are» было бы «у неё», а «două surori» — две сестры вместо сестры и брата.',
        },
        {
          kind: 'choice',
          prompt: 'Voi ___ copii?',
          ru: 'У вас есть дети?',
          options: ['avem', 'aveți', 'au', 'ai'],
          correct: 1,
          explain: 'Окончание «-ți» — признак формы «вы», как и в «sunteți».',
          forms: {
            'aveți': 'вы имеете',
            avem: 'мы имеем',
            au: 'они имеют',
            ai: 'ты имеешь',
          },
        },
        {
          kind: 'build',
          ru: 'У них есть машина.',
          answer: 'Ei au o mașină',
          bank: ['are', 'un'],
          explain: '«Они имеют» — au. Артикль «o» при этом нужен: машина одна, но неопределённая.',
        },
      ],
    },
    {
      id: 'ch3_l2',
      title: 'Мой, моя, мои',
      subtitle: 'Главная ловушка: согласуемся с предметом, а не с владельцем',
      emoji: '👜',
      steps: [
        {
          kind: 'rule',
          title: 'Форма зависит от вещи, а не от тебя',
          body:
            'Тут работает та же логика, что и в русском: «мой дом», но «моя книга» — форма подстраивается под предмет. Отличие в том, что в румынском притяжательное стоит ПОСЛЕ существительного, и существительное при этом обязано быть с определённым артиклем.',
          examples: [
            { ro: 'casa mea', ru: 'мой дом', note: 'casă — ж.р. → «mea»' },
            { ro: 'câinele meu', ru: 'моя собака', note: 'câine — м.р. → «meu»' },
            { ro: 'cărțile mele', ru: 'мои книги' },
            { ro: 'prietenii mei', ru: 'мои друзья' },
          ],
          aha: 'Русский «моя собака» и румынский «câinele meu» расходятся в роде: смотри на румынское слово, не на русское.',
        },
        {
          kind: 'rule',
          title: 'Четыре формы на каждое лицо',
          body:
            'Каждое притяжательное имеет четыре варианта: м.р. ед.ч., ж.р. ед.ч., м.р. мн.ч., ж.р. мн.ч.',
          examples: [
            { ro: 'meu / mea / mei / mele', ru: 'мой' },
            { ro: 'tău / ta / tăi / tale', ru: 'твой' },
            { ro: 'nostru / noastră / noștri / noastre', ru: 'наш' },
            { ro: 'vostru / voastră / voștri / voastre', ru: 'ваш' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'mașina ___',
          ru: 'моя машина',
          options: ['meu', 'mea', 'mei', 'mele'],
          correct: 1,
          explain: 'mașină — женский род, единственное число → «mea».',
          forms: {
            mea: 'моя — ж.р.',
            meu: 'мой — м.р.',
            mei: 'мои — м.р., много',
            mele: 'мои — ж.р., много',
          },
        },
        {
          kind: 'choice',
          prompt: 'frații ___',
          ru: 'мои братья',
          options: ['meu', 'mea', 'mei', 'mele'],
          correct: 2,
          explain: 'frați — мужской род, множественное → «mei».',
          forms: {
            mei: 'мои — м.р., много',
            meu: 'мой — м.р.',
            mea: 'моя — ж.р.',
            mele: 'мои — ж.р., много',
          },
        },
        {
          kind: 'choice',
          prompt: 'casa ___',
          ru: 'твой дом',
          options: ['tău', 'ta', 'tăi', 'tale'],
          correct: 1,
          explain:
            'Форма притяжательного зависит от предмета, а не от владельца: «casă» женского рода — значит «ta».',
          forms: {
            ta: 'твоя — ж.р.',
            'tău': 'твой — м.р.',
            'tăi': 'твои — м.р., много',
            tale: 'твои — ж.р., много',
          },
        },
        {
          kind: 'spot',
          tokens: ['Casă', 'mea', 'este', 'mare'],
          wrongIndex: 0,
          fix: 'Casa',
          ru: 'Мой дом большой.',
          explain: 'Перед притяжательным существительное обязано быть с артиклем: «casa mea».',
        },
        {
          kind: 'rule',
          title: 'Его и её — просто lui и ei',
          body:
            'А вот здесь румынский внезапно проще русского. «Его» — всегда «lui», «её» — всегда «ei», и они не меняются ни по роду, ни по числу предмета. Ставятся так же, после слова с артиклем.',
          examples: [
            { ro: 'mașina lui', ru: 'его машина' },
            { ro: 'mașina ei', ru: 'её машина' },
            { ro: 'prietenii lui', ru: 'его друзья' },
            { ro: 'casa lor', ru: 'их дом', note: '«их» — всегда «lor»' },
          ],
          aha: 'lui / ei / lor не изменяются вообще. Три слова — и тема закрыта.',
        },
        {
          kind: 'match',
          title: 'Чьё это',
          pairs: [
            { ro: 'casa mea', ru: 'мой дом' },
            { ro: 'casa ta', ru: 'твой дом' },
            { ro: 'casa lui', ru: 'его дом' },
            { ro: 'casa lor', ru: 'их дом' },
          ],
        },
        {
          kind: 'build',
          ru: 'Мои друзья дома.',
          answer: 'Prietenii mei sunt acasă',
          bank: ['mele', 'prieteni'],
          explain:
            'Друзья — мужской род во множественном, значит «mei». И существительное перед притяжательным берёт артикль: prietenii.',
        },
        {
          kind: 'type',
          ru: 'её книга',
          answer: 'cartea ei',
          explain:
            '«Её» — всегда «ei», оно не меняется ни по роду, ни по числу предмета. А «carte» перед ним встаёт в определённую форму: cartea.',
        },
        {
          kind: 'transform',
          instruction: 'Замени «мой» на «наш»',
          from: 'casa mea',
          answer: 'casa noastră',
          ru: 'мой дом → наш дом',
          explain: 'Предмет тот же, значит и род тот же: женскому «casa» соответствует «noastră».',
        },
        {
          kind: 'listen',
          ro: 'Prietenii mei sunt aici',
          options: ['Prietenii mei sunt aici', 'Prietena mea este aici', 'Casa mea este aici'],
          correct: 0,
          ru: 'Мои друзья здесь.',
          explain:
            '«Prietenii mei» — множественное: друзья. «Prietena mea» это подруга, одна, и глагол там был бы «este».',
        },
      ],
    },
    {
      id: 'ch3_l3',
      title: 'Какой именно',
      subtitle: 'Прилагательное встаёт после слова и подстраивается под него',
      emoji: '🎨',
      steps: [
        {
          kind: 'rule',
          title: 'Сначала предмет, потом описание',
          body:
            'В русском прилагательное почти всегда впереди: «красивый дом». В румынском наоборот — по умолчанию оно идёт ПОСЛЕ существительного. Перестроиться на это придётся сознательно: рука сама тянется поставить его вперёд.',
          vocabulary: [
            { ro: 'câini', ru: 'собаки' },
          ],
          examples: [
            { ro: 'o casă mare', ru: 'большой дом' },
            { ro: 'un băiat frumos', ru: 'красивый мальчик' },
            { ro: 'o zi bună', ru: 'хороший день' },
          ],
          aha: 'Правило-мнемоника: сначала называешь вещь, потом рассказываешь про неё.',
        },
        {
          kind: 'rule',
          title: 'Четыре формы прилагательного',
          body:
            'Прилагательное согласуется с существительным в роде и числе — как и в русском. У большинства прилагательных четыре формы, но есть и такие, у которых их всего две.',
          examples: [
            { ro: 'bun / bună / buni / bune', ru: 'хороший', note: 'четыре формы' },
            { ro: 'frumos / frumoasă / frumoși / frumoase', ru: 'красивый' },
            { ro: 'mare / mare / mari / mari', ru: 'большой', note: 'всего две — проще' },
            { ro: 'verde / verde / verzi / verzi', ru: 'зелёный' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'o fată ___',
          ru: 'красивая девочка',
          options: ['frumos', 'frumoasă', 'frumoși', 'frumoase'],
          correct: 1,
          explain:
            'Прилагательное согласуется с существительным: «fată» женского рода в единственном — значит «frumoasă». И заметь, что «o» внутри слова превратилось в «oa».',
          forms: {
            'frumoasă': 'ж.р., одна',
            frumos: 'м.р., один',
            'frumoși': 'м.р., много',
            frumoase: 'ж.р., много',
          },
        },
        {
          kind: 'choice',
          prompt: 'niște case ___',
          ru: 'красивые дома',
          options: ['frumos', 'frumoasă', 'frumoși', 'frumoase'],
          correct: 3,
          explain: 'case — женский род множественного числа → «frumoase».',
          forms: {
            frumoase: 'ж.р., много',
            frumos: 'м.р., один',
            'frumoasă': 'ж.р., одна',
            'frumoși': 'м.р., много',
          },
        },
        {
          kind: 'choice',
          prompt: 'doi băieți ___',
          ru: 'два хороших мальчика',
          options: ['bun', 'bună', 'buni', 'bune'],
          correct: 2,
          explain: 'Мужской род во множественном — «buni», с окончанием «-i».',
          forms: {
            buni: 'м.р., много',
            bun: 'м.р., один',
            'bună': 'ж.р., одна',
            bune: 'ж.р., много',
          },
        },
        {
          kind: 'spot',
          tokens: ['O', 'frumoasă', 'casă'],
          wrongIndex: 1,
          fix: '(после слова)',
          ru: 'красивый дом',
          explain: 'Порядок перепутан. Правильно: «o casă frumoasă».',
        },
        {
          kind: 'rule',
          title: 'Когда прилагательное всё-таки впереди',
          body:
            'Небольшая группа частых прилагательных может стоять и перед существительным — тогда фраза звучит эмоциональнее или книжнее. Это не ошибка, но и не то, что нужно осваивать в первую очередь.',
          examples: [
            { ro: 'o casă mare', ru: 'большой дом', note: 'нейтрально' },
            { ro: 'o mare casă', ru: 'великий дом', note: 'иной оттенок, редко' },
            { ro: 'un bun prieten', ru: 'хороший друг', note: 'устойчиво, звучит тепло' },
          ],
        },
        {
          kind: 'build',
          ru: 'У меня есть маленькая красная машина.',
          answer: 'Am o mașină mică roșie',
          bank: ['mic', 'roșu'],
          explain: 'Оба прилагательных — после слова и оба в женском роде, под «mașină».',
        },
        {
          kind: 'match',
          title: 'Согласование',
          pairs: [
            { ro: 'un câine mic', ru: 'маленькая собака' },
            { ro: 'o casă mică', ru: 'маленький дом' },
            { ro: 'doi câini mici', ru: 'две маленькие собаки' },
            { ro: 'două case mici', ru: 'два маленьких дома' },
          ],
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число',
          from: 'un băiat bun',
          answer: 'doi băieți buni',
          alt: ['băieți buni', 'niște băieți buni'],
          ru: 'хороший мальчик → хорошие мальчики',
          explain:
            'Во множественное уходит всё сразу: артикль (un → doi), существительное (băiat → băieți) и прилагательное (bun → buni).',
        },
        {
          kind: 'type',
          ru: 'большой город',
          answer: 'un oraș mare',
          alt: ['oraș mare'],
          explain:
            '«mare» — прилагательное на «-e»: у него всего две формы, и род оно не различает. И стоит оно после существительного.',
        },
        {
          kind: 'listen',
          ro: 'Am o casă mică',
          options: ['Am o casă mică', 'Am o casă mare', 'Am un câine mic'],
          correct: 0,
          ru: 'У меня маленький дом.',
          explain:
            '«mică» — маленькая. «Mare» это наоборот, большая, а «un câine mic» — маленький пёс, другое существительное.',
        },
      ],
    },
    {
      id: 'ch3_l4',
      title: 'Больше и лучше',
      subtitle: 'Сравнение: mai, cel mai, ca',
      emoji: '📈',
      steps: [
        {
          kind: 'rule',
          title: 'Одно слово «mai» вместо суффикса',
          body:
            'В русском мы меняем само слово: «большой → больше». В румынском слово не трогают — перед ним просто ставят «mai». Это работает вообще со всеми прилагательными, без исключений.',
          examples: [
            { ro: 'mare → mai mare', ru: 'большой → больше' },
            { ro: 'bun → mai bun', ru: 'хороший → лучше' },
            { ro: 'frumos → mai frumos', ru: 'красивый → красивее' },
          ],
          aha: 'Никаких «-ее» и «-ше». Одно «mai» — и любое прилагательное стало сравнительным.',
        },
        {
          kind: 'rule',
          title: 'Чем — это «decât» или «ca»',
          body:
            'Для сравнения двух вещей нужно слово «чем». Их два: «decât» — строгое и книжное, «ca» — разговорное. Оба ходовые.',
          examples: [
            { ro: 'Casa mea e mai mare decât casa ta.', ru: 'Мой дом больше, чем твой.' },
            { ro: 'El e mai înalt ca mine.', ru: 'Он выше меня.' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Ana e ___ înaltă decât Maria.',
          ru: 'Ана выше, чем Мария.',
          options: ['mai', 'cel mai', 'ca', 'foarte'],
          correct: 0,
          explain:
            'Само прилагательное при сравнении не меняется — перед ним ставится «mai». Русский суффикс «-ее» здесь становится отдельным словом.',
          forms: {
            mai: 'более',
            'cel mai': 'самый',
            ca: 'чем — разговорный вариант',
            foarte: 'очень — это не сравнение',
          },
        },
        {
          kind: 'rule',
          title: 'Самый — «cel mai»',
          body:
            'Превосходная степень строится добавлением «cel» перед «mai». Слово «cel» меняется по роду и числу: cel / cea / cei / cele.',
          examples: [
            { ro: 'cel mai bun', ru: 'самый лучший (м.р.)' },
            { ro: 'cea mai bună', ru: 'самая лучшая (ж.р.)' },
            { ro: 'cei mai buni', ru: 'самые лучшие (м.р. мн.)' },
            { ro: 'cele mai bune', ru: 'самые лучшие (ж.р. мн.)' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Ea este ___ mai bună.',
          ru: 'Она самая лучшая.',
          options: ['cel', 'cea', 'cei', 'cele'],
          correct: 1,
          explain: 'Слово «cel» меняется по роду и числу: женский род единственного — «cea».',
          forms: {
            cea: 'самая — ж.р., одна',
            cel: 'самый — м.р., один',
            cei: 'самые — м.р.',
            cele: 'самые — ж.р.',
          },
        },
        {
          kind: 'build',
          ru: 'Это самый большой город.',
          answer: 'Acesta este cel mai mare oraș',
          bank: ['cea', 'foarte'],
          explain:
            '«Город» мужского рода — значит «cel». И при превосходной степени прилагательное переезжает вперёд существительного.',
        },
        {
          kind: 'rule',
          title: 'Очень — это «foarte»',
          body:
            'Не путай «mai» (больше, сравнение) и «foarte» (очень, просто усиление). Ошибка частая, а смысл меняется полностью.',
          examples: [
            { ro: 'Casa e mare.', ru: 'Дом большой.' },
            { ro: 'Casa e foarte mare.', ru: 'Дом очень большой.' },
            { ro: 'Casa e mai mare.', ru: 'Дом больше.' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Cafeaua e ___ bună!',
          ru: 'Кофе очень вкусный!',
          options: ['mai', 'foarte', 'cel mai', 'ca'],
          correct: 1,
          explain:
            '«Очень» и «более» — разные слова. «Mai bună» значило бы «получше», а тут просто усиление: foarte.',
          forms: {
            foarte: 'очень — усиление',
            mai: 'более — сравнение',
            'cel mai': 'самый',
            ca: 'чем',
          },
        },
        {
          kind: 'match',
          title: 'Три степени',
          pairs: [
            { ro: 'bun', ru: 'хороший' },
            { ro: 'mai bun', ru: 'лучше' },
            { ro: 'cel mai bun', ru: 'самый лучший' },
            { ro: 'foarte bun', ru: 'очень хороший' },
          ],
        },
        {
          kind: 'type',
          ru: 'Мой дом больше.',
          answer: 'Casa mea e mai mare',
          alt: ['Casa mea este mai mare'],
          explain: '«Больше» разбирается на два слова: mai + mare. Само прилагательное не трогаем.',
        },
        {
          kind: 'spot',
          tokens: ['Ea', 'este', 'mai', 'bună', 'că', 'mine'],
          wrongIndex: 4,
          fix: 'ca',
          ru: 'Она лучше меня.',
          explain: '«că» — это союз «что». «Чем» в сравнении — «ca» или «decât».',
        },
        {
          kind: 'listen',
          ro: 'Este cel mai bun prieten',
          options: ['Este cel mai bun prieten', 'Este un prieten bun', 'Este mai bun'],
          correct: 0,
          ru: 'Это самый лучший друг.',
          explain:
            '«cel mai» — превосходная степень, самый лучший. Без «cel» вышло бы «получше», а без «mai» — просто «хороший».',
        },
      ],
    },
    {
      id: 'ch3_boss',
      title: 'Босс: Про себя',
      subtitle: 'Расскажи о семье, вещах и о том, какие они',
      emoji: '🏆',
      boss: true,
      steps: [
        {
          kind: 'rule',
          title: 'Что проверяем',
          body:
            'Вся третья глава: «у меня есть» — это «я имею» (am, ai, are), притяжательное согласуется с предметом, а не с владельцем, прилагательное идёт после существительного, сравнение строится словом «mai».',
          vocabulary: [
            { ro: 'cealaltă', ru: 'другая, вторая' },
          ],
          aha: 'Ошибка тут ничего не стоит: задание просто вернётся в конец очереди, пока не разберёшься.',
        },
        {
          kind: 'build',
          ru: 'Моя сестра красивая.',
          answer: 'Sora mea este frumoasă',
          bank: ['meu', 'frumos'],
          explain:
            'Три вещи разом: артикль на существительном (sora), притяжательное после него (mea) и прилагательное в женском роде (frumoasă).',
        },
        {
          kind: 'choice',
          prompt: 'câinele ___',
          ru: 'моя собака',
          options: ['mea', 'meu', 'mei', 'mele'],
          correct: 1,
          explain: 'В румынском câine — мужского рода, русский род тут не помощник.',
          forms: {
            meu: 'мой — м.р.',
            mea: 'моя — ж.р.',
            mei: 'мои — м.р., много',
            mele: 'мои — ж.р., много',
          },
        },
        {
          kind: 'spot',
          tokens: ['Eu', 'sunt', 'treizeci', 'de', 'ani'],
          wrongIndex: 1,
          fix: 'am',
          ru: 'Мне тридцать лет.',
          explain: 'Возраст «имеют», а не «есть»: не «sunt treizeci de ani», а «am treizeci de ani».',
        },
        {
          kind: 'type',
          ru: 'У нас большой дом.',
          answer: 'Avem o casă mare',
          alt: ['Noi avem o casă mare'],
          explain: '«Мы имеем» — avem. Не «am»: это форма только для «я».',
        },
        {
          kind: 'choice',
          prompt: 'Ele sunt ___ mai bune.',
          ru: 'Они самые лучшие.',
          options: ['cel', 'cea', 'cei', 'cele'],
          correct: 3,
          explain: 'Множественное число женского рода — «cele». Мужской род дал бы «cei».',
          forms: {
            cele: 'самые — ж.р., много',
            cel: 'самый — м.р., один',
            cea: 'самая — ж.р., одна',
            cei: 'самые — м.р., много',
          },
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число',
          from: 'prietenul meu bun',
          answer: 'prietenii mei buni',
          ru: 'мой хороший друг → мои хорошие друзья',
          explain: 'Во множественное уходит всё сразу: и слово, и артикль, и «мой», и прилагательное.',
        },
        {
          kind: 'match',
          title: 'Финальная проверка',
          pairs: [
            { ro: 'casa lui', ru: 'его дом' },
            { ro: 'casa ei', ru: 'её дом' },
            { ro: 'casa noastră', ru: 'наш дом' },
            { ro: 'casa lor', ru: 'их дом' },
          ],
        },
        {
          kind: 'build',
          ru: 'У неё нет машины.',
          answer: 'Ea nu are mașină',
          bank: ['este', 'o'],
          explain: '«nu» перед глаголом. Артикль при отрицании пропадает: «nu are mașină», а не «o mașină».',
        },
        {
          kind: 'listen',
          ro: 'Sora mea are douăzeci de ani',
          options: [
            'Sora mea are douăzeci de ani',
            'Fratele meu are doi ani',
            'Sora mea este acasă',
          ],
          correct: 0,
          ru: 'Моей сестре двадцать лет.',
          explain:
            '«are» — третье лицо: у неё. И «de» между числом и «ani» слышно отчётливо — без него было бы «doi ani», два года.',
        },
        {
          kind: 'choice',
          prompt: 'Cafeaua asta e ___ bună decât cealaltă.',
          ru: 'Этот кофе лучше, чем тот.',
          options: ['foarte', 'mai', 'cea mai', 'ca'],
          correct: 1,
          explain:
            'Есть «decât» — значит идёт сравнение, а сравнение делает «mai». «Foarte» с «decât» не сочетается вовсе.',
          forms: {
            mai: 'более — сравнение',
            foarte: 'очень — усиление, с «decât» не бывает',
            'cea mai': 'самая',
            ca: 'чем — но тогда без «decât»',
          },
        },
        {
          kind: 'type',
          ru: 'Сколько тебе лет?',
          answer: 'Câți ani ai',
          alt: ['Câți ani ai?'],
          explain:
            'Та же конструкция, что в начале главы: возраст «имеют». «Câți» согласуется с «ani» — мужской род множественного.',
        },
        {
          kind: 'build',
          ru: 'Их дети очень хорошие.',
          answer: 'Copiii lor sunt foarte buni',
          bank: ['mai', 'lui'],
          explain: '«Их» — «lor», оно не меняется. «foarte» усиливает, а прилагательное согласуется с детьми: buni.',
        },
      ],
    },
  ],
};
