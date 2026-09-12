import { CourseChapter } from './types';

// ГЛАВА 7. То, что превращает «правильные фразы» в живую речь:
// местоимения-клитики, «pe» перед одушевлённым дополнением, конъюнктив
// вместо инфинитива и вежливые формы. Здесь же — финальный босс курса.

export const CHAPTER_7: CourseChapter = {
  id: 'ch7',
  title: 'Живая речь',
  subtitle: 'Последний рывок: говорить как местные, а не как учебник',
  emoji: '💬',
  level: 'A2',
  color: '#8B5CF6',
  lessons: [
    {
      id: 'ch7_l1',
      title: 'Хочу пойти',
      subtitle: 'Конъюнктив «să» вместо инфинитива',
      emoji: '🔑',
      steps: [
        {
          kind: 'rule',
          title: 'Румын не говорит «хочу пойти»',
          body:
            'Вот, пожалуй, главное структурное отличие румынского от русского и от большинства европейских языков. Там, где мы ставим инфинитив («хочу пойти», «могу помочь»), румынский ставит «să» и спрягает ВТОРОЙ глагол тоже. Дословно получается «хочу, чтобы я пошёл».',
          examples: [
            { ro: 'Vreau să merg.', ru: 'Я хочу пойти.', note: 'дословно: «хочу чтобы я пошёл»' },
            { ro: 'Vrei să mergi.', ru: 'Ты хочешь пойти.', note: 'оба глагола под «ты»' },
            { ro: 'Pot să te ajut.', ru: 'Я могу тебе помочь.' },
          ],
          aha: 'Оба глагола в одном лице. «Vreau să mergi» — это уже «я хочу, чтобы ТЫ пошёл».',
        },
        {
          kind: 'choice',
          prompt: 'Vreau să ___ acasă.',
          ru: 'Я хочу пойти домой.',
          options: ['merg', 'mergi', 'meargă', 'mergem'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: 'Vreau să ___ acasă.',
          ru: 'Я хочу, чтобы ты пошёл домой.',
          options: ['merg', 'mergi', 'meargă', 'mergem'],
          correct: 1,
          explain: 'Первый глагол под «я», второй — под «ты». Так и получается «чтобы ты».',
        },
        {
          kind: 'rule',
          title: 'Меняется только третье лицо',
          body:
            'После «să» формы совпадают с настоящим временем — кроме «он / она / они». Там появляется особая форма, и её приходится запоминать.',
          examples: [
            { ro: 'el merge → să meargă', ru: 'он идёт → чтобы он пошёл' },
            { ro: 'el face → să facă', ru: 'он делает → чтобы он сделал' },
            { ro: 'el citește → să citească', ru: 'он читает → чтобы он прочитал' },
            { ro: 'el vine → să vină', ru: 'он приходит → чтобы он пришёл' },
            { ro: 'el este → să fie', ru: 'он есть → чтобы он был' },
            { ro: 'el are → să aibă', ru: 'у него есть → чтобы у него было' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Vrea să ___ mâine.',
          ru: 'Он хочет прийти завтра.',
          options: ['vine', 'vină', 'vin', 'venit'],
          correct: 1,
        },
        {
          kind: 'match',
          title: 'Третье лицо после «să»',
          pairs: [
            { ro: 'să fie', ru: 'чтобы он был' },
            { ro: 'să aibă', ru: 'чтобы у него было' },
            { ro: 'să facă', ru: 'чтобы он сделал' },
            { ro: 'să meargă', ru: 'чтобы он пошёл' },
          ],
        },
        {
          kind: 'rule',
          title: 'Где ещё нужен «să»',
          body:
            'Эта конструкция работает после «хочу», «могу», «должен», «надо», а также в вежливых просьбах. То есть — почти в каждом втором разговорном предложении.',
          examples: [
            { ro: 'Trebuie să plec.', ru: 'Мне нужно уходить.' },
            { ro: 'Poți să mă ajuți?', ru: 'Можешь мне помочь?' },
            { ro: 'Vreau să mănânc.', ru: 'Я хочу есть.' },
          ],
        },
        {
          kind: 'rule',
          title: '«trebuie» не спрягается',
          body:
            'Отдельный подарок: глагол «надо» имеет одну-единственную форму «trebuie» для всех лиц. Кто именно должен — показывает второй глагол.',
          examples: [
            { ro: 'Trebuie să merg.', ru: 'Мне надо идти.' },
            { ro: 'Trebuie să mergi.', ru: 'Тебе надо идти.' },
            { ro: 'Trebuie să meargă.', ru: 'Ему надо идти.' },
          ],
        },
        {
          kind: 'build',
          ru: 'Мне нужно идти на работу.',
          answer: 'Trebuie să merg la muncă',
          bank: ['trebuiesc', 'mergi'],
        },
        {
          kind: 'spot',
          tokens: ['Vreau', 'să', 'merge', 'acasă'],
          wrongIndex: 2,
          fix: 'merg',
          ru: 'Я хочу пойти домой.',
        },
        {
          kind: 'type',
          ru: 'Можешь мне помочь?',
          answer: 'Poți să mă ajuți',
          alt: ['Poți să mă ajuți?', 'Puteți să mă ajutați'],
        },
        {
          kind: 'listen',
          ro: 'Trebuie să plec acum',
          options: ['Trebuie să plec acum', 'Vreau să vin acum', 'Pot să plec mâine'],
          correct: 0,
          ru: 'Мне надо уходить сейчас.',
        },
      ],
    },
    {
      id: 'ch7_l2',
      title: 'Меня, тебя, его',
      subtitle: 'Короткие местоимения, которые лезут вперёд глагола',
      emoji: '🎯',
      steps: [
        {
          kind: 'rule',
          title: 'Местоимение встаёт ПЕРЕД глаголом',
          body:
            'В русском мы говорим «я вижу его» — местоимение после глагола. В румынском короткое местоимение обязано стоять перед глаголом: «îl văd». Порядок слов другой, и к нему надо привыкнуть.',
          examples: [
            { ro: 'mă, te, îl, o, ne, vă, îi, le', ru: 'кого? (винительный)' },
            { ro: 'Mă vezi?', ru: 'Ты меня видишь?' },
            { ro: 'Îl văd.', ru: 'Я его вижу.' },
            { ro: 'O văd.', ru: 'Я её вижу.' },
          ],
          aha: 'Сначала «кого», потом «делаю». Задом наперёд относительно русского.',
        },
        {
          kind: 'choice',
          prompt: '___ văd pe Ion.',
          ru: 'Я вижу Иона.',
          options: ['Îl', 'O', 'Mă', 'Le'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: '___ ajut, nu-ți face griji.',
          ru: 'Я тебе помогу, не волнуйся.',
          options: ['Mă', 'Te', 'Îl', 'Ne'],
          correct: 1,
        },
        {
          kind: 'rule',
          title: 'Кому? — другой набор',
          body:
            'Для дательного падежа («кому») набор свой: îmi, îți, îi, ne, vă, le. Они тоже встают перед глаголом.',
          examples: [
            { ro: 'Îmi place.', ru: 'Мне нравится.' },
            { ro: 'Îți place?', ru: 'Тебе нравится?' },
            { ro: 'Îi spun.', ru: 'Я ему / ей говорю.' },
            { ro: 'Ne place.', ru: 'Нам нравится.' },
          ],
        },
        {
          kind: 'rule',
          title: '«Мне нравится» устроено как в русском',
          body:
            'Приятное совпадение: конструкция «îmi place» работает ровно как русское «мне нравится» — тот, кому нравится, стоит в дательном, а то, что нравится, — подлежащее. Значит, во множественном числе глагол меняется.',
          examples: [
            { ro: 'Îmi place cafeaua.', ru: 'Мне нравится кофе.' },
            { ro: 'Îmi plac cărțile.', ru: 'Мне нравятся книги.', note: 'мн.ч. → «plac»' },
            { ro: 'Nu-mi place.', ru: 'Мне не нравится.', note: 'в отрицании слипается через дефис' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Îmi ___ cărțile.',
          ru: 'Мне нравятся книги.',
          options: ['place', 'plac', 'placi', 'plăcem'],
          correct: 1,
        },
        {
          kind: 'match',
          title: 'Кому',
          pairs: [
            { ro: 'îmi', ru: 'мне' },
            { ro: 'îți', ru: 'тебе' },
            { ro: 'îi', ru: 'ему / ей' },
            { ro: 'ne', ru: 'нам' },
          ],
        },
        {
          kind: 'build',
          ru: 'Мне нравится этот город.',
          answer: 'Îmi place orașul ăsta',
          bank: ['plac', 'oraș'],
        },
        {
          kind: 'rule',
          title: 'В прошедшем времени — перед «am»',
          body:
            'Местоимение остаётся впереди всей конструкции, то есть встаёт даже перед вспомогательным глаголом.',
          examples: [
            { ro: 'L-am văzut.', ru: 'Я его видел.', note: '«îl» сократилось до «l-»' },
            { ro: 'Mi-a spus.', ru: 'Он мне сказал.' },
            { ro: 'Ne-a ajutat.', ru: 'Он нам помог.' },
          ],
        },
        {
          kind: 'type',
          ru: 'Мне нравится.',
          answer: 'Îmi place',
        },
        {
          kind: 'spot',
          tokens: ['Văd', 'îl', 'pe', 'Ion'],
          wrongIndex: 0,
          fix: '(поменять местами)',
          ru: 'Я вижу Иона.',
          explain: 'Местоимение идёт первым: «Îl văd pe Ion».',
        },
        {
          kind: 'listen',
          ro: 'Îmi place foarte mult',
          options: ['Îmi place foarte mult', 'Îți place mult?', 'Nu-mi place'],
          correct: 0,
          ru: 'Мне очень нравится.',
        },
      ],
    },
    {
      id: 'ch7_l3',
      title: 'Загадочное «pe»',
      subtitle: 'Предлог перед людьми — и удвоение местоимения',
      emoji: '🧿',
      steps: [
        {
          kind: 'rule',
          title: 'Людей отмечают предлогом',
          body:
            'Странность, аналогов которой в русском нет: если прямое дополнение — человек (или конкретное живое существо), перед ним ставится предлог «pe». Для предметов ничего не ставят.',
          examples: [
            { ro: 'Văd o casă.', ru: 'Вижу дом.', note: 'предмет — без «pe»' },
            { ro: 'Îl văd pe Ion.', ru: 'Вижу Иона.', note: 'человек — с «pe»' },
            { ro: 'O aștept pe Maria.', ru: 'Жду Марию.' },
          ],
          aha: '«pe» — как знак «внимание, это человек». Похоже на наш одушевлённый винительный: «вижу стол», но «вижу брата».',
        },
        {
          kind: 'rule',
          title: 'И местоимение приходится удваивать',
          body:
            'Самое непривычное: при конструкции с «pe» местоимение всё равно ставится перед глаголом, хотя имя уже названо. Получается «его вижу Иона» — избыточно с точки зрения русского, но обязательно.',
          examples: [
            { ro: 'Îl văd pe Ion.', ru: 'Я вижу Иона.', note: 'дословно: «его вижу Иона»' },
            { ro: 'O cunosc pe Ana.', ru: 'Я знаю Ану.' },
            { ro: 'Îi văd pe copii.', ru: 'Я вижу детей.' },
          ],
        },
        {
          kind: 'choice',
          prompt: 'Văd ___ .',
          ru: 'Вижу дом.',
          options: ['o casă', 'pe o casă', 'pe casă', 'îl casa'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: 'O aștept ___ Maria.',
          ru: 'Я жду Марию.',
          options: ['pe', 'la', 'în', 'cu'],
          correct: 0,
        },
        {
          kind: 'choice',
          prompt: '___ cunosc pe Ana.',
          ru: 'Я знаю Ану.',
          options: ['Îl', 'O', 'Îi', 'Le'],
          correct: 1,
          explain: 'Ana — женского рода, единственное число → «o».',
        },
        {
          kind: 'rule',
          title: 'Как выбрать местоимение',
          body: 'Оно подстраивается под род и число того, о ком речь.',
          examples: [
            { ro: 'îl — pe Ion', ru: 'его (м.р. ед.)' },
            { ro: 'o — pe Maria', ru: 'её (ж.р. ед.)' },
            { ro: 'îi — pe copii', ru: 'их (м.р. мн.)' },
            { ro: 'le — pe fete', ru: 'их (ж.р. мн.)' },
          ],
        },
        {
          kind: 'build',
          ru: 'Я вижу детей.',
          answer: 'Îi văd pe copii',
          bank: ['îl', 'copiii'],
        },
        {
          kind: 'spot',
          tokens: ['Văd', 'pe', 'Ion'],
          wrongIndex: 0,
          fix: 'Îl văd',
          ru: 'Я вижу Иона.',
          explain: 'С «pe» местоимение обязательно, даже если имя уже названо.',
        },
        {
          kind: 'rule',
          title: '«pe» ещё и вопросительное',
          body:
            'Вопрос «кого?» тоже требует «pe»: «pe cine». А в вопросе «который из» — «pe care».',
          examples: [
            { ro: 'Pe cine aștepți?', ru: 'Кого ты ждёшь?' },
            { ro: 'Pe care îl vrei?', ru: 'Который из них ты хочешь?' },
          ],
        },
        {
          kind: 'type',
          ru: 'Кого ты ждёшь?',
          answer: 'Pe cine aștepți',
          alt: ['Pe cine aștepți?'],
        },
        {
          kind: 'listen',
          ro: 'O aștept pe sora mea',
          options: ['O aștept pe sora mea', 'Îl aștept pe fratele meu', 'Aștept un taxi'],
          correct: 0,
          ru: 'Я жду свою сестру.',
        },
        {
          kind: 'choice',
          prompt: 'Aștept ___ .',
          ru: 'Жду автобус.',
          options: ['autobuzul', 'pe autobuz', 'îl autobuz', 'pe autobuzul'],
          correct: 0,
          explain: 'Автобус — не человек, значит никакого «pe».',
        },
      ],
    },
    {
      id: 'ch7_l4',
      title: 'Вежливо и мягко',
      subtitle: 'Обращение на «вы» и условное «я бы хотел»',
      emoji: '🎩',
      steps: [
        {
          kind: 'rule',
          title: 'Три уровня вежливости',
          body:
            'В румынском «вы» устроено сложнее русского: кроме обычного «voi» (вы, несколько человек) есть отдельное вежливое обращение к одному человеку — «dumneavoastră». Глагол при нём стоит во множественном числе.',
          examples: [
            { ro: 'Ce faci?', ru: 'Что делаешь?', note: 'на «ты»' },
            { ro: 'Ce faceți?', ru: 'Что делаете?', note: 'на «вы»' },
            { ro: 'Cum vă numiți?', ru: 'Как вас зовут?', note: 'вежливо' },
            { ro: 'Vă rog', ru: 'Пожалуйста (прошу вас)' },
          ],
          aha: '«dumneavoastră» длинное и часто сокращается на письме до «dvs.».',
        },
        {
          kind: 'choice',
          prompt: 'Cum ___ numiți?',
          ru: 'Как вас зовут?',
          options: ['te', 'vă', 'mă', 'se'],
          correct: 1,
        },
        {
          kind: 'rule',
          title: 'Условное наклонение: aș, ai, ar',
          body:
            'Русскому «бы» соответствует отдельный вспомогательный глагол плюс инфинитив без «a». Это самый простой способ звучать вежливо, а не требовательно.',
          examples: [
            { ro: 'aș / ai / ar / am / ați / ar', ru: 'полный набор' },
            { ro: 'Aș vrea o cafea.', ru: 'Я бы хотел кофе.' },
            { ro: 'Ai putea să mă ajuți?', ru: 'Ты бы не мог мне помочь?' },
            { ro: 'Ar fi bine.', ru: 'Было бы хорошо.' },
          ],
        },
        {
          kind: 'choice',
          prompt: '___ vrea o cafea, vă rog.',
          ru: 'Я бы хотел кофе, пожалуйста.',
          options: ['Aș', 'Ai', 'Ar', 'Am'],
          correct: 0,
        },
        {
          kind: 'rule',
          title: '«Vreau» и «aș vrea» — разница ощутимая',
          body:
            'В кафе и магазине разница между ними примерно как между «дай кофе» и «мне бы кофе». Обе фразы поймут, но вторая звучит заметно приятнее.',
          examples: [
            { ro: 'Vreau o cafea.', ru: 'Хочу кофе.', note: 'нейтрально-прямо' },
            { ro: 'Aș vrea o cafea.', ru: 'Я бы хотел кофе.', note: 'вежливо' },
            { ro: 'Aș dori o cafea.', ru: 'Я бы желал кофе.', note: 'совсем формально' },
          ],
        },
        {
          kind: 'build',
          ru: 'Я бы хотел стакан воды, пожалуйста.',
          answer: 'Aș vrea un pahar de apă vă rog',
          bank: ['vreau', 'te'],
        },
        {
          kind: 'rule',
          title: 'Повелительное наклонение',
          body:
            'Просьбы и команды: для «ты» форма обычно совпадает с настоящим временем третьего лица, для «вы» — с формой «voi». Отрицательная команда на «ты» строится через инфинитив без «a».',
          examples: [
            { ro: 'Vino aici!', ru: 'Иди сюда!' },
            { ro: 'Veniți aici!', ru: 'Идите сюда!' },
            { ro: 'Nu vorbi!', ru: 'Не говори!', note: 'отрицание — через инфинитив' },
            { ro: 'Stai!', ru: 'Стой! / Погоди!' },
          ],
        },
        {
          kind: 'match',
          title: 'Вежливые формулы',
          pairs: [
            { ro: 'Vă rog', ru: 'Пожалуйста (прошу)' },
            { ro: 'Mulțumesc', ru: 'Спасибо' },
            { ro: 'Cu plăcere', ru: 'Пожалуйста (в ответ)' },
            { ro: 'Îmi pare rău', ru: 'Мне жаль, извините' },
          ],
        },
        {
          kind: 'type',
          ru: 'Я бы хотел кофе.',
          answer: 'Aș vrea o cafea',
        },
        {
          kind: 'choice',
          prompt: 'Ar ___ bine să mergem.',
          ru: 'Было бы хорошо пойти.',
          options: ['fi', 'este', 'fie', 'fost'],
          correct: 0,
          explain: 'После «ar» идёт инфинитив без «a»: «ar fi».',
        },
        {
          kind: 'listen',
          ro: 'Aș vrea un pahar de apă, vă rog',
          options: [
            'Aș vrea un pahar de apă, vă rog',
            'Vreau o cafea, te rog',
            'Îmi pare rău, nu pot',
          ],
          correct: 0,
          ru: 'Я бы хотел стакан воды, пожалуйста.',
        },
        {
          kind: 'spot',
          tokens: ['Aș', 'vreau', 'o', 'cafea'],
          wrongIndex: 1,
          fix: 'vrea',
          ru: 'Я бы хотел кофе.',
          explain: 'После «aș» идёт инфинитив без «a» — значит «vrea», а не «vreau».',
        },
      ],
    },
    {
      id: 'ch7_boss',
      title: 'ФИНАЛЬНЫЙ БОСС',
      subtitle: 'Весь курс в одном испытании',
      emoji: '👑',
      boss: true,
      steps: [
        {
          kind: 'rule',
          title: 'Что проверяем',
          body:
            'Вся седьмая глава: «să» плюс спрягаемый глагол вместо инфинитива, местоимения-клитики перед глаголом, «pe» перед одушевлённым дополнением с удвоением местоимения и условное наклонение для вежливости.',
          aha: 'Ошибка тут ничего не стоит: задание просто вернётся в конец очереди, пока не разберёшься.',
        },
        {
          kind: 'choice',
          prompt: 'Vreau să ___ acasă.',
          ru: 'Я хочу пойти домой.',
          options: ['merg', 'mergi', 'meargă', 'mers'],
          correct: 0,
        },
        {
          kind: 'build',
          ru: 'Я бы хотел кофе, пожалуйста.',
          answer: 'Aș vrea o cafea vă rog',
          bank: ['vreau', 'te'],
        },
        {
          kind: 'choice',
          prompt: '___ aștept pe Maria.',
          ru: 'Я жду Марию.',
          options: ['Îl', 'O', 'Îi', 'Le'],
          correct: 1,
        },
        {
          kind: 'spot',
          tokens: ['Merg', 'cu', 'mașină', 'la', 'muncă'],
          wrongIndex: 2,
          fix: 'mașina',
          ru: 'Я езжу на работу на машине.',
        },
        {
          kind: 'type',
          ru: 'Мне нужно уходить.',
          answer: 'Trebuie să plec',
        },
        {
          kind: 'choice',
          prompt: 'Ieri ___ la teatru cu prietenii mei.',
          ru: 'Вчера я ходил в театр с друзьями.',
          options: ['merg', 'am mers', 'o să merg', 'mers'],
          correct: 1,
        },
        {
          kind: 'transform',
          instruction: 'Поставь во множественное число вместе с артиклем',
          from: 'cartea mea bună',
          answer: 'cărțile mele bune',
          ru: 'моя хорошая книга → мои хорошие книги',
        },
        {
          kind: 'build',
          ru: 'Мне нравится этот город очень.',
          answer: 'Îmi place orașul ăsta foarte mult',
          bank: ['plac', 'oraș'],
        },
        {
          kind: 'choice',
          prompt: 'El o să ___ mâine.',
          ru: 'Он придёт завтра.',
          options: ['vine', 'vină', 'venit', 'vin'],
          correct: 1,
        },
        {
          kind: 'listen',
          ro: 'Îmi pare rău, nu pot să vin',
          options: [
            'Îmi pare rău, nu pot să vin',
            'Aș vrea să vin mâine',
            'Trebuie să plec acum',
          ],
          correct: 0,
          ru: 'Мне жаль, я не могу прийти.',
        },
        {
          kind: 'match',
          title: 'Последняя проверка',
          pairs: [
            { ro: 'Trebuie să plec.', ru: 'Мне надо идти.' },
            { ro: 'Aș vrea o cafea.', ru: 'Я бы хотел кофе.' },
            { ro: 'Îl văd pe Ion.', ru: 'Я вижу Иона.' },
            { ro: 'Nu-mi place.', ru: 'Мне не нравится.' },
          ],
        },
        {
          kind: 'type',
          ru: 'Можете мне помочь, пожалуйста?',
          answer: 'Puteți să mă ajutați vă rog',
          alt: [
            'Puteți să mă ajutați, vă rog?',
            'Poți să mă ajuți, te rog?',
            'Puteți să mă ajutați vă rog?',
          ],
        },
        {
          kind: 'build',
          ru: 'Вчера я был дома и читал книгу.',
          answer: 'Ieri am fost acasă și am citit o carte',
          bank: ['sunt', 'citesc'],
        },
        {
          kind: 'choice',
          prompt: 'Aștept ___ .',
          ru: 'Жду автобус.',
          options: ['autobuzul', 'pe autobuz', 'pe autobuzul', 'îl autobuz'],
          correct: 0,
        },
      ],
    },
  ],
};
