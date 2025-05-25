import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; // Assuming Ionicons is used
import { useTheme } from '@/hooks/useTheme'; // Added import
import { Theme } from '@/constants/theme'; // Added import

interface FoodSearchBarProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>; // Style for the container View
  onClear?: () => void; // Optional: callback when clear button is pressed
  // value and onChangeText will be passed via ...props
}

export const FoodSearchBar: React.FC<FoodSearchBarProps> = ({
  style,
  onClear,
  value, // Explicitly get value for clear button logic
  onChangeText, // Explicitly get onChangeText for clear button
  ...props
}) => {
  const theme = useTheme(); // Added useTheme hook
  const styles = makeStyles(theme); // Added makeStyles call

  const handleClear = () => {
    if (onChangeText) {
      onChangeText(''); // Clear the text using the passed handler
    }
    if (onClear) {
      onClear(); // Call the onClear prop if provided
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color={theme.colors.onSurfaceMedium} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search food database..."
        placeholderTextColor={theme.colors.onSurfaceMedium} // Consistent placeholder color
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {value && value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearIconContainer}>
          <Ionicons name="close-circle" size={20} color={theme.colors.onSurfaceMedium} />
        </Pressable>
      )}
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background, // Use background, or a slightly off-background like surfaceVariant if defined
    borderRadius: theme.borderRadius.lg,    // Larger border radius for a softer, modern look
    paddingHorizontal: theme.spacing.md,    // Adequate horizontal padding
    height: 48,                             // Standard height for touch targets
    borderWidth: 1,
    borderColor: theme.colors.border,       // Clear border
    // ...theme.shadows.xs, // Optional: very subtle shadow for depth
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.onBackground,       // Ensure text color contrasts with background
    height: '100%',
  },
  clearIconContainer: {
    marginLeft: theme.spacing.sm,         // Space from the text input
    padding: theme.spacing.xs,            // Make tap target slightly larger
  },
});
