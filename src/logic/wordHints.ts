import { ALL_WORDS } from '../data';
import { COURSE } from '../data/course';
import { DRILL_PACKS } from '../data/drills';

// Подсказка по тапу на слово. Словарь знает слова в начальной форме, а в
// заданиях они стоят в живых: глагол спрягается, у существительного сзади
// приклеен артикль, русское слово склоняется. Поэтому кроме точного
// совпадения пробуем ещё три пути: список частотных форм, отсечение
// артикля и поиск по основе.

const LETTERS = 'a-zA-ZĂÂÎȘȚăâîșțА-Яа-яЁё';
const TRIM_RE = new RegExp(`^[^${LETTERS}-]+|[^${LETTERS}-]+$`, 'g');

export function normalizeToken(raw: string): string {
  return raw.replace(TRIM_RE, '').toLowerCase().replace(/ё/g, 'е').trim();
}

/**
 * Румынские формы, которых нет в словаре отдельными записями: спряжения
 * частотных глаголов, местоимения-клитики, служебные слова. Именно они
 * составляют половину любого предложения из курса.
 */
const RO_FORMS: Record<string, string> = {
  // a fi
  sunt: 'я есть / они есть (a fi)',
  ești: 'ты есть (a fi)',
  este: 'он / она есть (a fi)',
  e: 'есть (краткая форма от este)',
  suntem: 'мы есть (a fi)',
  sunteți: 'вы есть (a fi)',
  fost: 'был (причастие от a fi)',
  eram: 'я был (незаконченное прошедшее)',
  era: 'он был',
  fie: 'чтобы был (конъюнктив от a fi)',
  fiu: 'чтобы я был',

  // a avea
  am: 'у меня есть / вспомогательный глагол прошедшего времени',
  ai: 'у тебя есть',
  are: 'у него / неё есть',
  avem: 'у нас есть',
  aveți: 'у вас есть',
  au: 'у них есть',
  avut: 'имел (причастие)',
  aibă: 'чтобы у него было',

  // модальные и самые частые
  vreau: 'я хочу', vrei: 'ты хочешь', vrea: 'он хочет',
  vrem: 'мы хотим', vreți: 'вы хотите', vor: 'они хотят', vrut: 'хотел',
  pot: 'я могу', poți: 'ты можешь', poate: 'он может / может быть',
  putem: 'мы можем', puteți: 'вы можете', putut: 'мог', poată: 'чтобы он мог',
  trebuie: 'надо, нужно (не спрягается)',
  știu: 'я знаю', știi: 'ты знаешь', știe: 'он знает',
  știm: 'мы знаем', știți: 'вы знаете', știut: 'знал',

  // движение и действие
  merg: 'я иду / они идут', mergi: 'ты идёшь', merge: 'он идёт',
  mergem: 'мы идём', mergeți: 'вы идёте', mers: 'ходил', meargă: 'чтобы он пошёл',
  vin: 'я прихожу / вино', vii: 'ты приходишь', vine: 'он приходит',
  venim: 'мы приходим', veniți: 'вы приходите', venit: 'пришёл', vină: 'чтобы он пришёл',
  plec: 'я ухожу', pleci: 'ты уходишь', pleacă: 'он уходит', plecat: 'ушёл',
  fac: 'я делаю', faci: 'ты делаешь', face: 'он делает',
  facem: 'мы делаем', faceți: 'вы делаете', făcut: 'сделал', facă: 'чтобы он сделал',
  dau: 'я даю', dai: 'ты даёшь', dă: 'он даёт', dat: 'дал', dea: 'чтобы он дал',
  iau: 'я беру', iei: 'ты берёшь', ia: 'он берёт', luat: 'взял',
  stau: 'я нахожусь / живу', stai: 'ты находишься', stă: 'он находится',
  beau: 'я пью', bei: 'ты пьёшь', bea: 'он пьёт', băut: 'пил',
  văd: 'я вижу', vezi: 'ты видишь', vede: 'он видит', văzut: 'видел',
  citesc: 'я читаю', citești: 'ты читаешь', citește: 'он читает',
  citim: 'мы читаем', citiți: 'вы читаете', citit: 'читал',
  vorbesc: 'я говорю', vorbești: 'ты говоришь', vorbește: 'он говорит',
  vorbim: 'мы говорим', vorbiți: 'вы говорите', vorbit: 'говорил',
  lucrez: 'я работаю', lucrezi: 'ты работаешь', lucrează: 'он работает',
  lucrăm: 'мы работаем', lucrați: 'вы работаете', lucrat: 'работал',
  dorm: 'я сплю', doarme: 'он спит',
  mănânc: 'я ем', mănânci: 'ты ешь', mănâncă: 'он ест', mâncat: 'ел',
  spun: 'я говорю', spui: 'ты говоришь', spune: 'он говорит', spus: 'сказал',
  aștept: 'я жду', aștepți: 'ты ждёшь', așteaptă: 'он ждёт',
  ajut: 'я помогаю', ajuți: 'ты помогаешь', ajută: 'он помогает', ajutați: 'вы помогаете',
  cunosc: 'я знаю (человека)', cunoaște: 'он знает (человека)',
  place: 'нравится', plac: 'нравятся', pare: 'кажется',
  cheamă: 'зовут (a chema)', numesc: 'называюсь', simt: 'я чувствую',
  trezesc: 'просыпаюсь', costă: 'стоит (о цене)', ajung: 'я добираюсь',
  înțeleg: 'я понимаю', înțelegi: 'ты понимаешь', înțelege: 'он понимает',
  scris: 'писал', zis: 'сказал', pus: 'положил', deschis: 'открыл',

  // местоимения-клитики
  mă: 'меня / -ся (я)', te: 'тебя / -ся (ты)', se: 'себя / -ся (он, они)',
  ne: 'нас / нам', vă: 'вас / вам', îl: 'его', îi: 'их / ему',
  le: 'их / им (ж.р.)', îmi: 'мне', îți: 'тебе', mi: 'мне', ți: 'тебе',

  // личные местоимения
  eu: 'я', tu: 'ты', el: 'он', ea: 'она', noi: 'мы', voi: 'вы',
  ei: 'они (м.р.) / её', ele: 'они (ж.р.)',
  mine: 'меня', tine: 'тебя', lui: 'его / ему', lor: 'их',
  dumneavoastră: 'вы (вежливо)',

  // притяжательные
  meu: 'мой', mea: 'моя', mei: 'мои (м.р.)', mele: 'мои (ж.р.)',
  tău: 'твой', ta: 'твоя', tăi: 'твои (м.р.)', tale: 'твои (ж.р.)',
  nostru: 'наш', noastră: 'наша', noștri: 'наши (м.р.)', noastre: 'наши (ж.р.)',
  vostru: 'ваш', voastră: 'ваша',

  // артикли и определители
  un: 'какой-то (м.р.)', o: 'какая-то (ж.р.) / её', niște: 'какие-то, несколько',
  doi: 'два (м.р.)', două: 'две (ж.р.)', decât: 'чем (в сравнении)',
  cel: 'самый (м.р.)', cea: 'самая (ж.р.)', cei: 'самые (м.р.)', cele: 'самые (ж.р.)',
  al: 'служебное слово принадлежности', ale: 'служебное слово принадлежности (мн.ч. ж.р.)',
  acesta: 'этот', aceasta: 'эта', ăsta: 'этот (разг.)', asta: 'эта, это (разг.)',
  acela: 'тот', ăla: 'тот (разг.)', aia: 'та (разг.)', acest: 'этот', această: 'эта',
  acestea: 'эти', alta: 'другая', altă: 'другая', alt: 'другой', cealaltă: 'та другая',

  // предлоги и союзы
  în: 'в', la: 'в, на, к, у', pe: 'на / служебное перед человеком',
  cu: 'с', de: 'из, от, о / служебное после числа', din: 'из',
  sub: 'под', lângă: 'рядом с', între: 'между', fără: 'без',
  spre: 'к, в направлении', până: 'до', despre: 'о, про', pentru: 'для',
  și: 'и', sau: 'или', dar: 'но', că: 'что (союз)', să: 'чтобы (перед глаголом)',
  ca: 'как, чем', dacă: 'если', deși: 'хотя', deci: 'значит', apoi: 'потом',
  totuși: 'однако', adică: 'то есть',

  // вопросительные
  ce: 'что', cine: 'кто', unde: 'где, куда', când: 'когда', cum: 'как',
  care: 'который', cât: 'сколько', câți: 'сколько (м.р.)', câte: 'сколько (ж.р.)',

  // отрицание
  nu: 'не, нет', nimic: 'ничего', nimeni: 'никто',
  niciodată: 'никогда', nicăieri: 'нигде', niciun: 'ни один',

  // частотные наречия
  mai: 'ещё / более (сравнение)', foarte: 'очень', prea: 'слишком',
  cam: 'примерно', tot: 'всё, всё ещё', deja: 'уже', încă: 'ещё',
  aici: 'здесь', acolo: 'там', acum: 'сейчас', azi: 'сегодня',
  ieri: 'вчера', mâine: 'завтра', bine: 'хорошо', rău: 'плохо',
  mult: 'много', puțin: 'мало', așa: 'так', atunci: 'тогда',
  sigur: 'конечно', poftiți: 'вот, пожалуйста', rog: 'прошу (vă rog — пожалуйста)',
  acasă: 'дома, домой', bună: 'хорошая, добрая', bun: 'хороший',
  buni: 'хорошие (м.р.)', bune: 'хорошие (ж.р.)',
  mare: 'большой', mari: 'большие', mică: 'маленькая', mici: 'маленькие',
  frumoasă: 'красивая', frumoși: 'красивые (м.р.)', frumoase: 'красивые (ж.р.)',
  obosit: 'уставший', obosiți: 'уставшие', medic: 'врач',
  ore: 'часы (мн.ч.)', ani: 'годы, лет', zile: 'дни',
  mulțumesc: 'спасибо', da: 'да',
};

