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
 * Тема, теорию которой уже прошли, но ни разу не отрабатывали. Берём
 * последнюю по порядку курса: практика должна идти сразу за своим уроком,
 * пока правило ещё в голове.
 */
function untrainedPackId(state: ProgressState): string | null {
  let found: string | null = null;
  for (const ref of COURSE_LESSONS) {
    const id = ref.lesson.id;
    if (!state.course[id]?.completed) break;
    if (!getDrillPack(id)) continue;
    if (!isRuleTrained(state, id)) found = id;
  }
  return found;
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

  // Теория без повторов не превращается в навык, поэтому блок практики
  // идёт раньше следующего урока: сначала закрепить, потом брать новое.
  const untrained = untrainedPackId(state);
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
