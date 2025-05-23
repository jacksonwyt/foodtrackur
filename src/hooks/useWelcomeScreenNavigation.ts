import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack'; // Import the navigation prop type
import type {OnboardingStackParamList} from '@/src/types/navigation'; // Import the param list

// Define the specific navigation prop type for the Onboarding stack
type OnboardingNavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'Welcome'
>;

export const useWelcomeScreenNavigation = () => {
  const navigation = useNavigation<OnboardingNavigationProp>(); // Use the typed navigation hook

  const goToGoals = useCallback(() => {
    // Use navigate from @react-navigation/native
    navigation.navigate('Goals');
  }, [navigation]);

  return {
    goToGoals,
  };
};
