import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { colors, radius } from '../theme/colors';
import { lookupWordHint } from '../logic/wordHints';

interface Props {
  text: string;
  lang: 'ru' | 'ro';
  /** Перевод всей фразы — на случай, если для тапнутого слова нет
   * отдельной словарной пары (актуально для многословных фраз). */
  fallback: string;
  textStyle?: StyleProp<TextStyle>;
}

interface ActiveHint {
  word: string;
  translation: string;
  exact: boolean;
}

/** Текст, где можно тапнуть по любому слову и увидеть его перевод. */
export function TappableWords({ text, lang, fallback, textStyle }: Props) {
  const [active, setActive] = useState<ActiveHint | null>(null);
  const parts = text.split(/(\s+)/);

  function onWordPress(piece: string) {
    setActive((prev) => {
      if (prev?.word === piece) return null;
      const hint = lookupWordHint(piece, lang);
      return { word: piece, translation: hint ?? fallback, exact: !!hint };
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
          const isActive = active?.word === piece;
          return (
            <Pressable key={i} onPress={() => onWordPress(piece)} hitSlop={4}>
              <Text style={[textStyle, isActive && styles.wordActive]}>{piece}</Text>
            </Pressable>
          );
        })}
      </View>
      {active ? (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>
            {active.exact
              ? `${active.word} — ${active.translation}`
              : active.translation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  wordActive: {
    color: colors.primaryBright,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
  },
  hintBox: {
    marginTop: 10,
    backgroundColor: colors.primaryDim,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderBright,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  hintText: { color: colors.text, fontWeight: '600', fontSize: 13 },
});
