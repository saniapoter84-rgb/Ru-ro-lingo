import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/colors';
import { speakRomanian } from '../logic/speech';

interface Props {
  text: string;
  size?: number;
  /** Крупная «кнопка прослушивания» для заданий на слух. */
  loud?: boolean;
}

export function SpeakerButton({ text, size = 36, loud }: Props) {
  return (
    <Pressable
      onPress={() => speakRomanian(text)}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: loud ? radius.lg : size / 2,
          opacity: pressed ? 0.6 : 1,
          backgroundColor: loud ? colors.primary : colors.primaryDim,
          borderColor: loud ? colors.primary : colors.borderBright,
        },
      ]}
      hitSlop={10}
    >
      <Text style={{ fontSize: size * 0.42, color: loud ? colors.white : colors.primaryBright }}>
        {'▶'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
