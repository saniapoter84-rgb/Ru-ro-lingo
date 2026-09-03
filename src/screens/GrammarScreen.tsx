import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import {
  GRAMMAR_CATEGORIES,
  GRAMMAR_TOPICS,
  GrammarTopic,
  getTopicsByCategory,
} from '../data/grammar';
import { SpeakerButton } from '../components/SpeakerButton';

interface Props {
  onBack: () => void;
}

/**
 * Справочник: та же грамматика, что в курсе, плюс то, что в задания не
 * укладывается — чтение, ударение, ложные друзья. Сгруппировано по
 * разделам, чтобы список из четырёх десятков тем не выглядел свалкой.
 */
export function GrammarScreen({ onBack }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const topic = GRAMMAR_TOPICS.find((t) => t.id === openId) ?? null;

  if (topic) {
    return <GrammarTopicDetail topic={topic} onBack={() => setOpenId(null)} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Справочник</Text>
        <Text style={styles.subtitle}>
          {GRAMMAR_TOPICS.length} тем — от чтения букв до типичных ошибок
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {GRAMMAR_CATEGORIES.map((category) => {
          const topics = getTopicsByCategory(category.id);
          if (topics.length === 0) return null;
          return (
            <View key={category.id} style={styles.categoryBlock}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{topics.length}</Text>
              </View>
              <Text style={styles.categoryHint}>{category.hint}</Text>

              {topics.map((t) => (
                <Pressable
                  key={t.id}
                  style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                  onPress={() => setOpenId(t.id)}
                >
                  <Text style={styles.cardEmoji}>{t.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{t.title}</Text>
                    <Text style={styles.cardSummary}>{t.summary}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ))}
            </View>
          );
        })}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

function GrammarTopicDetail({ topic, onBack }: { topic: GrammarTopic; onBack: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.detailTopBar}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.detailTitle} numberOfLines={2}>
          {topic.emoji} {topic.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {topic.sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>

            {section.examples ? (
              <View style={styles.examples}>
                {section.examples.map((ex, j) => (
                  <View key={j} style={styles.exampleRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exampleRo}>{ex.ro}</Text>
                      <Text style={styles.exampleRu}>{ex.ru}</Text>
                      {ex.note ? <Text style={styles.exampleNote}>{ex.note}</Text> : null}
                    </View>
                    <SpeakerButton text={ex.ro} size={30} />
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  back: { fontSize: 20, color: colors.textDim, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12, color: colors.textDim, marginTop: 3 },
  scrollContent: { paddingHorizontal: spacing.lg },

  categoryBlock: { marginBottom: spacing.xl },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.primaryBright,
  },
  categoryCount: { fontSize: 11, color: colors.textFaint, fontWeight: '700' },
  categoryHint: { fontSize: 11, color: colors.textFaint, marginTop: 2, marginBottom: spacing.md },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: { backgroundColor: colors.cardHover },
  cardEmoji: { fontSize: 20 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  cardSummary: { fontSize: 11, color: colors.textDim, marginTop: 2, lineHeight: 15 },
  chevron: { fontSize: 20, color: colors.textFaint },

  detailTopBar: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  detailTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 4 },

  section: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  sectionBody: { fontSize: 14, color: colors.textDim, lineHeight: 21 },
  examples: { marginTop: spacing.md, gap: spacing.sm },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  exampleRo: { fontSize: 15, fontWeight: '700', color: colors.text },
  exampleRu: { fontSize: 13, color: colors.textDim, marginTop: 2 },
  exampleNote: { fontSize: 11, color: colors.textFaint, marginTop: 3, fontStyle: 'italic' },
});
