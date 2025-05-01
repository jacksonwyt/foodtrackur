import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseFormData } from '../../hooks/useExerciseFormData';
import { useExerciseData } from '../../hooks/useExerciseData';
import { useExerciseCalculations } from '../../hooks/useExerciseCalculations';
import { ExerciseSuggestionButton } from '../../components/exercise/ExerciseSuggestionButton';
import { RecentExerciseItem } from '../../components/exercise/RecentExerciseItem';

const ExerciseScreen: React.FC = () => {
  const {
    exerciseName,
    setExerciseName,
    duration,
    setDuration,
    selectedExercise,
    handleExerciseSelect,
    isFormValid,
    resetForm,
  } = useExerciseFormData();

  const {
    exerciseSuggestions,
    recentExercises,
    addExerciseEntry,
  } = useExerciseData();

  const {
    estimatedCalories,
  } = useExerciseCalculations(selectedExercise, duration);

  const validForm = isFormValid();

  const handleLogExercise = () => {
    if (validForm && estimatedCalories !== null) {
      const minutes = parseInt(duration, 10);
      if (!isNaN(minutes)) {
        addExerciseEntry(exerciseName, minutes, estimatedCalories);
        resetForm();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Log Exercise</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exercise Type</Text>
            <TextInput
              style={styles.input}
              value={exerciseName}
              onChangeText={setExerciseName}
              placeholder="Enter exercise name or quick select"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.sectionTitle}>Quick Select</Text>
          <View style={styles.suggestions}>
            {exerciseSuggestions.map((exercise) => (
              <ExerciseSuggestionButton
                key={exercise.name}
                exercise={exercise}
                isSelected={selectedExercise?.name === exercise.name}
                onPress={handleExerciseSelect}
              />
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="Enter duration"
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />
          </View>

          {estimatedCalories !== null && (
            <View style={styles.calorieEstimate}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
              <Text style={styles.calorieText}>
                Estimated calories: {estimatedCalories}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Recent Exercises</Text>
        <View style={styles.recentExercises}>
          {recentExercises.map((exercise) => (
            <RecentExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !validForm && styles.buttonDisabled]}
          onPress={handleLogExercise}
          disabled={!validForm}
        >
          <Text style={styles.buttonText}>Log Exercise</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  calorieEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
  },
  calorieText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  recentExercises: {
    gap: 12,
    marginBottom: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ExerciseScreen; 