import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Lesson, Word } from '../data';
import { Exercise, buildExercisesForWords, isAnswerCorrect } from '../logic/exercises';
import { ProgressBar } from '../components/ProgressBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { SpeakerButton } from '../components/SpeakerButton';
import { TappableWords } from '../components/TappableWords';
import { speakRomanian } from '../logic/speech';
import { XP_PER_CORRECT, XP_PER_LESSON_BONUS } from '../logic/progress';
import { Lang, t } from '../i18n/strings';

interface Props {
  lesson: Lesson;
  words: Word[];
  unitWords: Word[];
  lang: Lang;
  immersion: boolean;
  onExit: () => void;
  onAnswer: (wordId: string, correct: boolean) => void;
  onFinishLesson: (lessonId: string) => void;
}

type Feedback = 'correct' | 'wrong' | null;

export function LessonScreen({
  lesson,
  words,
  unitWords,
  lang,
  immersion,
  onExit,
  onAnswer,
  onFinishLesson,
}: Props) {
  const totalWords = words.length;
  const [queue, setQueue] = useState<Exercise[]>(() =>
    buildExercisesForWords(words, unitWords, immersion)
  );
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [completedWordIds, setCompletedWordIds] = useState<Set<string>>(() => new Set());
  const [finished, setFinished] = useState(false);

  const current = queue[0];
  const progressRatio = totalWords === 0 ? 0 : completedWordIds.size / totalWords;

  function submitChoice(optionId: string) {
    if (!current || current.kind === 'type_ro' || feedback) return;
    setSelectedId(optionId);
    finalizeAnswer(optionId === current.correctId);
  }

  function submitTyped() {
    if (!current || current.kind !== 'type_ro' || feedback) return;
    finalizeAnswer(isAnswerCorrect(typed, current.acceptable));
  }

  function finalizeAnswer(correct: boolean) {
    if (!current) return;
    setFeedback(correct ? 'correct' : 'wrong');
    setSessionAttempts((n) => n + 1);
    onAnswer(current.word.id, correct);
    if (correct) {
      setSessionCorrect((n) => n + 1);
      setCompletedWordIds((s) => new Set(s).add(current.word.id));
      speakRomanian(current.word.ro);
    }
  }

  function handleContinue() {
    if (!current) return;
    const wasCorrect = feedback === 'correct';
    const rest = queue.slice(1);
    if (!wasCorrect) {
      rest.splice(Math.min(3, rest.length), 0, { ...queue[0] });
    }
    setQueue(rest);
    setFeedback(null);
    setSelectedId(null);
    setTyped('');

    if (rest.length === 0) {
      setFinished(true);
      onFinishLesson(lesson.id);
    }
  }

  if (finished || !current) {
    const accuracy =
      sessionAttempts === 0 ? 100 : Math.round((sessionCorrect / sessionAttempts) * 100);
    const xpEarned = sessionCorrect * XP_PER_CORRECT + XP_PER_LESSON_BONUS;
    return (
      <View style={styles.centered}>
        <View style={styles.doneGlyph}>
          <Text style={styles.doneGlyphText}>✓</Text>
        </View>
        <Text style={styles.doneTitle}>{t('lesson.finished', lang)}</Text>
        <View style={styles.doneStats}>
          <SummaryStat label={t('lesson.accuracy', lang)} value={`${accuracy}%`} />
          <SummaryStat label={t('lesson.xpEarned', lang)} value={`+${xpEarned}`} accent />
        </View>
        <PrimaryButton
          title={t('common.continue', lang)}
          onPress={onExit}
          style={{ marginTop: spacing.xxl, alignSelf: 'stretch' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar ratio={progressRatio} color={colors.accent} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {current.kind === 'listen_ro' ? (
          <ListenExerciseView
            key={current.word.id}
            audio={current.audio}
            options={current.options}
            correctId={current.correctId}
            selectedId={selectedId}
            feedback={feedback}
            onSelect={submitChoice}
            lang={lang}
          />
        ) : current.kind === 'type_ro' ? (
          <TypeExerciseView
            key={current.word.id}
            prompt={current.prompt}
            typed={typed}
            setTyped={setTyped}
            feedback={feedback}
            lang={lang}
          />
        ) : (
          <ChoiceExerciseView
            key={current.word.id}
            promptLang={current.kind === 'choice_ro' ? 'ru' : 'ro'}
            prompt={current.prompt}
            options={current.options}
            correctId={current.correctId}
            selectedId={selectedId}
            feedback={feedback}
            onSelect={submitChoice}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {feedback ? (
          <View
            style={[
              styles.feedbackBar,
              feedback === 'correct' ? styles.feedbackOk : styles.feedbackBad,
            ]}
          >
            <Text
              style={[
                styles.feedbackText,
                { color: feedback === 'correct' ? colors.success : colors.danger },
              ]}
            >
              {feedback === 'correct'
                ? t('lesson.correct', lang)
                : `${t('lesson.answerIs', lang)} ${
                    current.kind === 'type_ro'
                      ? current.answer
                      : current.options.find((o) => o.id === current.correctId)?.text
                  }`}
            </Text>
            <PrimaryButton
              title={t('common.continue', lang)}
              onPress={handleContinue}
              variant={feedback === 'correct' ? 'primary' : 'danger'}
              style={{ marginTop: spacing.md }}
            />
          </View>
        ) : current.kind === 'type_ro' ? (
          <PrimaryButton
            title={t('common.check', lang)}
            onPress={submitTyped}
            disabled={typed.trim().length === 0}
          />
        ) : null}
      </View>
    </View>
  );
}

function ChoiceExerciseView({
  promptLang,
  prompt,
  options,
  correctId,
  selectedId,
  feedback,
  onSelect,
}: {
  promptLang: 'ru' | 'ro';
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  selectedId: string | null;
  feedback: Feedback;
  onSelect: (id: string) => void;
}) {
  return (
    <View>
      <Text style={styles.instruction}>
        {promptLang === 'ru' ? 'RU → RO' : 'RO → RU'}
      </Text>
      <Text style={styles.tapHint}>Не знаешь слово — нажми на него</Text>
      <View style={styles.promptRow}>
        <View style={{ flex: 1 }}>
          <TappableWords text={prompt} lang={promptLang} textStyle={styles.promptText} />
        </View>
        {promptLang === 'ro' ? <SpeakerButton text={prompt} size={34} /> : null}
      </View>

      <View style={styles.options}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrectOption = feedback && opt.id === correctId;
          const isWrongSelected = feedback && isSelected && opt.id !== correctId;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelect(opt.id)}
              disabled={!!feedback}
              style={({ pressed }) => [
                styles.option,
                isCorrectOption && styles.optionCorrect,
                isWrongSelected && styles.optionWrong,
                pressed && !feedback && styles.optionPressed,
              ]}
            >
              <Text style={styles.optionText}>{opt.text}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ListenExerciseView({
  audio,
  options,
  correctId,
  selectedId,
  feedback,
  onSelect,
  lang,
}: {
  audio: string;
  options: { id: string; text: string }[];
  correctId: string;
  selectedId: string | null;
  feedback: Feedback;
  onSelect: (id: string) => void;
  lang: Lang;
}) {
  // Слово звучит само: смысл задания в том, чтобы узнать его на слух,
  // а не прочитать глазами.
  useEffect(() => {
    speakRomanian(audio);
  }, [audio]);

  return (
    <View>
      <Text style={styles.instruction}>{t('immersion.listenFirst', lang).toUpperCase()}</Text>
      <View style={styles.listenBox}>
        <SpeakerButton text={audio} size={72} loud />
        <Text style={styles.listenHint}>{t('immersion.replay', lang)}</Text>
      </View>
      <View style={styles.options}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrectOption = feedback && opt.id === correctId;
          const isWrongSelected = feedback && isSelected && opt.id !== correctId;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelect(opt.id)}
              disabled={!!feedback}
              style={({ pressed }) => [
                styles.option,
                isCorrectOption && styles.optionCorrect,
                isWrongSelected && styles.optionWrong,
                pressed && !feedback && styles.optionPressed,
              ]}
            >
              <Text style={styles.optionText}>{opt.text}</Text>
            </Pressable>
          );
        })}
      </View>
      {feedback ? <Text style={styles.revealedWord}>{audio}</Text> : null}
    </View>
  );
}

function TypeExerciseView({
  prompt,
  typed,
  setTyped,
  feedback,
  lang,
}: {
  prompt: string;
  typed: string;
  setTyped: (s: string) => void;
  feedback: Feedback;
  lang: Lang;
}) {
  return (
    <View>
      <Text style={styles.instruction}>RU → RO</Text>
      <Text style={styles.tapHint}>Не знаешь слово — нажми на него</Text>
      <View style={{ marginBottom: spacing.lg }}>
        <TappableWords text={prompt} lang="ru" textStyle={styles.promptText} />
      </View>
      <TextInput
        value={typed}
        onChangeText={setTyped}
        editable={!feedback}
        placeholder={t('lesson.typeHere', lang)}
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          feedback === 'correct' && styles.inputCorrect,
          feedback === 'wrong' && styles.inputWrong,
        ]}
      />
    </View>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.summaryStat}>
      <Text style={[styles.summaryStatValue, accent && { color: colors.primaryBright }]}>
        {value}
      </Text>
      <Text style={styles.summaryStatLabel}>{label}</Text>
    </View>
  );
}

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
  body: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  instruction: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: colors.textFaint,
    marginBottom: 4,
  },
  tapHint: { fontSize: 11, color: colors.textFaint, marginBottom: spacing.md },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  promptText: { fontSize: 26, fontWeight: '800', color: colors.text, lineHeight: 34 },
  options: { gap: spacing.sm },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  optionPressed: { backgroundColor: colors.cardHover, borderColor: colors.borderBright },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successDim },
  optionWrong: { borderColor: colors.danger, backgroundColor: colors.dangerDim },
  optionText: { fontSize: 16, fontWeight: '600', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: 17,
    backgroundColor: colors.bgElevated,
    color: colors.text,
  },
  inputCorrect: { borderColor: colors.success, backgroundColor: colors.successDim },
  inputWrong: { borderColor: colors.danger, backgroundColor: colors.dangerDim },
  listenBox: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  listenHint: { color: colors.textFaint, fontSize: 12 },
  revealedWord: {
    marginTop: spacing.lg,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryBright,
    textAlign: 'center',
  },
  footer: { padding: spacing.lg },
  feedbackBar: {
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    backgroundColor: colors.bgElevated,
  },
  feedbackOk: { borderColor: colors.success },
  feedbackBad: { borderColor: colors.danger },
  feedbackText: { fontSize: 15, fontWeight: '700' },

  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  doneGlyph: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  doneGlyphText: { fontSize: 34, color: colors.accent },
  doneTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xl,
  },
  doneStats: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xl },
  summaryStat: { alignItems: 'center' },
  summaryStatValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  summaryStatLabel: { fontSize: 11, color: colors.textFaint, marginTop: 4 },
});
