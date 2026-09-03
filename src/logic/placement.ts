import { COURSE, ChoiceStep, CourseChapter } from '../data/course';
import { shuffle } from './courseEngine';

// Тест на определение уровня. Смысл — не заставлять человека, который уже
// что-то знает, прокликивать «Eu sunt student» пятнадцать раз подряд.
//
// Устройство простое и честное: глава за главой, по пять вопросов на
// каждую. Сдал главу — она отмечается пройденной и открывается следующая.
// Не сдал — тест на этом заканчивается: раз глава 4 не даётся, проверять
// главу 6 незачем, курс всё равно идёт по порядку.

export const QUESTIONS_PER_CHAPTER = 5;
/** Сколько нужно ответить верно, чтобы глава засчиталась. */
export const PASS_THRESHOLD = 4;

export interface PlacementQuestion {
  chapterId: string;
  chapterTitle: string;
  prompt: string;
  ru?: string;
  options: string[];
  correct: number;
  explain?: string;
}

/** Все задания-выборы главы — из них и набирается выборка. */
function choiceStepsOf(chapter: CourseChapter): ChoiceStep[] {
  const steps: ChoiceStep[] = [];
  for (const lesson of chapter.lessons) {
    for (const step of lesson.steps) {
      if (step.kind === 'choice') steps.push(step);
    }
  }
  return steps;
}

/**
 * Вопросы для одной главы. Берём из разных уроков вперемешку, чтобы тест
 * не сводился к первому уроку главы, и перемешиваем варианты ответов —
 * иначе при повторном прохождении можно было бы запомнить позиции.
 */
export function buildChapterQuestions(chapterIndex: number): PlacementQuestion[] {
  const chapter = COURSE[chapterIndex];
  if (!chapter) return [];

  const picked = shuffle(choiceStepsOf(chapter)).slice(0, QUESTIONS_PER_CHAPTER);

  return picked.map((step) => {
    const correctText = step.options[step.correct];
    const options = shuffle(step.options);
    return {
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      prompt: step.prompt,
      ru: step.ru,
      options,
      correct: options.indexOf(correctText),
      explain: step.explain,
    };
  });
}

export const TOTAL_TEST_CHAPTERS = COURSE.length;

/** Максимальная длина теста — для прогресс-бара «худшего случая». */
export const MAX_TEST_QUESTIONS = TOTAL_TEST_CHAPTERS * QUESTIONS_PER_CHAPTER;

export function chapterPassed(correctCount: number): boolean {
  return correctCount >= PASS_THRESHOLD;
}

/** Названия глав, которые тест признал known — для экрана результата. */
export function chapterTitles(count: number): string[] {
  return COURSE.slice(0, count).map((c) => c.title);
}

/** Сколько уроков будет отмечено пройденными при таком результате. */
export function lessonsCovered(chapterCount: number): number {
  return COURSE.slice(0, chapterCount).reduce((sum, c) => sum + c.lessons.length, 0);
}
