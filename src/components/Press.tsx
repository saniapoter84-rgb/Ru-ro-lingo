import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';
import { HapticKind, haptic } from '../logic/haptics';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * Стиль внешней области нажатия. Нужен, когда раскладка задаётся снаружи
   * (`flex: 1` в ряду): внутренний слой анимируется и такие правила до него
   * не доходят.
   */
  outerStyle?: StyleProp<ViewStyle>;
  /** Во сколько раз элемент «проседает» под пальцем. */
  scaleTo?: number;
  /** Какой отклик дать в руку. null — молча. */
  feedback?: HapticKind | null;
  hitSlop?: number;
  /** Не даёт нажать дважды подряд быстрее, чем за N мс. */
  throttleMs?: number;
}

/**
 * Нажимаемая обёртка с пружинкой и откликом в руку.
 *
 * Смысл в одном: палец должен получать ответ мгновенно. Обычный Pressable
 * меняет прозрачность на следующем кадре и ощущается «пластиковым»; здесь
 * элемент физически проседает и отпружинивает обратно, поэтому даже
 * промах по кнопке ощущается как взаимодействие с вещью, а не с картинкой.
 */
export function Press({
  children,
  onPress,
  onLongPress,
  disabled,
  style,
  outerStyle,
  scaleTo = 0.965,
  feedback = 'tap',
  hitSlop,
  throttleMs = 0,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const lastPress = useRef(0);

  function spring(toValue: number) {
    Animated.spring(scale, {
      toValue,
      // Жёсткая и быстрая пружина: «щелчок», а не «желе».
      speed: 40,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  }

  function handlePress() {
    if (!onPress) return;
    if (throttleMs > 0) {
      const now = Date.now();
      if (now - lastPress.current < throttleMs) return;
      lastPress.current = now;
    }
    if (feedback) haptic(feedback);
    onPress();
  }

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => spring(scaleTo)}
      onPressOut={() => spring(1)}
      onPress={handlePress}
      onLongPress={onLongPress}
      hitSlop={hitSlop}
      style={outerStyle}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}