/** Русские формы, которые в словаре лежат в другом падеже или числе. */
const RU_FORMS: Record<string, string> = {
  я: 'eu', ты: 'tu', он: 'el', она: 'ea', мы: 'noi', вы: 'voi', они: 'ei / ele',
  меня: 'mă / pe mine', тебя: 'te / pe tine', мне: 'îmi / mie', тебе: 'îți / ție',
  его: 'îl / lui', её: 'o / ei', нас: 'ne', вас: 'vă', им: 'le',
  мой: 'meu', моя: 'mea', мои: 'mei / mele', твой: 'tău', твоя: 'ta',
  наш: 'nostru', наша: 'noastră', их: 'lor',
  не: 'nu', нет: 'nu', и: 'și', или: 'sau', но: 'dar', что: 'ce / că',
  чтобы: 'să', если: 'dacă', когда: 'când', потому: 'pentru (că)',
  в: 'în / la', на: 'pe / la', с: 'cu', из: 'din', для: 'pentru',
  под: 'sub', над: 'deasupra', между: 'între', без: 'fără', до: 'până la',
  очень: 'foarte', уже: 'deja', ещё: 'încă', тоже: 'de asemenea',
  здесь: 'aici', там: 'acolo', сейчас: 'acum', сегодня: 'azi',
  вчера: 'ieri', завтра: 'mâine', всегда: 'întotdeauna', никогда: 'niciodată',
  дома: 'acasă', домой: 'acasă', дом: 'casă',
  есть: 'este / a avea', был: 'am fost', была: 'a fost', были: 'au fost',
  буду: 'o să fiu', будет: 'o să fie',
  хочу: 'vreau', хочешь: 'vrei', хочет: 'vrea', хотим: 'vrem',
  могу: 'pot', можешь: 'poți', может: 'poate', можете: 'puteți',
  знаю: 'știu', знаешь: 'știi', знает: 'știe', знаем: 'știm',
  иду: 'merg', идёшь: 'mergi', идёт: 'merge', идём: 'mergem', идут: 'merg',
  еду: 'merg (cu)', едем: 'mergem', пойду: 'o să merg', пойдёт: 'o să meargă',
  делаю: 'fac', делаешь: 'faci', делает: 'face',
  читаю: 'citesc', читает: 'citește', читал: 'am citit',
  говорю: 'vorbesc', говоришь: 'vorbești', говорит: 'vorbește',
  работаю: 'lucrez', работает: 'lucrează', работал: 'am lucrat',
  живу: 'locuiesc', живёшь: 'locuiești',
  лет: 'ani', года: 'ani', год: 'an', дней: 'zile', день: 'zi',
  книгу: 'carte', книга: 'carte', книги: 'cărți',
  машину: 'mașină', машина: 'mașină', машине: 'mașină',
  город: 'oraș', городе: 'oraș', города: 'orașe',
  магазин: 'magazin', магазине: 'magazin',
  школу: 'școală', школе: 'școală', школа: 'școală',
  работу: 'muncă', работе: 'muncă', работа: 'muncă',
  воды: 'apă', вода: 'apă', воду: 'apă',
  друзья: 'prieteni', друга: 'prieten', друг: 'prieten', друзей: 'prieteni',
  сестра: 'soră', сестры: 'surori', сестру: 'soră',
  брат: 'frate', брата: 'frate', братья: 'frați',
  дети: 'copii', детей: 'copii', ребёнок: 'copil',
  собака: 'câine', собаку: 'câine', кошка: 'pisică',
  врач: 'medic', врача: 'medic', студент: 'student',
  красивая: 'frumoasă', красивый: 'frumos', большой: 'mare', большая: 'mare',
  хороший: 'bun', хорошая: 'bună', хорошо: 'bine', плохо: 'rău',
  маленький: 'mic', маленькая: 'mică',
  вижу: 'văd', видишь: 'vezi', жду: 'aștept', ждёшь: 'aștepți',
  нравится: 'îmi place', нравятся: 'îmi plac',
  зовут: 'mă cheamă', сколько: 'cât / câți / câte',
  пожалуйста: 'vă rog / cu plăcere', спасибо: 'mulțumesc',
  у: 'la / предлог принадлежности (у меня есть — am)',
  самый: 'cel mai', самая: 'cea mai', самые: 'cei mai / cele mai',
  бы: 'aș / ar (условное наклонение)',
  этот: 'acesta / ăsta', эта: 'aceasta / asta', эти: 'aceștia / astea',
  тот: 'acela / ăla', та: 'aceea / aia', те: 'aceia / alea', то: 'acela',
  прийти: 'să vin / a veni', пойти: 'să merg / a merge',
  ходил: 'am mers', пришёл: 'a venit', помочь: 'să ajut / a ajuta',
  сделал: 'am făcut', прочитал: 'am citit', поел: 'am mâncat',
  человек: 'om', люди: 'oameni', человека: 'om',
  два: 'doi', две: 'două', три: 'trei', двадцать: 'douăzeci',
  тридцать: 'treizeci', сорок: 'patruzeci', сто: 'o sută',
  ничего: 'nimic', никто: 'nimeni', никого: 'nimeni',
  хорошие: 'buni / bune', большие: 'mari', красивые: 'frumoși / frumoase',
  работаем: 'lucrăm', работаете: 'lucrați', работают: 'lucrează',
  идёте: 'mergeți', едет: 'merge',
  столе: 'masă', стол: 'masă', столом: 'masă',
  свою: 'mea / ta (согласуется с предметом)', своей: 'mea / ta',
  устал: 'obosit', устали: 'obosiți',
  учительница: 'profesoară', мальчик: 'băiat', девочка: 'fată',
  книгой: 'carte', кофе: 'cafea', чай: 'ceai',
  часов: 'ore', часа: 'ore', минут: 'minute',
  смог: 'am putut', смогу: 'o să pot',
  будешь: 'o să fii', было: 'a fost',
  всё: 'tot / totul', все: 'toți / toate', много: 'mult', мало: 'puțin',
};

