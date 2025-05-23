import {useState, useCallback} from 'react';

export interface OnboardingDetailsFormData {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: 'male' | 'female' | 'other' | null;
  activityLevel:
    | 'sedentary'
    | 'light'
    | 'moderate'
    | 'active'
    | 'extra_active'
    | null;
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
    id: 'active' as const,
    title: 'Active',
    description: '6-7 days/week',
  },
  {
    id: 'extra_active' as const,
    title: 'Extra Active',
    description: 'Very intense daily exercise',
  },
];

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]['id'];

export interface OnboardingDetailsFormErrors {
  name?: string;
  age?: string;
  height?: string;
  weight?: string;
  gender?: string;
  activityLevel?: string;
}

export const useOnboardingDetailsForm = () => {
  const [formData, setFormData] = useState<OnboardingDetailsFormData>({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: null,
    activityLevel: null,
  });
  const [errors, setErrors] = useState<OnboardingDetailsFormErrors>({});

  const validateForm = useCallback((): OnboardingDetailsFormErrors => {
    const newErrors: OnboardingDetailsFormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required.';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Please enter a valid age.';
    }
    if (!formData.height.trim()) {
      newErrors.height = 'Height is required.';
    } else if (isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
      newErrors.height = 'Please enter a valid height.';
    }
    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight is required.';
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight.';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.activityLevel)
      newErrors.activityLevel = 'Activity level is required.';

    setErrors(newErrors);
    return newErrors;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof OnboardingDetailsFormData, value: string) => {
      setFormData(prev => ({...prev, [field]: value}));
      // Clear error for the field when user starts typing
      if (errors[field]) {
        setErrors(prevErrors => ({...prevErrors, [field]: undefined}));
      }
    },
    [errors], // Add errors to dependency array
  );

  const handleGenderSelect = useCallback(
    (gender: OnboardingDetailsFormData['gender']) => {
      setFormData(prev => ({...prev, gender}));
      if (errors.gender) {
        setErrors(prevErrors => ({...prevErrors, gender: undefined}));
      }
    },
    [errors], // Add errors to dependency array
  );

  const handleActivitySelect = useCallback((level: ActivityLevel | null) => {
    setFormData(prev => ({...prev, activityLevel: level}));
    if (errors.activityLevel) {
      setErrors(prevErrors => ({...prevErrors, activityLevel: undefined}));
    }
  }, [errors]); // Add errors to dependency array

  // Placeholder for actual submission logic
  const handleSubmit = useCallback(() => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted successfully:', formData);
      // Proceed with actual submission (e.g., API call)
      return true;
    } else {
      console.log('Form has errors:', validationErrors);
      return false;
    }
  }, [validateForm, formData]);

  return {
    formData,
    errors, // Expose errors
    handleInputChange,
    handleGenderSelect,
    handleActivitySelect,
    activityLevels: ACTIVITY_LEVELS,
    handleSubmit, // Expose handleSubmit
  };
};
