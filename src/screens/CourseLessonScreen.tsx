import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Animated } from 'react-native';
import { colors, radius, spacing, softShadow } from '../theme/colors';
import { haptic } from '../logic/haptics';
import { describeForm } from '../logic/forms';
import { Press } from '../components/Press';
import { Reveal } from '../components/Reveal';
import { CountUp } from '../components/CountUp';
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
  explanationForStep,
  instructionForStep,
  matchesAnswer,
  shuffle,
  speechTextForStep,
  xpForCorrect,
  XP_LESSON_BONUS,
  XP_PERFECT_BONUS,
} from '../logic/courseEngine';
import { CourseResult } from '../logic/progress';
import { speakRomanian } from '../logic/speech';
import { Lang, t } from '../i18n/strings';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { SpeakerButton } from '../components/SpeakerButton';
import { ComboBadge } from '../components/ComboBadge';
import { Panel } from '../components/Panel';
import { TappableWords, detectLang } from '../components/TappableWords';

interface Props {
  lesson: GrammarLesson;
  chapter: CourseChapter;
  lang: Lang;
  immersion: boolean;
  onFinish: (result: CourseResult) => void;
  onExit: () => void;
}

type Phase = 'question' | 'feedback' | 'finished';

export function CourseLessonScreen({
  lesson,
  chapter,
  lang,
  immersion,
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
  /** Что человек ответил — нужно, чтобы разбор сравнил это с верным. */
  const [picked, setPicked] = useState<string | undefined>(undefined);

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
    (correct: boolean, answered?: string) => {
      if (phase !== 'question' || currentIndex === undefined) return;

      setAttempts((n) => n + 1);
      setWasCorrect(correct);
      setPicked(answered);

      if (correct) {
        haptic('ok');
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setBestCombo((b) => Math.max(b, nextCombo));
        setXpEarned((x) => x + xpForCorrect(nextCombo, boss));
        if (!solved.has(currentIndex)) {
          setSolved((s) => new Set(s).add(currentIndex));
          setCorrectCount((n) => n + 1);
        }
      } else {
        haptic('miss');
        runShake();
        setCombo(0);
        setMistakes((n) => n + 1);
      }

      // Правильная форма звучит в обоих случаях. При ошибке — тем более:
      // именно тогда её и нужно услышать, а раньше приложение молчало
      // ровно в тот момент, когда звук был нужнее всего.
      const speech = speechTextForStep(steps[currentIndex]);
      if (speech) speakRomanian(speech);

      setPhase('feedback');
    },
    [phase, currentIndex, combo, boss, solved, steps, runShake]
  );

  /** Переход к следующему шагу — после карточки правила или после разбора. */
  const advance = useCallback(() => {
    if (currentIndex === undefined) return;

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

  if (!step) return null;

  const progressRatio = taskTotal === 0 ? 1 : solved.size / taskTotal;
  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-9, 9] });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Press onPress={onExit} feedback="select" hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Press>
        <View style={{ flex: 1 }}>
          <ProgressBar ratio={progressRatio} color={chapter.color} />
        </View>
        <Text style={styles.stepCount}>
          {solved.size}/{taskTotal}
        </Text>
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
          <Reveal key={`${currentIndex}-${queue.length}`} offset={14}>
            <StepView
              step={step}
              lang={lang}
              immersion={immersion}
              locked={phase === 'feedback'}
              accent={chapter.color}
              showTapHint={
                attempts < 5 || step.kind === 'type' || step.kind === 'transform'
              }
              onSubmit={submit}
              onContinueRule={skipRule}
            />
          </Reveal>
        </ScrollView>
      </Animated.View>

      {phase === 'feedback' ? (
        <FeedbackBar
          lang={lang}
          correct={wasCorrect}
          step={step}
          picked={picked}
          explain={explanationForStep(steps, currentIndex)}
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
  /** Подсказку «тапни по слову» показываем только в начале урока. */
  showTapHint: boolean;
  onSubmit: (correct: boolean, answered?: string) => void;
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
    <Press onPress={() => setShown(true)} style={styles.revealChip} feedback="select" hitSlop={6}>
      <Text style={styles.revealText}>{t('lesson.showRu', lang)}</Text>
    </Press>
  );
}

function Instruction({ step }: { step: GrammarStep }) {
  return <Text style={styles.instruction}>{instructionForStep(step)}</Text>;
}

