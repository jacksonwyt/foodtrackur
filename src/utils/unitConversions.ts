export function convertHeightToCm(
  height: string,
  unit: 'cm' | 'ft_in',
  feet?: string,
  inches?: string,
): number | undefined {
  if (unit === 'cm') {
    const cmValue = parseFloat(height);
    return !isNaN(cmValue) && cmValue > 0 ? cmValue : undefined;
  } else {
    const ftValue = feet ? parseFloat(feet) : 0;
    const inValue = inches ? parseFloat(inches) : 0;

    if (isNaN(ftValue) && isNaN(inValue)) return undefined;
    if (ftValue < 0 || inValue < 0) return undefined; // Or handle error appropriately
    if (ftValue === 0 && inValue === 0 && !feet?.trim() && !inches?.trim())
      return undefined; // Nothing entered

    let totalCm = 0;
    if (!isNaN(ftValue) && ftValue > 0) {
      totalCm += ftValue * 30.48;
    }
    if (!isNaN(inValue) && inValue > 0) {
      totalCm += inValue * 2.54;
    }
    return totalCm > 0 ? totalCm : undefined;
  }
}

export function convertWeightToKg(
  weight: string,
  unit: 'kg' | 'lbs',
): number | undefined {
  const weightValue = parseFloat(weight);
  if (isNaN(weightValue) || weightValue <= 0) return undefined;

  if (unit === 'kg') {
    return weightValue;
  } else {
    return weightValue * 0.453592;
  }
}
