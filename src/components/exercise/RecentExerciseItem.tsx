import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  timestamp: Date;
}

interface Props {
  exercise: Exercise;
}

export const RecentExerciseItem: React.FC<Props> = ({ exercise }) => {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseDetails}>
          {exercise.duration} mins • {exercise.calories} cal
        </Text>
      </View>
      <Text style={styles.exerciseDate}>
        {new Date(exercise.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  exerciseInfo: {
    gap: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
  exerciseDate: {
    fontSize: 14,
    color: '#666',
  },
}); 