import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { GRAMMAR_TOPICS, GrammarTopic } from '../data/grammar';
import { SpeakerButton } from '../components/SpeakerButton';

interface Props {
  onBack: () => void;
}

/** Справочник: та же грамматика, что в курсе, но списком и без заданий —
 * чтобы можно было быстро подсмотреть правило, не проходя урок заново. */
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
        <Text style={styles.subtitle}>Короткие объяснения — почему слова выглядят именно так</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {GRAMMAR_TOPICS.map((t) => (
          <Pressable key={t.id} style={styles.card} onPress={() => setOpenId(t.id)}>
            <Text style={styles.cardEmoji}>{t.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <Text style={styles.cardSummary}>{t.summary}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function GrammarTopicDetail({ topic, onBack }: { topic: GrammarTopic; onBack: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.detailTopBar}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.detailTitle} numberOfLines={2}>
          {topic.emoji} {topic.title}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                    </View>
                    <SpeakerButton text={ex.ro} size={32} />
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textDim, marginTop: 2 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardEmoji: { fontSize: 26 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardSummary: { fontSize: 12, color: colors.textDim, marginTop: 2 },
  chevron: { fontSize: 22, color: colors.textDim },
  detailTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  back: { fontSize: 20, color: colors.textDim, marginBottom: 6 },
  detailTitle: { fontSize: 17, fontWeight: '800', color: colors.text, flex: 1 },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 6 },
  sectionBody: { fontSize: 14, color: colors.text, lineHeight: 20 },
  examples: { marginTop: 12, gap: 10 },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 10,
  },
  exampleRo: { fontSize: 15, fontWeight: '700', color: colors.text },
  exampleRu: { fontSize: 13, color: colors.textDim, marginTop: 2 },
});
