import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface WeightEntry {
  id: string;
  weight: number;
  timestamp: Date;
  note?: string;
}

interface Props {
  entry: WeightEntry;
}

export const WeightHistoryItem: React.FC<Props> = ({ entry }) => {
  return (
    <View style={styles.historyItem}>
      <View style={styles.infoContainer}>
        <Text style={styles.weightValue}>{entry.weight.toFixed(1)} kg</Text>
        <Text style={styles.weightDate}>
          {entry.timestamp.toLocaleDateString()}
        </Text>
      </View>
      {entry.note && (
        <Text style={styles.weightNote}>{entry.note}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  historyItem: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 8,
  },
  infoContainer: {
      // If note is present, align date below weight
      // If no note, keep them inline (or decide on a consistent layout)
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
    marginTop: 4, // Add space if note is present
  },
}); 