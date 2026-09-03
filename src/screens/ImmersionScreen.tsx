import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { colors, radius, spacing, FLAG_TARGET } from '../theme/colors';
import { DIALOGUES, Dialogue } from '../data/dialogues';
import { ProgressState } from '../logic/progress';
import { Lang, t } from '../i18n/strings';
import { Panel, SectionLabel } from '../components/Panel';

interface Props {
  progress: ProgressState;
  lang: Lang;
  onToggleImmersion: () => void;
  onOpenDialogue: (dialogue: Dialogue) => void;
}

export function ImmersionScreen({ progress, lang, onToggleImmersion, onOpenDialogue }: Props) {
  const done = Object.values(progress.dialogues).filter((d) => d.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('immersion.title', lang)}</Text>
        <Text style={styles.subtitle}>{t('immersion.subtitle', lang)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Panel active={progress.immersion} style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>
                {progress.immersion
                  ? t('immersion.modeOn', lang)
                  : t('immersion.modeOff', lang)}
              </Text>
              <Text style={styles.toggleHint}>{t('immersion.toggleHint', lang)}</Text>
            </View>
            <Switch
              value={progress.immersion}
              onValueChange={onToggleImmersion}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          {progress.immersion ? (
            <View style={styles.flagStrip}>
              <Text style={styles.flagText}>
                {FLAG_TARGET} Numai română · fără traducere automată
              </Text>
            </View>
          ) : null}
        </Panel>

        <View style={styles.counterRow}>
          <SectionLabel>
            {t('immersion.scenes', lang)} · {done}/{DIALOGUES.length}
          </SectionLabel>
        </View>

        {DIALOGUES.map((dialogue) => {
          const entry = progress.dialogues[dialogue.id];
          return (
            <Pressable
              key={dialogue.id}
              onPress={() => onOpenDialogue(dialogue)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.cardEmojiBox}>
                <Text style={styles.cardEmoji}>{dialogue.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{dialogue.title}</Text>
                  <View style={styles.levelPill}>
                    <Text style={styles.levelText}>{dialogue.level}</Text>
                  </View>
                </View>
                <Text style={styles.cardTitleRu}>{dialogue.titleRu}</Text>
                <Text style={styles.cardSetting} numberOfLines={2}>
                  {dialogue.setting}
                </Text>
              </View>
              <View style={styles.cardRight}>
                {entry?.completed ? (
                  <Text style={styles.scoreDone}>
                    {entry.bestScore}/{dialogue.questions.length}
                  </Text>
                ) : (
                  <Text style={styles.chevron}>›</Text>
                )}
              </View>
            </Pressable>
          );
        })}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12, color: colors.textDim, marginTop: 3 },
  scroll: { paddingHorizontal: spacing.lg },

  toggleCard: { marginBottom: spacing.xl },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  toggleHint: { fontSize: 11, color: colors.textDim, marginTop: 4, lineHeight: 16 },
  flagStrip: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  flagText: { fontSize: 11, color: colors.primaryBright, fontWeight: '600' },

  counterRow: { marginBottom: spacing.xs },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardPressed: { backgroundColor: colors.cardHover },
  cardEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 20 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  levelPill: {
    borderWidth: 1,
    borderColor: colors.borderBright,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  levelText: { fontSize: 9, fontWeight: '800', color: colors.textFaint },
  cardTitleRu: { fontSize: 11, color: colors.textFaint, marginTop: 1 },
  cardSetting: { fontSize: 11, color: colors.textDim, marginTop: 4, lineHeight: 15 },
  cardRight: { minWidth: 34, alignItems: 'flex-end' },
  chevron: { fontSize: 20, color: colors.textFaint },
  scoreDone: { fontSize: 12, fontWeight: '800', color: colors.success },
});
