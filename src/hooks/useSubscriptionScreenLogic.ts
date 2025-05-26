import {useState, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../types/navigation';

const FEATURES = [
  {
    icon: 'camera',
    title: 'AI Food Recognition',
    description: 'Scan food to get instant nutrition info',
  },
  {
    icon: 'mic',
    title: 'Voice Logging',
    description: 'Log meals by speaking naturally',
  },
  {
    icon: 'trending-up',
    title: 'Advanced Analytics',
    description: 'Get detailed insights about your nutrition',
  },
  {
    icon: 'bulb',
    title: 'Smart Recommendations',
    description: 'Personalized nutrition advice from AI',
  },
];

const PLANS = [
  {
    id: 'trial',
    title: '7-Day Free Trial',
    price: 0,
    description: 'Try all Pro features for 7 days',
    isPopular: false,
  },
  {
    id: 'monthly',
    title: 'Monthly',
    price: 9.99,
    description: 'Billed monthly',
    isPopular: false,
  },
  {
    id: 'annual',
    title: 'Annual',
    price: 59.99,
    description: 'Billed annually • Save 50%',
    isPopular: true,
  },
];

export const useSubscriptionScreenLogic = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [selectedPlanId, setSelectedPlanId] = useState(PLANS[2].id);

  const handleSubscribe = useCallback(() => {
    // TODO: Implement actual subscription logic (e.g., API call, purchase flow)
    console.log(`Subscribing to plan: ${selectedPlanId}`);
    // Navigate home after successful subscription
    navigation.navigate('Main', { screen: 'HomeTab', params: { screen: 'Home' } });
  }, [selectedPlanId, navigation]);

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback if cannot go back (e.g., navigate home)
      navigation.navigate('Main', { screen: 'HomeTab', params: { screen: 'Home' } });
      console.warn('Cannot go back from SubscriptionScreen, navigating home.');
    }
  }, [navigation]);

  return {
    features: FEATURES,
    plans: PLANS,
    selectedPlanId,
    setSelectedPlanId,
    handleSubscribe,
    handleClose,
  };
};
