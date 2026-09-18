import { COURSE_LESSONS, CourseChapter, GrammarLesson, getCourseLesson } from '../data/course';
import { DIALOGUES } from '../data/dialogues';
import { LIVE_TEXTS } from '../data/texts';
import { DRILL_PACK_IDS, getDrillPack } from '../data/drills';
import {
  ProgressState,
  getDueRuleIds,
  getDueWordIds,
  isRuleTrained,
  nextCourseLessonId,
} from './progress';
import { comprehensionSummary } from './comprehension';
import { planStatus } from './plan';
import { DRILL_FULL, DRILL_SHORT } from './drills';

/**
 * Что делать прямо сейчас.
 *
 * Главная причина не открыть приложение — не лень, а выбор: экран со
 * списком глав требует решения ещё до того, как начнёшь. Поэтому здесь
 * решение принимается за человека: одна кнопка, которая всегда знает,
 * что полезнее всего сделать в эту минуту, и всегда говорит, что за ней
 * будет. Обещание вместо угрозы: «откроешь вот это», а не «иначе потеряешь».
 */

export type NextActionKind = 'review' | 'lesson' | 'dialogue' | 'reading' | 'drill' | 'recall';

export interface NextAction {
  kind: NextActionKind;
  /** Надпись на кнопке. */
  action: string;
  /** Что это за занятие — строкой над кнопкой. */
  title: string;
  /** Ради чего: то самое, что откроется. Это и есть крючок. */
  teaser: string;
  /** Сколько займёт — чтобы «на минутку» было честным обещанием. */
  meta: string;
  lessonId?: string;
  chapter?: CourseChapter;
  lesson?: GrammarLesson;
  wordIds?: string[];
  dialogueId?: string;
  textId?: string;
  /** Темы тренажёра, из которых собирается практика. */
  packIds?: string[];
  /** Сколько заданий будет в блоке. */
  taskCount?: number;
}

/** С какого числа созревших слов повторение важнее нового урока. */
const REVIEW_URGENT = 12;
export const REVIEW_BATCH = 15;
/** Сколько тем берём в одно напоминание — чтобы оно осталось коротким. */
const RECALL_THEMES = 3;

/**
 * Сколько уроков должно пройти после темы, прежде чем предлагать по ней
 * практику.
 *
 * Сразу после урока правило ещё лежит в оперативной памяти: двадцать
 * заданий по горячим следам проверяют не знание, а кратковременную
 * память. Толк появляется, когда между теорией и практикой успело
 * вклиниться что-то другое.
 */
const DRILL_DELAY_LESSONS = 2;

/**
 * Тема, которую пора отработать: теория пройдена, с тех пор сделано ещё
 * хотя бы пара уроков, а практики по ней не было.
 *
 * Из всех подошедших берём не первую и не последнюю, а случайную —
 * иначе порядок практики повторяет порядок курса, и возвращение к теме
 * перестаёт быть возвращением.
 */
function untrainedPackId(state: ProgressState, now: number): string | null {
  const completed: string[] = [];
  for (const ref of COURSE_LESSONS) {
    if (!state.course[ref.lesson.id]?.completed) break;
    completed.push(ref.lesson.id);
  }

  const eligible = completed
    .slice(0, Math.max(0, completed.length - DRILL_DELAY_LESSONS))
    .filter((id) => getDrillPack(id) && !isRuleTrained(state, id));

  if (eligible.length === 0) return null;
  // Выбор стабилен в пределах дня: одна и та же тема не прыгает при
  // каждом возврате на экран.
  const day = Math.floor(now / (24 * 60 * 60 * 1000));
  return eligible[day % eligible.length];
}

/**
 * Сцена, до которой человек дорос.
 *
 * Раньше сцены ждали конца всего курса — то есть их не видели вовсе.
 * Живая речь нужна по дороге: как только грамматика недели наполовину
 * закрыта, разговор по её теме уже вытягивается.
 *
 * Смотрим по всем неделям сразу, а не только по текущей. «Текущая» —
 * это первая незакрытая, а неделя не закрывается, пока не выучен её
 * словарь; грамматика при этом может уйти далеко вперёд, и сцены за
 * пройденные темы так и не всплыли бы никогда.
 */
function readyDialogueId(state: ProgressState): string | null {
  for (const week of planStatus(state).weeks) {
    const grammarReady =
      week.lessonsTotal === 0 || week.lessonsDone / week.lessonsTotal >= 0.5;
    if (!grammarReady) break;

    const pending = week.week.dialogueIds.find((id) => !state.dialogues[id]?.completed);
    if (pending) return pending;
  }
  return null;
}

/** Первое правило урока — самое понятное обещание того, что откроется. */
function lessonTeaser(lesson: GrammarLesson): string {
  const rule = lesson.steps.find((step) => step.kind === 'rule');
  if (rule && rule.kind === 'rule') return rule.title;
  return lesson.subtitle;
}

