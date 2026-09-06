import React, { useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import {
  Lesson,
  ALL_WORDS,
  ALL_LESSONS,
  getWordById,
  getWordsForLesson,
} from './src/data';
import { CourseChapter, GrammarLesson, getCourseLesson } from './src/data/course';
import { Dialogue, DIALOGUES } from './src/data/dialogues';
import { NextAction } from './src/logic/today';
import { useProgress } from './src/logic/useProgress';
import { useFullscreen } from './src/logic/useFullscreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CourseScreen } from './src/screens/CourseScreen';
import { CourseLessonScreen } from './src/screens/CourseLessonScreen';
import { ImmersionScreen } from './src/screens/ImmersionScreen';
import { DialogueScreen } from './src/screens/DialogueScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { GrammarScreen } from './src/screens/GrammarScreen';
import { PlacementTestScreen } from './src/screens/PlacementTestScreen';
import { ReadingScreen } from './src/screens/ReadingScreen';
import { LessonFlowScreen } from './src/screens/LessonFlowScreen';
import { TabBar, TabKey } from './src/components/TabBar';
import { AchievementToast } from './src/components/AchievementToast';

type Screen =
  | { name: 'tabs' }
  | { name: 'wordLesson'; lesson: Lesson }
  | { name: 'review'; wordIds: string[] }
  | { name: 'courseLesson'; lesson: GrammarLesson; chapter: CourseChapter }
  | { name: 'dialogue'; dialogue: Dialogue }
  | { name: 'reference' }
  | { name: 'placement' };

const topInset = Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 52;

export default function App() {
  const {
    progress,
    loaded,
    lang,
    pendingAchievements,
    dismissAchievements,
    answer,
    finishLesson,
    finishReview,
    finishPlacement,
    finishCourseLesson,
    finishDialogue,
    toggleImmersion,
    toggleFullscreen,
    changeDailyGoal,
    beginPlan,
  } = useProgress();

  // Полный экран включается один раз на всё приложение и переустанавливается
  // сам, когда Android возвращает панели после сворачивания.
  useFullscreen(progress.fullscreen);

  const [screen, setScreen] = useState<Screen>({ name: 'tabs' });
  const [tab, setTab] = useState<TabKey>('course');
  /** Какой текст открыть на вкладке «Текст» — задаётся переходом извне. */
  const [readingTextId, setReadingTextId] = useState<string | null>(null);

  if (!loaded) {
    return <View style={styles.container} />;
  }

  const backToTabs = () => setScreen({ name: 'tabs' });

  /** Первый непройденный урок темы — чтобы тема открывалась «с того места». */
  function openUnit(unitId: string) {
    const lessons = ALL_LESSONS.filter((l) => l.unitId === unitId);
    const next = lessons.find((l) => !progress.completedLessonIds.includes(l.id)) ?? lessons[0];
    if (next) setScreen({ name: 'wordLesson', lesson: next });
  }

  function openText(textId: string) {
    setReadingTextId(textId);
    setTab('reading');
  }

  function openDialogueById(id: string) {
    const dialogue = DIALOGUES.find((d) => d.id === id);
    if (dialogue) setScreen({ name: 'dialogue', dialogue });
  }

  /** Единственная кнопка «Продолжить» ведёт туда, куда решила логика дня. */
  function runAction(action: NextAction) {
    if (action.kind === 'review' && action.wordIds) {
      setScreen({ name: 'review', wordIds: action.wordIds });
    } else if (action.kind === 'lesson' && action.lessonId) {
      const ref = getCourseLesson(action.lessonId);
      if (ref) setScreen({ name: 'courseLesson', lesson: ref.lesson, chapter: ref.chapter });
    } else if (action.kind === 'dialogue' && action.dialogueId) {
      openDialogueById(action.dialogueId);
    } else if (action.kind === 'reading' && action.textId) {
      openText(action.textId);
    }
  }

  // --- Полноэкранные режимы (без нижней панели) ---

  if (screen.name === 'wordLesson') {
    const words = getWordsForLesson(screen.lesson);
    const unitWords = ALL_WORDS.filter((w) => w.unitId === screen.lesson.unitId);
    return (
      <Shell fullscreen={progress.fullscreen}>
        <LessonFlowScreen
          lesson={screen.lesson}
          words={words}
          unitWords={unitWords}
          lang={lang}
          immersion={progress.immersion}
          onExit={backToTabs}
          onAnswer={answer}
          onFinishLesson={finishLesson}
        />
      </Shell>
    );
  }

  if (screen.name === 'review') {
    // Повторение — та же механика урока, но набор слов собирает SRS,
    // а не тема. Синтетический «урок» нужен только чтобы переиспользовать экран.
    const words = screen.wordIds.map(getWordById).filter((w): w is NonNullable<typeof w> => !!w);
    const reviewLesson: Lesson = {
      id: 'srs_review',
      unitId: 'srs_review',
      index: 0,
      title: 'Повторение',
      wordIds: screen.wordIds,
    };
    return (
      <Shell fullscreen={progress.fullscreen}>
        <LessonFlowScreen
          lesson={reviewLesson}
          words={words}
          unitWords={ALL_WORDS}
          lang={lang}
          immersion={progress.immersion}
          onExit={backToTabs}
          onAnswer={answer}
          onFinishLesson={finishReview}
        />
      </Shell>
    );
  }

  if (screen.name === 'courseLesson') {
    return (
      <Shell fullscreen={progress.fullscreen}>
        <CourseLessonScreen
          lesson={screen.lesson}
          chapter={screen.chapter}
          lang={lang}
          immersion={progress.immersion}
          onFinish={finishCourseLesson}
          onExit={backToTabs}
        />
      </Shell>
    );
  }

  if (screen.name === 'dialogue') {
    return (
      <Shell fullscreen={progress.fullscreen}>
        <DialogueScreen
          dialogue={screen.dialogue}
          lang={lang}
          immersion={progress.immersion}
          onFinish={(score, total, xp) => finishDialogue(screen.dialogue.id, score, total, xp)}
          onExit={backToTabs}
        />
      </Shell>
    );
  }

  if (screen.name === 'placement') {
    return (
      <Shell fullscreen={progress.fullscreen}>
        <PlacementTestScreen onFinish={finishPlacement} onExit={backToTabs} />
      </Shell>
    );
  }

  if (screen.name === 'reference') {
    return (
      <Shell fullscreen={progress.fullscreen}>
        <GrammarScreen onBack={backToTabs} />
      </Shell>
    );
  }

  // --- Вкладки ---

  let content: React.ReactNode;
  if (tab === 'course') {
    content = (
      <CourseScreen
        progress={progress}
        lang={lang}
        onOpenLesson={(lesson, chapter) => setScreen({ name: 'courseLesson', lesson, chapter })}
        onOpenReference={() => setScreen({ name: 'reference' })}
        onOpenPlacement={() => setScreen({ name: 'placement' })}
        onStartPlan={beginPlan}
        onOpenUnit={openUnit}
        onOpenText={openText}
        onOpenDialogue={openDialogueById}
        onRunAction={runAction}
      />
    );
  } else if (tab === 'words') {
    content = (
      <HomeScreen
        progress={progress}
        lang={lang}
        onOpenLesson={(lesson) => setScreen({ name: 'wordLesson', lesson })}
        onStartReview={(wordIds) => setScreen({ name: 'review', wordIds })}
      />
    );
  } else if (tab === 'reading') {
    content = <ReadingScreen progress={progress} initialTextId={readingTextId} />;
  } else if (tab === 'immersion') {
    content = (
      <ImmersionScreen
        progress={progress}
        lang={lang}
        onToggleImmersion={toggleImmersion}
        onToggleFullscreen={toggleFullscreen}
        onOpenDialogue={(dialogue) => setScreen({ name: 'dialogue', dialogue })}
      />
    );
  } else {
    content = (
      <ProfileScreen
        progress={progress}
        lang={lang}
        onToggleImmersion={toggleImmersion}
        onToggleFullscreen={toggleFullscreen}
        onChangeGoal={changeDailyGoal}
        onOpenPlacement={() => setScreen({ name: 'placement' })}
      />
    );
  }

  return (
    <Shell fullscreen={progress.fullscreen}>
      <AchievementToast ids={pendingAchievements} lang={lang} onDismiss={dismissAchievements} />
      <View style={{ flex: 1 }}>{content}</View>
      <TabBar active={tab} onChange={setTab} lang={lang} fullscreen={progress.fullscreen} />
    </Shell>
  );
}

/**
 * Общая обёртка: тёмный фон, отступ под системную строку, светлый статус-бар.
 *
 * Отступ сверху сохраняется и в полноэкранном режиме: приложение рисует
 * от края до края, и без него содержимое уезжало бы под вырез камеры. Часы
 * и иконки при этом всё равно исчезают — ради чего режим и нужен.
 */
function Shell({
  children,
  fullscreen,
}: {
  children: React.ReactNode;
  fullscreen: boolean;
}) {
  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <StatusBar style="light" hidden={fullscreen} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
