import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type { WeightLogRow } from '../../types/weightLog';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';

interface Props {
  entry: WeightLogRow;
}

export const WeightHistoryItem: React.FC<Props> = ({entry}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const logDate = new Date(entry.log_date);

  return (
    <View style={styles.historyItem}>
      <View style={styles.infoContainer}>
        <Text style={styles.weightValue}>{entry.weight.toFixed(1)} {entry.unit || 'kg'}</Text>
        <Text style={styles.weightDate}>
          {logDate.toLocaleDateString()}
        </Text>
      </View>
      {entry.notes && <Text style={styles.weightNote}>{entry.notes}</Text>}
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  historyItem: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  weightValue: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  weightDate: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
  weightNote: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
});
