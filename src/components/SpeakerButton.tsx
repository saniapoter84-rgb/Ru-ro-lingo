import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { speakRomanian } from '../logic/speech';

interface Props {
  text: string;
  size?: number;
}

export function SpeakerButton({ text, size = 40 }: Props) {
  return (
    <Pressable
      onPress={() => speakRomanian(text)}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, borderRadius: size / 2, opacity: pressed ? 0.7 : 1 },
      ]}
      hitSlop={8}
    >
      <Text style={{ fontSize: size * 0.5 }}>🔊</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.blue + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
