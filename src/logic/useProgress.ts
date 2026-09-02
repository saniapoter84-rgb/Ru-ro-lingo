import { useCallback, useEffect, useRef, useState } from 'react';
import { loadProgress, saveProgress } from './storage';
import {
  ProgressState,
  completeLesson,
  createInitialProgress,
  recordAnswer,
  touchDailyStreak,
} from './progress';

export function useProgress() {
  const [state, setState] = useState<ProgressState>(createInitialProgress());
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loadedState = await loadProgress();
      const withStreak = touchDailyStreak(loadedState);
      if (!cancelled) {
        setState(withStreak);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Дебаунс сохранения, чтобы не писать в хранилище на каждый чих.
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProgress(state);
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, loaded]);

  const answer = useCallback((wordId: string, correct: boolean) => {
    setState((s) => recordAnswer(s, wordId, correct));
  }, []);

  const finishLesson = useCallback((lessonId: string) => {
    setState((s) => completeLesson(s, lessonId));
  }, []);

  return { progress: state, loaded, answer, finishLesson };
}
