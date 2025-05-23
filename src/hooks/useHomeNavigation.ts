import {useNavigation, ParamListBase} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../types/navigation';

// Import shared types
import {AppStackParamList} from '../types/navigation';

export const useHomeNavigation = () => {
  // Strongly type the navigation prop using the defined ParamList
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // Navigation functions using React Navigation
  const navigateToExercise = () =>
    navigation.navigate('Main', {screen: 'ExerciseTab'});
  const navigateToSubscription = () => navigation.navigate('SubscriptionNav');
  const navigateToAddMeal = () => navigation.navigate('AddFood');
  const navigateToSettings = () => navigation.navigate('SettingsNav');

  // Return actions and individual navigation functions
  return {
    navigateToExercise,
    navigateToSubscription,
    navigateToAddMeal,
    navigateToSettings,
  };
};
