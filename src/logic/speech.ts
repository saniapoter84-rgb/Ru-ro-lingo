import * as Speech from 'expo-speech';

/** Озвучивает румынский текст. Если голос ro-RO недоступен на устройстве,
 * expo-speech обычно всё равно попытается прочитать текст ближайшим доступным
 * движком — ошибку молча проглатываем, чтобы не ломать урок из-за озвучки. */
export function speakRomanian(text: string) {
  try {
    Speech.stop();
    Speech.speak(text, {
      language: 'ro-RO',
      pitch: 1.0,
      rate: 0.9,
    });
  } catch (e) {
    console.warn('Озвучка недоступна', e);
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
