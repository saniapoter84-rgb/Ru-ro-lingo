import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { colors } from '../theme/colors';
import { Word } from '../data';
import { SpeakerButton } from '../components/SpeakerButton';
import { ProgressBar } from '../components/ProgressBar';
import { speakRomanian } from '../logic/speech';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 220;
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 360);
const CARD_HEIGHT = CARD_WIDTH * 1.25;

export interface FlashcardResult {
  knownIds: string[];
  unknownIds: string[];
}

interface Props {
  words: Word[];
  onExit: () => void;
  onDone: (result: FlashcardResult) => void;
}

export function FlashcardScreen({ words, onExit, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const known = useRef<string[]>([]);
  const unknown = useRef<string[]>([]);

  const current = words[index];
  const next = words[index + 1];

  // Пока карточка улетает, второй свайп принимать нельзя: иначе два
  // завершения подряд перепрыгивают через конец списка.
  const swiping = useRef(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone({ knownIds: known.current, unknownIds: unknown.current });
  }, [onDone]);

  // Страховка: если индекс всё-таки ушёл за конец (например, из-за
  // прерванной анимации), завершаем этап, а не показываем пустой экран.
  useEffect(() => {
    if (words.length === 0 || index >= words.length) finish();
  }, [index, words.length, finish]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (g.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  function forceSwipe(direction: 'left' | 'right') {
    if (swiping.current) return;
    swiping.current = true;
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(({ finished: completed }) => {
      // Прерванная анимация тоже зовёт колбэк — такой вызов не считается.
      if (!completed) {
        swiping.current = false;
        return;
      }
      onSwipeComplete(direction);
    });
  }

  function onSwipeComplete(direction: 'left' | 'right') {
    const word = words[index];
    if (word) {
      if (direction === 'right') known.current.push(word.id);
      else unknown.current.push(word.id);
    }

    position.setValue({ x: 0, y: 0 });
    flipAnim.setValue(0);
    setFlipped(false);
    swiping.current = false;

    if (index + 1 >= words.length) {
      finish();
    } else {
      // Присваиваем значение, а не увеличиваем: повторный вызов тогда
      // приводит к тому же индексу, а не к прыжку через карточку.
      setIndex(index + 1);
    }
  }

  function resetPosition() {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  }

  function toggleFlip() {
    const flippingToBack = !flipped;
    Animated.spring(flipAnim, {
      toValue: flippingToBack ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(flippingToBack);
    if (flippingToBack) speakRomanian(current.ro);
  }

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [10, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  if (!current) return null;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={8}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ProgressBar ratio={index / words.length} color={colors.accent} />
        </View>
      </View>

      <Text style={styles.instruction}>Смахни вправо, если знаешь слово, влево — если нет</Text>

      <View style={styles.cardArea}>
        {next && (
          <View style={[styles.card, styles.cardBehind]}>
            <Text style={styles.cardTextDim}>{next.ro}</Text>
          </View>
        )}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
            },
          ]}
        >
          <Pressable style={styles.pressableFill} onPress={toggleFlip}>
            <Animated.View
              style={[
                styles.face,
                { transform: [{ perspective: 1200 }, { rotateY: frontInterpolate }] },
              ]}
            >
              <Text style={styles.cardText}>{current.ro}</Text>
              <View style={styles.speakerWrap}>
                <SpeakerButton text={current.ro} size={44} />
              </View>
              <Text style={styles.hint}>Нажми, чтобы увидеть перевод</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.face,
                styles.faceBack,
                { transform: [{ perspective: 1200 }, { rotateY: backInterpolate }] },
              ]}
            >
              <Text style={styles.cardTextBack}>{current.ru}</Text>
              <Text style={styles.hintBack}>{current.ro}</Text>
            </Animated.View>
          </Pressable>

          <Animated.View
            pointerEvents="none"
            style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}
          >
            <Text style={styles.stampText}>ЗНАЮ</Text>
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.stamp, styles.stampNope, { opacity: nopeOpacity }]}
          >
            <Text style={styles.stampText}>НЕ ЗНАЮ</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.buttonsRow}>
        <Pressable style={[styles.roundBtn, styles.roundBtnNope]} onPress={() => forceSwipe('left')}>
          <Text style={styles.roundBtnText}>✕</Text>
        </Pressable>
        <Pressable style={[styles.roundBtn, styles.roundBtnLike]} onPress={() => forceSwipe('right')}>
          <Text style={styles.roundBtnText}>✓</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  close: { fontSize: 20, color: colors.textDim },
  instruction: {
    textAlign: 'center',
    color: colors.textDim,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  cardArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardBehind: {
    top: 10,
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.94 }],
  },
  cardTextDim: { fontSize: 24, fontWeight: '700', color: colors.textDim },
  pressableFill: { flex: 1 },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backfaceVisibility: 'hidden',
  },
  faceBack: {
    backgroundColor: colors.primary,
  },
  cardText: { fontSize: 32, fontWeight: '800', color: colors.text, textAlign: 'center' },
  cardTextBack: { fontSize: 30, fontWeight: '800', color: colors.white, textAlign: 'center' },
  speakerWrap: { marginTop: 16 },
  hint: { position: 'absolute', bottom: 20, fontSize: 12, color: colors.textDim },
  hintBack: { marginTop: 10, fontSize: 16, color: colors.white, opacity: 0.85 },
  stamp: {
    position: 'absolute',
    top: 28,
    borderWidth: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stampLike: { right: 20, borderColor: colors.primary, transform: [{ rotate: '-14deg' }] },
  stampNope: { left: 20, borderColor: colors.danger, transform: [{ rotate: '14deg' }] },
  stampText: { fontSize: 22, fontWeight: '900', color: colors.text },
  buttonsRow: { flexDirection: 'row', justifyContent: 'center', gap: 28, paddingVertical: 24 },
  roundBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  roundBtnNope: { borderWidth: 2, borderColor: colors.danger },
  roundBtnLike: { borderWidth: 2, borderColor: colors.primary },
  roundBtnText: { fontSize: 26, fontWeight: '800', color: colors.text },
});
