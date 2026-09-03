import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, softShadow } from '../theme/colors';
import {
  BuildStep,
  ChoiceStep,
  CourseChapter,
  GrammarLesson,
  GrammarStep,
  ListenStep,
  MatchStep,
  RuleStep,
  SpotStep,
  TransformStep,
  TypeStep,
  isScorableStep,
} from '../data/course';
import {
  buildTokenBank,
  comboMultiplier,
  instructionForStep,
  matchesAnswer,
  shuffle,
  speechTextForStep,
  xpForCorrect,
  XP_LESSON_BONUS,
  XP_PERFECT_BONUS,
} from '../logic/courseEngine';
import { CourseResult } from '../logic/progress';
import { BOSS_HEARTS } from '../logic/hearts';
import { speakRomanian } from '../logic/speech';
import { Lang, t } from '../i18n/strings';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { SpeakerButton } from '../components/SpeakerButton';
import { HeartDots } from '../components/Hearts';
import { ComboBadge } from '../components/ComboBadge';
import { Panel } from '../components/Panel';

interface Props {
  lesson: GrammarLesson;
  chapter: CourseChapter;
  lang: Lang;
  immersion: boolean;
  availableHearts: number;
  onLoseHeart: () => void;
  onFinish: (result: CourseResult) => void;
  onExit: () => void;
}

type Phase = 'question' | 'feedback' | 'finished' | 'dead';

function tap(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(() => {});
}

