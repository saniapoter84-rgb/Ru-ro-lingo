import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export type TabKey = 'home' | 'grammar' | 'stats';

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'home', label: 'Учёба', emoji: '🏠' },
  { key: 'grammar', label: 'Грамматика', emoji: '📖' },
  { key: 'stats', label: 'Профиль', emoji: '📊' },
];

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function TabBar({ active, onChange }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onChange(tab.key)}>
            <Text style={[styles.emoji, isActive && styles.emojiActive]}>{tab.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  emoji: { fontSize: 20, opacity: 0.5 },
  emojiActive: { opacity: 1 },
  label: { fontSize: 11, color: colors.textLight, fontWeight: '600' },
  labelActive: { color: colors.primary },
});
