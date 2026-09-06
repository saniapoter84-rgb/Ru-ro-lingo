import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { LIVE_TEXTS, LiveText } from '../data/texts';
import { ProgressState } from '../logic/progress';
import {
  AnalyzedToken,
  READABLE_RATIO,
  TextAnalysis,
  TokenState,
  analyzeText,
} from '../logic/comprehension';
import { Press } from '../components/Press';
import { Reveal } from '../components/Reveal';
import { Panel } from '../components/Panel';
import { SpeakerButton } from '../components/SpeakerButton';
import { haptic } from '../logic/haptics';

interface Props {
  progress: ProgressState;
  /** Открыть конкретный текст сразу — по кнопке с главного экрана. */
  initialTextId?: string | null;
}

const STATE_COLOR: Record<TokenState, string> = {
  known: colors.text,
  seen: colors.textDim,
  new: colors.textFaint,
};

const STATE_LABEL: Record<TokenState, string> = {
  known: 'уже твоё',
  seen: 'встречалось',
  new: 'новое',
};

/**
 * «Живой текст» — единственный экран, который меряет не приложение, а язык.
 *
 * Здесь ничего нельзя пройти, выиграть или потерять: текст просто
 * показывает, сколько слов в нём уже читается. Это и есть повод вернуться —
 * не «серия сгорит», а «в прошлый раз тут было половина тёмного».
 */
export function ReadingScreen({ progress, initialTextId }: Props) {
  const [openId, setOpenId] = useState<string | null>(initialTextId ?? null);
  const open = openId ? LIVE_TEXTS.find((t) => t.id === openId) ?? null : null;

  if (open) {
    return <Reader text={open} progress={progress} onBack={() => setOpenId(null)} />;
  }
  return <TextList progress={progress} onOpen={setOpenId} />;
}

// --- Список текстов -----------------------------------------------------