function minutesFor(taskCount: number): string {
  const minutes = Math.max(2, Math.round(taskCount * 0.35));
  return `≈ ${minutes} мин`;
}

export function nextAction(state: ProgressState, now: number = Date.now()): NextAction {
  const due = getDueWordIds(state, now);

  // Правила забываются так же, как слова. Когда тема всплывает по
  // интервальному повторению, она возвращается коротким блоком — тем же
  // материалом, но на пару минут, а не на двадцать заданий.
  const dueRules = getDueRuleIds(state, DRILL_PACK_IDS, now).slice(0, RECALL_THEMES);
  if (dueRules.length > 0) {
    const titles = dueRules
      .map((id) => getDrillPack(id)?.title)
      .filter((title): title is string => !!title);
    return {
      kind: 'recall',
      action: 'Напомнить',
      title: 'Короткое напоминание',
      teaser:
        titles.length === 1
          ? `${titles[0]} — тема начала забываться, вернём её за пару минут`
          : `${titles.join(', ')} — пора освежить`,
      meta: `${dueRules.length * DRILL_SHORT} заданий · ≈ ${Math.max(2, dueRules.length * 2)} мин`,
      packIds: dueRules,
      taskCount: dueRules.length * DRILL_SHORT,
    };
  }

  // Созревшие слова — это то, что вот-вот забудется. Если их накопилось
  // много, любое новое знание поверх осыпающегося старого бессмысленно.
  if (due.length >= REVIEW_URGENT) {
    const batch = due.slice(0, REVIEW_BATCH);
    return {
      kind: 'review',
      action: 'Повторить',
      title: 'Повторение',
      teaser: `${due.length} слов на грани забывания — вернём их за один подход`,
      meta: minutesFor(batch.length),
      wordIds: batch,
    };
  }

  // Сцена идёт вперёд практики. Незакреплённые темы есть почти всегда,
  // и если пропускать сцену ради тренажёра, она не наступит никогда.
  const readyScene = readyDialogueId(state);
  if (readyScene) {
    const scene = DIALOGUES.find((d) => d.id === readyScene);
    if (scene) {
      return {
        kind: 'dialogue',
        action: 'Открыть сцену',
        title: 'Живая речь',
        teaser: `${scene.title} — грамматика для неё уже пройдена`,
        meta: '≈ 5 мин',
        dialogueId: scene.id,
      };
    }
  }

  // Теория без повторов не превращается в навык, поэтому блок практики
  // идёт раньше следующего урока: сначала закрепить, потом брать новое.
  const untrained = untrainedPackId(state, now);
  if (untrained) {
    const pack = getDrillPack(untrained);
    if (pack) {
      return {
        kind: 'drill',
        action: 'Закрепить',
        title: 'Практика',
        teaser: `${pack.title} — ${DRILL_FULL} повторов, чтобы правило осело`,
        meta: `${DRILL_FULL} заданий · ≈ 6 мин`,
        packIds: [untrained],
        taskCount: DRILL_FULL,
      };
    }
  }

  const nextId = nextCourseLessonId(state);
  if (nextId) {
    const ref = getCourseLesson(nextId);
    if (ref) {
      const done = COURSE_LESSONS.filter((r) => state.course[r.lesson.id]?.completed).length;
      return {
        kind: 'lesson',
        action: 'Продолжить',
        title: `${ref.chapter.title} · урок ${done + 1}`,
        teaser: lessonTeaser(ref.lesson),
        meta: minutesFor(ref.lesson.steps.length),
        lessonId: nextId,
        chapter: ref.chapter,
        lesson: ref.lesson,
      };
    }
  }

  // Курс пройден — дальше держит живая речь.
  const scene = DIALOGUES.find((d) => !state.dialogues[d.id]?.completed);
  if (scene) {
    return {
      kind: 'dialogue',
      action: 'Открыть сцену',
      title: 'Погружение',
      teaser: scene.title,
      meta: '≈ 5 мин',
      dialogueId: scene.id,
    };
  }

  if (due.length > 0) {
    return {
      kind: 'review',
      action: 'Повторить',
      title: 'Повторение',
      teaser: `${due.length} слов ждут — это единственное, что сегодня осыпается`,
      meta: minutesFor(Math.min(due.length, REVIEW_BATCH)),
      wordIds: due.slice(0, REVIEW_BATCH),
    };
  }

  const summary = comprehensionSummary(state);
  return {
    kind: 'reading',
    action: 'Читать',
    title: 'Живой текст',
    teaser: `${summary.best.title} — узнаёшь ${Math.round(summary.bestRatio * 100)}% слов`,
    meta: '≈ 3 мин',
    textId: summary.best.id,
  };
}

/** Сколько текстов уже читается — короткая сводка для карточки на «Тропе». */
export function readingTeaser(state: ProgressState): { ratio: number; textId: string } {
  const summary = comprehensionSummary(state);
  return { ratio: summary.ratio, textId: summary.best.id };
}

export const TOTAL_TEXTS = LIVE_TEXTS.length;
