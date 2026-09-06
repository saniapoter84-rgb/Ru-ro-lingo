import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  /** Задержка перед появлением — ей набирается «лесенка» в списках. */
  delay?: number;
  /** На сколько пикселей элемент выезжает снизу. */
  offset?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Мягкое появление: проявление + короткий подъём снизу.
 *
 * Нужно там, где содержимое сменяется целиком (новое задание, новый экран).
 * Без анимации смена читается как «моргнуло и стало другое», и глаз каждый
 * раз заново ищет, за что зацепиться; с ней взгляд ведут.
 */
export function Reveal({ children, delay = 0, offset = 10, duration = 260, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [offset, 0],
  });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
