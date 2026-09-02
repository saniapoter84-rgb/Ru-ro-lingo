import React, { useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import { Lesson, ALL_WORDS, getWordsForLesson } from './src/data';
import { useProgress } from './src/logic/useProgress';
import { HomeScreen } from './src/screens/HomeScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { GrammarScreen } from './src/screens/GrammarScreen';
import { LessonFlowScreen } from './src/screens/LessonFlowScreen';
import { TabBar, TabKey } from './src/components/TabBar';

type Screen = { name: 'tabs' } | { name: 'lesson'; lesson: Lesson };

const topInset = Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 50;

export default function App() {
  const { progress, loaded, answer, finishLesson } = useProgress();
  const [screen, setScreen] = useState<Screen>({ name: 'tabs' });
  const [tab, setTab] = useState<TabKey>('home');

  if (!loaded) {
    return <View style={styles.container} />;
  }

  if (screen.name === 'lesson') {
    const words = getWordsForLesson(screen.lesson);
    const unitWords = ALL_WORDS.filter((w) => w.unitId === screen.lesson.unitId);
    return (
      <View style={[styles.container, { paddingTop: topInset }]}>
        <StatusBar style="dark" />
        <LessonFlowScreen
          lesson={screen.lesson}
          words={words}
          unitWords={unitWords}
          onExit={() => setScreen({ name: 'tabs' })}
          onAnswer={answer}
          onFinishLesson={finishLesson}
        />
      </View>
    );
  }

  let content: React.ReactNode;
  if (tab === 'home') {
    content = (
      <HomeScreen
        progress={progress}
        onOpenLesson={(lesson) => setScreen({ name: 'lesson', lesson })}
        onOpenStats={() => setTab('stats')}
      />
    );
  } else if (tab === 'grammar') {
    content = <GrammarScreen />;
  } else {
    content = <StatsScreen progress={progress} onBack={() => setTab('home')} />;
  }

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>{content}</View>
      <TabBar active={tab} onChange={setTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
