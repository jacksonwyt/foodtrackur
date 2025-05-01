import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

// Helper to check if a string is a valid non-negative number
const isValidNumber = (value: string): boolean => {
  if (value.trim() === '') return true; // Allow empty initially, specific validation can check later
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

export const useFoodDBAddForm = () => {
  const router = useRouter();
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (foodName.trim() === '') {
      newErrors.foodName = 'Food name is required.';
    }
    if (calories.trim() === '' || !isValidNumber(calories)) {
      newErrors.calories = 'Calories must be a valid non-negative number.';
    }
    if (!isValidNumber(protein)) {
      newErrors.protein = 'Protein must be a valid non-negative number.';
    }
    if (!isValidNumber(carbs)) {
      newErrors.carbs = 'Carbs must be a valid non-negative number.';
    }
    if (!isValidNumber(fat)) {
      newErrors.fat = 'Fat must be a valid non-negative number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [foodName, calories, protein, carbs, fat]);

  const isFormValid = useCallback(() => {
      return (
          foodName.trim() !== '' &&
          calories.trim() !== '' && isValidNumber(calories) &&
          isValidNumber(protein) &&
          isValidNumber(carbs) &&
          isValidNumber(fat)
      );
  }, [foodName, calories, protein, carbs, fat])

  const handleSave = useCallback(() => {
    if (validateForm()) {
      const foodData = {
        name: foodName.trim(),
        calories: parseFloat(calories),
        protein: parseFloat(protein || '0'),
        carbs: parseFloat(carbs || '0'),
        fat: parseFloat(fat || '0'),
      };
      // Replace console.log with actual saving logic (e.g., API call)
      console.log('Saving food data:', foodData);
      router.back();
    }
  }, [validateForm, foodName, calories, protein, carbs, fat, router]);

  // Input handlers that also clear errors on change
  const handleFoodNameChange = (text: string) => {
    setFoodName(text);
    if (errors.foodName) setErrors(prev => ({ ...prev, foodName: '' }));
  };
    const handleCaloriesChange = (text: string) => {
    setCalories(text);
    if (errors.calories) setErrors(prev => ({ ...prev, calories: '' }));
  };
    const handleProteinChange = (text: string) => {
    setProtein(text);
    if (errors.protein) setErrors(prev => ({ ...prev, protein: '' }));
  };
    const handleCarbsChange = (text: string) => {
    setCarbs(text);
    if (errors.carbs) setErrors(prev => ({ ...prev, carbs: '' }));
  };
    const handleFatChange = (text: string) => {
    setFat(text);
    if (errors.fat) setErrors(prev => ({ ...prev, fat: '' }));
  };

  return {
    foodName,
    calories,
    protein,
    carbs,
    fat,
    errors,
    handleFoodNameChange,
    handleCaloriesChange,
    handleProteinChange,
    handleCarbsChange,
    handleFatChange,
    handleSave,
    isFormValid: isFormValid(), // Provide the current boolean value
  };
}; 