/**
 * Ключи, под которыми словарная запись попадает в индекс.
 *
 * В словаре полно записей с уточнением в скобках («счёт (в банке)») и с
 * вариантами через слэш («идти / ехать»). Раньше такие считались
 * многословными и выбрасывались целиком — из-за этого подсказка молчала
 * на вполне обычных словах.
 */
function indexKeysFor(text: string): string[] {
  const withoutParens = text.replace(/\([^)]*\)/g, ' ');
  const keys: string[] = [];
  for (const part of withoutParens.split('/')) {
    const key = normalizeToken(part);
    // Многословный остаток («в банке») ключом быть не может.
    if (key && !/\s/.test(key)) keys.push(key);
  }
  return keys;
}

function buildSingleWordIndex(field: 'ru' | 'ro'): Map<string, string> {
  const other: 'ru' | 'ro' = field === 'ru' ? 'ro' : 'ru';
  const map = new Map<string, string>();

  for (const w of ALL_WORDS) {
    const translation = w[other];
    for (const key of indexKeysFor(w[field])) {
      if (!map.has(key)) map.set(key, translation);
    }
    // Альтернативные румынские написания тоже должны находиться.
    if (field === 'ro' && w.alt) {
      for (const alt of w.alt) {
        for (const key of indexKeysFor(alt)) {
          if (!map.has(key)) map.set(key, translation);
        }
      }
    }
  }
  return map;
}

