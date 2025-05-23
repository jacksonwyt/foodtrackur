import {Platform, TextStyle} from 'react-native';

// Helper function to convert hex to an "R,G,B" string
function hexToRgbString(hex: string): string {
  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  // 6 digits
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    // console.warn(`Invalid hex color: ${hex}, returning default black.`);
    return '0,0,0'; // Default to black if hex is invalid
  }
  return `${r},${g},${b}`;
}

export const colors = {
  // Brand Colors
  primary: '#007AFF', // Vibrant Blue - good for CTAs, active states
  primaryRGB: hexToRgbString('#007AFF'), // Added
  onPrimary: '#FFFFFF', // Text/icon color on primary background
  secondary: '#5856D6', // Complementary Purple - for secondary actions, accents
  onSecondary: '#FFFFFF', // Text/icon color on secondary background

  // Neutral Colors
  background: '#F2F2F7', // Light Gray - iOS system background color for a native feel
  onBackground: '#000000', // Text on background
  surface: '#FFFFFF', // White - for cards, sheets, elevated surfaces
  onSurface: '#000000', // Text on surface
  card: '#FFFFFF', // Explicitly defined card, though can be same as surface
  onCard: '#000000',

  // Text Colors
  text: '#000000', // Primary text color (high contrast)
  textSecondary: '#3C3C43', // Medium Gray - for subheadings, less important text (iOS Label)
  textSecondaryRGB: hexToRgbString('#3C3C43'), // Added
  textPlaceholder: '#3C3C43', // Placeholder text (iOS Placeholder Text, opacity 0.3)

  // Border & Divider Colors
  border: '#C6C6C8', // Light Gray - for borders and dividers (iOS Separator)

  // Semantic Colors
  error: '#FF3B30', // Red - for errors, destructive actions
  onError: '#FFFFFF',
  errorBackground: '#FFEEEE', // Light red for error message backgrounds
  success: '#34C759', // Green - for success states
  onSuccess: '#FFFFFF',
  successBackground: '#E6FFFA', // Light green for success message backgrounds
  warning: '#FFCC00', // Yellow - for warnings
  onWarning: '#000000',
  info: '#007AFF', // Blue - for informational messages (can be same as primary)
  onInfo: '#FFFFFF',

  // Macro colors (keeping existing)
  protein: '#FF3B30',
  carbs: '#FF9500',
  fat: '#007AFF',

  // Status colors (keeping existing, consider if they map to semantic colors)
  active: '#34C759', // Could map to success
  inactive: '#8E8E93', // A darker medium gray for inactive states

  // Disabled Colors
  surfaceDisabled: '#E5E5EA', // A light gray for disabled surfaces (iOS-like)
  onSurfaceDisabled: '#AEAEB2', // A medium gray for text/icons on disabled surfaces (iOS-like)

  // Additional Surface/Text Colors
  onSurfaceMedium: '#8A8A8E', // For less prominent text on surfaces (e.g., placeholders, secondary info)
};

export const typography = {
  fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif', // System defaults
  sizes: {
    h1: 28, // Large Page Titles
    h2: 22, // Section Headers / Prominent Titles
    h3: 20, // Sub-Section Headers
    bodyLarge: 18, // Larger body text for emphasis
    body: 16, // Standard body text (min 16dp)
    bodySmall: 14, // Smaller body text, distinct from caption if needed
    caption: 14, // Captions, smaller text
    overline: 12, // Overlines, very small utility text
    // Old names for reference, can be removed later
    // xs: 12,
    // sm: 14,
    // md: 16,
    // lg: 18,
    // xl: 20,
    // xxl: 24,
    // xxxl: 24, // Was duplicate, h1 is 28 now
  },
  weights: {
    light: '300' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  lineHeights: {
    // Added for convenience, though often applied as multiple of fontSize
    tight: 1.2,
    normal: 1.4,
    loose: 1.6,
  },
  // Added Button Typography
  button: {
    fontSize: 16, // Or theme.typography.sizes.body
    fontWeight: '600' as TextStyle['fontWeight'], // Or theme.typography.weights.semibold
    // fontFamily: (Platform.OS === 'ios' ? 'System' : 'sans-serif'), // Already available via fontFamily at root
    // Note: We can also use typography.sizes.button here if defined
  },
};

export const spacing = {
  xxs: 2, // Extra extra small for fine-tuning
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48, // Added for larger spacing needs
};

export const borderRadius = {
  xs: 4, // Smaller radius for elements like tags
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.text, // Use theme color for consistency
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.0,
    elevation: 2, // Adjusted elevation
  },
  md: {
    shadowColor: colors.text, // Use theme color for consistency
    shadowOffset: {
      width: 0,
      height: 3, // Slightly more offset for medium shadow
    },
    shadowOpacity: 0.15, // Slightly more opacity
    shadowRadius: 6.0, // Softer radius
    elevation: 5,
  },
  lg: {
    // Added a larger shadow for more prominent elements
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8.0,
    elevation: 10,
  },
};

export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

const theme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
