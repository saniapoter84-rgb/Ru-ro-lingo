// Сцены для режима погружения.
//
// Здесь румынский идёт сплошным потоком, без опоры на русский: перевод
// каждой реплики существует, но по умолчанию спрятан и достаётся тапом.
// Вопросы к сцене тоже на румынском — чтобы человек не переключался
// на родной язык вообще, пока не упрётся.

export interface DialogueLine {
  speaker: string;
  ro: string;
  ru: string;
}

export interface DialogueQuestion {
  ro: string;
  /** Перевод вопроса — открывается только по запросу. */
  ru: string;
  options: string[];
  correct: number;
}

export interface Dialogue {
  id: string;
  /** Название сцены по-румынски — его и видно в режиме погружения. */
  title: string;
  titleRu: string;
  emoji: string;
  level: 'A0' | 'A1' | 'A2';
  /** Одна строка контекста: где это происходит и кто с кем говорит. */
  setting: string;
  lines: DialogueLine[];
  questions: DialogueQuestion[];
  /** Выражения, которые стоит унести из сцены целиком. */
  phrases: { ro: string; ru: string }[];
}

export const DIALOGUES: Dialogue[] = [
  {
    id: 'cafenea',
    title: 'La cafenea',
    titleRu: 'В кафе',
    emoji: '☕',
    level: 'A0',
    setting: 'Утро, маленькое кафе в центре. Ты заказываешь завтрак.',
    lines: [
      { speaker: 'Chelner', ro: 'Bună dimineața! Ce doriți?', ru: 'Доброе утро! Что желаете?' },
      { speaker: 'Tu', ro: 'Bună! Aș vrea o cafea, vă rog.', ru: 'Здравствуйте! Я бы хотел кофе, пожалуйста.' },
      { speaker: 'Chelner', ro: 'Cu lapte sau fără?', ru: 'С молоком или без?' },
      { speaker: 'Tu', ro: 'Cu lapte, vă rog. Și un croissant.', ru: 'С молоком, пожалуйста. И круассан.' },
      { speaker: 'Chelner', ro: 'Altceva?', ru: 'Что-нибудь ещё?' },
      { speaker: 'Tu', ro: 'Nu, mulțumesc. Cât costă?', ru: 'Нет, спасибо. Сколько стоит?' },
      { speaker: 'Chelner', ro: 'Cincisprezece lei.', ru: 'Пятнадцать леев.' },
      { speaker: 'Tu', ro: 'Poftiți. Mulțumesc!', ru: 'Вот, пожалуйста. Спасибо!' },
      { speaker: 'Chelner', ro: 'Cu plăcere! O zi bună!', ru: 'Пожалуйста! Хорошего дня!' },
    ],
    questions: [
      {
        ro: 'Ce a comandat clientul?',
        ru: 'Что заказал клиент?',
        options: ['O cafea cu lapte', 'Un ceai', 'O bere', 'Apă minerală'],
        correct: 0,
      },
      {
        ro: 'Cât costă totul?',
        ru: 'Сколько всё стоит?',
        options: ['Cinci lei', 'Cincisprezece lei', 'Cincizeci de lei', 'Zece lei'],
        correct: 1,
      },
      {
        ro: 'Ce mai vrea clientul, în afară de cafea?',
        ru: 'Что ещё хочет клиент, кроме кофе?',
        options: ['Un croissant', 'O prăjitură', 'Nimic', 'Un sandviș'],
        correct: 0,
      },
    ],
    phrases: [
      { ro: 'Ce doriți?', ru: 'Что желаете?' },
      { ro: 'Aș vrea…', ru: 'Я бы хотел…' },
      { ro: 'Altceva?', ru: 'Что-нибудь ещё?' },
      { ro: 'Cât costă?', ru: 'Сколько стоит?' },
      { ro: 'Poftiți', ru: 'Вот, пожалуйста / прошу' },
    ],
  },
  {
    id: 'cunostinta',
    title: 'O cunoștință nouă',
    titleRu: 'Новое знакомство',
    emoji: '🤝',
    level: 'A0',
    setting: 'Вечеринка у общих друзей. К тебе подходит незнакомый человек.',
    lines: [
      { speaker: 'Andrei', ro: 'Salut! Eu sunt Andrei.', ru: 'Привет! Я Андрей.' },
      { speaker: 'Tu', ro: 'Bună! Mă cheamă Alexandru. Îmi pare bine.', ru: 'Привет! Меня зовут Александр. Приятно познакомиться.' },
      { speaker: 'Andrei', ro: 'Și mie. De unde ești?', ru: 'И мне. Откуда ты?' },
      { speaker: 'Tu', ro: 'Sunt din Rusia, din Moscova.', ru: 'Я из России, из Москвы.' },
      { speaker: 'Andrei', ro: 'Serios? Și de cât timp ești aici?', ru: 'Серьёзно? И давно ты здесь?' },
      { speaker: 'Tu', ro: 'De trei luni. Învăț limba română.', ru: 'Три месяца. Я учу румынский язык.' },
      { speaker: 'Andrei', ro: 'Vorbești foarte bine!', ru: 'Ты очень хорошо говоришь!' },
      { speaker: 'Tu', ro: 'Mulțumesc, dar încă e greu.', ru: 'Спасибо, но пока трудно.' },
      { speaker: 'Andrei', ro: 'Nicio problemă. Vorbim rar.', ru: 'Без проблем. Будем говорить медленно.' },
    ],
    questions: [
      {
        ro: 'De unde este Alexandru?',
        ru: 'Откуда Александр?',
        options: ['Din România', 'Din Rusia', 'Din Moldova', 'Din Ucraina'],
        correct: 1,
      },
      {
        ro: 'De cât timp este el în țară?',
        ru: 'Как давно он в стране?',
        options: ['De trei zile', 'De trei ani', 'De trei luni', 'De o săptămână'],
        correct: 2,
      },
      {
        ro: 'Ce face Alexandru acum?',
        ru: 'Чем сейчас занимается Александр?',
        options: ['Învață română', 'Lucrează la un magazin', 'Caută o casă', 'Predă rusa'],
        correct: 0,
      },
    ],
    phrases: [
      { ro: 'Mă cheamă…', ru: 'Меня зовут…' },
      { ro: 'Îmi pare bine', ru: 'Приятно познакомиться' },
      { ro: 'De unde ești?', ru: 'Откуда ты?' },
      { ro: 'De cât timp?', ru: 'Как давно?' },
      { ro: 'Nicio problemă', ru: 'Без проблем' },
    ],
  },
  {
    id: 'piata',
    title: 'La piață',
    titleRu: 'На рынке',
    emoji: '🍅',
    level: 'A1',
    setting: 'Субботнее утро на рынке. Ты выбираешь овощи и торгуешься.',
    lines: [
      { speaker: 'Vânzătoare', ro: 'Bună ziua! Ce vă dau?', ru: 'Добрый день! Что вам дать?' },
      { speaker: 'Tu', ro: 'Bună ziua. Cât costă roșiile?', ru: 'Добрый день. Сколько стоят помидоры?' },
      { speaker: 'Vânzătoare', ro: 'Zece lei kilogramul. Sunt foarte bune.', ru: 'Десять леев за килограмм. Они очень хорошие.' },
      { speaker: 'Tu', ro: 'Îmi dați două kilograme, vă rog.', ru: 'Дайте мне два килограмма, пожалуйста.' },
      { speaker: 'Vânzătoare', ro: 'Sigur. Mai doriți ceva?', ru: 'Конечно. Ещё что-нибудь желаете?' },
      { speaker: 'Tu', ro: 'Da, și un kilogram de mere. Sunt dulci?', ru: 'Да, и килограмм яблок. Они сладкие?' },
      { speaker: 'Vânzătoare', ro: 'Foarte dulci! Gustați unul.', ru: 'Очень сладкие! Попробуйте одно.' },
      { speaker: 'Tu', ro: 'Într-adevăr. Le iau.', ru: 'Действительно. Беру их.' },
      { speaker: 'Vânzătoare', ro: 'În total, douăzeci și cinci de lei.', ru: 'Всего двадцать пять леев.' },
      { speaker: 'Tu', ro: 'Poftiți. O zi bună!', ru: 'Вот. Хорошего дня!' },
    ],
    questions: [
      {
        ro: 'Cât costă un kilogram de roșii?',
        ru: 'Сколько стоит килограмм помидоров?',
        options: ['Cinci lei', 'Zece lei', 'Douăzeci de lei', 'Douăzeci și cinci de lei'],
        correct: 1,
      },
      {
        ro: 'Câte kilograme de roșii cumpără clientul?',
        ru: 'Сколько килограммов помидоров покупает клиент?',
        options: ['Unul', 'Două', 'Trei', 'Cinci'],
        correct: 1,
      },
      {
        ro: 'Ce mai cumpără, în afară de roșii?',
        ru: 'Что ещё он покупает, кроме помидоров?',
        options: ['Cartofi', 'Mere', 'Pâine', 'Brânză'],
        correct: 1,
      },
    ],
    phrases: [
      { ro: 'Ce vă dau?', ru: 'Что вам дать?' },
      { ro: 'Îmi dați…, vă rog', ru: 'Дайте мне…, пожалуйста' },
      { ro: 'Mai doriți ceva?', ru: 'Ещё что-нибудь желаете?' },
      { ro: 'În total', ru: 'Всего, итого' },
      { ro: 'Le iau', ru: 'Беру их' },
    ],
  },
  {
    id: 'taxi',
    title: 'Cu taxiul',
    titleRu: 'В такси',
    emoji: '🚕',
    level: 'A1',
    setting: 'Ты садишься в такси и объясняешь, куда ехать. Водитель разговорчивый.',
    lines: [
      { speaker: 'Șofer', ro: 'Bună seara! Unde mergem?', ru: 'Добрый вечер! Куда едем?' },
      { speaker: 'Tu', ro: 'Bună seara. La gară, vă rog.', ru: 'Добрый вечер. На вокзал, пожалуйста.' },
      { speaker: 'Șofer', ro: 'La gara de nord?', ru: 'На Северный вокзал?' },
      { speaker: 'Tu', ro: 'Da, exact. Cât durează?', ru: 'Да, именно. Сколько это займёт?' },
      { speaker: 'Șofer', ro: 'Cam douăzeci de minute, dacă nu e trafic.', ru: 'Примерно двадцать минут, если нет пробок.' },
      { speaker: 'Tu', ro: 'Bine. Am trenul la ora opt.', ru: 'Хорошо. У меня поезд в восемь часов.' },
      { speaker: 'Șofer', ro: 'Ajungem la timp, nu vă faceți griji.', ru: 'Успеем вовремя, не волнуйтесь.' },
      { speaker: 'Tu', ro: 'Mulțumesc. Cât costă drumul?', ru: 'Спасибо. Сколько стоит поездка?' },
      { speaker: 'Șofer', ro: 'Vreo treizeci de lei.', ru: 'Около тридцати леев.' },
      { speaker: 'Tu', ro: 'În regulă. Puteți opri aici, vă rog.', ru: 'Хорошо. Можете остановить здесь, пожалуйста.' },
    ],
    questions: [
      {
        ro: 'Unde merge clientul?',
        ru: 'Куда едет клиент?',
        options: ['La aeroport', 'La gară', 'La hotel', 'Acasă'],
        correct: 1,
      },
      {
        ro: 'La ce oră are trenul?',
        ru: 'Во сколько у него поезд?',
        options: ['La ora șase', 'La ora șapte', 'La ora opt', 'La ora nouă'],
        correct: 2,
      },
      {
        ro: 'Cât durează drumul?',
        ru: 'Сколько длится дорога?',
        options: [
          'Cam zece minute',
          'Cam douăzeci de minute',
          'Cam o oră',
          'Cam treizeci de minute',
        ],
        correct: 1,
      },
    ],
    phrases: [
      { ro: 'Unde mergem?', ru: 'Куда едем?' },
      { ro: 'Cât durează?', ru: 'Сколько времени займёт?' },
      { ro: 'Nu vă faceți griji', ru: 'Не волнуйтесь' },
      { ro: 'Ajungem la timp', ru: 'Успеем вовремя' },
      { ro: 'În regulă', ru: 'Хорошо, договорились' },
    ],
  },
  {
    id: 'vecina',
    title: 'Vecina de la etaj',
    titleRu: 'Соседка с этажа',
    emoji: '🚪',
    level: 'A1',
    setting: 'Ты сталкиваешься с соседкой у лифта. Она любопытная, но добрая.',
    lines: [
      { speaker: 'Vecina', ro: 'Bună ziua! Dumneavoastră sunteți noul vecin?', ru: 'Добрый день! Вы новый сосед?' },
      { speaker: 'Tu', ro: 'Da, bună ziua. M-am mutat săptămâna trecută.', ru: 'Да, добрый день. Я переехал на прошлой неделе.' },
      { speaker: 'Vecina', ro: 'Bine ați venit! Eu stau la etajul trei.', ru: 'Добро пожаловать! Я живу на третьем этаже.' },
      { speaker: 'Tu', ro: 'Mulțumesc. Eu sunt la etajul doi.', ru: 'Спасибо. Я на втором этаже.' },
      { speaker: 'Vecina', ro: 'Și de unde sunteți? Aveți un accent frumos.', ru: 'А откуда вы? У вас красивый акцент.' },
      { speaker: 'Tu', ro: 'Sunt din Rusia. Învăț româna de câteva luni.', ru: 'Я из России. Учу румынский несколько месяцев.' },
      { speaker: 'Vecina', ro: 'Se vede că munciți! Dacă aveți nevoie de ceva, bateți la ușă.', ru: 'Видно, что вы стараетесь! Если что-то понадобится, стучите в дверь.' },
      { speaker: 'Tu', ro: 'Sunteți foarte amabilă. Mulțumesc mult.', ru: 'Вы очень любезны. Большое спасибо.' },
      { speaker: 'Vecina', ro: 'Cu plăcere. Numai bine!', ru: 'Пожалуйста. Всего доброго!' },
    ],
    questions: [
      {
        ro: 'La ce etaj stă vecina?',
        ru: 'На каком этаже живёт соседка?',
        options: ['La etajul unu', 'La etajul doi', 'La etajul trei', 'La parter'],
        correct: 2,
      },
      {
        ro: 'Când s-a mutat vecinul nou?',
        ru: 'Когда переехал новый сосед?',
        options: ['Ieri', 'Săptămâna trecută', 'Luna trecută', 'Anul trecut'],
        correct: 1,
      },
      {
        ro: 'Ce îi propune vecina?',
        ru: 'Что предлагает соседка?',
        options: [
          'Să bea o cafea',
          'Să bată la ușă dacă are nevoie de ceva',
          'Să se mute la etajul trei',
          'Să învețe rusa',
        ],
        correct: 1,
      },
    ],
    phrases: [
      { ro: 'Bine ați venit!', ru: 'Добро пожаловать!' },
      { ro: 'M-am mutat', ru: 'Я переехал' },
      { ro: 'Dacă aveți nevoie de ceva', ru: 'Если вам что-то понадобится' },
      { ro: 'Sunteți foarte amabilă', ru: 'Вы очень любезны' },
      { ro: 'Numai bine!', ru: 'Всего доброго!' },
    ],
  },
  {
    id: 'farmacie',
    title: 'La farmacie',
    titleRu: 'В аптеке',
    emoji: '💊',
    level: 'A1',
    setting: 'Ты простудился и пришёл в аптеку. Надо объяснить, что болит.',
    lines: [
      { speaker: 'Farmacist', ro: 'Bună ziua! Cu ce vă pot ajuta?', ru: 'Добрый день! Чем могу помочь?' },
      { speaker: 'Tu', ro: 'Bună ziua. Nu mă simt bine. Mă doare gâtul.', ru: 'Добрый день. Я плохо себя чувствую. У меня болит горло.' },
      { speaker: 'Farmacist', ro: 'Aveți febră?', ru: 'У вас температура?' },
      { speaker: 'Tu', ro: 'Puțin. Și mă doare capul.', ru: 'Немного. И голова болит.' },
      { speaker: 'Farmacist', ro: 'De cât timp vă simțiți așa?', ru: 'Как давно вы себя так чувствуете?' },
      { speaker: 'Tu', ro: 'De două zile.', ru: 'Два дня.' },
      { speaker: 'Farmacist', ro: 'Vă dau niște pastile. Luați una dimineața și una seara.', ru: 'Я дам вам таблетки. Принимайте одну утром и одну вечером.' },
      { speaker: 'Tu', ro: 'Cu apă?', ru: 'С водой?' },
      { speaker: 'Farmacist', ro: 'Da, după masă. Dacă nu vă e mai bine în trei zile, mergeți la doctor.', ru: 'Да, после еды. Если через три дня не станет лучше, идите к врачу.' },
      { speaker: 'Tu', ro: 'Am înțeles. Mulțumesc frumos.', ru: 'Понял. Большое спасибо.' },
    ],
    questions: [
      {
        ro: 'Ce îl doare pe client?',
        ru: 'Что болит у клиента?',
        options: ['Gâtul și capul', 'Stomacul', 'Piciorul', 'Spatele'],
        correct: 0,
      },
      {
        ro: 'Când trebuie să ia pastilele?',
        ru: 'Когда нужно принимать таблетки?',
        options: [
          'Numai dimineața',
          'Dimineața și seara',
          'La fiecare oră',
          'Numai când doare',
        ],
        correct: 1,
      },
      {
        ro: 'Ce trebuie să facă dacă nu îi este mai bine?',
        ru: 'Что делать, если лучше не станет?',
        options: [
          'Să ia mai multe pastile',
          'Să vină din nou la farmacie',
          'Să meargă la doctor',
          'Să stea acasă',
        ],
        correct: 2,
      },
    ],
    phrases: [
      { ro: 'Cu ce vă pot ajuta?', ru: 'Чем могу помочь?' },
      { ro: 'Nu mă simt bine', ru: 'Я плохо себя чувствую' },
      { ro: 'Mă doare…', ru: 'У меня болит…' },
      { ro: 'Am înțeles', ru: 'Я понял' },
      { ro: 'Mulțumesc frumos', ru: 'Большое спасибо' },
    ],
  },
  {
    id: 'tren',
    title: 'Bilet de tren',
    titleRu: 'Билет на поезд',
    emoji: '🚆',
    level: 'A1',
    setting: 'Касса на вокзале. Тебе нужен билет, и желательно у окна.',
    lines: [
      { speaker: 'Casier', ro: 'Următorul, vă rog!', ru: 'Следующий, пожалуйста!' },
      { speaker: 'Tu', ro: 'Bună ziua. Un bilet spre Brașov, vă rog.', ru: 'Добрый день. Один билет до Брашова, пожалуйста.' },
      { speaker: 'Casier', ro: 'Pentru ce dată?', ru: 'На какое число?' },
      { speaker: 'Tu', ro: 'Pentru mâine dimineață.', ru: 'На завтра утром.' },
      { speaker: 'Casier', ro: 'Avem un tren la ora șapte și unul la nouă.', ru: 'Есть поезд в семь и в девять.' },
      { speaker: 'Tu', ro: 'Cel de la nouă, vă rog. Dus-întors.', ru: 'Тот, что в девять, пожалуйста. Туда-обратно.' },
      { speaker: 'Casier', ro: 'Doriți loc la geam?', ru: 'Хотите место у окна?' },
      { speaker: 'Tu', ro: 'Da, dacă se poate.', ru: 'Да, если можно.' },
      { speaker: 'Casier', ro: 'Vagonul patru, locul douăzeci și trei. Optzeci de lei.', ru: 'Вагон четыре, место двадцать три. Восемьдесят леев.' },
      { speaker: 'Tu', ro: 'Perfect. Mulțumesc!', ru: 'Отлично. Спасибо!' },
    ],
    questions: [
      {
        ro: 'Unde merge călătorul?',
        ru: 'Куда едет пассажир?',
        options: ['La București', 'La Brașov', 'La Cluj', 'La Constanța'],
        correct: 1,
      },
      {
        ro: 'La ce oră este trenul ales?',
        ru: 'Во сколько выбранный поезд?',
        options: ['La ora șapte', 'La ora opt', 'La ora nouă', 'La ora zece'],
        correct: 2,
      },
      {
        ro: 'Ce fel de bilet cumpără?',
        ru: 'Какой билет он покупает?',
        options: ['Numai dus', 'Dus-întors', 'Un abonament', 'Bilet de autobuz'],
        correct: 1,
      },
    ],
    phrases: [
      { ro: 'Un bilet spre…', ru: 'Один билет до…' },
      { ro: 'Pentru ce dată?', ru: 'На какое число?' },
      { ro: 'dus-întors', ru: 'туда-обратно' },
      { ro: 'loc la geam', ru: 'место у окна' },
      { ro: 'dacă se poate', ru: 'если можно' },
    ],
  },
  {
    id: 'restaurant',
    title: 'Cina la restaurant',
    titleRu: 'Ужин в ресторане',
    emoji: '🍽️',
    level: 'A2',
    setting: 'Ужин вдвоём. Официант рекомендует блюдо дня, ты уточняешь состав.',
    lines: [
      { speaker: 'Chelner', ro: 'Bună seara! Aveți rezervare?', ru: 'Добрый вечер! У вас есть бронь?' },
      { speaker: 'Tu', ro: 'Da, pe numele Alexandru, pentru două persoane.', ru: 'Да, на имя Александр, на двоих.' },
      { speaker: 'Chelner', ro: 'Poftiți la masa de lângă fereastră. Iată meniul.', ru: 'Проходите к столику у окна. Вот меню.' },
      { speaker: 'Tu', ro: 'Mulțumesc. Ce ne recomandați?', ru: 'Спасибо. Что вы нам порекомендуете?' },
      { speaker: 'Chelner', ro: 'Astăzi avem sarmale foarte bune și ciorbă de burtă.', ru: 'Сегодня у нас очень хорошие сармале и чорба.' },
      { speaker: 'Tu', ro: 'Sarmalele conțin carne de porc?', ru: 'В сармале есть свинина?' },
      { speaker: 'Chelner', ro: 'Da, porc și vită. Avem și o variantă de post.', ru: 'Да, свинина и говядина. Есть и постный вариант.' },
      { speaker: 'Tu', ro: 'Atunci luăm două porții de sarmale și o salată.', ru: 'Тогда возьмём две порции сармале и салат.' },
      { speaker: 'Chelner', ro: 'De băut?', ru: 'Из напитков?' },
      { speaker: 'Tu', ro: 'O sticlă de apă plată, vă rog. Și nota mai târziu.', ru: 'Бутылку негазированной воды, пожалуйста. И счёт попозже.' },
      { speaker: 'Chelner', ro: 'Imediat. Poftă bună!', ru: 'Сейчас же. Приятного аппетита!' },
    ],
    questions: [
      {
        ro: 'Pentru câte persoane este rezervarea?',
        ru: 'На сколько человек бронь?',
        options: ['Pentru una', 'Pentru două', 'Pentru trei', 'Pentru patru'],
        correct: 1,
      },
      {
        ro: 'Ce recomandă chelnerul?',
        ru: 'Что рекомендует официант?',
        options: [
          'Pizza și paste',
          'Sarmale și ciorbă de burtă',
          'Pește și cartofi',
          'Numai desert',
        ],
        correct: 1,
      },
      {
        ro: 'Ce comandă clientul de băut?',
        ru: 'Что клиент заказывает из напитков?',
        options: ['Vin roșu', 'Bere', 'Apă plată', 'Suc de portocale'],
        correct: 2,
      },
    ],
    phrases: [
      { ro: 'Aveți rezervare?', ru: 'У вас есть бронь?' },
      { ro: 'Ce ne recomandați?', ru: 'Что вы нам порекомендуете?' },
      { ro: 'apă plată / minerală', ru: 'вода без газа / с газом' },
      { ro: 'nota, vă rog', ru: 'счёт, пожалуйста' },
      { ro: 'Poftă bună!', ru: 'Приятного аппетита!' },
    ],
  },
  {
    id: 'interviu',
    title: 'Primul interviu',
    titleRu: 'Первое собеседование',
    emoji: '💼',
    level: 'A2',
    setting: 'Собеседование на работу. Тебя спрашивают об опыте и планах.',
    lines: [
      { speaker: 'Angajator', ro: 'Bună ziua, luați loc, vă rog. Povestiți-mi despre dumneavoastră.', ru: 'Добрый день, садитесь, пожалуйста. Расскажите о себе.' },
      { speaker: 'Tu', ro: 'Mulțumesc. Mă numesc Alexandru, am douăzeci și opt de ani.', ru: 'Спасибо. Меня зовут Александр, мне двадцать восемь лет.' },
      { speaker: 'Angajator', ro: 'Unde ați lucrat până acum?', ru: 'Где вы работали до сих пор?' },
      { speaker: 'Tu', ro: 'Am lucrat trei ani ca programator la o firmă din Moscova.', ru: 'Я три года работал программистом в фирме в Москве.' },
      { speaker: 'Angajator', ro: 'De ce ați venit în România?', ru: 'Почему вы приехали в Румынию?' },
      { speaker: 'Tu', ro: 'Soția mea este de aici și ne-am mutat împreună anul trecut.', ru: 'Моя жена отсюда, и мы переехали вместе в прошлом году.' },
      { speaker: 'Angajator', ro: 'Cum stați cu limba? Văd că vorbiți destul de bine.', ru: 'Как у вас с языком? Вижу, вы говорите довольно хорошо.' },
      { speaker: 'Tu', ro: 'Învăț în fiecare zi. Înțeleg aproape tot, dar mai greșesc.', ru: 'Учу каждый день. Понимаю почти всё, но пока ошибаюсь.' },
      { speaker: 'Angajator', ro: 'Nu e nicio problemă, se învață repede la birou.', ru: 'Это не проблема, в офисе быстро научитесь.' },
      { speaker: 'Tu', ro: 'Sper. Când ați putea să îmi dați un răspuns?', ru: 'Надеюсь. Когда вы сможете дать мне ответ?' },
      { speaker: 'Angajator', ro: 'Vă sunăm până vineri. Vă mulțumim că ați venit.', ru: 'Мы позвоним вам до пятницы. Спасибо, что пришли.' },
    ],
    questions: [
      {
        ro: 'Cât timp a lucrat ca programator?',
        ru: 'Сколько он работал программистом?',
        options: ['Un an', 'Doi ani', 'Trei ani', 'Cinci ani'],
        correct: 2,
      },
      {
        ro: 'De ce s-a mutat în România?',
        ru: 'Почему он переехал в Румынию?',
        options: [
          'Pentru un loc de muncă',
          'Pentru că soția lui este de aici',
          'Pentru studii',
          'Pentru vacanță',
        ],
        correct: 1,
      },
      {
        ro: 'Când va primi un răspuns?',
        ru: 'Когда он получит ответ?',
        options: ['Mâine', 'Până vineri', 'Peste o lună', 'Nu se știe'],
        correct: 1,
      },
    ],
    phrases: [
      { ro: 'Luați loc, vă rog', ru: 'Садитесь, пожалуйста' },
      { ro: 'Povestiți-mi despre dumneavoastră', ru: 'Расскажите о себе' },
      { ro: 'Am lucrat ca…', ru: 'Я работал в качестве…' },
      { ro: 'Cum stați cu…?', ru: 'Как у вас обстоит с…?' },
      { ro: 'Vă sunăm', ru: 'Мы вам позвоним' },
    ],
  },
  {
    id: 'planuri',
    title: 'Planuri de weekend',
    titleRu: 'Планы на выходные',
    emoji: '🏔️',
    level: 'A2',
    setting: 'Друг зовёт тебя в горы. Вы договариваетесь о деталях.',
    lines: [
      { speaker: 'Mihai', ro: 'Ce faci în weekend? Ai vreun plan?', ru: 'Что делаешь на выходных? Есть планы?' },
      { speaker: 'Tu', ro: 'Încă nu m-am hotărât. De ce întrebi?', ru: 'Ещё не решил. А почему спрашиваешь?' },
      { speaker: 'Mihai', ro: 'Mergem la munte cu niște prieteni. Vrei să vii?', ru: 'Мы едем в горы с друзьями. Хочешь поехать?' },
      { speaker: 'Tu', ro: 'Sună bine! Când plecați?', ru: 'Звучит хорошо! Когда выезжаете?' },
      { speaker: 'Mihai', ro: 'Sâmbătă dimineața, pe la șase. Ne întoarcem duminică seara.', ru: 'В субботу утром, около шести. Вернёмся в воскресенье вечером.' },
      { speaker: 'Tu', ro: 'Șase e cam devreme, dar merită. Ce trebuie să iau cu mine?', ru: 'Шесть — рановато, но оно того стоит. Что нужно взять с собой?' },
      { speaker: 'Mihai', ro: 'Haine călduroase și bocanci. Sus e frig chiar și vara.', ru: 'Тёплую одежду и ботинки. Наверху холодно даже летом.' },
      { speaker: 'Tu', ro: 'Am înțeles. Și unde dormim?', ru: 'Понял. А где мы ночуем?' },
      { speaker: 'Mihai', ro: 'La o cabană. Am rezervat deja două camere.', ru: 'В горном домике. Я уже забронировал две комнаты.' },
      { speaker: 'Tu', ro: 'Super. Atunci ne vedem sâmbătă!', ru: 'Супер. Тогда увидимся в субботу!' },
      { speaker: 'Mihai', ro: 'Te sun vineri seara să confirmăm.', ru: 'Позвоню тебе в пятницу вечером, чтобы подтвердить.' },
    ],
    questions: [
      {
        ro: 'Când pleacă la munte?',
        ru: 'Когда они едут в горы?',
        options: ['Vineri seara', 'Sâmbătă dimineața', 'Duminică dimineața', 'Joi'],
        correct: 1,
      },
      {
        ro: 'Ce trebuie să ia cu el?',
        ru: 'Что ему нужно взять с собой?',
        options: [
          'Haine călduroase și bocanci',
          'Costum și cravată',
          'Numai bani',
          'Un cort',
        ],
        correct: 0,
      },
      {
        ro: 'Unde vor dormi?',
        ru: 'Где они будут ночевать?',
        options: ['La hotel', 'La cabană', 'În cort', 'Acasă la Mihai'],
        correct: 1,
      },
    ],
    phrases: [
      { ro: 'Ai vreun plan?', ru: 'У тебя есть планы?' },
      { ro: 'Nu m-am hotărât', ru: 'Я ещё не решил' },
      { ro: 'Sună bine!', ru: 'Звучит хорошо!' },
      { ro: 'Ne vedem…', ru: 'Увидимся…' },
      { ro: 'Te sun', ru: 'Я тебе позвоню' },
    ],
  },
];

const DIALOGUES_BY_ID = new Map(DIALOGUES.map((d) => [d.id, d]));

export function getDialogue(id: string): Dialogue | undefined {
  return DIALOGUES_BY_ID.get(id);
}

export const TOTAL_DIALOGUES = DIALOGUES.length;
