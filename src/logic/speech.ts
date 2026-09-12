import * as Speech from 'expo-speech';

/**
 * Озвучка румынского.
 *
 * Два неочевидных места, из-за которых звук пропадает молча.
 *
 * Первое: expo-speech по умолчанию ставит новую фразу в очередь, а не
 * заменяет текущую, поэтому перед каждой репликой нужен `stop()`. Но
 * `stop()` асинхронный, и если вызвать `speak()` сразу за ним, остановка
 * успевает прилететь уже после старта и убивает свежую фразу. Поэтому
 * здесь `speak()` ждёт завершения `stop()`.
 *
 * Второе: если на телефоне не установлен румынский голос, движок просто
 * ничего не произносит — без исключения и без ошибки в консоли. На такой
 * случай есть повтор без указания языка: прочитает ближайшим доступным
 * голосом, с акцентом, но вслух.
 */

/** Румынский голос отсутствует — второй раз с языком не пробуем. */
let romanianVoiceBroken = false;

function run(text: string, withLanguage: boolean): void {
  Speech.speak(text, {
    language: withLanguage ? 'ro-RO' : undefined,
    pitch: 1.0,
    rate: 0.9,
    onError: () => {
      if (!withLanguage) return;
      // Голос ro-RO не отработал — дальше читаем тем, что есть.
      romanianVoiceBroken = true;
      run(text, false);
    },
  });
}

export function speakRomanian(text: string): void {
  const trimmed = text?.trim();
  if (!trimmed) return;

  Speech.stop()
    .catch(() => {
      // Останавливать было нечего — это не помеха следующей фразе.
    })
    .then(() => {
      try {
        run(trimmed, !romanianVoiceBroken);
      } catch (e) {
        console.warn('Озвучка недоступна', e);
      }
    });
}

export function stopSpeaking(): void {
  Speech.stop().catch(() => {});
}
