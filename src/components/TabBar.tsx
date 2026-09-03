import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Lang, StringKey, t } from '../i18n/strings';

export type TabKey = 'course' | 'words' | 'immersion' | 'profile';

const TABS: { key: TabKey; labelKey: StringKey; icon: string }[] = [
  { key: 'course', labelKey: 'tab.course', icon: '◆' },
  { key: 'words', labelKey: 'tab.learn', icon: '▣' },
  { key: 'immersion', labelKey: 'tab.immersion', icon: '◉' },
  { key: 'profile', labelKey: 'tab.profile', icon: '◈' },
];

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  lang: Lang;
}

export function TabBar({ active, onChange, lang }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}
            onPress={() => onChange(tab.key)}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(tab.labelKey, lang)}
            </Text>
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
    backgroundColor: colors.bgElevated,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  iconWrap: {
    width: 42,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primaryDim },
  icon: { fontSize: 15, color: colors.textFaint },
  iconActive: { color: colors.primaryBright },
  label: { fontSize: 10, color: colors.textFaint, fontWeight: '600', letterSpacing: 0.2 },
  labelActive: { color: colors.text },
});
