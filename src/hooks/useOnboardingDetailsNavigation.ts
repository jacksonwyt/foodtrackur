import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback} from 'react';
import type {OnboardingStackParamList} from '@/types/navigation';

export const useOnboardingDetailsNavigation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const goToNext = useCallback(() => {
    // In a real app, you might pass data or perform other actions here
    navigation.navigate('NutritionGoals');
  }, [navigation]);

  // Add goBack or other navigation functions if needed

  return {
    goToNext,
  };
};
