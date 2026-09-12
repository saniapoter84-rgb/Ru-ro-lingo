import { DrillPack } from './types';

export const DRILLS_CH4: DrillPack[] = [
  {
    id: 'ch4_l1',
    title: 'Глаголы на -a',
    rule:
      'Группа на -a. Обычный тип берёт окончания -, -i, -ă (cânt, cânți, cântă), тип со вставкой добавляет «-ez-» (lucrez, lucrezi, lucrează). У части глаголов меняется гласная в корне: a mânca → mănânc.',
    transformInstruction: 'Проспрягай для указанного лица',
    rows: [
      { sentence: 'Eu ___ la birou.', from: 'a lucra · eu', ro: 'lucrez', ru: 'Я работаю в офисе.', traps: ['lucru', 'lucrezi', 'lucrează'] },
      { sentence: 'Tu ___ mult.', from: 'a lucra · tu', ro: 'lucrezi', ru: 'Ты много работаешь.', traps: ['lucrez', 'lucrează', 'lucrăm'] },
      { sentence: 'El ___ acasă.', from: 'a lucra · el', ro: 'lucrează', ru: 'Он работает дома.', traps: ['lucrez', 'lucrezi', 'lucrăm'] },
      { sentence: 'Eu ___ bine.', from: 'a cânta · eu', ro: 'cânt', ru: 'Я хорошо пою.', traps: ['cântez', 'cânți', 'cântă'] },
      { sentence: 'Tu ___ frumos.', from: 'a cânta · tu', ro: 'cânți', ru: 'Ты красиво поёшь.', traps: ['cânt', 'cântă', 'cântăm'] },
      { sentence: 'Eu ___ acum.', from: 'a mânca · eu', ro: 'mănânc', ru: 'Я сейчас ем.', traps: ['mânc', 'mănânci', 'mănâncă'], note: 'Гласная в корне меняется: a → ă.' },
      { sentence: 'El ___ o pizza.', from: 'a mânca · el', ro: 'mănâncă', ru: 'Он ест пиццу.', traps: ['mănânc', 'mănânci', 'mâncă'] },
      { sentence: 'Noi ___ în casă.', from: 'a intra · noi', ro: 'intrăm', ru: 'Мы входим в дом.', traps: ['intru', 'intri', 'intră'] },
      { sentence: 'Eu ___ acum.', from: 'a pleca · eu', ro: 'plec', ru: 'Я сейчас ухожу.', traps: ['plecez', 'pleci', 'pleacă'] },
      { sentence: 'El ___ mâine.', from: 'a pleca · el', ro: 'pleacă', ru: 'Он уезжает завтра.', traps: ['plec', 'pleci', 'plecă'] },
    ],
  },
  {
    id: 'ch4_l2',
    title: 'Глаголы на -e и -ea',
    rule:
      'Группы на -e и -ea: merg, mergi, merge и văd, vezi, vede. Первое лицо часто оканчивается на согласную или «-u»: fac, scriu, beau.',
    transformInstruction: 'Проспрягай для указанного лица',
    rows: [
      { sentence: 'Eu ___ la școală.', from: 'a merge · eu', ro: 'merg', ru: 'Я иду в школу.', traps: ['mergi', 'merge', 'mergem'] },
      { sentence: 'Tu ___ pe jos?', from: 'a merge · tu', ro: 'mergi', ru: 'Ты идёшь пешком?', traps: ['merg', 'merge', 'mergeți'] },
      { sentence: 'Noi ___ la mare.', from: 'a merge · noi', ro: 'mergem', ru: 'Мы едем на море.', traps: ['merg', 'mergeți', 'merge'] },
      { sentence: 'Ce ___ eu acum?', from: 'a face · eu', ro: 'fac', ru: 'Что мне сейчас делать?', traps: ['faci', 'face', 'facem'] },
      { sentence: 'Ce ___?', from: 'a face · tu', ro: 'faci', ru: 'Что делаешь?', traps: ['fac', 'face', 'faceți'] },
      { sentence: 'El ___ cafea.', from: 'a face · el', ro: 'face', ru: 'Он делает кофе.', traps: ['fac', 'faci', 'facem'] },
      { sentence: 'Eu ___ bine.', from: 'a vedea · eu', ro: 'văd', ru: 'Я хорошо вижу.', traps: ['vezi', 'vede', 'vedem'] },
      { sentence: 'Tu ___ ceva?', from: 'a vedea · tu', ro: 'vezi', ru: 'Ты что-то видишь?', traps: ['văd', 'vede', 'vedeți'] },
      { sentence: 'Eu ___ cafea.', from: 'a bea · eu', ro: 'beau', ru: 'Я пью кофе.', traps: ['bei', 'bea', 'bem'] },
      { sentence: 'Eu ___ o scrisoare.', from: 'a scrie · eu', ro: 'scriu', ru: 'Я пишу письмо.', traps: ['scrii', 'scrie', 'scriem'] },
    ],
  },
  {
    id: 'ch4_l3',
    title: 'Глаголы на -i',
    rule:
      'Группа на -i делится надвое. Со вставкой «-esc-»: vorbesc, vorbești, vorbește. Без вставки: dorm, dormi, doarme. Какой тип у глагола — приходится запоминать.',
    transformInstruction: 'Проспрягай для указанного лица',
    rows: [
      { sentence: 'Eu ___ românește.', from: 'a vorbi · eu', ro: 'vorbesc', ru: 'Я говорю по-румынски.', traps: ['vorb', 'vorbești', 'vorbește'], note: 'Тип со вставкой «-esc-».' },
      { sentence: 'Tu ___ prea repede.', from: 'a vorbi · tu', ro: 'vorbești', ru: 'Ты говоришь слишком быстро.', traps: ['vorbesc', 'vorbește', 'vorbim'] },
      { sentence: 'El ___ trei limbi.', from: 'a vorbi · el', ro: 'vorbește', ru: 'Он говорит на трёх языках.', traps: ['vorbesc', 'vorbești', 'vorbim'] },
      { sentence: 'Eu ___ o carte.', from: 'a citi · eu', ro: 'citesc', ru: 'Я читаю книгу.', traps: ['cit', 'citești', 'citește'] },
      { sentence: 'Noi ___ seara.', from: 'a citi · noi', ro: 'citim', ru: 'Мы читаем по вечерам.', traps: ['citesc', 'citiți', 'citește'] },
      { sentence: 'Eu ___ opt ore.', from: 'a dormi · eu', ro: 'dorm', ru: 'Я сплю восемь часов.', traps: ['dormesc', 'dormi', 'doarme'], note: 'Этот тип идёт без вставки «-esc-».' },
      { sentence: 'El ___ deja.', from: 'a dormi · el', ro: 'doarme', ru: 'Он уже спит.', traps: ['dorm', 'dormi', 'dormim'] },
      { sentence: 'Eu ___ mâine.', from: 'a veni · eu', ro: 'vin', ru: 'Я приду завтра.', traps: ['venesc', 'vii', 'vine'] },
      { sentence: 'Tu ___ cu noi?', from: 'a veni · tu', ro: 'vii', ru: 'Ты идёшь с нами?', traps: ['vin', 'vine', 'veniți'] },
      { sentence: 'Nu ___ cheile.', from: 'a găsi · eu', ro: 'găsesc', ru: 'Я не нахожу ключи.', traps: ['găs', 'găsești', 'găsește'] },
    ],
  },
  {
    id: 'ch4_l4',
    title: 'Хочу, могу, беру, стою',
    rule:
      'Четыре самых частых глагола неправильные: vreau / vrei / vrea, pot / poți / poate, iau / iei / ia, stau / stai / stă. Их проще выучить целиком, чем выводить по правилу.',
    rows: [
      { sentence: 'Eu ___ o cafea.', ro: 'vreau', ru: 'Я хочу кофе.', traps: ['vrei', 'vrea', 'vrem'] },
      { sentence: 'Tu ___ să vii?', ro: 'vrei', ru: 'Ты хочешь прийти?', traps: ['vreau', 'vrea', 'vreți'] },
      { sentence: 'El ___ să plece.', ro: 'vrea', ru: 'Он хочет уйти.', traps: ['vreau', 'vrei', 'vrem'] },
      { sentence: 'Eu ___ să te ajut.', ro: 'pot', ru: 'Я могу тебе помочь.', traps: ['poți', 'poate', 'putem'] },
      { sentence: 'Tu ___ să vorbești?', ro: 'poți', ru: 'Ты можешь говорить?', traps: ['pot', 'poate', 'puteți'] },
      { sentence: 'El ___ veni mâine.', ro: 'poate', ru: 'Он может прийти завтра.', traps: ['pot', 'poți', 'putem'] },
      { sentence: 'Eu ___ autobuzul.', ro: 'iau', ru: 'Я еду на автобусе.', traps: ['ia', 'iei', 'luăm'] },
      { sentence: 'Tu ___ taxiul?', ro: 'iei', ru: 'Ты берёшь такси?', traps: ['iau', 'ia', 'luați'] },
      { sentence: 'Eu ___ acasă azi.', ro: 'stau', ru: 'Сегодня я дома.', traps: ['stai', 'stă', 'stăm'] },
      { sentence: 'El ___ la hotel.', ro: 'stă', ru: 'Он живёт в отеле.', traps: ['stau', 'stai', 'stăm'] },
    ],
  },
  {
    id: 'ch4_l5',
    title: 'Возвратные глаголы',
    rule:
      'Русское «-ся» стало отдельным словом перед глаголом: mă, te, se, ne, vă, se. При отрицании первым идёт «nu», частица — сразу за ним: nu mă simt bine.',
    rows: [
      { sentence: 'Eu ___ numesc Ana.', ro: 'mă', ru: 'Меня зовут Ана.', traps: ['te', 'se', 'ne'] },
      { sentence: 'Cum ___ numești?', ro: 'te', ru: 'Как тебя зовут?', traps: ['mă', 'se', 'vă'] },
      { sentence: 'El ___ numește Ion.', ro: 'se', ru: 'Его зовут Ион.', traps: ['mă', 'te', 'ne'] },
      { sentence: 'Noi ___ trezim devreme.', ro: 'ne', ru: 'Мы встаём рано.', traps: ['mă', 'vă', 'se'] },
      { sentence: 'Voi ___ odihniți?', ro: 'vă', ru: 'Вы отдыхаете?', traps: ['ne', 'se', 'te'] },
      { sentence: 'Ei ___ distrează.', ro: 'se', ru: 'Они развлекаются.', traps: ['ne', 'vă', 'mă'] },
      { sentence: 'Eu ___ spăl pe mâini.', ro: 'mă', ru: 'Я мою руки.', traps: ['te', 'se', 'ne'] },
      { sentence: 'Nu ___ simt bine.', ro: 'mă', ru: 'Я плохо себя чувствую.', traps: ['te', 'se', 'ne'], note: 'При отрицании «nu» встаёт первым, частица — сразу за ним.' },
      { sentence: 'Ea ___ îmbracă repede.', ro: 'se', ru: 'Она быстро одевается.', traps: ['mă', 'te', 'ne'] },
      { sentence: 'Tu ___ grăbești?', ro: 'te', ru: 'Ты торопишься?', traps: ['mă', 'se', 'vă'] },
    ],
  },
];
