import { COURSE_LESSONS, CourseChapter, GrammarLesson, getCourseLesson } from '../data/course';
import { DIALOGUES } from '../data/dialogues';
import { LIVE_TEXTS } from '../data/texts';
import { ProgressState, getDueWordIds, nextCourseLessonId } from './progress';
import { comprehensionSummary } from './comprehension';

/**
 * Что делать прямо сейчас.
 *
 * Главная причина не открыть приложение — не лень, а выбор: экран со
 * списком глав требует решения ещё до того, как начнёшь. Поэтому здесь
 * решение принимается за человека: одна кнопка, которая всегда знает,
 * что полезнее всего сделать в эту минуту, и всегда говорит, что за ней
 * будет. Обещание вместо угрозы: «откроешь вот это», а не «иначе потеряешь».
 */

export type NextActionKind = 'review' | 'lesson' | 'dialogue' | 'reading';

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
}

/** С какого числа созревших слов повторение важнее нового урока. */
const REVIEW_URGENT = 12;
export const REVIEW_BATCH = 15;

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
