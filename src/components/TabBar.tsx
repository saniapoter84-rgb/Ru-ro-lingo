import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Press } from './Press';
import { colors, radius, spacing } from '../theme/colors';
import { Lang, StringKey, t } from '../i18n/strings';

export type TabKey = 'course' | 'words' | 'reading' | 'immersion' | 'profile';

const TABS: { key: TabKey; labelKey: StringKey; icon: string }[] = [
  { key: 'course', labelKey: 'tab.course', icon: '◆' },
  { key: 'words', labelKey: 'tab.learn', icon: '▣' },
  { key: 'reading', labelKey: 'tab.reading', icon: '▤' },
  { key: 'immersion', labelKey: 'tab.immersion', icon: '◉' },
  { key: 'profile', labelKey: 'tab.profile', icon: '◈' },
];

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  lang: Lang;
  /** В полноэкранном режиме под панелью нет системной навигации. */
  fullscreen?: boolean;
}

export function TabBar({ active, onChange, lang, fullscreen }: Props) {
  return (
    <View style={[styles.container, fullscreen && styles.containerFullscreen]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Press
            key={tab.key}
            outerStyle={styles.tabOuter}
            style={styles.tab}
            scaleTo={0.9}
            feedback="select"
            onPress={() => onChange(tab.key)}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {t(tab.labelKey, lang)}
            </Text>
          </Press>
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
  // Без системной панели снизу вкладки упирались бы в самый край экрана.
  containerFullscreen: { paddingBottom: spacing.xl },
  tabOuter: { flex: 1 },
  tab: { alignItems: 'center', gap: 4 },
  iconWrap: {
    width: 38,
    height: 26,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primaryDim },
  icon: { fontSize: 15, color: colors.textFaint },
  iconActive: { color: colors.primaryBright },
  label: { fontSize: 9, color: colors.textFaint, fontWeight: '600', letterSpacing: 0.1 },
  labelActive: { color: colors.text },
});
