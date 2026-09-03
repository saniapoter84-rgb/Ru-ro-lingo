import React, { useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { Lesson, ALL_WORDS, getWordsForLesson } from './src/data';
import { CourseChapter, GrammarLesson } from './src/data/course';
import { Dialogue } from './src/data/dialogues';
import { useProgress } from './src/logic/useProgress';
import { syncHearts } from './src/logic/hearts';
import { HomeScreen } from './src/screens/HomeScreen';
import { CourseScreen } from './src/screens/CourseScreen';
import { CourseLessonScreen } from './src/screens/CourseLessonScreen';
import { ImmersionScreen } from './src/screens/ImmersionScreen';
import { DialogueScreen } from './src/screens/DialogueScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { GrammarScreen } from './src/screens/GrammarScreen';
import { LessonFlowScreen } from './src/screens/LessonFlowScreen';
import { TabBar, TabKey } from './src/components/TabBar';
import { AchievementToast } from './src/components/AchievementToast';

type Screen =
  | { name: 'tabs' }
  | { name: 'wordLesson'; lesson: Lesson }
  | { name: 'courseLesson'; lesson: GrammarLesson; chapter: CourseChapter }
  | { name: 'dialogue'; dialogue: Dialogue }
  | { name: 'reference' };

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
    finishCourseLesson,
    finishDialogue,
    loseHeart,
    toggleImmersion,
    changeDailyGoal,
  } = useProgress();

  const [screen, setScreen] = useState<Screen>({ name: 'tabs' });
  const [tab, setTab] = useState<TabKey>('course');

  if (!loaded) {
    return <View style={styles.container} />;
  }

  const backToTabs = () => setScreen({ name: 'tabs' });

  // --- Полноэкранные режимы (без нижней панели) ---

  if (screen.name === 'wordLesson') {
    const words = getWordsForLesson(screen.lesson);
    const unitWords = ALL_WORDS.filter((w) => w.unitId === screen.lesson.unitId);
    return (
      <Shell>
        <LessonFlowScreen
          lesson={screen.lesson}
          words={words}
          unitWords={unitWords}
          lang={lang}
          onExit={backToTabs}
          onAnswer={answer}
          onFinishLesson={finishLesson}
        />
      </Shell>
    );
  }

  if (screen.name === 'courseLesson') {
    return (
      <Shell>
        <CourseLessonScreen
          lesson={screen.lesson}
          chapter={screen.chapter}
          lang={lang}
          immersion={progress.immersion}
          availableHearts={syncHearts(progress.hearts).count}
          onLoseHeart={loseHeart}
          onFinish={finishCourseLesson}
          onExit={backToTabs}
        />
      </Shell>
    );
  }

  if (screen.name === 'dialogue') {
    return (
      <Shell>
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

  if (screen.name === 'reference') {
    return (
      <Shell>
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
      />
    );
  } else if (tab === 'words') {
    content = (
      <HomeScreen
        progress={progress}
        lang={lang}
        onOpenLesson={(lesson) => setScreen({ name: 'wordLesson', lesson })}
      />
    );
  } else if (tab === 'immersion') {
    content = (
      <ImmersionScreen
        progress={progress}
        lang={lang}
        onToggleImmersion={toggleImmersion}
        onOpenDialogue={(dialogue) => setScreen({ name: 'dialogue', dialogue })}
      />
    );
  } else {
    content = (
      <ProfileScreen
        progress={progress}
        lang={lang}
        onToggleImmersion={toggleImmersion}
        onChangeGoal={changeDailyGoal}
      />
    );
  }

  return (
    <Shell>
      <AchievementToast ids={pendingAchievements} lang={lang} onDismiss={dismissAchievements} />
      <View style={{ flex: 1 }}>{content}</View>
      <TabBar active={tab} onChange={setTab} lang={lang} />
    </Shell>
  );
}

/** Общая обёртка: тёмный фон, отступ под системную строку, светлый статус-бар. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <StatusBar style="light" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
