import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadProgress, saveProgress } from './storage';
import {
  CourseResult,
  ProgressState,
  completeLesson,
  createInitialProgress,
  markTimeOfDay,
  recordAnswer,
  recordCourseResult,
  recordDialogueResult,
  restoreHearts,
  setDailyGoal,
  setImmersion,
  settleRewards,
  spendHeart,
  syncDaily,
} from './progress';
import { Lang } from '../i18n/strings';

export interface ProgressApi {
  progress: ProgressState;
  loaded: boolean;
  /** Язык интерфейса: в режиме погружения приложение говорит по-румынски. */
  lang: Lang;
  /** Ачивки, открытые только что, — их показывает всплывашка. */
  pendingAchievements: string[];
  dismissAchievements: () => void;
  answer: (wordId: string, correct: boolean) => void;
  finishLesson: (lessonId: string) => void;
  finishCourseLesson: (result: CourseResult) => void;
  finishDialogue: (id: string, score: number, total: number, xp: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  toggleImmersion: () => void;
  changeDailyGoal: (goal: number) => void;
}

export function useProgress(): ProgressApi {
  const [state, setState] = useState<ProgressState>(createInitialProgress);
  const [loaded, setLoaded] = useState(false);
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadProgress();
      if (cancelled) return;
      setState(markTimeOfDay(syncDaily(stored)));
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Дебаунс сохранения, чтобы не писать в хранилище на каждый чих.
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveProgress(state), 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, loaded]);

  /**
   * Любое изменение прогресса проходит через эту обёртку: она начисляет
   * награды за закрытые задания дня и собирает новые ачивки, чтобы про
   * них не пришлось помнить на каждом экране.
   */
  const apply = useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((current) => {
      const { state: settled, unlockedAchievements } = settleRewards(fn(current));
      if (unlockedAchievements.length > 0) {
        setPendingAchievements((prev) => [...prev, ...unlockedAchievements]);
      }
      return settled;
    });
  }, []);

  const answer = useCallback(
    (wordId: string, correct: boolean) => apply((s) => recordAnswer(s, wordId, correct)),
    [apply]
  );

  const finishLesson = useCallback(
    (lessonId: string) => apply((s) => completeLesson(s, lessonId)),
    [apply]
  );

  const finishCourseLesson = useCallback(
    (result: CourseResult) => apply((s) => recordCourseResult(s, result)),
    [apply]
  );

  const finishDialogue = useCallback(
    (id: string, score: number, total: number, xp: number) =>
      apply((s) => recordDialogueResult(s, id, score, total, xp)),
    [apply]
  );

  const loseHeart = useCallback(() => apply(spendHeart), [apply]);
  const refillHearts = useCallback(() => apply(restoreHearts), [apply]);

  const toggleImmersion = useCallback(
    () => apply((s) => setImmersion(s, !s.immersion)),
    [apply]
  );

  const changeDailyGoal = useCallback(
    (goal: number) => apply((s) => setDailyGoal(s, goal)),
    [apply]
  );

  const dismissAchievements = useCallback(() => setPendingAchievements([]), []);

  const lang: Lang = state.immersion ? 'ro' : 'ru';

  return useMemo(
    () => ({
      progress: state,
      loaded,
      lang,
      pendingAchievements,
      dismissAchievements,
      answer,
      finishLesson,
      finishCourseLesson,
      finishDialogue,
      loseHeart,
      refillHearts,
      toggleImmersion,
      changeDailyGoal,
    }),
    [
      state,
      loaded,
      lang,
      pendingAchievements,
      dismissAchievements,
      answer,
      finishLesson,
      finishCourseLesson,
      finishDialogue,
      loseHeart,
      refillHearts,
      toggleImmersion,
      changeDailyGoal,
    ]
  );
}