export function CourseLessonScreen({
  lesson,
  chapter,
  lang,
  immersion,
  availableHearts,
  onLoseHeart,
  onFinish,
  onExit,
}: Props) {
  const boss = !!lesson.boss;
  const steps = lesson.steps;
  const taskTotal = useMemo(() => steps.filter(isScorableStep).length, [steps]);

  // Очередь индексов: ошибочные задания возвращаются в конец, чтобы урок
  // нельзя было закрыть, так и не поняв тему.
  const [queue, setQueue] = useState<number[]>(() => steps.map((_, i) => i));
  const [phase, setPhase] = useState<Phase>('question');
  const [wasCorrect, setWasCorrect] = useState(true);

  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(() => new Set());
  const [mistakes, setMistakes] = useState(0);

  const startingLives = boss ? Math.min(availableHearts, BOSS_HEARTS) : availableHearts;
  const [lives, setLives] = useState(Math.max(1, startingLives));
  const maxLives = Math.max(1, startingLives);

  const currentIndex = queue[0];
  const step = currentIndex === undefined ? undefined : steps[currentIndex];

  const shake = useRef(new Animated.Value(0)).current;

  const runShake = useCallback(() => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shake]);

  const finish = useCallback(
    (finalXp: number, finalCorrect: number, finalBestCombo: number, perfect: boolean) => {
      const bonus = XP_LESSON_BONUS + (perfect ? XP_PERFECT_BONUS : 0);
      const total = finalXp + (boss ? bonus * 2 : bonus);
      setXpEarned(total);
      setPhase('finished');
      onFinish({
        lessonId: lesson.id,
        correct: finalCorrect,
        total: taskTotal,
        xpEarned: total,
        perfect,
        bestCombo: finalBestCombo,
        immersionTasks: immersion ? taskTotal : 0,
      });
    },
    [boss, immersion, lesson.id, onFinish, taskTotal]
  );

  /** Единая точка входа для результата любого задания. */
  const submit = useCallback(
    (correct: boolean) => {
      if (phase !== 'question' || currentIndex === undefined) return;

      setAttempts((n) => n + 1);
      setWasCorrect(correct);

      if (correct) {
        tap(Haptics.ImpactFeedbackStyle.Light);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setBestCombo((b) => Math.max(b, nextCombo));
        setXpEarned((x) => x + xpForCorrect(nextCombo, boss));
        if (!solved.has(currentIndex)) {
          setSolved((s) => new Set(s).add(currentIndex));
          setCorrectCount((n) => n + 1);
        }
        const speech = speechTextForStep(steps[currentIndex]);
        if (speech) speakRomanian(speech);
      } else {
        tap(Haptics.ImpactFeedbackStyle.Heavy);
        runShake();
        setCombo(0);
        setMistakes((n) => n + 1);
        setLives((n) => n - 1);
        onLoseHeart();
      }
      setPhase('feedback');
    },
    [phase, currentIndex, combo, boss, solved, steps, onLoseHeart, runShake]
  );

  /** Переход к следующему шагу — после карточки правила или после разбора. */
  const advance = useCallback(() => {
    if (currentIndex === undefined) return;

    if (!wasCorrect && lives <= 0) {
      setPhase('dead');
      return;
    }

    const rest = queue.slice(1);
    // Неверно решённое задание вернётся ближе к концу урока.
    const next = wasCorrect ? rest : [...rest, currentIndex];

    if (next.length === 0) {
      finish(xpEarned, correctCount, bestCombo, mistakes === 0);
      return;
    }
    setQueue(next);
    setPhase('question');
  }, [
    currentIndex,
    wasCorrect,
    lives,
    queue,
    xpEarned,
    correctCount,
    bestCombo,
    mistakes,
    finish,
  ]);

  const skipRule = useCallback(() => {
    const rest = queue.slice(1);
    if (rest.length === 0) {
      finish(xpEarned, correctCount, bestCombo, mistakes === 0);
      return;
    }
    setQueue(rest);
  }, [queue, xpEarned, correctCount, bestCombo, mistakes, finish]);

  // --- Экраны завершения ---

  if (phase === 'finished') {
    const accuracy = attempts === 0 ? 100 : Math.round((correctCount / Math.max(attempts, 1)) * 100);
    return (
      <ResultScreen
        lang={lang}
        perfect={mistakes === 0}
        accuracy={accuracy}
        xp={xpEarned}
        bestCombo={bestCombo}
        chapterColor={chapter.color}
        boss={boss}
        onExit={onExit}
      />
    );
  }

  if (phase === 'dead') {
    return <OutOfHeartsScreen lang={lang} onExit={onExit} />;
  }

  if (!step) return null;

  const progressRatio = taskTotal === 0 ? 1 : solved.size / taskTotal;
  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-9, 9] });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar ratio={progressRatio} color={chapter.color} />
        </View>
        <HeartDots count={Math.max(0, lives)} max={maxLives} />
      </View>

      <View style={styles.comboRow}>
        <ComboBadge combo={combo} lang={lang} />
      </View>

      <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StepView
            key={`${currentIndex}-${queue.length}`}
            step={step}
            lang={lang}
            immersion={immersion}
            locked={phase === 'feedback'}
            accent={chapter.color}
            onSubmit={submit}
            onContinueRule={skipRule}
          />
        </ScrollView>
      </Animated.View>

      {phase === 'feedback' ? (
        <FeedbackBar
          lang={lang}
          correct={wasCorrect}
          step={step}
          onContinue={advance}
        />
      ) : null}
    </View>
  );
}

// --- Диспетчер шагов ----------------------------------------------------

interface StepProps {
  step: GrammarStep;
  lang: Lang;
  immersion: boolean;
  locked: boolean;
  accent: string;
  onSubmit: (correct: boolean) => void;
  onContinueRule: () => void;
}

function StepView(props: StepProps) {
  const { step } = props;
  switch (step.kind) {
    case 'rule':
      return <RuleView step={step} lang={props.lang} onContinue={props.onContinueRule} />;
    case 'choice':
      return <ChoiceView {...props} step={step} />;
    case 'build':
      return <BuildView {...props} step={step} />;
    case 'type':
      return <TypeView {...props} step={step} />;
    case 'match':
      return <MatchView {...props} step={step} />;
    case 'listen':
      return <ListenView {...props} step={step} />;
    case 'spot':
      return <SpotView {...props} step={step} />;
    case 'transform':
      return <TransformView {...props} step={step} />;
    default:
      return null;
  }
}

/** Перевод, который в режиме погружения открывается только по тапу. */
function HiddenRu({ text, lang, immersion }: { text?: string; lang: Lang; immersion: boolean }) {
  const [shown, setShown] = useState(false);
  if (!text) return null;
  if (!immersion) return <Text style={styles.ruHint}>{text}</Text>;
  if (shown) return <Text style={styles.ruHint}>{text}</Text>;
  return (
    <Pressable onPress={() => setShown(true)} style={styles.revealChip} hitSlop={6}>
      <Text style={styles.revealText}>{t('lesson.showRu', lang)}</Text>
    </Pressable>
  );
}

