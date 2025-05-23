import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text as RNText,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getProfile,
  updateProfile,
  Profile,
  UpdateProfileData,
} from '../../services/profileService';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../../store/slices/authSlice';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SettingsStackParamList} from '../../types/navigation';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';
import {AppText} from '../../components/common/AppText';
import {AppTextInput} from '../../components/common/AppTextInput';
import {AppButton} from '../../components/common/AppButton';

type GoalWeightUnit = 'kg' | 'lbs';

type AdjustGoalsScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'AdjustGoals'
>;

const AdjustGoalsScreen: React.FC<AdjustGoalsScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useSelector(selectCurrentUser);

  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [goalWeightUnit, setGoalWeightUnit] = useState<GoalWeightUnit>('kg');
  const [goalPace, setGoalPace] = useState('');

  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);

  const toggleGoalWeightUnit = () => {
    setGoalWeightUnit(prev => (prev === 'kg' ? 'lbs' : 'kg'));
  };

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error('User not authenticated.');
      }

      const profileData = await getProfile();
      if (profileData) {
        setOriginalProfile(profileData);
        setCalories(profileData.target_calories?.toString() || '');
        setProtein(profileData.target_protein_g?.toString() || '');
        setCarbs(profileData.target_carbs_g?.toString() || '');
        setFat(profileData.target_fat_g?.toString() || '');

        if (profileData.goal_weight) {
          if (goalWeightUnit === 'kg') {
            setGoalWeight(profileData.goal_weight.toString());
          } else {
            setGoalWeight((profileData.goal_weight * 2.20462).toFixed(1));
          }
        } else {
          setGoalWeight('');
        }
        setGoalPace(profileData.goal_pace?.toString() || '');
      } else {
        setError('Could not load profile data for goals.');
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Failed to fetch profile goals.');
      }
      console.error(
        'Fetch profile goals error:',
        e instanceof Error ? e.stack || e.message : String(e),
      );
    } finally {
      setIsLoading(false);
    }
  }, [goalWeightUnit, currentUser]);

  useEffect(() => {
    void fetchProfileData();
  }, [fetchProfileData]);

  const handleSave = async () => {
    if (!currentUser || !currentUser.id) {
      Alert.alert('Error', 'User ID not found. Cannot save goals.');
      return;
    }

    const numCalories = parseFloat(calories);
    const numProtein = parseFloat(protein);
    const numCarbs = parseFloat(carbs);
    const numFat = parseFloat(fat);
    const numGoalWeight =
      goalWeight.trim() !== '' ? parseFloat(goalWeight) : null;
    const numGoalPace = goalPace.trim() !== '' ? parseFloat(goalPace) : null;

    if (
      isNaN(numCalories) ||
      numCalories < 0 ||
      isNaN(numProtein) ||
      numProtein < 0 ||
      isNaN(numCarbs) ||
      numCarbs < 0 ||
      isNaN(numFat) ||
      numFat < 0
    ) {
      Alert.alert(
        'Validation Error',
        'Macronutrient and calorie goals must be positive numbers.',
      );
      return;
    }
    if (
      numGoalWeight !== null &&
      (isNaN(numGoalWeight) || numGoalWeight <= 0)
    ) {
      Alert.alert(
        'Validation Error',
        'If provided, Goal Weight must be a positive number.',
      );
      return;
    }
    if (numGoalPace !== null && (isNaN(numGoalPace) || numGoalPace <= 0)) {
      Alert.alert(
        'Validation Error',
        'If provided, Goal Pace must be a positive number.',
      );
      return;
    }

    let goalWeightInKg: number | null | undefined = undefined;
    if (goalWeight.trim() === '') {
      goalWeightInKg = null;
    } else if (numGoalWeight !== null) {
      goalWeightInKg =
        goalWeightUnit === 'kg' ? numGoalWeight : numGoalWeight / 2.20462;
    }

    let parsedGoalPace: number | null | undefined = undefined;
    if (goalPace.trim() === '') {
      parsedGoalPace = null;
    } else if (numGoalPace !== null) {
      parsedGoalPace = numGoalPace;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updates: UpdateProfileData = {
        target_calories: numCalories,
        target_protein_g: numProtein,
        target_carbs_g: numCarbs,
        target_fat_g: numFat,
        goal_weight:
          goalWeightInKg === undefined
            ? originalProfile?.goal_weight
            : goalWeightInKg,
        goal_pace:
          parsedGoalPace === undefined
            ? originalProfile?.goal_pace
            : parsedGoalPace,
      };

      await updateProfile(currentUser.id, updates);
      Alert.alert('Success', 'Goals updated successfully!');
      navigation.goBack();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save goals.';
      setError(message);
      Alert.alert('Error', message);
      console.error(
        'Save goals error:',
        e instanceof Error ? e.stack || e.message : String(e),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText style={styles.loadingText}>Loading goals...</AppText>
      </SafeAreaView>
    );
  }

  if (error && !originalProfile) {
    return (
      <SafeAreaView style={styles.centered}>
        <AppText style={styles.errorText}>Error: {error}</AppText>
        <AppButton
          title="Retry"
          onPress={() => {
            void fetchProfileData();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <AppText style={styles.title}>Adjust Nutritional Goals</AppText>

          {error && <AppText style={styles.errorText}>Error: {error}</AppText>}

          <AppTextInput
            label="Daily Calories (kcal)"
            value={calories}
            onChangeText={setCalories}
            placeholder="e.g., 2000"
            keyboardType="number-pad"
            returnKeyType="done"
            containerStyle={styles.inputGroup}
          />

          <View style={styles.inputGrid}>
            <AppTextInput
              label="Protein (g)"
              value={protein}
              onChangeText={setProtein}
              placeholder="g"
              keyboardType="number-pad"
              returnKeyType="done"
              containerStyle={styles.inputGridItem}
            />
            <AppTextInput
              label="Carbs (g)"
              value={carbs}
              onChangeText={setCarbs}
              placeholder="g"
              keyboardType="number-pad"
              returnKeyType="done"
              containerStyle={styles.inputGridItem}
            />
            <AppTextInput
              label="Fat (g)"
              value={fat}
              onChangeText={setFat}
              placeholder="g"
              keyboardType="number-pad"
              returnKeyType="done"
              containerStyle={styles.inputGridItem}
            />
          </View>

          <View style={styles.inputGroupWithToggle}>
            <AppTextInput
              label={`Goal Weight (${goalWeightUnit})`}
              value={goalWeight}
              onChangeText={setGoalWeight}
              placeholder={`Enter target weight in ${goalWeightUnit}`}
              keyboardType="numeric"
              returnKeyType="done"
              containerStyle={{flex: 1}}
            />
            <TouchableOpacity
              onPress={toggleGoalWeightUnit}
              style={styles.unitToggleButton}>
              <RNText style={styles.unitToggleText}>
                {goalWeightUnit === 'kg' ? 'lbs' : 'kg'}
              </RNText>
            </TouchableOpacity>
          </View>

          <AppTextInput
            label="Weekly Goal Pace (optional)"
            value={goalPace}
            onChangeText={setGoalPace}
            placeholder={`e.g., 0.5 ${goalWeightUnit}/week`}
            keyboardType="numeric"
            returnKeyType="done"
            containerStyle={styles.inputGroup}
          />

          <AppButton
            title={isSaving ? 'Saving...' : 'Save Goals'}
            onPress={() => {
              void handleSave();
            }}
            disabled={isSaving || isLoading}
            isLoading={isSaving}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdjustGoalsScreen;

interface AdjustGoalsStyles {
  screen: ViewStyle;
  container: ViewStyle;
  centered: ViewStyle;
  title: TextStyle;
  inputGroup: ViewStyle;
  inputGroupWithToggle: ViewStyle;
  unitToggleButton: ViewStyle;
  unitToggleText: TextStyle;
  inputGrid: ViewStyle;
  inputGridItem: ViewStyle;
  label: TextStyle;
  button: ViewStyle; // For AppButton, assuming it takes ViewStyle for its main style
  loadingText: TextStyle;
  errorText: TextStyle;
  goalPaceInfo: TextStyle;
}

const getStyles = (theme: Theme): AdjustGoalsStyles =>
  StyleSheet.create<AdjustGoalsStyles>({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      padding: theme.spacing.lg,
      flexGrow: 1,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
    },
    inputGroupWithToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    unitToggleButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      height: 48,
    },
    unitToggleText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.medium,
    },
    inputGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    inputGridItem: {
      flex: 1,
    },
    label: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    button: {
      marginTop: theme.spacing.lg,
    },
    loadingText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.textPlaceholder,
      marginTop: theme.spacing.md,
    },
    errorText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    goalPaceInfo: {
      fontSize: theme.typography.sizes.caption,
      color: theme.colors.textPlaceholder,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
  });
