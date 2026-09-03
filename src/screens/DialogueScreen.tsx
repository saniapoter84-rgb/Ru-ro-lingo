import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Dialogue } from '../data/dialogues';
import { Lang, t } from '../i18n/strings';
import { PrimaryButton } from '../components/PrimaryButton';
import { SpeakerButton } from '../components/SpeakerButton';
import { ProgressBar } from '../components/ProgressBar';
import { Panel, SectionLabel } from '../components/Panel';
import { speakRomanian } from '../logic/speech';

interface Props {
  dialogue: Dialogue;
  lang: Lang;
  immersion: boolean;
  onFinish: (score: number, total: number, xp: number) => void;
  onExit: () => void;
}

type Phase = 'read' | 'quiz' | 'done';

const XP_PER_QUESTION = 15;
const XP_SCENE_BONUS = 25;

export function DialogueScreen({ dialogue, lang, immersion, onFinish, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('read');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (phase === 'read') {
    return (
      <ReadPhase
        dialogue={dialogue}
        lang={lang}
        immersion={immersion}
        onExit={onExit}
        onStartQuiz={() => setPhase('quiz')}
      />
    );
  }

  if (phase === 'done') {
    const xp = score * XP_PER_QUESTION + XP_SCENE_BONUS;
    return (
      <View style={styles.centered}>
        <Text style={styles.doneEmoji}>{dialogue.emoji}</Text>
        <Text style={styles.doneTitle}>{t('immersion.sceneDone', lang)}</Text>
        <Text style={styles.doneScore}>
          {t('immersion.score', lang)}: {score}/{dialogue.questions.length}
        </Text>
        <Text style={styles.doneXp}>+{xp} XP</Text>

        <View style={styles.phrasesBlock}>
          <SectionLabel>{t('immersion.phrases', lang)}</SectionLabel>
          {dialogue.phrases.map((phrase, i) => (
            <Panel key={i} style={styles.phraseRow} padded={false}>
              <View style={styles.phraseInner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.phraseRo}>{phrase.ro}</Text>
                  <Text style={styles.phraseRu}>{phrase.ru}</Text>
                </View>
                <SpeakerButton text={phrase.ro} size={30} />
              </View>
            </Panel>
          ))}
        </View>

        <PrimaryButton
          title={t('common.continue', lang)}
          onPress={() => {
            onFinish(score, dialogue.questions.length, xp);
            onExit();
          }}
          style={{ marginTop: spacing.xl, alignSelf: 'stretch' }}
        />
      </View>
    );
  }

  const question = dialogue.questions[questionIndex];
  const answered = picked !== null;

  function next() {
    if (questionIndex + 1 >= dialogue.questions.length) {
      setPhase('done');
      return;
    }
    setQuestionIndex((i) => i + 1);
    setPicked(null);
  }

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === question.correct) setScore((s) => s + 1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar
            ratio={(questionIndex + (answered ? 1 : 0)) / dialogue.questions.length}
            color={colors.accent}
          />
        </View>
        <Text style={styles.counter}>
          {questionIndex + 1}/{dialogue.questions.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.quizBody} showsVerticalScrollIndicator={false}>
        <SectionLabel>{t('immersion.questions', lang)}</SectionLabel>
        <Text style={styles.questionRo}>{question.ro}</Text>
        <RevealableRu text={question.ru} lang={lang} immersion={immersion} />

        <View style={styles.options}>
          {question.options.map((option, i) => {
            const isCorrect = answered && i === question.correct;
            const isWrong = answered && i === picked && i !== question.correct;
            return (
              <Pressable
                key={i}
                onPress={() => choose(i)}
                style={[
                  styles.option,
                  isCorrect && styles.optionCorrect,
                  isWrong && styles.optionWrong,
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {answered ? (
        <View style={styles.footer}>
          <PrimaryButton title={t('common.continue', lang)} onPress={next} />
        </View>
      ) : null}
    </View>
  );
}

function ReadPhase({
  dialogue,
  lang,
  immersion,
  onExit,
  onStartQuiz,
}: {
  dialogue: Dialogue;
  lang: Lang;
  immersion: boolean;
  onExit: () => void;
  onStartQuiz: () => void;
}) {
  const [openLine, setOpenLine] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <Text style={styles.sceneTitle} numberOfLines={1}>
          {dialogue.emoji} {dialogue.title}
        </Text>
        <Pressable
          onPress={() => speakRomanian(dialogue.lines.map((l) => l.ro).join('. '))}
          hitSlop={10}
        >
          <Text style={styles.playAll}>▶</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.readBody} showsVerticalScrollIndicator={false}>
        {!immersion ? <Text style={styles.setting}>{dialogue.setting}</Text> : null}
        <Text style={styles.tapHint}>{t('immersion.tapLine', lang)}</Text>

        {dialogue.lines.map((line, i) => {
          const open = openLine === i;
          const isYou = line.speaker === 'Tu';
          return (
            <Pressable
              key={i}
              onPress={() => setOpenLine(open ? null : i)}
              style={[styles.line, isYou && styles.lineYou]}
            >
              <View style={styles.lineHeader}>
                <Text style={[styles.speaker, isYou && styles.speakerYou]}>{line.speaker}</Text>
                <SpeakerButton text={line.ro} size={26} />
              </View>
              <Text style={styles.lineRo}>{line.ro}</Text>
              {open ? <Text style={styles.lineRu}>{line.ru}</Text> : null}
            </Pressable>
          );
        })}

        <View style={styles.phrasesBlock}>
          <SectionLabel>{t('immersion.phrases', lang)}</SectionLabel>
          {dialogue.phrases.map((phrase, i) => (
            <View key={i} style={styles.phraseCompact}>
              <Text style={styles.phraseRo}>{phrase.ro}</Text>
              <Text style={styles.phraseRu}>{phrase.ru}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          title={t('immersion.startQuestions', lang)}
          onPress={onStartQuiz}
          style={{ marginTop: spacing.xl }}
        />
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

/** В погружении перевод вопроса прячется, пока сам не попросишь. */
function RevealableRu({
  text,
  lang,
  immersion,
}: {
  text: string;
  lang: Lang;
  immersion: boolean;
}) {
  const [shown, setShown] = useState(false);
  if (!immersion || shown) return <Text style={styles.questionRu}>{text}</Text>;
  return (
    <Pressable onPress={() => setShown(true)} style={styles.revealChip} hitSlop={6}>
      <Text style={styles.revealText}>{t('lesson.showRu', lang)}</Text>
    </Pressable>
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
  sceneTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  playAll: { fontSize: 15, color: colors.primaryBright },
  counter: { fontSize: 12, color: colors.textFaint, fontVariant: ['tabular-nums'] },

  readBody: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  setting: { fontSize: 12, color: colors.textDim, lineHeight: 18, marginBottom: spacing.md },
  tapHint: { fontSize: 11, color: colors.textFaint, marginBottom: spacing.lg },

  line: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lineYou: { backgroundColor: colors.primaryDim, borderColor: colors.borderBright },
  lineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  speaker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  speakerYou: { color: colors.primaryBright },
  lineRo: { fontSize: 16, color: colors.text, marginTop: 6, lineHeight: 23 },
  lineRu: {
    fontSize: 13,
    color: colors.textDim,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  phrasesBlock: { marginTop: spacing.xl },
  phraseCompact: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  phraseRow: { marginBottom: spacing.sm, backgroundColor: colors.bgElevated },
  phraseInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  phraseRo: { fontSize: 14, fontWeight: '700', color: colors.text },
  phraseRu: { fontSize: 12, color: colors.textDim, marginTop: 2 },

  quizBody: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  questionRo: { fontSize: 21, fontWeight: '700', color: colors.text, lineHeight: 29 },
  questionRu: { fontSize: 13, color: colors.textDim, marginTop: 6 },
  revealChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: spacing.sm,
  },
  revealText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  options: { gap: spacing.sm, marginTop: spacing.xl },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successDim },
  optionWrong: { borderColor: colors.danger, backgroundColor: colors.dangerDim },
  optionText: { fontSize: 15, fontWeight: '600', color: colors.text },
  footer: { padding: spacing.lg },

  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  doneEmoji: { fontSize: 48 },
  doneTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  doneScore: { fontSize: 14, color: colors.textDim, marginTop: 6 },
  doneXp: { fontSize: 18, fontWeight: '800', color: colors.primaryBright, marginTop: 4 },
});