function Instruction({ step }: { step: GrammarStep }) {
  return <Text style={styles.instruction}>{instructionForStep(step)}</Text>;
}

// --- Карточка правила ---------------------------------------------------

function RuleView({
  step,
  lang,
  onContinue,
}: {
  step: RuleStep;
  lang: Lang;
  onContinue: () => void;
}) {
  return (
    <View>
      <Text style={styles.ruleBadge}>REGULĂ</Text>
      <Text style={styles.ruleTitle}>{step.title}</Text>
      <Text style={styles.ruleBody}>{step.body}</Text>

      {step.examples ? (
        <View style={styles.examples}>
          {step.examples.map((ex, i) => (
            <Panel key={i} style={styles.exampleRow} padded={false}>
              <View style={styles.exampleInner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exampleRo}>{ex.ro}</Text>
                  <Text style={styles.exampleRu}>{ex.ru}</Text>
                  {ex.note ? <Text style={styles.exampleNote}>{ex.note}</Text> : null}
                </View>
                <SpeakerButton text={ex.ro} size={32} />
              </View>
            </Panel>
          ))}
        </View>
      ) : null}

      {step.aha ? (
        <View style={styles.ahaBox}>
          <Text style={styles.ahaLabel}>💡</Text>
          <Text style={styles.ahaText}>{step.aha}</Text>
        </View>
      ) : null}

      <PrimaryButton
        title={t('lesson.gotIt', lang)}
        onPress={onContinue}
        style={{ marginTop: spacing.xl }}
      />
    </View>
  );
}

// --- Выбор варианта -----------------------------------------------------

function ChoiceView({ step, lang, immersion, locked, onSubmit }: StepProps & { step: ChoiceStep }) {
  const [picked, setPicked] = useState<number | null>(null);

  function choose(i: number) {
    if (locked) return;
    setPicked(i);
    onSubmit(i === step.correct);
  }

  return (
    <View>
      <Instruction step={step} />
      <PromptWithGap text={step.prompt} />
      <HiddenRu text={step.ru} lang={lang} immersion={immersion} />
      <View style={styles.options}>
        {step.options.map((option, i) => (
          <OptionRow
            key={i}
            text={option}
            state={optionState(i, picked, step.correct, locked)}
            onPress={() => choose(i)}
          />
        ))}
      </View>
    </View>
  );
}

function optionState(
  index: number,
  picked: number | null,
  correct: number,
  locked: boolean
): 'idle' | 'correct' | 'wrong' {
  if (!locked) return 'idle';
  if (index === correct) return 'correct';
  if (index === picked) return 'wrong';
  return 'idle';
}

function OptionRow({
  text,
  state,
  onPress,
}: {
  text: string;
  state: 'idle' | 'correct' | 'wrong';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        state === 'correct' && styles.optionCorrect,
        state === 'wrong' && styles.optionWrong,
        pressed && state === 'idle' && styles.optionPressed,
      ]}
    >
      <Text style={styles.optionText}>{text}</Text>
    </Pressable>
  );
}

/** Задание с пропуском: «___» превращается в подчёркнутую пустоту. */
function PromptWithGap({ text }: { text: string }) {
  if (!text.includes('___')) {
    return <Text style={styles.prompt}>{text}</Text>;
  }
  const [before, after] = text.split('___');
  return (
    <Text style={styles.prompt}>
      {before}
      <Text style={styles.gap}>{'      '}</Text>
      {after}
    </Text>
  );
}

// --- Собери фразу -------------------------------------------------------

