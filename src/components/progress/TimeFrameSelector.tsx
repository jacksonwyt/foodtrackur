import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeFrame } from '../../hooks/useProgressData'; // Adjust path if necessary

interface TimeFrameSelectorProps {
  currentTimeFrame: TimeFrame;
  onSelectTimeFrame: (timeFrame: TimeFrame) => void;
  timeFrames: TimeFrame[];
}

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({
  currentTimeFrame,
  onSelectTimeFrame,
  timeFrames,
}) => {
  return (
    <View style={styles.timeFrames}>
      {timeFrames.map((tf) => (
        <TouchableOpacity
          key={tf}
          style={[
            styles.timeFrameButton,
            currentTimeFrame === tf && styles.selectedTimeFrame,
          ]}
          onPress={() => onSelectTimeFrame(tf)}
        >
          <Text
            style={[
              styles.timeFrameText,
              currentTimeFrame === tf && styles.selectedTimeFrameText,
            ]}
          >
            {tf}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  timeFrames: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  timeFrameButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedTimeFrame: {
    backgroundColor: '#000',
  },
  timeFrameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedTimeFrameText: {
    color: '#fff',
  },
});

export default TimeFrameSelector; 