/**
 * Слова и формы, введённые уроками.
 *
 * Словарь по темам знает начальные формы: «carte», «a merge». А в заданиях
 * стоят живые — «cărțile», «mergeam», «mergând», — плюс служебные слова
 * («aș», «va», «deoarece»), которых в тематическом словаре нет вовсе.
 *
 * Переводы для всего этого уже написаны: блоками «слова, которые
 * встретятся» на карточках правил и разборами форм, по которым строится
 * объяснение ошибки. Их и подключаем, чтобы тап по слову не молчал там,
 * где само приложение это слово только что объясняло.
 */
function collectLessonWords(): Map<string, string> {
  const map = new Map<string, string>();
  const put = (ro: string, ru: string) => {
    const key = normalizeToken(ro);
    if (!key || !ru.trim() || map.has(key)) return;
    // Пометки вида «такой формы нет» — это разбор ошибки, а не перевод.
    if (/такой формы нет/i.test(ru)) return;
    map.set(key, ru);
  };

  for (const chapter of COURSE) {
    for (const lesson of chapter.lessons) {
      for (const step of lesson.steps) {
        if (step.kind === 'rule') {
          for (const item of step.vocabulary ?? []) put(item.ro, item.ru);
        } else if (step.kind === 'choice') {
          for (const [form, meaning] of Object.entries(step.forms ?? {})) put(form, meaning);
        }
      }
    }
  }

  for (const pack of DRILL_PACKS) {
    for (const item of pack.vocabulary ?? []) put(item.ro, item.ru);
    for (const [form, meaning] of Object.entries(pack.forms ?? {})) put(form, meaning);
    for (const task of pack.tasks) {
      if (task.kind !== 'choice') continue;
      for (const [form, meaning] of Object.entries(task.forms ?? {})) put(form, meaning);
    }
  }
  return map;
}

