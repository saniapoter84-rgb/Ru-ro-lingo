// Интерфейс на двух языках.
//
// В обычном режиме приложение говорит по-русски. Когда включён режим
// погружения, оно целиком переходит на румынский — включая кнопки, подписи
// и подбадривания. Это часть метода: если даже «Далее» написано «Continuă»,
// мозг перестаёт считать румынский «предметом» и начинает считать средой.

export type Lang = 'ru' | 'ro';

type Entry = { ru: string; ro: string };

const DICT = {
  'tab.learn': { ru: 'Слова', ro: 'Cuvinte' },
  'tab.course': { ru: 'Тропа', ro: 'Traseu' },
  'tab.immersion': { ru: 'Погружение', ro: 'Imersiune' },
  'tab.profile': { ru: 'Профиль', ro: 'Profil' },

  'common.back': { ru: 'Назад', ro: 'Înapoi' },
  'common.continue': { ru: 'Продолжить', ro: 'Continuă' },
  'common.next': { ru: 'Далее', ro: 'Mai departe' },
  'common.check': { ru: 'Проверить', ro: 'Verifică' },
  'common.close': { ru: 'Закрыть', ro: 'Închide' },
  'common.start': { ru: 'Начать', ro: 'Începe' },
  'common.retry': { ru: 'Ещё раз', ro: 'Din nou' },
  'common.done': { ru: 'Готово', ro: 'Gata' },
  'common.of': { ru: 'из', ro: 'din' },

  'home.title': { ru: 'Словарь по темам', ro: 'Vocabular pe teme' },
  'home.subtitle': {
    ru: 'Карточки и упражнения по 66 темам',
    ro: 'Cartonașe și exerciții pe 66 de teme',
  },

  'review.title': { ru: 'Повторение', ro: 'Repetare' },
  'review.due': { ru: 'слов ждут повторения', ro: 'cuvinte așteaptă repetarea' },
  'review.none': {
    ru: 'Всё повторено. Возвращайся завтра — SRS подберёт новую порцию.',
    ro: 'Totul repetat. Revino mâine — SRS pregătește o porție nouă.',
  },
  'review.start': { ru: 'Повторить сейчас', ro: 'Repetă acum' },

  'course.title': { ru: 'Тропа', ro: 'Traseul' },
  'course.subtitle': {
    ru: 'Грамматика с нуля — шаг за шагом',
    ro: 'Gramatica de la zero — pas cu pas',
  },
  'course.locked': { ru: 'Закрыто', ro: 'Blocat' },
  'course.boss': { ru: 'Босс', ro: 'Boss' },
  'course.chapterDone': { ru: 'Глава пройдена', ro: 'Capitol terminat' },
  'course.continueHere': { ru: 'Продолжить здесь', ro: 'Continuă aici' },
  'course.lessons': { ru: 'уроков', ro: 'lecții' },

  'lesson.exit': { ru: 'Выйти из урока?', ro: 'Ieși din lecție?' },
  'lesson.exitBody': {
    ru: 'Прогресс этого урока не сохранится.',
    ro: 'Progresul acestei lecții nu se salvează.',
  },
  'lesson.stay': { ru: 'Остаться', ro: 'Rămân' },
  'lesson.leave': { ru: 'Выйти', ro: 'Ies' },
  'lesson.correct': { ru: 'Верно!', ro: 'Corect!' },
  'lesson.wrong': { ru: 'Не совсем', ro: 'Nu chiar' },
  'lesson.answerIs': { ru: 'Правильно:', ro: 'Corect e:' },
  'lesson.typeHere': { ru: 'Напиши здесь…', ro: 'Scrie aici…' },
  'lesson.tapToBuild': { ru: 'Нажимай на слова по порядку', ro: 'Atinge cuvintele în ordine' },
  'lesson.tapWrong': { ru: 'Найди слово с ошибкой', ro: 'Găsește cuvântul greșit' },
  'lesson.showRu': { ru: 'Показать перевод', ro: 'Arată traducerea' },
  'lesson.gotIt': { ru: 'Понятно', ro: 'Am înțeles' },
  'lesson.combo': { ru: 'комбо', ro: 'combo' },
  'lesson.finished': { ru: 'Урок пройден!', ro: 'Lecție terminată!' },
  'lesson.perfect': { ru: 'Идеально — ни одной ошибки!', ro: 'Perfect — nicio greșeală!' },
  'lesson.accuracy': { ru: 'Точность', ro: 'Precizie' },
  'lesson.xpEarned': { ru: 'Опыт', ro: 'Experiență' },
  'lesson.bestCombo': { ru: 'Лучшее комбо', ro: 'Cel mai bun combo' },
  'lesson.newAchievement': { ru: 'Новая ачивка!', ro: 'Realizare nouă!' },

  'immersion.title': { ru: 'Погружение', ro: 'Imersiune' },
  'immersion.subtitle': {
    ru: 'Живые сцены целиком на румынском',
    ro: 'Scene reale, numai în română',
  },
  'immersion.modeOn': { ru: 'Режим погружения включён', ro: 'Modul imersiv este pornit' },
  'immersion.modeOff': { ru: 'Режим погружения выключен', ro: 'Modul imersiv este oprit' },
  'immersion.toggleHint': {
    ru: 'Интерфейс переходит на румынский, переводы прячутся под тап, а в уроках появляется больше заданий на слух.',
    ro: 'Interfața trece în română, traducerile se ascund sub atingere, iar în lecții apar mai multe exerciții de ascultare.',
  },
  'immersion.listenFirst': { ru: 'Сначала послушай', ro: 'Ascultă mai întâi' },
  'immersion.replay': { ru: 'Ещё раз', ro: 'Încă o dată' },
  'immersion.readScene': { ru: 'Читать сцену', ro: 'Citește scena' },
  'immersion.scenes': { ru: 'Сцены', ro: 'Scene' },
  'immersion.questions': { ru: 'Вопросы по сцене', ro: 'Întrebări despre scenă' },
  'immersion.phrases': { ru: 'Фразы на вынос', ro: 'Expresii de reținut' },
  'immersion.tapLine': {
    ru: 'Тапни по реплике — увидишь перевод',
    ro: 'Atinge o replică — vezi traducerea',
  },
  'immersion.sceneDone': { ru: 'Сцена разобрана', ro: 'Scenă terminată' },
  'immersion.score': { ru: 'Ответов верно', ro: 'Răspunsuri corecte' },
  'immersion.startQuestions': { ru: 'К вопросам', ro: 'La întrebări' },

  'profile.title': { ru: 'Профиль', ro: 'Profil' },
  'profile.streak': { ru: 'Дней подряд', ro: 'Zile la rând' },
  'profile.xp': { ru: 'Всего XP', ro: 'Total XP' },
  'profile.wordsMastered': { ru: 'Слов освоено', ro: 'Cuvinte învățate' },
  'profile.learning': { ru: 'Учу сейчас', ro: 'În curs' },
  'profile.dailyGoal': { ru: 'Цель на сегодня', ro: 'Obiectivul de azi' },
  'profile.goalDone': { ru: 'Цель дня выполнена!', ro: 'Obiectivul zilei atins!' },
  'profile.quests': { ru: 'Задания дня', ro: 'Misiunile zilei' },
  'profile.achievements': { ru: 'Достижения', ro: 'Realizări' },
  'profile.settings': { ru: 'Настройки', ro: 'Setări' },
  'profile.courseProgress': { ru: 'Прогресс по курсу', ro: 'Progresul cursului' },
  'profile.byTopic': { ru: 'Словарь по темам', ro: 'Vocabular pe teme' },
  'profile.rank': { ru: 'Ранг', ro: 'Rang' },
  'profile.toNextRank': { ru: 'до следующего ранга', ro: 'până la rangul următor' },
  'profile.secret': { ru: 'Секретная ачивка', ro: 'Realizare secretă' },
} satisfies Record<string, Entry>;

export type StringKey = keyof typeof DICT;

export function t(key: StringKey, lang: Lang): string {
  return DICT[key][lang];
}

/** Удобно, когда язык уже известен на уровне экрана. */
export function makeTranslator(lang: Lang) {
  return (key: StringKey) => t(key, lang);
}

export type Translate = ReturnType<typeof makeTranslator>;