function TextList({
  progress,
  onOpen,
}: {
  progress: ProgressState;
  onOpen: (id: string) => void;
}) {
  const rows = useMemo(
    () => LIVE_TEXTS.map((text) => ({ text, analysis: analyzeText(text, progress) })),
    [progress]
  );
  const readable = rows.filter((r) => r.analysis.ratio >= READABLE_RATIO).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>ЖИВОЙ РУМЫНСКИЙ</Text>
          <Text style={styles.title}>Что ты уже понимаешь</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Настоящие тексты: записка соседки, вывеска, объявление на вокзале. Ничего не надо
          решать — просто смотри, сколько слов уже читается. Через несколько уроков вернись
          и сравни.
        </Text>

        <Panel style={styles.summary}>
          <Text style={styles.summaryValue}>
            {readable}
            <Text style={styles.summaryMax}> из {LIVE_TEXTS.length}</Text>
          </Text>
          <Text style={styles.summaryLabel}>
            {readable === 0
              ? 'текстов читаются почти целиком — пока ни одного, и это нормально'
              : 'текстов читаются почти целиком'}
          </Text>
        </Panel>

        {rows.map(({ text, analysis }, i) => (
          <Reveal key={text.id} delay={i * 28}>
            <Press
              onPress={() => onOpen(text.id)}
              style={styles.card}
              feedback="select"
              scaleTo={0.985}
            >
              <View style={styles.cardHead}>
                <View style={styles.cardEmojiBox}>
                  <Text style={styles.cardEmoji}>{text.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{text.title}</Text>
                  <Text style={styles.cardKind}>{text.kind}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text
                    style={[
                      styles.cardPercent,
                      analysis.ratio >= READABLE_RATIO && { color: colors.success },
                    ]}
                  >
                    {Math.round(analysis.ratio * 100)}%
                  </Text>
                  <Text style={styles.cardWords}>
                    {analysis.known + analysis.seen}/{analysis.total} слов
                  </Text>
                </View>
              </View>
              <CoverageMeter analysis={analysis} />
            </Press>
          </Reveal>
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

/**
 * Полоса из клеточек — по одной на слово текста. Читается быстрее любого
 * процента: видно не «сколько», а «где» ещё темно.
 */
function CoverageMeter({ analysis }: { analysis: TextAnalysis }) {
  const cells: TokenState[] = [];
  for (const line of analysis.lines) {
    for (const token of line.tokens) {
      if (token.countable) cells.push(token.state);
    }
  }

  return (
    <View style={styles.meter}>
      {cells.map((state, i) => (
        <View
          key={i}
          style={[
            styles.meterCell,
            state === 'known' && { backgroundColor: colors.primary },
            state === 'seen' && { backgroundColor: colors.primaryDim },
          ]}
        />
      ))}
    </View>
  );
}

// --- Чтение -------------------------------------------------------------

function Reader({
  text,
  progress,
  onBack,
}: {
  text: LiveText;
  progress: ProgressState;
  onBack: () => void;
}) {
  const analysis = useMemo(() => analyzeText(text, progress), [text, progress]);
  const [active, setActive] = useState<{ line: number; index: number } | null>(null);
  const [shownLines, setShownLines] = useState<Set<number>>(() => new Set());

  const activeToken =
    active !== null ? analysis.lines[active.line]?.tokens[active.index] ?? null : null;

  function toggleLine(index: number) {
    haptic('select');
    setShownLines((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Press onPress={onBack} style={styles.backButton} feedback="select" hitSlop={8}>
          <Text style={styles.backIcon}>←</Text>
        </Press>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>{text.kind.toUpperCase()}</Text>
          <Text style={styles.readerTitle}>{text.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Panel style={styles.readerStat}>
          <View style={styles.readerStatRow}>
            <Text style={styles.readerStatValue}>
              {analysis.known + analysis.seen}
              <Text style={styles.readerStatMax}>/{analysis.total}</Text>
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.readerStatLabel}>слов узнаёшь</Text>
              <Text style={styles.readerStatHint}>
                твёрдо знакомых — {analysis.known}
                {analysis.seen > 0 ? `, встречались — ${analysis.seen}` : ''}
              </Text>
            </View>
          </View>
          <CoverageMeter analysis={analysis} />
        </Panel>

        <View style={styles.legend}>
          <LegendDot color={colors.primary} label="знаешь" />
          <LegendDot color={colors.primaryDim} label="встречал" />
          <LegendDot color={colors.bgElevated} label="новое" />
        </View>

        {analysis.lines.map((line, lineIndex) => (
          <Reveal key={lineIndex} delay={lineIndex * 40} style={styles.line}>
            <View style={styles.lineRow}>
              <View style={styles.lineWords}>
                {line.tokens.map((token, index) => {
                  if (!token.countable) {
                    return (
                      <Text key={index} style={styles.tokenPlain}>
                        {token.raw}{' '}
                      </Text>
                    );
                  }
                  const isActive =
                    active?.line === lineIndex && active?.index === index;
                  return (
                    <Pressable
                      key={index}
                      hitSlop={3}
                      onPress={() => {
                        haptic('tap');
                        setActive(isActive ? null : { line: lineIndex, index });
                      }}
                    >
                      <Text
                        style={[
                          styles.token,
                          { color: STATE_COLOR[token.state] },
                          token.state === 'new' && styles.tokenNew,
                          isActive && styles.tokenActive,
                        ]}
                      >
                        {token.raw}{' '}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <SpeakerButton text={line.tokens.map((t) => t.raw).join(' ')} size={28} />
            </View>

            <Press
              onPress={() => toggleLine(lineIndex)}
              style={[
                styles.translateToggle,
                shownLines.has(lineIndex) && styles.translateToggleOpen,
              ]}
              feedback={null}
              scaleTo={0.99}
            >
              <Text
                style={[
                  styles.translateToggleText,
                  shownLines.has(lineIndex) && styles.translateToggleTextOpen,
                ]}
              >
                {shownLines.has(lineIndex) ? line.ru : '↳ перевод'}
              </Text>
            </Press>
          </Reveal>
        ))}

        {activeToken ? (
          <View style={styles.wordCard}>
            <View style={styles.wordCardHead}>
              <Text style={styles.wordCardWord}>{activeToken.key}</Text>
              <View
                style={[
                  styles.statePill,
                  activeToken.state === 'known' && { borderColor: colors.primary },
                  activeToken.state === 'seen' && { borderColor: colors.borderBright },
                ]}
              >
                <Text style={styles.statePillText}>{STATE_LABEL[activeToken.state]}</Text>
              </View>
            </View>
            <Text style={styles.wordCardGloss}>
              {activeToken.gloss ?? 'нет отдельного перевода — смотри строку целиком'}
            </Text>
          </View>
        ) : (
          <Text style={styles.tapHint}>Нажми на любое слово — увидишь перевод</Text>
        )}

        {analysis.newWords.length > 0 ? (
          <View style={styles.newBlock}>
            <Text style={styles.newTitle}>
              Новые слова в этом тексте · {analysis.newWords.length}
            </Text>
            <Text style={styles.newHint}>
              Они появятся в уроках сами — специально искать их не нужно.
            </Text>
            <View style={styles.newList}>
              {analysis.newWords.map((word) => (
                <View key={word.key} style={styles.newChip}>
                  <Text style={styles.newChipWord}>{word.key}</Text>
                  {word.gloss ? <Text style={styles.newChipGloss}>{word.gloss}</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.doneBlock}>
            <Text style={styles.doneText}>
              В этом тексте для тебя не осталось незнакомых слов.
            </Text>
          </View>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: colors.textFaint },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 2 },
  readerTitle: { fontSize: 19, fontWeight: '800', color: colors.text, marginTop: 2 },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 16, color: colors.textDim, fontWeight: '700' },
  scroll: { paddingHorizontal: spacing.lg },
  intro: { fontSize: 12, color: colors.textDim, lineHeight: 18, marginBottom: spacing.lg },

  summary: { marginBottom: spacing.lg, alignItems: 'flex-start' },
  summaryValue: { fontSize: 26, fontWeight: '800', color: colors.primaryBright },
  summaryMax: { fontSize: 14, color: colors.textFaint, fontWeight: '700' },
  summaryLabel: { fontSize: 12, color: colors.textDim, marginTop: 2, lineHeight: 17 },

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardEmojiBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 18 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  cardKind: { fontSize: 11, color: colors.textFaint, marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  cardPercent: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryBright,
    fontVariant: ['tabular-nums'],
  },
  cardWords: { fontSize: 10, color: colors.textFaint, marginTop: 2 },

  meter: { flexDirection: 'row', gap: 2, marginTop: spacing.md },
  meterCell: {
    flex: 1,
    height: 5,
    borderRadius: 2,
    backgroundColor: colors.bgElevated,
    minWidth: 2,
  },

  readerStat: { marginBottom: spacing.md },
  readerStatRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  readerStatValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  readerStatMax: { fontSize: 15, color: colors.textFaint, fontWeight: '700' },
  readerStatLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  readerStatHint: { fontSize: 11, color: colors.textDim, marginTop: 2 },

  legend: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendLabel: { fontSize: 10, color: colors.textFaint, fontWeight: '600' },

  line: { marginBottom: spacing.lg },
  lineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  lineWords: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  token: { fontSize: 19, lineHeight: 29, fontWeight: '600' },
  tokenPlain: { fontSize: 19, lineHeight: 29, color: colors.textFaint },
  tokenNew: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: colors.borderBright,
  },
  tokenActive: { color: colors.primaryBright },
  translateToggle: {
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  translateToggleOpen: { borderColor: 'transparent', paddingHorizontal: 0, paddingVertical: 0 },
  translateToggleText: { fontSize: 11, color: colors.textFaint, fontWeight: '600' },
  translateToggleTextOpen: { fontSize: 13, color: colors.textDim, lineHeight: 19 },

  wordCard: {
    backgroundColor: colors.primaryDim,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  wordCardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  wordCardWord: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.primaryBright },
  statePill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statePillText: { fontSize: 9, fontWeight: '800', color: colors.textDim, letterSpacing: 0.4 },
  wordCardGloss: { fontSize: 14, color: colors.text, marginTop: 6, lineHeight: 20 },
  tapHint: { fontSize: 11, color: colors.textFaint, marginTop: spacing.sm },

  newBlock: { marginTop: spacing.xxl },
  newTitle: { fontSize: 13, fontWeight: '800', color: colors.text },
  newHint: { fontSize: 11, color: colors.textFaint, marginTop: 3, lineHeight: 16 },
  newList: { gap: spacing.xs, marginTop: spacing.md },
  newChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  newChipWord: { fontSize: 13, fontWeight: '700', color: colors.text },
  newChipGloss: { fontSize: 11, color: colors.textDim, marginTop: 2 },

  doneBlock: {
    marginTop: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: colors.successDim,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  doneText: { fontSize: 13, color: colors.text, lineHeight: 19 },
});
