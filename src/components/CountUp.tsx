import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, Text, TextStyle } from 'react-native';

interface Props {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Число, которое «докручивается» до значения вместо того, чтобы просто
 * появиться. Разница чисто психологическая, но заметная: цифра, набегающая
 * на глазах, читается как заработанная, а не как выданная.
 */
export function CountUp({ value, duration = 750, delay = 120, prefix, suffix, style }: Props) {
  const animated = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = animated.addListener(({ value: v }) => setShown(Math.round(v)));
    animated.setValue(0);
    const animation = Animated.timing(animated, {
      toValue: value,
      duration,
      delay,
      // Значение читается на JS-стороне, нативный драйвер тут неприменим.
      useNativeDriver: false,
    });
    animation.start();
    return () => {
      animation.stop();
      animated.removeListener(id);
    };
  }, [value, duration, delay, animated]);

  return (
    <Text style={style}>
      {prefix ?? ''}
      {shown}
      {suffix ?? ''}
    </Text>
  );
}
