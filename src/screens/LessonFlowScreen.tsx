import React, { useState } from 'react';
import { Lesson, Word } from '../data';
import { FlashcardScreen } from './FlashcardScreen';
import { LessonScreen } from './LessonScreen';
import { Lang } from '../i18n/strings';

interface Props {
  lesson: Lesson;
  words: Word[];
  unitWords: Word[];
  lang: Lang;
  onExit: () => void;
  onAnswer: (wordId: string, correct: boolean) => void;
  onFinishLesson: (lessonId: string) => void;
}

/** Сначала карточки на знакомство (свайп влево/вправо), потом упражнения. */
export function LessonFlowScreen({
  lesson,
  words,
  unitWords,
  lang,
  onExit,
  onAnswer,
  onFinishLesson,
}: Props) {
  const [phase, setPhase] = useState<'cards' | 'exercises'>('cards');

  if (phase === 'cards') {
    return <FlashcardScreen words={words} onExit={onExit} onDone={() => setPhase('exercises')} />;
  }

  return (
    <LessonScreen
      lesson={lesson}
      words={words}
      unitWords={unitWords}
      lang={lang}
      onExit={onExit}
      onAnswer={onAnswer}
      onFinishLesson={onFinishLesson}
    />
  );
}
