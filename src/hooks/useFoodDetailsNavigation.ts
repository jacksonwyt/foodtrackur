import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { RootStackParamList } from '../types/navigation'; // Import RootStackParamList

interface UseFoodDetailsNavigationResult {
  handleGoBack: () => void;
  handleNavigateToEdit: (foodId: string) => void;
}

export const useFoodDetailsNavigation = (): UseFoodDetailsNavigationResult => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Use useNavigation

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack(); // Use navigation.goBack()
    } else {
      // Optional: Define fallback behavior if needed (e.g., navigate to home)
      // navigation.navigate('MainTabs', { screen: 'Home' });
      console.warn('Cannot go back from FoodDetails');
    }
  }, [navigation]); // Use navigation as dependency

  const handleNavigateToEdit = useCallback((foodId: string) => {
    // Navigate to the AddMeal screen for editing, passing the itemId
    navigation.navigate('AddMeal', { itemId: foodId });
    console.log(`Navigating to AddMeal screen for food ID: ${foodId}`);
  }, [navigation]); // Use navigation as dependency

  return {
    handleGoBack,
    handleNavigateToEdit,
  };
}; 