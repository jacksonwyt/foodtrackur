import { useState, useCallback } from 'react';

export interface OnboardingDetailsFormData {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: 'male' | 'female' | 'other' | null;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra' | null;
}

export const ACTIVITY_LEVELS = [
  {
    id: 'sedentary' as const,
    title: 'Sedentary',
    description: 'Little or no exercise',
  },
  {
    id: 'light' as const,
    title: 'Lightly Active',
    description: '1-3 days/week',
  },
  {
    id: 'moderate' as const,
    title: 'Moderately Active',
    description: '3-5 days/week',
  },
  {
    id: 'very' as const,
    title: 'Very Active',
    description: '6-7 days/week',
  },
  {
    id: 'extra' as const,
    title: 'Extra Active',
    description: 'Very intense daily exercise',
  },
];

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]['id'];

export const useOnboardingDetailsForm = () => {
  const [formData, setFormData] = useState<OnboardingDetailsFormData>({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: null,
    activityLevel: null,
  });

  const handleInputChange = useCallback(
    (field: keyof OnboardingDetailsFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleGenderSelect = useCallback(
    (gender: OnboardingDetailsFormData['gender']) => {
      setFormData((prev) => ({ ...prev, gender }));
    },
    []
  );

  const handleActivitySelect = useCallback(
    (level: ActivityLevel) => {
      setFormData((prev) => ({ ...prev, activityLevel: level }));
    },
    []
  );

  const isFormValid = useCallback(() => {
    // Basic validation: check if all fields are non-empty/null
    // More complex validation (e.g., numeric checks, ranges) could be added here.
    return (
      formData.name.trim() !== '' &&
      formData.age.trim() !== '' &&
      formData.height.trim() !== '' &&
      formData.weight.trim() !== '' &&
      formData.gender !== null &&
      formData.activityLevel !== null
    );
  }, [formData]);

  return {
    formData,
    handleInputChange,
    handleGenderSelect,
    handleActivitySelect,
    isFormValid,
    activityLevels: ACTIVITY_LEVELS, // Expose the data
  };
}; 