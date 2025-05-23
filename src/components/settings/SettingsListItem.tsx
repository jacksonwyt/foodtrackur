import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../common/AppText';
import type { Theme } from '../../constants/theme';

export interface SettingsItemData {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
}

interface SettingsListItemProps {
  item: SettingsItemData;
  isLast?: boolean;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({item, isLast}) => {
  const theme = useTheme();
  const styles = makeStyles(theme, isLast);

  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={item.onPress}
      activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <Ionicons name={item.icon} size={24} color={theme.colors.text} />
        <AppText style={styles.settingLabel}>{item.label}</AppText>
      </View>
      <View style={styles.settingRight}>
        {item.value && <AppText style={styles.settingValue}>{item.value}</AppText>}
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textPlaceholder} />
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme, isLast?: boolean) => StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: isLast ? 'transparent' : theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  settingValue: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
});

export default SettingsListItem;
