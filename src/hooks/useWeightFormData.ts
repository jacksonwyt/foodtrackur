import { useState, useCallback } from 'react';

export const useWeightFormData = () => {
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');

  const isFormValid = useCallback(() => {
    const numericWeight = parseFloat(weight);
    return weight !== '' && !isNaN(numericWeight) && numericWeight > 0;
  }, [weight]);

  const resetForm = useCallback(() => {
    setWeight('');
    setNote('');
  }, []);

  return {
    weight,
    setWeight,
    note,
    setNote,
    isFormValid,
    resetForm,
  };
}; 