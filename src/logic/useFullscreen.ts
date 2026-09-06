import { useEffect } from 'react';
import { AppState, Platform, StatusBar } from 'react-native';
import { NavigationBar, setVisibilityAsync } from 'expo-navigation-bar';

/**
 * Полноэкранный режим: убирает системные часы, иконки и панель навигации.
 *
 * Смысл ровно тот же, что у режима погружения: пока учишь язык, на экране
 * не должно быть ничего чужого. Уведомления, время и три кнопки внизу —
 * это постоянное напоминание, что за приложением есть телефон, и внимание
 * туда утекает само.
 *
 * Android возвращает панели при сворачивании и при свайпе от края, поэтому
 * режим приходится включать заново каждый раз, когда приложение снова
 * становится активным. Свайп от края всё так же показывает панели на пару
 * секунд — выйти из приложения можно всегда, ничего не блокируется.
 */
export function useFullscreen(enabled: boolean): void {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    function apply() {
      StatusBar.setHidden(enabled, 'fade');
      try {
        NavigationBar.setHidden(enabled);
      } catch {
        // Старое API на случай, если новое в этой сборке недоступно.
        setVisibilityAsync(enabled ? 'hidden' : 'visible').catch(() => {});
      }
    }

    apply();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') apply();
    });

    return () => subscription.remove();
  }, [enabled]);
}
