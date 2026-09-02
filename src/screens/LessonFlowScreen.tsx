import React, { useState } from 'react';
import { Lesson, Word } from '../data';
import { FlashcardScreen } from './FlashcardScreen';
import { LessonScreen } from './LessonScreen';

interface Props {
  lesson: Lesson;
  words: Word[];
  unitWords: Word[];
  onExit: () => void;
  onAnswer: (wordId: string, correct: boolean) => void;
  onFinishLesson: (lessonId: string) => void;
}

/** Сначала карточки на повторение (свайп влево/вправо), потом обычные упражнения урока. */
export function LessonFlowScreen({ lesson, words, unitWords, onExit, onAnswer, onFinishLesson }: Props) {
  const [phase, setPhase] = useState<'cards' | 'exercises'>('cards');

  if (phase === 'cards') {
    return <FlashcardScreen words={words} onExit={onExit} onDone={() => setPhase('exercises')} />;
  }

  return (
    <LessonScreen
      lesson={lesson}
      words={words}
      unitWords={unitWords}
      onExit={onExit}
      onAnswer={onAnswer}
      onFinishLesson={onFinishLesson}
    />
  );
}
