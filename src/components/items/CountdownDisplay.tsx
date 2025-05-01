import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownDisplayProps {
  timeLeft: TimeLeft;
}

// Helper function to format numbers with leading zero
const formatNumber = (num: number): string => num.toString().padStart(2, '0');

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ timeLeft }) => {
  return (
    <View style={styles.timerContainer}>
      <View style={styles.timeBlock}>
        <Text style={styles.timeNumber}>{formatNumber(timeLeft.hours)}</Text>
        <Text style={styles.timeLabel}>hours</Text>
      </View>
      <Text style={styles.timeSeparator}>:</Text>
      <View style={styles.timeBlock}>
        <Text style={styles.timeNumber}>{formatNumber(timeLeft.minutes)}</Text>
        <Text style={styles.timeLabel}>mins</Text>
      </View>
      <Text style={styles.timeSeparator}>:</Text>
      <View style={styles.timeBlock}>
        <Text style={styles.timeNumber}>{formatNumber(timeLeft.seconds)}</Text>
        <Text style={styles.timeLabel}>secs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBlock: {
    alignItems: 'center',
    minWidth: 50, // Maintain consistent width
  },
  timeNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginHorizontal: 8,
  },
}); 