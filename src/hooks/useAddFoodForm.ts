import { useState, useCallback, useEffect } from 'react';

// Placeholder for where data would actually be saved/updated
const saveFoodData = async (foodData: any) => {
  console.log('Saving new food data:', foodData);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return mock ID for new item
  return { ...foodData, id: `new-${Date.now()}` }; 
};

const updateFoodData = async (itemId: string, foodData: any) => {
  console.log(`Updating food data for ID ${itemId}:`, foodData);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return updated item
  return { ...foodData, id: itemId };
};

// Placeholder for fetching existing data
const fetchFoodItemById = async (itemId: string) => {
  console.log(`Fetching food data for ID ${itemId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  // Return mock data - replace with actual API call
  if (itemId === 'mock-item-id') { // Example ID
    return {
      id: itemId,
      name: 'Fetched Apple',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      // Add other relevant fields fetched from backend
    };
  }
  throw new Error('Item not found');
};

interface FoodFormData {
  foodName: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

// Define error type to include specific fields and a general form error
type FormErrors = Partial<Record<keyof FoodFormData | 'form', string>>;

interface UseAddFoodFormOptions {
  itemId?: string;
  mealCategory?: string; // Retain for potential future use if needed
}

interface UseAddFoodFormResult {
  formData: FoodFormData;
  handleInputChange: (field: keyof FoodFormData, value: string) => void;
  handleSubmit: () => Promise<boolean>; // Returns true on success, false on failure
  isSubmitting: boolean;
  isLoading: boolean; // Added state for loading existing item
  errors: FormErrors; // Use the updated error type
}

export const useAddFoodForm = (options?: UseAddFoodFormOptions): UseAddFoodFormResult => {
  const { itemId } = options || {};
  const [formData, setFormData] = useState<FoodFormData>({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading existing item
  const [errors, setErrors] = useState<FormErrors>({});

  // Effect to load existing data if itemId is provided
  useEffect(() => {
    if (itemId) {
      const loadData = async () => {
        setIsLoading(true);
        setErrors({});
        try {
          const fetchedData = await fetchFoodItemById(itemId);
          setFormData({
            foodName: fetchedData.name,
            calories: String(fetchedData.calories),
            protein: String(fetchedData.protein),
            carbs: String(fetchedData.carbs),
            fat: String(fetchedData.fat),
          });
        } catch (error) {
          console.error('Failed to fetch food item:', error);
          setErrors({ form: 'Failed to load existing food data.' });
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
    // Reset form if itemId becomes undefined (e.g., navigating away and back)
    // Optional: depends on desired UX
    // else {
    //   setFormData({ foodName: '', calories: '', protein: '', carbs: '', fat: '' });
    //   setErrors({});
    // }
  }, [itemId]); // Dependency array includes itemId

  const handleInputChange = useCallback((field: keyof FoodFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined, form: undefined }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required';
      isValid = false;
    }
    if (!formData.calories.trim() || isNaN(Number(formData.calories)) || Number(formData.calories) < 0) {
      newErrors.calories = 'Valid calories are required';
      isValid = false;
    }
    if (isNaN(Number(formData.protein)) || Number(formData.protein) < 0) {
        newErrors.protein = 'Must be a non-negative number';
        isValid = false;
    }
     if (isNaN(Number(formData.carbs)) || Number(formData.carbs) < 0) {
        newErrors.carbs = 'Must be a non-negative number';
        isValid = false;
    }
     if (isNaN(Number(formData.fat)) || Number(formData.fat) < 0) {
        newErrors.fat = 'Must be a non-negative number';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const dataToSave = {
        name: formData.foodName,
        calories: Number(formData.calories),
        protein: Number(formData.protein) || 0,
        carbs: Number(formData.carbs) || 0,
        fat: Number(formData.fat) || 0,
        // Include mealCategory if needed in save/update logic
        // category: options?.mealCategory 
      };

      if (itemId) {
        // Update existing item
        await updateFoodData(itemId, dataToSave);
      } else {
        // Save new item
        await saveFoodData(dataToSave);
      }

      setIsSubmitting(false);
      // Optionally reset form after successful *new* item submission
      // if (!itemId) setFormData({ foodName: '', ... });
      return true; // Indicate success
    } catch (error) {
      console.error('Submission failed:', error);
      const action = itemId ? 'update' : 'save';
      setErrors({ form: `Failed to ${action} food item. Please try again.` });
      setIsSubmitting(false);
      return false; // Indicate failure
    }
  }, [formData, itemId]); // Add itemId to dependencies

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    isLoading, // Return loading state
    errors,
  };
}; 