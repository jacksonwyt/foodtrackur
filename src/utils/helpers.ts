/**
 * Gets a color based on the food category string.
 * @param category The food category (e.g., 'breakfast', 'lunch').
 * @returns A hex color string.
 */
export const getCategoryColor = (category: string): string => {
  switch (category?.toLowerCase()) { // Added lowercase for robustness
    case 'breakfast': return '#FFB454';
    case 'lunch': return '#54B9FF';
    case 'dinner': return '#FF5454';
    case 'snack': return '#54FF9F';
    default: return '#AAAAAA';
  }
};

// Add other general helper functions here as needed 