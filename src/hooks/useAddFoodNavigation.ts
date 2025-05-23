import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback} from 'react';
import {RootStackParamList} from '../types/navigation';

interface UseAddFoodNavigationResult {
  handleGoBack: () => void;
}

export const useAddFoodNavigation = (): UseAddFoodNavigationResult => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Define fallback behavior if needed (e.g., navigate to home)
      // navigation.navigate('MainTabs', { screen: 'Home' });
      console.warn('Cannot go back from AddFoodScreen');
    }
  }, [navigation]);

  return {
    handleGoBack,
  };
};
