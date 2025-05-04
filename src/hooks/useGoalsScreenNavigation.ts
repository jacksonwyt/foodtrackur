import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList, GoalType } from '@/src/types/navigation'; // Import GoalType

// Define the specific navigation prop type for the Onboarding stack
type OnboardingNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Goals'>;

export const useGoalsScreenNavigation = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();

  const goToDetails = useCallback((goal: GoalType | undefined) => {
    if (!goal) {
      console.warn('Goal must be selected before proceeding.');
      return; // Don't navigate if no goal is selected
    }
    navigation.navigate('Details', { goal: goal });
  }, [navigation]);

  // Optional: Add goBack if needed
  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return {
    goToDetails,
    goBack,
  };
}; 