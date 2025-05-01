import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { RootStackParamList } from '@/src/types/navigation';

export const useFoodScreenNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList & ParamListBase>>();

  const navigateToAddFood = useCallback((category: RootStackParamList['AddMeal']['mealCategory']) => {
    navigation.navigate('AddMeal', { mealCategory: category });
  }, [navigation]);

  const navigateToFoodDetails = useCallback((id: string) => {
    navigation.navigate('FoodDetails', { foodId: id });
  }, [navigation]);

  const navigateToFoodDBItem = useCallback((id: string) => {
    navigation.navigate('FoodDB', { itemId: id });
  }, [navigation]);

  return {
    navigateToAddFood,
    navigateToFoodDetails,
    navigateToFoodDBItem,
  };
}; 