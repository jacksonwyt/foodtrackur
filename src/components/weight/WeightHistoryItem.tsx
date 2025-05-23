import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type { WeightLogRow } from '../../types/weightLog';

interface Props {
  entry: WeightLogRow;
}

export const WeightHistoryItem: React.FC<Props> = ({entry}) => {
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

const styles = StyleSheet.create({
  historyItem: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weightValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  weightDate: {
    fontSize: 14,
    color: '#666',
  },
  weightNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