const RU_WORD_TO_RO = buildSingleWordIndex('ru');
const RO_WORD_TO_RU = buildSingleWordIndex('ro');
const LESSON_WORDS = collectLessonWords();

/**
 * Имена, города и названия языков.
 *
 * Учить в них нечего, но молчать на тап тоже неправильно: человек видит
 * незнакомое слово и не понимает, что это просто имя.
 */
/**
 * Глаголы без частицы «a».
 *
 * В словаре инфинитив лежит целиком — «a vedea», — а в живой фразе после
 * «voi», «aș» и «trebuie» частица отваливается: «voi vedea». Ключом такая
 * пара быть не может (в индексе только однословные), поэтому отдельная
 * карта.
 */
const BARE_INFINITIVES = (() => {
  const map = new Map<string, string>();
  for (const w of ALL_WORDS) {
    const match = /^a\s+(\S+)$/.exec(w.ro.trim());
    if (!match) continue;
    const key = normalizeToken(match[1]);
    if (key && !map.has(key)) map.set(key, w.ru);
  }
  return map;
})();

/**
 * Половинки слитных форм: «m-a văzut», «l-am citit», «mi-e frig».
 *
 * Сами по себе эти куски в словаре не живут, но тап приходится именно на
 * целое слово, и разобрать его по частям — единственный способ ответить.
 */
const CLITICS = new Map<string, string>([
  ['m', 'меня'], ['te', 'тебя'], ['l', 'его'], ['o', 'её'],
  ['ne', 'нас'], ['v', 'вас'], ['i', 'ему, им'], ['le', 'им'],
  ['mi', 'мне'], ['ți', 'тебе'], ['s', 'себя'],
  ['am', 'вспомогательный: я, мы'], ['ai', 'вспомогательный: ты'],
  ['a', 'вспомогательный: он, она'], ['au', 'вспомогательный: они'],
  ['ați', 'вспомогательный: вы'], ['e', 'есть'],
  ['nu', 'не'], ['într', 'в'], ['un', 'один'], ['o-', 'будущее: «o să»'],
]);

