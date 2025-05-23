import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ExerciseStackParamList} from '../../types/navigation';
import {useExerciseFormData} from '../../hooks/useExerciseFormData';
import {useExerciseData} from '../../hooks/useExerciseData';
import {useExerciseCalculations} from '../../hooks/useExerciseCalculations';
import {ExerciseSuggestionButton} from '../../components/exercise/ExerciseSuggestionButton';
import {RecentExerciseItem} from '../../components/exercise/RecentExerciseItem';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import {AppTextInput} from '../../components/common/AppTextInput';
import {Theme} from '../../constants/theme';

// Define prop types for the screen
type ExerciseScreenProps = NativeStackScreenProps<
  ExerciseStackParamList,
  'Exercise'
>;

const ExerciseScreen: React.FC<ExerciseScreenProps> = ({navigation, route}) => {
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

  const {exerciseSuggestions, recentExercises, addExerciseEntry} =
    useExerciseData();

  const {estimatedCalories} = useExerciseCalculations(
    selectedExercise,
    duration,
  );

  const theme = useTheme();
  const styles = makeStyles(theme);

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AppText style={styles.title}>Log Exercise</AppText>

        <View style={styles.form}>
          <AppTextInput
            label="Exercise Type"
            containerStyle={styles.inputGroup}
            value={exerciseName}
            onChangeText={setExerciseName}
            placeholder="Enter exercise name or quick select"
          />

          <AppText style={styles.sectionTitle}>Quick Select</AppText>
          <View style={styles.suggestions}>
            {exerciseSuggestions.map(exercise => (
              <ExerciseSuggestionButton
                key={exercise.name}
                exercise={exercise}
                isSelected={selectedExercise?.name === exercise.name}
                onPress={handleExerciseSelect}
              />
            ))}
          </View>

          <AppTextInput
            label="Duration (minutes)"
            containerStyle={styles.inputGroup}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration"
            keyboardType="number-pad"
          />

          {estimatedCalories !== null && (
            <View style={styles.calorieEstimate}>
              <Ionicons name="flame" size={24} color={theme.colors.warning} />
              <AppText style={styles.calorieText}>
                Estimated calories: {estimatedCalories}
              </AppText>
            </View>
          )}
        </View>

        <AppText style={styles.sectionTitle}>Recent Exercises</AppText>
        <View style={styles.recentExercises}>
          {recentExercises.map(exercise => (
            <RecentExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !validForm && styles.buttonDisabled]}
          onPress={handleLogExercise}
          disabled={!validForm}>
          <AppText style={styles.buttonText}>Log Exercise</AppText>
          <Ionicons name="checkmark" size={20} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.sizes.h1,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.onBackground,
      marginBottom: theme.spacing.xl,
    },
    form: {
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    inputGroup: {
      // AppTextInput handles its own label and input styling, and marginBottom
      // So, this might only be needed if there are multiple items in an inputGroup
      // For now, AppTextInput will provide its own bottom margin.
      // If specific grouping margin is needed, add it here.
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.onBackground,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    suggestions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    calorieEstimate: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.sm,
    },
    calorieText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.warning,
      fontWeight: theme.typography.weights.medium,
    },
    recentExercises: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    footer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.md,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.surfaceDisabled,
      opacity: 0.7,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
  });

export default ExerciseScreen;
