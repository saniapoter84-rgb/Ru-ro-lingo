import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadProgress, saveProgress } from './storage';
import {
  CourseResult,
  ProgressState,
  completeLesson,
  applyPlacement,
  completeReview,
  createInitialProgress,
  markTimeOfDay,
  recordAnswer,
  recordCourseResult,
  recordDialogueResult,
  setDailyGoal,
  setFullscreen,
  setImmersion,
  startPlan,
  settleRewards,
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
  finishReview: () => void;
  finishPlacement: (knownChapters: number) => void;
  finishCourseLesson: (result: CourseResult) => void;
  finishDialogue: (id: string, score: number, total: number, xp: number) => void;
  toggleImmersion: () => void;
  toggleFullscreen: () => void;
  changeDailyGoal: (goal: number) => void;
  /** Запустить план или сдвинуть его на сегодня. */
  beginPlan: () => void;
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
   * Любое изменение прогресса проходит через эту обёртку: она заодно
   * начисляет награды за закрытые задания дня и отмечает новые ачивки,
   * чтобы про них не пришлось помнить на каждом экране.
   *
   * Функция обновления состояния обязана быть чистой, поэтому показ
   * всплывашки живёт не здесь, а в эффекте ниже — он сравнивает список
   * ачивок с предыдущим.
   */
  const apply = useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((current) => settleRewards(fn(current)).state);
  }, []);

  const seenAchievements = useRef<string[] | null>(null);

  useEffect(() => {
    if (!loaded) return;
    // Первый проход после загрузки: запоминаем уже полученное молча,
    // иначе при каждом запуске посыпались бы старые ачивки.
    if (seenAchievements.current === null) {
      seenAchievements.current = state.achievements;
      return;
    }
    const before = new Set(seenAchievements.current);
    const fresh = state.achievements.filter((id) => !before.has(id));
    if (fresh.length > 0) {
      setPendingAchievements((prev) => [...prev, ...fresh]);
    }
    seenAchievements.current = state.achievements;
  }, [state.achievements, loaded]);

  const answer = useCallback(
    (wordId: string, correct: boolean) => apply((s) => recordAnswer(s, wordId, correct)),
    [apply]
  );

  const finishLesson = useCallback(
    (lessonId: string) => apply((s) => completeLesson(s, lessonId)),
    [apply]
  );

  const finishReview = useCallback(() => apply(completeReview), [apply]);

  const finishPlacement = useCallback(
    (knownChapters: number) => apply((s) => applyPlacement(s, knownChapters)),
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

  const toggleImmersion = useCallback(
    () => apply((s) => setImmersion(s, !s.immersion)),
    [apply]
  );

  const toggleFullscreen = useCallback(
    () => apply((s) => setFullscreen(s, !s.fullscreen)),
    [apply]
  );

  const changeDailyGoal = useCallback(
    (goal: number) => apply((s) => setDailyGoal(s, goal)),
    [apply]
  );

  const beginPlan = useCallback(() => apply((s) => startPlan(s)), [apply]);

  // Убираем только показанную — если открылось несколько сразу,
  // следующая покажется вместо неё, а не потеряется.
  const dismissAchievements = useCallback(
    () => setPendingAchievements((prev) => prev.slice(1)),
    []
  );

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
      finishReview,
      finishPlacement,
      finishCourseLesson,
      finishDialogue,
      toggleImmersion,
      toggleFullscreen,
      changeDailyGoal,
      beginPlan,
    }),
    [
      state,
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
    ]
  );
}
