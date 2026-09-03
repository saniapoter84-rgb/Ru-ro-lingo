import { CHAPTER_1 } from './ch1';
import { CHAPTER_2 } from './ch2';
import { CHAPTER_3 } from './ch3';
import { CHAPTER_4 } from './ch4';
import { CHAPTER_5 } from './ch5';
import { CHAPTER_6 } from './ch6';
import { CHAPTER_7 } from './ch7';
import { CourseChapter, GrammarLesson, isScorableStep } from './types';

export * from './types';

/** «Тропа» — путь от нуля до уровня A2, семь глав. */
export const COURSE: CourseChapter[] = [
  CHAPTER_1,
  CHAPTER_2,
  CHAPTER_3,
  CHAPTER_4,
  CHAPTER_5,
  CHAPTER_6,
  CHAPTER_7,
];

export interface CourseLessonRef {
  lesson: GrammarLesson;
  chapter: CourseChapter;
  /** Позиция урока в общем сквозном порядке курса. */
  order: number;
}

function buildIndex(): CourseLessonRef[] {
  const refs: CourseLessonRef[] = [];
  for (const chapter of COURSE) {
    for (const lesson of chapter.lessons) {
      refs.push({ lesson, chapter, order: refs.length });
    }
  }
  return refs;
}

export const COURSE_LESSONS: CourseLessonRef[] = buildIndex();

const BY_ID = new Map(COURSE_LESSONS.map((ref) => [ref.lesson.id, ref]));

export function getCourseLesson(id: string): CourseLessonRef | undefined {
  return BY_ID.get(id);
}

export function getChapter(id: string): CourseChapter | undefined {
  return COURSE.find((c) => c.id === id);
}

/** Сколько в уроке заданий (карточки правил не считаются). */
export function countTasks(lesson: GrammarLesson): number {
  return lesson.steps.filter(isScorableStep).length;
}

export const TOTAL_COURSE_LESSONS = COURSE_LESSONS.length;
export const TOTAL_COURSE_TASKS = COURSE_LESSONS.reduce(
  (sum, ref) => sum + countTasks(ref.lesson),
  0
);
