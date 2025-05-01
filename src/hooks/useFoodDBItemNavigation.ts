import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useFoodDBItemNavigation = () => {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback if no history (e.g., deep link)
      router.replace('/(tabs)/food'); // Adjust fallback route if needed
    }
  }, [router]);

  const navigateToEdit = useCallback((id: string) => {
    // Assuming an edit screen exists at /fooddb/edit/[id] or similar
    // router.push(`/fooddb/edit/${id}`);
    console.log(`Navigate to edit screen for ID: ${id}`); // Placeholder
  }, [router]);

  return {
    goBack,
    navigateToEdit,
  };
}; 