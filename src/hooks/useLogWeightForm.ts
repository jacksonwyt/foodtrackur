import {useState, useCallback} from 'react';
import {WeightUnit, WeightUnits} from '../services/weightLogService'; // Assuming WeightUnits is exported

export const useLogWeightForm = (
  initialWeight: string = '',
  initialUnit: WeightUnit = WeightUnits.KG,
  initialDate: Date = new Date(),
) => {
  const [weight, setWeight] = useState<string>(initialWeight);
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>(initialUnit);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const isFormValid = useCallback(() => {
    const numericWeight = parseFloat(weight);
    return (
      weight !== '' &&
      !isNaN(numericWeight) &&
      numericWeight > 0 &&
      selectedUnit &&
      selectedDate
    );
  }, [weight, selectedUnit, selectedDate]);

  const resetForm = useCallback(() => {
    setWeight(initialWeight);
    setSelectedUnit(initialUnit);
    setSelectedDate(initialDate);
  }, [initialWeight, initialUnit, initialDate]);

  return {
    weight,
    setWeight,
    selectedUnit,
    setSelectedUnit,
    selectedDate,
    setSelectedDate,
    isFormValid,
    resetForm,
  };
};
