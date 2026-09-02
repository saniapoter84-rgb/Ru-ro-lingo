import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressState, createInitialProgress } from './progress';

const STORAGE_KEY = '@ru_ro_lingo/progress_v1';

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw);
    // Подстраховка на случай, если структура когда-нибудь изменится.
    return { ...createInitialProgress(), ...parsed };
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
