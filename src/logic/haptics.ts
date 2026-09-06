import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Вся вибрация приложения — через этот файл.
 *
 * Отклик в руке делает интерфейс «живым» сильнее, чем любая анимация:
 * палец получает подтверждение раньше, чем глаз успевает прочитать
 * результат. Поэтому тактильность здесь не украшение, а часть UX — но
 * дозированная: сильный отклик оставлен только для важных событий,
 * иначе телефон превращается в дрель и его хочется выключить.
 */
export type HapticKind =
  /** Обычное нажатие: кнопка, вариант ответа, фишка. */
  | 'tap'
  /** Выбор из ряда: вкладка, чип цели, переключатель. */
  | 'select'
  /** Правильный ответ. */
  | 'ok'
  /** Неправильный ответ — не «наказание», просто другой характер отклика. */
  | 'miss'
  /** Что-то завершилось: урок, глава, повторение. */
  | 'done';

const enabled = Platform.OS !== 'web';

export function haptic(kind: HapticKind = 'tap'): void {
  if (!enabled) return;
  try {
    switch (kind) {
      case 'select':
        Haptics.selectionAsync().catch(() => {});
        break;
      case 'ok':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        break;
      case 'miss':
        // Именно Medium, а не Error: резкий «ошибочный» паттерн читается
        // телом как окрик. Ошибаться при изучении языка нормально.
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        break;
      case 'done':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  } catch {
    // Вибромотора может не быть — это не повод падать.
  }
}
