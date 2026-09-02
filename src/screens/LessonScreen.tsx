import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { Lesson, Word } from '../data';
import { Exercise, buildExercisesForWords, isAnswerCorrect } from '../logic/exercises';
import { ProgressBar } from '../components/ProgressBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { SpeakerButton } from '../components/SpeakerButton';
import { TappableWords } from '../components/TappableWords';
import { speakRomanian } from '../logic/speech';
import { XP_PER_CORRECT, XP_PER_LESSON_BONUS } from '../logic/progress';

interface Props {
  lesson: Lesson;
  words: Word[];
  unitWords: Word[];
  onExit: () => void;
  onAnswer: (wordId: string, correct: boolean) => void;
  onFinishLesson: (lessonId: string) => void;
}

type Feedback = 'correct' | 'wrong' | null;

export function LessonScreen({ lesson, words, unitWords, onExit, onAnswer, onFinishLesson }: Props) {
  const totalWords = words.length;
  const [queue, setQueue] = useState<Exercise[]>(() => buildExercisesForWords(words, unitWords));
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [completedWordIds, setCompletedWordIds] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const current = queue[0];

  const progressRatio = totalWords === 0 ? 0 : completedWordIds.size / totalWords;

  function submitChoice(optionId: string) {
    if (!current || current.kind === 'type_ro' || feedback) return;
    const correct = optionId === current.correctId;
    setSelectedId(optionId);
    finalizeAnswer(correct);
  }

  function submitTyped() {
    if (!current || current.kind !== 'type_ro' || feedback) return;
    const correct = isAnswerCorrect(typed, current.acceptable);
    finalizeAnswer(correct);
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
      const insertAt = Math.min(3, rest.length);
      rest.splice(insertAt, 0, { ...queue[0] });
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
    const accuracy = sessionAttempts === 0 ? 100 : Math.round((sessionCorrect / sessionAttempts) * 100);
    const xpEarned = sessionCorrect * XP_PER_CORRECT + XP_PER_LESSON_BONUS;
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.summaryContent}>
          <Text style={styles.summaryEmoji}>🎉</Text>
          <Text style={styles.summaryTitle}>Урок пройден!</Text>
          <View style={styles.summaryRow}>
            <SummaryStat label="Точность" value={`${accuracy}%`} />
            <SummaryStat label="Получено XP" value={`+${xpEarned}`} />
          </View>
          <PrimaryButton title="Продолжить" onPress={onExit} style={{ marginTop: 24, width: '100%' }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={8}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ProgressBar ratio={progressRatio} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {current.kind === 'type_ro' ? (
          <TypeExerciseView
            key={current.word.id}
            prompt={current.prompt}
            typed={typed}
            setTyped={setTyped}
            feedback={feedback}
            correctAnswer={current.answer}
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
          <View style={[styles.feedbackBar, feedback === 'correct' ? styles.feedbackOk : styles.feedbackBad]}>
            <Text style={styles.feedbackText}>
              {feedback === 'correct' ? 'Верно! 🎉' : `Неверно. Правильно: ${current.kind === 'type_ro' ? current.answer : current.options.find((o) => o.id === current.correctId)?.text}`}
            </Text>
            <PrimaryButton
              title="Далее"
              onPress={handleContinue}
              variant={feedback === 'correct' ? 'primary' : 'danger'}
            />
          </View>
        ) : current.kind === 'type_ro' ? (
          <PrimaryButton title="Проверить" onPress={submitTyped} disabled={typed.trim().length === 0} />
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
        {promptLang === 'ru' ? 'Переведи на румынский' : 'Переведи на русский'}
      </Text>
      <Text style={styles.tapHint}>Не знаешь слово — тапни по нему</Text>
      <View style={styles.promptRow}>
        <View style={{ flex: 1 }}>
          <TappableWords
            text={prompt}
            lang={promptLang}
            fallback={options.find((o) => o.id === correctId)?.text ?? ''}
            textStyle={styles.promptText}
          />
        </View>
        {promptLang === 'ru' ? null : <SpeakerButton text={prompt} size={34} />}
      </View>
      <View style={styles.optionsWrap}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrectOption = feedback && opt.id === correctId;
          const isWrongSelected = feedback && isSelected && opt.id !== correctId;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelect(opt.id)}
              disabled={!!feedback}
              style={[
                styles.option,
                isCorrectOption && styles.optionCorrect,
                isWrongSelected && styles.optionWrong,
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

function TypeExerciseView({
  prompt,
  typed,
  setTyped,
  feedback,
  correctAnswer,
}: {
  prompt: string;
  typed: string;
  setTyped: (s: string) => void;
  feedback: Feedback;
  correctAnswer: string;
}) {
  return (
    <View>
      <Text style={styles.instruction}>Напиши перевод на румынском</Text>
      <Text style={styles.tapHint}>Не знаешь слово — тапни по нему</Text>
      <View style={{ marginBottom: 16 }}>
        <TappableWords text={prompt} lang="ru" fallback={correctAnswer} textStyle={styles.promptText} />
      </View>
      <TextInput
        value={typed}
        onChangeText={setTyped}
        editable={!feedback}
        placeholder="Введи перевод..."
        placeholderTextColor={colors.textLight}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          feedback === 'correct' && styles.inputCorrect,
          feedback === 'wrong' && styles.inputWrong,
        ]}
      />
      {feedback === 'wrong' ? (
        <Text style={styles.correctHint}>Правильный ответ: {correctAnswer}</Text>
      ) : null}
    </View>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryStat}>
      <Text style={styles.summaryStatValue}>{value}</Text>
      <Text style={styles.summaryStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  close: { fontSize: 20, color: colors.textLight },
  body: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  instruction: { fontSize: 13, fontWeight: '700', color: colors.textLight, marginBottom: 4 },
  tapHint: { fontSize: 11, color: colors.textLight, marginBottom: 10 },
  promptRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 24 },
  promptText: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8 },
  optionsWrap: { gap: 10 },
  option: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: colors.card,
  },
  optionCorrect: { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
  optionWrong: { borderColor: colors.red, backgroundColor: colors.red + '22' },
  optionText: { fontSize: 17, fontWeight: '600', color: colors.text },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    backgroundColor: colors.card,
    color: colors.text,
  },
  inputCorrect: { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
  inputWrong: { borderColor: colors.red, backgroundColor: colors.red + '22' },
  correctHint: { marginTop: 10, color: colors.red, fontWeight: '600' },
  footer: { padding: 16 },
  feedbackBar: { borderRadius: 16, padding: 16, gap: 12 },
  feedbackOk: { backgroundColor: colors.primary + '18' },
  feedbackBad: { backgroundColor: colors.red + '18' },
  feedbackText: { fontSize: 15, fontWeight: '700', color: colors.text },
  summaryContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  summaryEmoji: { fontSize: 56, marginBottom: 12 },
  summaryTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', gap: 16 },
  summaryStat: { alignItems: 'center' },
  summaryStatValue: { fontSize: 24, fontWeight: '800', color: colors.primary },
  summaryStatLabel: { fontSize: 13, color: colors.textLight, marginTop: 4 },
});
