import { useRouter, Href } from 'expo-router';
import { useCallback } from 'react';

export const useOnboardingDetailsNavigation = () => {
  const router = useRouter();

  const goToNext = useCallback(() => {
    // In a real app, you might pass data or perform other actions here
    router.push('/onboarding/complete' as Href);
  }, [router]);

  // Add goBack or other navigation functions if needed

  return {
    goToNext,
  };
}; 