export const colors = {
  primary: '#000000',
  secondary: '#666666',
  background: '#FFFFFF',
  card: '#F8F8F8',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E5E5E5',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  
  // Macro colors
  protein: '#FF3B30',
  carbs: '#FF9500',
  fat: '#007AFF',
  
  // Status colors
  active: '#34C759',
  inactive: '#8E8E93',
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 24,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
}; 