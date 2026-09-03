import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressState, createInitialProgress, toLocalDateString } from './progress';
import { createHearts } from './hearts';
import { createQuestState } from './quests';

const LEGACY_KEY = '@ru_ro_lingo/progress_v1';
const STORAGE_KEY = '@ru_ro_lingo/progress_v2';

/**
 * Приводит что угодно из хранилища к актуальной форме. Отдельные поля
 * проверяем поимённо: файл мог быть записан старой версией приложения,
 * и тогда половины ключей там просто нет.
 */
function migrate(raw: unknown): ProgressState {
  const base = createInitialProgress();
  if (!raw || typeof raw !== 'object') return base;
  const parsed = raw as Partial<ProgressState>;
  const today = toLocalDateString(new Date());

  return {
    ...base,
    ...parsed,
    words: parsed.words ?? base.words,
    completedLessonIds: parsed.completedLessonIds ?? base.completedLessonIds,
    course: parsed.course ?? base.course,
    dialogues: parsed.dialogues ?? base.dialogues,
    hearts: parsed.hearts ?? createHearts(),
    quests: parsed.quests ?? createQuestState(today),
    achievements: parsed.achievements ?? [],
    dailyGoal: parsed.dailyGoal ?? base.dailyGoal,
    immersion: parsed.immersion ?? false,
    // Стрик мог существовать в v1 — тогда он и есть «самый длинный».
    longestStreak: parsed.longestStreak ?? parsed.streak ?? 0,
  };
}

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return migrate(JSON.parse(raw));

    // Первый запуск после обновления: подхватываем прогресс старой версии,
    // чтобы выученные слова и стрик не пропали.
    const legacy = await AsyncStorage.getItem(LEGACY_KEY);
    if (legacy) return migrate(JSON.parse(legacy));

    return createInitialProgress();
  } catch (e) {
    console.warn('Не удалось загрузить прогресс, начинаем с нуля', e);
    return createInitialProgress();
  }
}

export async function saveProgress(state: ProgressState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Не удалось сохранить прогресс', e);
  }
}

export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(LEGACY_KEY);
  } catch (e) {
    console.warn('Не удалось сбросить прогресс', e);
  }
}
