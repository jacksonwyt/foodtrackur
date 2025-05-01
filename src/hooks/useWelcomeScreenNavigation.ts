import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useWelcomeScreenNavigation = () => {
  const router = useRouter();

  const goToGoals = useCallback(() => {
    router.push('/onboarding/goals');
  }, [router]);

  return {
    goToGoals,
  };
}; 