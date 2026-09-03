import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { lookupPhraseHint, lookupWordHint } from '../logic/wordHints';

interface Props {
  text: string;
  lang: 'ru' | 'ro';
  /**
   * Перевод всей фразы — показывается, если для тапнутого слова нет
   * отдельной подсказки. В заданиях на ввод НЕ передаётся: там перевод
   * фразы и есть правильный ответ, показывать его нельзя.
   */
  fallback?: string;
  textStyle?: StyleProp<TextStyle>;
}

interface ActiveHint {
  index: number;
  word: string;
  translation: string | null;
  /** Перевод всей фразы, а не одного слова — подписываем иначе. */
  whole: boolean;
}

/** Определяет язык текста по наличию кириллицы. */
export function detectLang(text: string): 'ru' | 'ro' {
  return /[А-Яа-яЁё]/.test(text) ? 'ru' : 'ro';
}

/**
 * Текст, в котором можно тапнуть по любому слову и увидеть его перевод.
 * Слова подчёркнуты пунктиром — иначе никто не догадается, что по ним
 * вообще можно нажимать.
 */
export function TappableWords({ text, lang, fallback, textStyle }: Props) {
  const [active, setActive] = useState<ActiveHint | null>(null);
  const parts = text.split(/(\s+)/);

  function onWordPress(piece: string, index: number) {
    setActive((prev) => {
      if (prev?.index === index) return null;

      const hint = lookupWordHint(piece, lang);
      if (hint) return { index, word: piece, translation: hint, whole: false };

      // У слова отдельного значения нет — возможно, вся фраза есть
      // в словаре целиком («приятного аппетита»).
      const phrase = lookupPhraseHint(text, lang);
      if (phrase) return { index, word: text, translation: phrase, whole: true };

      return { index, word: piece, translation: fallback ?? null, whole: !!fallback };
    });
  }

  return (
    <View>
      <View style={styles.wrap}>
        {parts.map((piece, i) => {
          if (piece === '' || /^\s+$/.test(piece)) {
            return (
              <Text key={i} style={textStyle}>
                {piece}
              </Text>
            );
          }
          // «___» — это пропуск в задании, а не слово: не подчёркиваем
          // и не даём по нему тапать.
          if (/^_+$/.test(piece)) {
            return (
              <Text key={i} style={[textStyle, styles.gap]}>
                {'\u2007\u2007\u2007\u2007'}
              </Text>
            );
          }

          const isActive = active?.index === i;
          return (
            <Pressable key={i} onPress={() => onWordPress(piece, i)} hitSlop={4}>
              <Text style={[textStyle, styles.word, isActive && styles.wordActive]}>{piece}</Text>
            </Pressable>
          );
        })}
      </View>

      {active ? (
        <View style={[styles.hintBox, !active.translation && styles.hintBoxEmpty]}>
          {active.translation ? (
            <Text style={styles.hintText}>
              {active.whole ? <Text style={styles.hintLabel}>вся фраза: </Text> : null}
              <Text style={styles.hintWord}>{active.word}</Text> — {active.translation}
            </Text>
          ) : (
            <Text style={styles.hintEmptyText}>
              Для этого слова подсказки нет — попробуй соседнее
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  gap: {
    color: colors.primaryBright,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
  },
  word: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: colors.textFaint,
  },
  wordActive: {
    color: colors.primaryBright,
    textDecorationColor: colors.primary,
  },
  hintBox: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryDim,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  hintBoxEmpty: { backgroundColor: colors.glass, borderColor: colors.border },
  hintText: { color: colors.text, fontSize: 14, lineHeight: 19 },
  hintWord: { fontWeight: '800', color: colors.primaryBright },
  hintLabel: { color: colors.textFaint, fontSize: 12 },
  hintEmptyText: { color: colors.textFaint, fontSize: 12 },
});
