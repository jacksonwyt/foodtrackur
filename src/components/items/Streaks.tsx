import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../hooks/useTheme';
import {AppText as Text} from '../common/AppText';

interface StreaksProps {
  currentStreak: number;
}

export const Streaks: React.FC<StreaksProps> = ({currentStreak}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={24} color={theme.colors.warning} />
      <Text style={styles.streakText}>{currentStreak}</Text>
      <Text style={styles.daysText}>days</Text>
    </View>
  );
};

const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  streakText: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  daysText: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
  },
});
