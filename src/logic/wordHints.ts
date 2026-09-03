import { ALL_WORDS } from '../data';

// Подсказка по тапу на слово. Словарь знает слова в начальной форме, а в
// заданиях они стоят в живых: глагол спрягается, у существительного сзади
// приклеен артикль, русское слово склоняется. Поэтому кроме точного
// совпадения пробуем ещё три пути: список частотных форм, отсечение
// артикля и поиск по основе.

const LETTERS = 'a-zA-ZĂÂÎȘȚăâîșțА-Яа-яЁё';
const TRIM_RE = new RegExp(`^[^${LETTERS}-]+|[^${LETTERS}-]+$`, 'g');

export function normalizeToken(raw: string): string {
  return raw.replace(TRIM_RE, '').toLowerCase().trim();
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

function buildSingleWordIndex(field: 'ru' | 'ro'): Map<string, string> {
  const other: 'ru' | 'ro' = field === 'ru' ? 'ro' : 'ru';
  const map = new Map<string, string>();
  for (const w of ALL_WORDS) {
    const text = w[field].trim();
    if (!text || /\s/.test(text)) continue; // только однословные словарные записи
    const key = normalizeToken(text);
    if (!key || map.has(key)) continue;
    map.set(key, w[other]);
  }
  return map;
}

const RU_WORD_TO_RO = buildSingleWordIndex('ru');
const RO_WORD_TO_RU = buildSingleWordIndex('ro');

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
  const forms = lang === 'ru' ? RU_FORMS : RO_FORMS;

  // Частотные формы важнее словаря: «are» как форма глагола полезнее,
  // чем случайное совпадение с существительным.
  const form = forms[key];
  if (form) return form;

  const exact = index.get(key);
  if (exact) return exact;

  if (lang === 'ro') {
    const stripped = guessBaseForm(key);
    if (stripped) return stripped;
  }

  return matchByStem(key, index);
}