/**
 * Слова, которые встречаются в заданиях, но в тематический словарь не
 * попали: служебные, формы с приклеенным артиклем и пара обиходных слов
 * вроде «om». Тап по ним молчать не должен.
 */
const EXTRA_WORDS = new Map<string, string>([
  ['om', 'человек'], ['omul', 'человек — тот самый'],
  ['oameni', 'люди'], ['oamenii', 'люди — те самые'],
  ['frații', 'братья — те самые'], ['studenții', 'студенты — те самые'],
  ['trenurile', 'поезда — те самые'],
  ['fel', 'вид, род · «la fel de» — такой же'],
  ['peste', 'через — о времени; над'],
  ['stânga', 'левая сторона · «la stânga» — налево'],
  ['dreapta', 'правая сторона · «la dreapta» — направо'],
  ['ori', 'раз · «de trei ori» — три раза'],
  ['sută', 'сто'], ['viitoare', 'будущая, следующая'],
  ['născut', 'родился — причастие от «a naște»'],
  ['plătit', 'заплатил — причастие от «a plăti»'],
  ['numiți', 'зовётесь'], ['locuiește', 'живёт'],
  ['mut', 'переезжаю — от «a se muta»'],
  ['închiriază', 'сдаётся; снимает'],
  ['termin', 'заканчиваю'], ['simți', 'чувствуешь'],
  ['sună', 'звони; звонит'], ['întreabă', 'спроси; спрашивает'],
]);

const PROPER_NAMES = new Map<string, string>([
  ['ana', 'Ана — имя'],
  ['ion', 'Ион — имя'],
  ['maria', 'Мария — имя'],
  ['dan', 'Дан — имя'],
  ['alexandru', 'Александру — имя'],
  ['bucurești', 'Бухарест'],
  ['cluj', 'Клуж — город в Румынии'],
  ['moscova', 'Москва'],
  ['românește', 'по-румынски'],
  ['rusește', 'по-русски'],
  ['spaniolă', 'испанский'],
  ['engleză', 'английский'],
  ['română', 'румынский'],
  ['rusă', 'русский'],
]);

/** Ключи списков форм приводим к тому же виду, что и запросы. */
function normalizeFormMap(forms: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(forms)) {
    const normalized = normalizeToken(key);
    if (normalized && !map.has(normalized)) map.set(normalized, value);
  }
  return map;
}

const RO_FORM_MAP = normalizeFormMap(RO_FORMS);
const RU_FORM_MAP = normalizeFormMap(RU_FORMS);

