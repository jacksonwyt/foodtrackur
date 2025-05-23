import React from 'react';
import {View, StyleSheet} from 'react-native';
import SettingsListItem, {SettingsItemData} from './SettingsListItem';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../common/AppText';
import type { Theme } from '../../constants/theme';

interface SettingsSectionProps {
  title: string;
  items: SettingsItemData[];
}

const SettingsSection: React.FC<SettingsSectionProps> = ({title, items}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      <View style={styles.sectionItemsContainer}>
        {items.map((item, index) => (
          <SettingsListItem 
            key={index} 
            item={item} 
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.xs,
  },
  sectionItemsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    overflow: 'hidden',
  },
});

export default SettingsSection;