/**
 * Подсказка о том, что по словам можно тапать.
 *
 * В начале урока её видят все, дальше она остаётся только там, где ответ
 * надо написать самому: в задании с выбором соседний вариант всё равно
 * подскажет, а над пустым полем ввода без перевода можно застрять.
 */
function TapHint({ lang, show }: { lang: Lang; show: boolean }) {
  if (!show) return null;
  return (
    <Text style={styles.tapHint}>
      {lang === 'ru' ? 'Не знаешь слово — нажми на него' : 'Nu știi un cuvânt? Atinge-l'}
    </Text>
  );
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

      {/* Формы по полочкам: слева сама форма, справа — что она значит.
          В строчку через слэши это не читается вообще. */}
      {step.table && step.table.length > 0 ? (
        <View style={styles.table}>
          {step.table.map((row, i) => (
            <View
              key={i}
              style={[styles.tableRow, i === step.table!.length - 1 && styles.tableRowLast]}
            >
              <Text style={styles.tableForm}>{row.form}</Text>
              <Text style={styles.tableMeaning}>{row.meaning}</Text>
            </View>
          ))}
        </View>
      ) : null}

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

function ChoiceView({
  step,
  lang,
  immersion,
  locked,
  showTapHint,
  onSubmit,
}: StepProps & { step: ChoiceStep }) {
  const [picked, setPicked] = useState<number | null>(null);

  function choose(i: number) {
    if (locked) return;
    setPicked(i);
    onSubmit(i === step.correct, step.options[i]);
  }

  return (
    <View>
      <Instruction step={step} />
      <TapHint lang={lang} show={showTapHint} />
      <PromptWithGap text={step.prompt} fallback={immersion ? undefined : step.ru} />
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
    <Press
      onPress={onPress}
      feedback={null}
      scaleTo={0.98}
      style={[
        styles.option,
        state === 'correct' && styles.optionCorrect,
        state === 'wrong' && styles.optionWrong,
      ]}
    >
      <Text style={styles.optionText}>{text}</Text>
    </Press>
  );
}

/** Задание с пропуском: «___» рисует сам TappableWords. */
function PromptWithGap({ text, fallback }: { text: string; fallback?: string }) {
  return (
    <TappableWords
      text={text}
      lang={detectLang(text)}
      fallback={fallback}
      textStyle={styles.prompt}
    />
  );
}

// --- Собери фразу -------------------------------------------------------

function BuildView({
  step,
  lang,
  locked,
  accent,
  showTapHint,
  onSubmit,
}: StepProps & { step: BuildStep }) {
  const bank = useMemo(() => buildTokenBank(step.answer, step.bank), [step]);
  const [used, setUsed] = useState<number[]>([]);

  const assembled = used.map((i) => bank[i]).join(' ');

  function pick(i: number) {
    if (locked || used.includes(i)) return;
    haptic('tap');
    setUsed((u) => [...u, i]);
  }

  function unpick(position: number) {
    if (locked) return;
    setUsed((u) => u.filter((_, idx) => idx !== position));
  }

  return (
    <View>
      <Instruction step={step} />
      <TapHint lang={lang} show={showTapHint} />
      <TappableWords text={step.ru} lang="ru" textStyle={styles.prompt} />

      <View style={[styles.assembleArea, { borderColor: accent + '55' }]}>
        {used.length === 0 ? (
          <Text style={styles.assembleHint}>{t('lesson.tapToBuild', lang)}</Text>
        ) : (
          <View style={styles.chipRow}>
            {used.map((tokenIndex, position) => (
              <Press
                key={`${tokenIndex}-${position}`}
                onPress={() => unpick(position)}
                style={[styles.chip, styles.chipUsed]}
                feedback="tap"
                scaleTo={0.94}
              >
                <Text style={styles.chipText}>{bank[tokenIndex]}</Text>
              </Press>
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
            <Press key={i} onPress={() => pick(i)} style={styles.chip} feedback={null} scaleTo={0.94}>
              <Text style={styles.chipText}>{token}</Text>
            </Press>
          )
        )}
      </View>

      {!locked ? (
        <PrimaryButton
          title={t('common.check', lang)}
          disabled={used.length === 0}
          onPress={() => onSubmit(matchesAnswer(assembled, step.answer), assembled)}
          style={{ marginTop: spacing.xl }}
        />
      ) : null}
    </View>
  );
}

// --- Ввод текста --------------------------------------------------------

function TypeView({
  step,
  lang,
  immersion,
  locked,
  showTapHint,
  onSubmit,
}: StepProps & { step: TypeStep }) {
  const [value, setValue] = useState('');

  return (
    <View>
      <Instruction step={step} />
      <TapHint lang={lang} show={showTapHint} />
      <TappableWords text={step.ru} lang="ru" textStyle={styles.prompt} />
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
          onPress={() => onSubmit(matchesAnswer(value, step.answer, step.alt), value)}
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
  showTapHint,
  onSubmit,
}: StepProps & { step: TransformStep }) {
  const [value, setValue] = useState('');

  return (
    <View>
      <Instruction step={step} />
      <TapHint lang={lang} show={showTapHint} />
      <View style={styles.fromBox}>
        <TappableWords text={step.from} lang="ro" textStyle={styles.fromText} />
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
          onPress={() => onSubmit(matchesAnswer(value, step.answer, step.alt), value)}
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
      haptic('tap');
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
      haptic('miss');
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
              <Press
                key={i}
                disabled={done || locked}
                onPress={() => setSelectedLeft(i)}
                feedback="select"
                scaleTo={0.97}
                style={[
                  styles.matchCell,
                  selectedLeft === i && styles.matchCellActive,
                  done && styles.matchCellDone,
                ]}
              >
                <Text style={[styles.matchText, done && styles.matchTextDone]}>{pair.ro}</Text>
              </Press>
            );
          })}
        </View>

        <View style={styles.matchColumn}>
          {right.map((label, i) => {
            const done = matchedRight.has(label);
            return (
              <Press
                key={i}
                disabled={done || locked}
                onPress={() => pickRight(i)}
                feedback={null}
                scaleTo={0.97}
                style={[
                  styles.matchCell,
                  done && styles.matchCellDone,
                  flash === i && styles.matchCellWrong,
                ]}
              >
                <Text style={[styles.matchText, done && styles.matchTextDone]}>{label}</Text>
              </Press>
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
    onSubmit(i === step.correct, step.options[i]);
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
    onSubmit(i === step.wrongIndex, step.tokens[i]);
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
            <Press
              key={i}
              onPress={() => choose(i)}
              feedback={null}
              scaleTo={0.94}
              style={[
                styles.chip,
                styles.tokenChip,
                isWrong && styles.chipWrongAnswer,
                isBadPick && styles.chipBadPick,
              ]}
            >
              <Text style={styles.chipText}>{token}</Text>
            </Press>
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
  picked,
  explain,
  onContinue,
}: {
  lang: Lang;
  correct: boolean;
  step: GrammarStep;
  picked?: string;
  explain?: string;
  onContinue: () => void;
}) {
  const answer = correctAnswerText(step);
  const speech = speechTextForStep(step);

  // Разбор по существу: чем выбранная форма отличается от нужной. Общее
  // правило внизу отвечает «почему так», а эта пара строк — «а не иначе».
  const forms = 'forms' in step ? step.forms : undefined;
  const pickedMeaning = !correct && picked ? describeForm(picked, forms) : undefined;
  const answerMeaning = answer ? describeForm(answer, forms) : undefined;
  const hasContrast = !correct && !!pickedMeaning && !!answerMeaning && picked !== answer;

  // Разбор выезжает снизу: так понятно, что это ответ на твоё действие,
  // а не подменившийся экран.
  const slide = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    slide.setValue(0);
    Animated.spring(slide, {
      toValue: 1,
      speed: 20,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  }, [slide, step, correct]);

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [90, 0] });

  return (
    <Animated.View
      style={[
        styles.feedback,
        correct ? styles.feedbackOk : styles.feedbackBad,
        { transform: [{ translateY }], opacity: slide },
      ]}
    >
      <View style={styles.feedbackHead}>
        <Text
          style={[
            styles.feedbackTitle,
            { color: correct ? colors.success : colors.danger },
          ]}
        >
          {correct ? t('lesson.correct', lang) : t('lesson.wrong', lang)}
        </Text>
        {speech ? <SpeakerButton text={speech} size={32} /> : null}
      </View>
      {!correct && answer ? (
        <Text style={styles.feedbackAnswer}>
          {t('lesson.answerIs', lang)} <Text style={styles.feedbackAnswerStrong}>{answer}</Text>
        </Text>
      ) : null}
      {explain || hasContrast ? (
        <View style={[styles.whyBox, correct && styles.whyBoxOk]}>
          {!correct ? <Text style={styles.whyLabel}>ПОЧЕМУ</Text> : null}

          {hasContrast ? (
            <View style={styles.contrast}>
              <View style={styles.contrastRow}>
                <Text style={styles.contrastMark}>✗</Text>
                <Text style={styles.contrastText}>
                  <Text style={styles.contrastForm}>{picked}</Text> — {pickedMeaning}
                </Text>
              </View>
              <View style={styles.contrastRow}>
                <Text style={[styles.contrastMark, { color: colors.success }]}>✓</Text>
                <Text style={styles.contrastText}>
                  <Text style={[styles.contrastForm, { color: colors.success }]}>{answer}</Text> —{' '}
                  {answerMeaning}
                </Text>
              </View>
            </View>
          ) : null}

          {explain ? <Text style={styles.feedbackExplain}>{explain}</Text> : null}
        </View>
      ) : null}
      {/* Кнопка «дальше» всегда одна и та же: красной её делать незачем.
          Красным отмечен сам неверный вариант — этого достаточно, чтобы
          понять, что произошло, и незачем ещё и подсвечивать тревогой
          выход из ситуации. */}
      <PrimaryButton
        title={t('common.continue', lang)}
        onPress={onContinue}
        style={{ marginTop: spacing.md }}
      />
    </Animated.View>
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
  useEffect(() => {
    haptic('done');
  }, []);

  return (
    <View style={styles.centered}>
      <Reveal offset={16}>
        <View style={styles.resultTop}>
          <View style={[styles.resultGlyph, { borderColor: chapterColor }]}>
            <Text style={styles.resultGlyphText}>{boss ? '👑' : '✓'}</Text>
          </View>
          <Text style={styles.resultTitle}>{t('lesson.finished', lang)}</Text>
          {perfect ? <Text style={styles.resultPerfect}>{t('lesson.perfect', lang)}</Text> : null}
        </View>
      </Reveal>

      <Reveal delay={160}>
        <View style={styles.resultStats}>
          <ResultStat label={t('lesson.accuracy', lang)} value={`${accuracy}%`} />
          <View style={styles.resultStat}>
            <CountUp
              value={xp}
              prefix="+"
              style={[styles.resultStatValue, { color: colors.primaryBright }]}
            />
            <Text style={styles.resultStatLabel}>{t('lesson.xpEarned', lang)}</Text>
          </View>
          <ResultStat label={t('lesson.bestCombo', lang)} value={String(bestCombo)} />
        </View>
      </Reveal>

      <Reveal delay={320} style={{ alignSelf: 'stretch' }}>
        <PrimaryButton
          title={t('common.continue', lang)}
          onPress={onExit}
          style={{ marginTop: spacing.xxl, alignSelf: 'stretch' }}
        />
      </Reveal>
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
  stepCount: {
    fontSize: 12,
    color: colors.textFaint,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    minWidth: 38,
    textAlign: 'right',
  },
  comboRow: { paddingHorizontal: spacing.lg, minHeight: 24 },
  body: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },

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
  ruHint: { fontSize: 14, color: colors.textDim, marginBottom: spacing.lg },
  tapHint: { fontSize: 11, color: colors.textFaint, marginBottom: spacing.md },
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
  table: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowLast: { borderBottomWidth: 0 },
  tableForm: {
    width: 96,
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryBright,
  },
  tableMeaning: { flex: 1, fontSize: 13, color: colors.textDim, lineHeight: 18 },
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
  feedbackHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  feedbackTitle: { flex: 1, fontSize: 16, fontWeight: '800' },
  feedbackAnswer: { color: colors.textDim, fontSize: 14, marginTop: 4 },
  feedbackAnswerStrong: { color: colors.text, fontWeight: '700' },
  feedbackExplain: { color: colors.text, fontSize: 13, lineHeight: 20 },
  whyBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerDim,
    gap: 5,
  },
  whyBoxOk: { borderColor: colors.border, backgroundColor: colors.glass },
  whyLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.danger,
  },
  contrast: { gap: 4, marginBottom: 2 },
  contrastRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  contrastMark: { fontSize: 12, color: colors.danger, fontWeight: '800', width: 12 },
  contrastText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 19 },
  contrastForm: { fontWeight: '800', color: colors.danger },

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
  resultTop: { alignItems: 'center' },
  resultTitle: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  resultPerfect: { fontSize: 14, color: colors.success, marginTop: 6, fontWeight: '600' },
  resultStats: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xxl },
  resultStat: { alignItems: 'center' },
  resultStatValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  resultStatLabel: { fontSize: 11, color: colors.textFaint, marginTop: 4 },
});