function BuildView({ step, lang, locked, accent, onSubmit }: StepProps & { step: BuildStep }) {
  const bank = useMemo(() => buildTokenBank(step.answer, step.bank), [step]);
  const [used, setUsed] = useState<number[]>([]);

  const assembled = used.map((i) => bank[i]).join(' ');

  function pick(i: number) {
    if (locked || used.includes(i)) return;
    tap();
    setUsed((u) => [...u, i]);
  }

  function unpick(position: number) {
    if (locked) return;
    setUsed((u) => u.filter((_, idx) => idx !== position));
  }

  return (
    <View>
      <Instruction step={step} />
      <Text style={styles.prompt}>{step.ru}</Text>

      <View style={[styles.assembleArea, { borderColor: accent + '55' }]}>
        {used.length === 0 ? (
          <Text style={styles.assembleHint}>{t('lesson.tapToBuild', lang)}</Text>
        ) : (
          <View style={styles.chipRow}>
            {used.map((tokenIndex, position) => (
              <Pressable
                key={`${tokenIndex}-${position}`}
                onPress={() => unpick(position)}
                style={[styles.chip, styles.chipUsed]}
              >
                <Text style={styles.chipText}>{bank[tokenIndex]}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.chipRow}>
        {bank.map((token, i) =>
          used.includes(i) ? (
            <View key={i} style={[styles.chip, styles.chipGhost]}>
              <Text style={styles.chipGhostText}>{token}</Text>
            </View>
          ) : (
            <Pressable key={i} onPress={() => pick(i)} style={styles.chip}>
              <Text style={styles.chipText}>{token}</Text>
            </Pressable>
          )
        )}
      </View>

      {!locked ? (
        <PrimaryButton
          title={t('common.check', lang)}
          disabled={used.length === 0}
          onPress={() => onSubmit(matchesAnswer(assembled, step.answer))}
          style={{ marginTop: spacing.xl }}
        />
      ) : null}
    </View>
  );
}

// --- Ввод текста --------------------------------------------------------

function TypeView({ step, lang, immersion, locked, onSubmit }: StepProps & { step: TypeStep }) {
  const [value, setValue] = useState('');

  return (
    <View>
      <Instruction step={step} />
      <Text style={styles.prompt}>{step.ru}</Text>
      {step.hint ? <Text style={styles.smallHint}>{step.hint}</Text> : null}
      <TextInput
        value={value}
        onChangeText={setValue}
        editable={!locked}
        placeholder={t('lesson.typeHere', lang)}
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, locked && styles.inputLocked]}
      />
      {!locked ? (
        <PrimaryButton
          title={t('common.check', lang)}
          disabled={value.trim().length === 0}
          onPress={() => onSubmit(matchesAnswer(value, step.answer, step.alt))}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}
      <Text style={styles.diacriticNote}>
        {immersion ? 'Diacriticele sunt opționale' : 'Диакритику можно не ставить'}
      </Text>
    </View>
  );
}

// --- Преобразование формы ----------------------------------------------

function TransformView({
  step,
  lang,
  immersion,
  locked,
  onSubmit,
}: StepProps & { step: TransformStep }) {
  const [value, setValue] = useState('');

  return (
    <View>
      <Instruction step={step} />
      <View style={styles.fromBox}>
        <Text style={styles.fromText}>{step.from}</Text>
        <Text style={styles.arrow}>↓</Text>
      </View>
      <HiddenRu text={step.ru} lang={lang} immersion={immersion} />
      <TextInput
        value={value}
        onChangeText={setValue}
        editable={!locked}
        placeholder={t('lesson.typeHere', lang)}
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, locked && styles.inputLocked]}
      />
      {!locked ? (
        <PrimaryButton
          title={t('common.check', lang)}
          disabled={value.trim().length === 0}
          onPress={() => onSubmit(matchesAnswer(value, step.answer, step.alt))}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}
    </View>
  );
}

// --- Сопоставление пар --------------------------------------------------

function MatchView({ step, locked, onSubmit }: StepProps & { step: MatchStep }) {
  const right = useMemo(() => shuffle(step.pairs.map((p) => p.ru)), [step]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [failed, setFailed] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);

  function pickRight(rightIndex: number) {
    if (locked || selectedLeft === null) return;
    const expected = step.pairs[selectedLeft].ru;
    if (right[rightIndex] === expected) {
      tap();
      const next = new Set(matched).add(selectedLeft);
      setMatched(next);
      setSelectedLeft(null);
      if (next.size === step.pairs.length) {
        onSubmit(!failed);
      }
    } else {
      setFailed(true);
      setFlash(rightIndex);
      setTimeout(() => setFlash(null), 400);
      tap(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  const matchedRight = new Set(
    Array.from(matched).map((leftIndex) => step.pairs[leftIndex].ru)
  );

  return (
    <View>
      <Instruction step={step} />
      <View style={styles.matchColumns}>
        <View style={styles.matchColumn}>
          {step.pairs.map((pair, i) => {
            const done = matched.has(i);
            return (
              <Pressable
                key={i}
                disabled={done || locked}
                onPress={() => setSelectedLeft(i)}
                style={[
                  styles.matchCell,
                  selectedLeft === i && styles.matchCellActive,
                  done && styles.matchCellDone,
                ]}
              >
                <Text style={[styles.matchText, done && styles.matchTextDone]}>{pair.ro}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.matchColumn}>
          {right.map((label, i) => {
            const done = matchedRight.has(label);
            return (
              <Pressable
                key={i}
                disabled={done || locked}
                onPress={() => pickRight(i)}
                style={[
                  styles.matchCell,
                  done && styles.matchCellDone,
                  flash === i && styles.matchCellWrong,
                ]}
              >
                <Text style={[styles.matchText, done && styles.matchTextDone]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// --- Аудирование --------------------------------------------------------

function ListenView({ step, lang, immersion, locked, onSubmit }: StepProps & { step: ListenStep }) {
  const [picked, setPicked] = useState<number | null>(null);

  // Первое проигрывание — само, без нажатия: задание всё-таки на слух.
  useEffect(() => {
    speakRomanian(step.ro);
  }, [step.ro]);

  function choose(i: number) {
    if (locked) return;
    setPicked(i);
    onSubmit(i === step.correct);
  }

  return (
    <View>
      <Instruction step={step} />
      <View style={styles.listenBox}>
        <SpeakerButton text={step.ro} size={72} loud />
        <Text style={styles.listenHint}>{t('immersion.replay', lang)}</Text>
      </View>
      <HiddenRu text={step.ru} lang={lang} immersion={immersion} />
      <View style={styles.options}>
        {step.options.map((option, i) => (
          <OptionRow
            key={i}
            text={option}
            state={optionState(i, picked, step.correct, locked)}
            onPress={() => choose(i)}
          />
        ))}
      </View>
    </View>
  );
}

// --- Найди ошибку -------------------------------------------------------

function SpotView({ step, lang, immersion, locked, onSubmit }: StepProps & { step: SpotStep }) {
  const [picked, setPicked] = useState<number | null>(null);

  function choose(i: number) {
    if (locked) return;
    setPicked(i);
    onSubmit(i === step.wrongIndex);
  }

  return (
    <View>
      <Instruction step={step} />
      <Text style={styles.smallHint}>{t('lesson.tapWrong', lang)}</Text>
      <View style={styles.chipRow}>
        {step.tokens.map((token, i) => {
          const isWrong = locked && i === step.wrongIndex;
          const isBadPick = locked && picked === i && i !== step.wrongIndex;
          return (
            <Pressable
              key={i}
              onPress={() => choose(i)}
              style={[
                styles.chip,
                styles.tokenChip,
                isWrong && styles.chipWrongAnswer,
                isBadPick && styles.chipBadPick,
              ]}
            >
              <Text style={styles.chipText}>{token}</Text>
            </Pressable>
          );
        })}
      </View>
      {locked ? (
        <View style={styles.fixBox}>
          <Text style={styles.fixLabel}>{step.tokens[step.wrongIndex]} → </Text>
          <Text style={styles.fixValue}>{step.fix}</Text>
        </View>
      ) : null}
      <HiddenRu text={step.ru} lang={lang} immersion={immersion} />
    </View>
  );
}

// --- Полоса разбора -----------------------------------------------------

function FeedbackBar({
  lang,
  correct,
  step,
  onContinue,
}: {
  lang: Lang;
  correct: boolean;
  step: GrammarStep;
  onContinue: () => void;
}) {
  const explain = 'explain' in step ? step.explain : undefined;
  const answer = correctAnswerText(step);

  return (
    <View style={[styles.feedback, correct ? styles.feedbackOk : styles.feedbackBad]}>
      <Text style={[styles.feedbackTitle, { color: correct ? colors.success : colors.danger }]}>
        {correct ? t('lesson.correct', lang) : t('lesson.wrong', lang)}
      </Text>
      {!correct && answer ? (
        <Text style={styles.feedbackAnswer}>
          {t('lesson.answerIs', lang)} <Text style={styles.feedbackAnswerStrong}>{answer}</Text>
        </Text>
      ) : null}
      {explain ? <Text style={styles.feedbackExplain}>{explain}</Text> : null}
      <PrimaryButton
        title={t('common.continue', lang)}
        variant={correct ? 'primary' : 'danger'}
        onPress={onContinue}
        style={{ marginTop: spacing.md }}
      />
    </View>
  );
}

function correctAnswerText(step: GrammarStep): string | null {
  switch (step.kind) {
    case 'choice':
    case 'listen':
      return step.options[step.correct];
    case 'build':
    case 'type':
    case 'transform':
      return step.answer;
    case 'spot':
      return step.fix;
    default:
      return null;
  }
}

// --- Итоги --------------------------------------------------------------

function ResultScreen({
  lang,
  perfect,
  accuracy,
  xp,
  bestCombo,
  chapterColor,
  boss,
  onExit,
}: {
  lang: Lang;
  perfect: boolean;
  accuracy: number;
  xp: number;
  bestCombo: number;
  chapterColor: string;
  boss: boolean;
  onExit: () => void;
}) {
  return (
    <View style={styles.centered}>
      <View style={[styles.resultGlyph, { borderColor: chapterColor }]}>
        <Text style={styles.resultGlyphText}>{boss ? '👑' : '✓'}</Text>
      </View>
      <Text style={styles.resultTitle}>{t('lesson.finished', lang)}</Text>
      {perfect ? <Text style={styles.resultPerfect}>{t('lesson.perfect', lang)}</Text> : null}

      <View style={styles.resultStats}>
        <ResultStat label={t('lesson.accuracy', lang)} value={`${accuracy}%`} />
        <ResultStat label={t('lesson.xpEarned', lang)} value={`+${xp}`} accent />
        <ResultStat label={t('lesson.bestCombo', lang)} value={String(bestCombo)} />
      </View>

      <PrimaryButton
        title={t('common.continue', lang)}
        onPress={onExit}
        style={{ marginTop: spacing.xxl, alignSelf: 'stretch' }}
      />
    </View>
  );
}

function ResultStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.resultStat}>
      <Text style={[styles.resultStatValue, accent && { color: colors.primaryBright }]}>
        {value}
      </Text>
      <Text style={styles.resultStatLabel}>{label}</Text>
    </View>
  );
}

function OutOfHeartsScreen({ lang, onExit }: { lang: Lang; onExit: () => void }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.deadHeart}>♥</Text>
      <Text style={styles.resultTitle}>{t('lesson.outOfHearts', lang)}</Text>
      <Text style={styles.deadBody}>{t('lesson.outOfHeartsBody', lang)}</Text>
      <PrimaryButton
        title={t('common.continue', lang)}
        onPress={onExit}
        style={{ marginTop: spacing.xxl, alignSelf: 'stretch' }}
      />
    </View>
  );
}

// --- Стили --------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  close: { fontSize: 18, color: colors.textFaint },
  comboRow: { paddingHorizontal: spacing.lg, minHeight: 24 },
  body: { padding: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1, justifyContent: 'center' },

  instruction: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textFaint,
    marginBottom: spacing.md,
  },
  prompt: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 34,
    marginBottom: spacing.md,
  },
  gap: {
    color: colors.primaryBright,
    textDecorationLine: 'underline',
  },
  ruHint: { fontSize: 14, color: colors.textDim, marginBottom: spacing.lg },
  revealChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: spacing.lg,
  },
  revealText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  smallHint: { fontSize: 12, color: colors.textFaint, marginBottom: spacing.md },

  options: { gap: spacing.sm, marginTop: spacing.sm },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
  },
  optionPressed: { backgroundColor: colors.cardHover, borderColor: colors.borderBright },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successDim },
  optionWrong: { borderColor: colors.danger, backgroundColor: colors.dangerDim },
  optionText: { fontSize: 16, fontWeight: '600', color: colors.text },

  // Правило
  ruleBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: colors.primaryBright,
    marginBottom: spacing.sm,
  },
  ruleTitle: { fontSize: 23, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  ruleBody: { fontSize: 15, lineHeight: 23, color: colors.textDim },
  examples: { marginTop: spacing.lg, gap: spacing.sm },
  exampleRow: { backgroundColor: colors.bgElevated },
  exampleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  exampleRo: { fontSize: 15, fontWeight: '700', color: colors.text },
  exampleRu: { fontSize: 13, color: colors.textDim, marginTop: 2 },
  exampleNote: { fontSize: 11, color: colors.textFaint, marginTop: 3, fontStyle: 'italic' },
  ahaBox: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primaryDim,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ahaLabel: { fontSize: 16 },
  ahaText: { flex: 1, fontSize: 14, lineHeight: 21, color: colors.text, fontWeight: '600' },

  // Собери фразу
  assembleArea: {
    minHeight: 84,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: colors.bgElevated,
    padding: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: 'center',
  },
  assembleHint: { color: colors.textFaint, fontSize: 13, textAlign: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.sm,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  chipUsed: { borderColor: colors.primary, backgroundColor: colors.primaryDim },
  chipGhost: { backgroundColor: 'transparent', borderColor: colors.border },
  chipGhostText: { color: 'transparent', fontSize: 15, fontWeight: '600' },
  chipText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  tokenChip: { paddingHorizontal: 14, paddingVertical: 11 },
  chipWrongAnswer: { borderColor: colors.danger, backgroundColor: colors.dangerDim },
  chipBadPick: { borderColor: colors.warning, backgroundColor: colors.warningDim },
  fixBox: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  fixLabel: { color: colors.textDim, fontSize: 15 },
  fixValue: { color: colors.success, fontSize: 15, fontWeight: '800' },

  // Ввод
  input: {
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: 17,
    backgroundColor: colors.bgElevated,
    color: colors.text,
    marginTop: spacing.sm,
  },
  inputLocked: { opacity: 0.6 },
  diacriticNote: { fontSize: 11, color: colors.textFaint, marginTop: spacing.md },
  fromBox: { alignItems: 'center', marginBottom: spacing.md },
  fromText: { fontSize: 22, fontWeight: '700', color: colors.textDim },
  arrow: { fontSize: 20, color: colors.primaryBright, marginTop: 4 },

  // Пары
  matchColumns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  matchColumn: { flex: 1, gap: spacing.sm },
  matchCell: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  matchCellActive: { borderColor: colors.primary, backgroundColor: colors.primaryDim },
  matchCellDone: { borderColor: colors.success, backgroundColor: colors.successDim, opacity: 0.55 },
  matchCellWrong: { borderColor: colors.danger, backgroundColor: colors.dangerDim },
  matchText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  matchTextDone: { color: colors.textDim },

  // Аудирование
  listenBox: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  listenHint: { color: colors.textFaint, fontSize: 12 },

  // Разбор
  feedback: {
    padding: spacing.lg,
    borderTopWidth: 1,
    backgroundColor: colors.bgElevated,
  },
  feedbackOk: { borderTopColor: colors.success },
  feedbackBad: { borderTopColor: colors.danger },
  feedbackTitle: { fontSize: 16, fontWeight: '800' },
  feedbackAnswer: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  feedbackAnswerStrong: { color: colors.text, fontWeight: '700' },
  feedbackExplain: { color: colors.textDim, fontSize: 13, lineHeight: 19, marginTop: 6 },

  // Итоги
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  resultGlyph: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.card,
    ...softShadow,
  },
  resultGlyphText: { fontSize: 38, color: colors.text },
  resultTitle: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  resultPerfect: { fontSize: 14, color: colors.success, marginTop: 6, fontWeight: '600' },
  resultStats: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xxl },
  resultStat: { alignItems: 'center' },
  resultStatValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  resultStatLabel: { fontSize: 11, color: colors.textFaint, marginTop: 4 },
  deadHeart: { fontSize: 56, color: colors.danger, marginBottom: spacing.lg },
  deadBody: {
    fontSize: 14,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 21,
  },
});
