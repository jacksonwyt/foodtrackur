import {useState, useCallback, useEffect} from 'react';
// Import actual service functions and types
import {
  addCustomFood,
  updateCustomFood,
  getCustomFoodById,
  CustomFood,
  AddCustomFoodData,
  UpdateCustomFoodData,
} from '../services/customFoodService';

// Remove mock functions: saveFoodData, updateFoodData, fetchFoodItemById

interface FoodFormData {
  foodName: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  servingSize: string; // Added
  servingUnit: string; // Added
}

// Define error type to include specific fields and a general form error
type FormErrors = Partial<Record<keyof FoodFormData | 'form', string>>;

interface UseAddFoodFormOptions {
  itemId?: string; // Comes from route params, potentially string
}

interface UseAddFoodFormResult {
  formData: FoodFormData;
  handleInputChange: (field: keyof FoodFormData, value: string) => void;
  handleSubmit: () => Promise<boolean>;
  isSubmitting: boolean;
  isLoading: boolean;
  isEditMode: boolean; // Explicitly indicate if we are editing
  itemId?: number; // Return the parsed numeric ID
  errors: FormErrors;
}

export const useAddFoodForm = (
  options?: UseAddFoodFormOptions,
): UseAddFoodFormResult => {
  const {itemId: itemIdString} = options || {}; // Rename to clarify it's a string
  const isEditMode = !!itemIdString;
  const itemId = itemIdString ? parseInt(itemIdString, 10) : undefined;

  const [formData, setFormData] = useState<FoodFormData>({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '', // Added
    servingUnit: '', // Added
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Effect to load existing data if itemId is valid number
  useEffect(() => {
    // Check if we are in edit mode AND have a valid, parsed number ID
    const validItemId =
      isEditMode && typeof itemId === 'number' && !isNaN(itemId);

    if (validItemId) {
      const loadData = async () => {
        setIsLoading(true);
        setErrors({});
        try {
          // Use actual service call - now we know itemId is a number
          const fetchedData = await getCustomFoodById(itemId);
          if (fetchedData) {
            setFormData({
              foodName: fetchedData.food_name,
              calories: String(fetchedData.calories),
              protein: String(fetchedData.protein),
              carbs: String(fetchedData.carbs),
              fat: String(fetchedData.fat),
              servingSize: String(fetchedData.serving_size),
              servingUnit: fetchedData.serving_unit,
            });
          } else {
            setErrors({form: 'Food item not found or access denied.'});
            // Optional: redirect back or show persistent error
          }
        } catch (error) {
          console.error('Failed to fetch custom food item:', error);
          setErrors({form: 'Failed to load existing food data.'});
        } finally {
          setIsLoading(false);
        }
      };
      loadData().catch(error => {
        // Handle or log the error from loadData itself, though individual errors are caught within loadData
        console.error('Error in loadData invocation:', error);
        // Optionally, set a generic error state if loadData fails catastrophically before its own try/catch
        // setErrors({ form: "Failed to initialize food item loading." });
        setIsLoading(false); // Ensure loading is stopped
      });
    } else if (itemIdString && !validItemId) {
      // Handle cases where itemIdString exists but parsing failed or wasn't attempted
      // Handle invalid ID from route param
      console.error(
        'Invalid item ID provided or failed parsing:',
        itemIdString,
      );
      setErrors({form: 'Invalid item ID.'});
      setIsLoading(false);
    }
    // Reset form if not in edit mode (e.g., navigated back from edit)
    // Might be needed depending on navigation patterns
    // if (!isEditMode) {
    //   setFormData({ foodName: '', ... , servingSize: '', servingUnit: '' });
    //   setErrors({});
    // }
  }, [itemIdString, isEditMode, itemId]); // Depend on the original string ID and derived values

  const handleInputChange = useCallback(
    (field: keyof FoodFormData, value: string) => {
      setFormData(prev => ({...prev, [field]: value}));
      // Clear field-specific error and general form error on input change
      setErrors(prev => ({...prev, [field]: undefined, form: undefined}));
    },
    [],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required';
      isValid = false;
    }
    if (
      !formData.servingSize.trim() ||
      isNaN(Number(formData.servingSize)) ||
      Number(formData.servingSize) <= 0
    ) {
      newErrors.servingSize = 'Valid serving size (> 0) is required';
      isValid = false;
    }
    if (!formData.servingUnit.trim()) {
      newErrors.servingUnit = 'Serving unit is required';
      isValid = false;
    }
    if (
      !formData.calories.trim() ||
      isNaN(Number(formData.calories)) ||
      Number(formData.calories) < 0
    ) {
      newErrors.calories = 'Valid calories are required';
      isValid = false;
    }
    // Allow 0 for macros, but ensure they are numbers
    if (
      formData.protein.trim() &&
      (isNaN(Number(formData.protein)) || Number(formData.protein) < 0)
    ) {
      newErrors.protein = 'Must be a non-negative number';
      isValid = false;
    }
    if (
      formData.carbs.trim() &&
      (isNaN(Number(formData.carbs)) || Number(formData.carbs) < 0)
    ) {
      newErrors.carbs = 'Must be a non-negative number';
      isValid = false;
    }
    if (
      formData.fat.trim() &&
      (isNaN(Number(formData.fat)) || Number(formData.fat) < 0)
    ) {
      newErrors.fat = 'Must be a non-negative number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    // Prepare data matching service expectations
    const baseData = {
      food_name: formData.foodName.trim(),
      calories: Number(formData.calories),
      protein: Number(formData.protein) || 0,
      carbs: Number(formData.carbs) || 0,
      fat: Number(formData.fat) || 0,
      serving_size: Number(formData.servingSize), // Already validated as > 0 number
      serving_unit: formData.servingUnit.trim(),
    };

    try {
      let result: CustomFood | null = null;
      if (isEditMode && itemId !== undefined) {
        // Update existing item - ensure itemId is a valid number
        const updateData: UpdateCustomFoodData = baseData;
        result = await updateCustomFood(itemId, updateData);
      } else {
        // Add new item
        const addData: AddCustomFoodData = baseData;
        result = await addCustomFood(addData);
      }

      setIsSubmitting(false);

      if (result) {
        // Success
        // Optionally reset form only after successful *new* item submission
        if (!isEditMode) {
          setFormData({
            foodName: '',
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            servingSize: '',
            servingUnit: '',
          });
        }
        return true; // Indicate success
      } else {
        // Handle case where service call returns null (e.g., update failed due to non-ownership)
        const action = isEditMode ? 'update' : 'add';
        setErrors({
          form: `Failed to ${action} food item. Item might not exist or operation failed.`,
        });
        return false; // Indicate failure
      }
    } catch (error) {
      console.error('Submission failed:', error);
      const action = isEditMode ? 'update' : 'add';
      // Try to provide a more specific error if possible, otherwise generic
      const message =
        error instanceof Error
          ? error.message
          : `An unknown error occurred while trying to ${action} the food item.`;
      setErrors({form: message});
      setIsSubmitting(false);
      return false; // Indicate failure
    }
  }, [formData, isEditMode, itemId, validateForm]); // Update dependencies

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    isLoading,
    isEditMode,
    itemId,
    errors,
  };
};
