import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useGoalsScreenNavigation = () => {
  const router = useRouter();

  const goToDetails = useCallback(() => {
    // Optionally pass selected goal ID if needed by the next screen
    router.push('/onboarding/details');
  }, [router]);

  // Add goBack if needed later
  // const goBack = useCallback(() => router.back(), [router]);

  return {
    goToDetails,
    // goBack,
  };
}; 