/** Нормализация целой фразы: регистр, ё, скобки, знаки препинания. */
export function normalizePhrase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\([^)]*\)/g, ' ')
    .replace(new RegExp(`[^${LETTERS} -]`, 'g'), ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPhraseIndex(field: 'ru' | 'ro'): Map<string, string> {
  const other: 'ru' | 'ro' = field === 'ru' ? 'ro' : 'ru';
  const map = new Map<string, string>();
  for (const w of ALL_WORDS) {
    const key = normalizePhrase(w[field]);
    if (key && !map.has(key)) map.set(key, w[other]);
  }
  return map;
}

const RU_PHRASE_TO_RO = buildPhraseIndex('ru');
const RO_PHRASE_TO_RU = buildPhraseIndex('ro');

/**
 * Перевод фразы целиком. Нужен для устойчивых выражений вроде «приятного
 * аппетита»: отдельного значения у слова «аппетита» нет, а у фразы есть.
 */
export function lookupPhraseHint(text: string, lang: 'ru' | 'ro'): string | undefined {
  const key = normalizePhrase(text);
  if (!key || !key.includes(' ')) return undefined; // однословное — не фраза
  return (lang === 'ru' ? RU_PHRASE_TO_RO : RO_PHRASE_TO_RU).get(key);
}

/**
 * Пробует свести румынское слово к словарной форме: отсекает приклеенный
 * артикль и разворачивает множественное число. Возвращает первое
 * попадание в словарь.
 */
function guessBaseForm(key: string): string | undefined {
  const candidates: string[] = [];
  if (key.endsWith('ul')) candidates.push(key.slice(0, -2));
  if (key.endsWith('ului')) candidates.push(key.slice(0, -4));
  if (key.endsWith('le')) candidates.push(key.slice(0, -2), key.slice(0, -2) + 'e');
  if (key.endsWith('lui')) candidates.push(key.slice(0, -3), key.slice(0, -3) + 'e');
  if (key.endsWith('a')) candidates.push(key.slice(0, -1) + 'ă', key.slice(0, -1) + 'e');
  if (key.endsWith('ea')) candidates.push(key.slice(0, -2) + 'e');
  if (key.endsWith('ii')) candidates.push(key.slice(0, -1));
  if (key.endsWith('i')) candidates.push(key.slice(0, -1), key.slice(0, -1) + 'e');
  // множественное число: case → casă, flori → floare, zile → zi
  if (key.endsWith('e')) candidates.push(key.slice(0, -1) + 'ă', key.slice(0, -1));
  if (key.endsWith('uri')) candidates.push(key.slice(0, -3));

  for (const c of candidates) {
    if (c.length < 2) continue;
    const hit = RO_WORD_TO_RU.get(c);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Поиск по основе: у русских слов меняется окончание, поэтому пробуем
 * найти словарное слово с тем же началом. Берём только однозначные
 * совпадения — если основа подходит нескольким словам, молчим.
 */
function matchByStem(key: string, index: Map<string, string>): string | undefined {
  if (key.length < 5) return undefined;
  const stem = key.slice(0, Math.max(4, key.length - 2));
  let found: string | undefined;
  for (const [word, translation] of index) {
    if (!word.startsWith(stem)) continue;
    if (found && found !== translation) return undefined; // неоднозначно
    found = translation;
  }
  return found;
}

/**
 * Перевод одного слова из фразы. Если слова нет ни в словаре, ни в списках
 * форм, вернёт undefined — вызывающий код сам решит, что показать.
 */
export function lookupWordHint(token: string, lang: 'ru' | 'ro'): string | undefined {
  const key = normalizeToken(token);
  if (!key) return undefined;

  const index = lang === 'ru' ? RU_WORD_TO_RO : RO_WORD_TO_RU;
  const forms = lang === 'ru' ? RU_FORM_MAP : RO_FORM_MAP;

  // Частотные формы важнее словаря: «are» как форма глагола полезнее,
  // чем случайное совпадение с существительным.
  const form = forms.get(key);
  if (form) return form;

  const exact = index.get(key);
  if (exact) return exact;

  if (lang === 'ro') {
    // Формы и служебные слова, объяснённые уроками, точнее любых догадок.
    const fromLesson = LESSON_WORDS.get(key);
    if (fromLesson) return fromLesson;

    // Имена и города: тап по ним не должен молчать, хотя учить там нечего.
    const proper = PROPER_NAMES.get(key);
    if (proper) return proper;

    // Инфинитив после «voi», «aș», «trebuie» идёт без частицы «a», а в
    // словаре глагол лежит с ней: «voi vedea» → «a vedea».
    const bare = BARE_INFINITIVES.get(key);
    if (bare) return bare;

    const clitic = CLITICS.get(key);
    if (clitic) return clitic;

    const extra = EXTRA_WORDS.get(key);
    if (extra) return extra;

    const stripped = guessBaseForm(key);
    if (stripped) return stripped;

    // Слитные формы с клитикой: «mi-a», «spune-mi», «într-o». В словаре
    // их нет и быть не может — собираем подсказку из половинок.
    if (key.includes('-')) {
      const parts = key.split('-').filter(Boolean);
      if (parts.length === 1) {
        const only = lookupWordHint(parts[0], 'ro');
        if (only) return only;
      }
      if (parts.length > 1) {
        // Для половинок короткая клитическая расшифровка точнее словарной:
        // «am» тут вспомогательный глагол, а не «у меня есть».
        const pieces = parts.map((part) => CLITICS.get(part) ?? lookupWordHint(part, 'ro'));
        if (pieces.every(Boolean)) return pieces.join(' + ');
      }
    }
  }

  return matchByStem(key, index);
}
