import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors, radius, spacing, softShadow } from '../theme/colors';
import {
  MAX_TEST_QUESTIONS,
  PlacementQuestion,
  QUESTIONS_PER_CHAPTER,
  TOTAL_TEST_CHAPTERS,
  buildChapterQuestions,
  chapterPassed,
  chapterTitles,
  lessonsCovered,
} from '../logic/placement';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { Panel } from '../components/Panel';
import { TappableWords, detectLang } from '../components/TappableWords';

interface Props {
  /** Сколько глав уже пройдено руками — их тест не переспрашивает. */
  onFinish: (knownChapters: number) => void;
  onExit: () => void;
}

type Phase = 'intro' | 'question' | 'result';

/**
 * Тест на определение уровня: глава за главой, по пять вопросов.
 * Сдал главу — идём дальше, не сдал — тест закончен, и дальше учиться
 * с этого места. Правильность каждого ответа не показываем: это проверка,
 * а не урок, подсказки исказили бы результат.
 */
export function PlacementTestScreen({ onFinish, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [chapterIndex, setChapterIndex] = useState(0);
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctInChapter, setCorrectInChapter] = useState(0);
  const [knownChapters, setKnownChapters] = useState(0);
  const [answered, setAnswered] = useState(0);

  const start = useCallback(() => {
    setQuestions(buildChapterQuestions(0));
    setChapterIndex(0);
    setQuestionIndex(0);
    setCorrectInChapter(0);
    setKnownChapters(0);
    setAnswered(0);
    setPhase('question');
  }, []);

  const answer = useCallback(
    (optionIndex: number) => {
      const question = questions[questionIndex];
      if (!question) return;

      const correct = correctInChapter + (optionIndex === question.correct ? 1 : 0);
      setAnswered((n) => n + 1);

      // Глава ещё не кончилась — просто следующий вопрос.
      if (questionIndex + 1 < questions.length) {
        setCorrectInChapter(correct);
        setQuestionIndex((i) => i + 1);
        return;
      }

      // Глава кончилась — решаем, идти ли дальше.
      if (!chapterPassed(correct)) {
        setPhase('result');
        return;
      }

      const passed = chapterIndex + 1;
      setKnownChapters(passed);

      if (passed >= TOTAL_TEST_CHAPTERS) {
        setPhase('result');
        return;
      }

      setChapterIndex(passed);
      setQuestions(buildChapterQuestions(passed));
      setQuestionIndex(0);
      setCorrectInChapter(0);
    },
    [questions, questionIndex, correctInChapter, chapterIndex]
  );

  if (phase === 'intro') {
    return <IntroScreen onStart={start} onExit={onExit} />;
  }

  if (phase === 'result') {
    return (
      <ResultScreen
        knownChapters={knownChapters}
        onApply={() => {
          onFinish(knownChapters);
          onExit();
        }}
      />
    );
  }

  const question = questions[questionIndex];
  if (!question) return null;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar ratio={answered / MAX_TEST_QUESTIONS} color={colors.accent} />
        </View>
        <Text style={styles.counter}>
          {questionIndex + 1}/{QUESTIONS_PER_CHAPTER}
        </Text>
      </View>

      <Text style={styles.chapterLabel}>
        Раздел {chapterIndex + 1} · {question.chapterTitle}
      </Text>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TappableWords
          text={question.prompt}
          lang={detectLang(question.prompt)}
          textStyle={styles.prompt}
        />
        {question.ru ? <Text style={styles.ruHint}>{question.ru}</Text> : null}

        <View style={styles.options}>
          {question.options.map((option, i) => (
            <Pressable
              key={i}
              onPress={() => answer(i)}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => answer(-1)} style={styles.skip} hitSlop={8}>
          <Text style={styles.skipText}>Не знаю</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function IntroScreen({ onStart, onExit }: { onStart: () => void; onExit: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.introBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.introGlyph}>◎</Text>
        <Text style={styles.introTitle}>Тест на уровень</Text>
        <Text style={styles.introText}>
          Если ты уже что-то знаешь, незачем проходить это заново. Тест проверит, где
          твой реальный уровень, и отметит пройденными главы, которые ты и так знаешь.
        </Text>

        <Panel style={styles.introPanel}>
          <IntroPoint
            n="1"
            text="Идём главами: по пять вопросов на каждую, с выбором ответа."
          />
          <IntroPoint
            n="2"
            text="Сдал главу — переходим к следующей. Не сдал — тест заканчивается, и учиться начинаешь с этого места."
          />
          <IntroPoint
            n="3"
            text="Правильные ответы по ходу не показываем: это проверка, а не урок."
          />
          <IntroPoint
            n="4"
            text="Опыт за пропущенные главы не начисляется, и пройти их по-настоящему можно в любой момент."
          />
        </Panel>

        <Text style={styles.introNote}>
          Максимум {MAX_TEST_QUESTIONS} вопросов, обычно сильно меньше. Уже пройденное
          вручную тест не тронет.
        </Text>

        <PrimaryButton title="Начать тест" onPress={onStart} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

function IntroPoint({ n, text }: { n: string; text: string }) {
  return (
    <View style={styles.introPoint}>
      <Text style={styles.introPointNum}>{n}</Text>
      <Text style={styles.introPointText}>{text}</Text>
    </View>
  );
}

function ResultScreen({
  knownChapters,
  onApply,
}: {
  knownChapters: number;
  onApply: () => void;
}) {
  const titles = useMemo(() => chapterTitles(knownChapters), [knownChapters]);
  const lessons = lessonsCovered(knownChapters);
  const nothingSkipped = knownChapters === 0;
  const everything = knownChapters >= TOTAL_TEST_CHAPTERS;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.resultBody} showsVerticalScrollIndicator={false}>
        <View style={[styles.resultGlyph, softShadow]}>
          <Text style={styles.resultGlyphText}>{nothingSkipped ? '🌱' : everything ? '👑' : '◎'}</Text>
        </View>

        <Text style={styles.resultTitle}>
          {nothingSkipped
            ? 'Начнём с самого начала'
            : everything
            ? 'Ты знаешь весь курс'
            : `Твой уровень — глава ${knownChapters + 1}`}
        </Text>

        <Text style={styles.resultText}>
          {nothingSkipped
            ? 'Первая глава не далась — это нормально, она и есть точка входа. Ничего не пропускаем, идём с начала тропы.'
            : everything
            ? 'Все семь глав пройдены тестом. Загляни в погружение и в словарь — там ещё есть чем заняться.'
            : `Тест зачёл ${lessons} ${plural(lessons, 'урок', 'урока', 'уроков')}. Дальше начинай с главы ${knownChapters + 1}.`}
        </Text>

        {titles.length > 0 ? (
          <View style={styles.chapterList}>
            {titles.map((title, i) => (
              <View key={i} style={styles.chapterRow}>
                <Text style={styles.chapterCheck}>✓</Text>
                <Text style={styles.chapterName}>{title}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <PrimaryButton
          title={nothingSkipped ? 'К тропе' : 'Открыть эти главы'}
          onPress={onApply}
          style={{ marginTop: spacing.xxl, alignSelf: 'stretch' }}
        />
      </ScrollView>
    </View>
  );
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
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
  counter: { fontSize: 12, color: colors.textFaint, fontVariant: ['tabular-nums'] },
  chapterLabel: {
    paddingHorizontal: spacing.lg,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },

  body: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  prompt: { fontSize: 24, fontWeight: '700', color: colors.text, lineHeight: 33 },
  ruHint: { fontSize: 14, color: colors.textDim, marginTop: spacing.md },
  options: { gap: spacing.sm, marginTop: spacing.xl },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
  },
  optionPressed: { backgroundColor: colors.cardHover, borderColor: colors.borderBright },
  optionText: { fontSize: 16, fontWeight: '600', color: colors.text },
  skip: { alignSelf: 'center', marginTop: spacing.xl, padding: spacing.sm },
  skipText: { color: colors.textFaint, fontSize: 13, fontWeight: '600' },

  introBody: { padding: spacing.lg, paddingBottom: spacing.xxl },
  introGlyph: { fontSize: 44, color: colors.primaryBright, marginBottom: spacing.md },
  introTitle: { fontSize: 26, fontWeight: '800', color: colors.text },
  introText: {
    fontSize: 14,
    color: colors.textDim,
    lineHeight: 21,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  introPanel: { gap: spacing.md },
  introPoint: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  introPointNum: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryBright,
    width: 14,
    marginTop: 2,
  },
  introPointText: { flex: 1, fontSize: 13, color: colors.textDim, lineHeight: 19 },
  introNote: {
    fontSize: 11,
    color: colors.textFaint,
    marginTop: spacing.lg,
    lineHeight: 16,
  },

  resultBody: { padding: spacing.xl, flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  resultGlyph: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  resultGlyphText: { fontSize: 36 },
  resultTitle: { fontSize: 23, fontWeight: '800', color: colors.text, textAlign: 'center' },
  resultText: {
    fontSize: 14,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.md,
  },
  chapterList: { alignSelf: 'stretch', marginTop: spacing.xl, gap: spacing.sm },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  chapterCheck: { color: colors.success, fontWeight: '800' },
  chapterName: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
