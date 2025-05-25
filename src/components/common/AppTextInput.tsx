import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '@/hooks/useTheme';
import {AppText} from './AppText'; // For error messages or labels
import {Theme} from '@/constants/theme';

interface AppTextInputProps extends TextInputProps {
  error?: string;
  label?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle; // To allow specific overrides of the input field itself
  // We can add props for icons, etc., later
}

export function AppTextInput({
  style, // This will be passed to the RNTextInput
  error,
  label,
  containerStyle, // Style for the wrapping View
  ...props
}: AppTextInputProps): React.ReactElement {
  const theme = useTheme();
  const styles = makeStyles(theme);

  // Combine default input style, error style, and passed `style` prop for the TextInput itself
  const combinedInputStyle = StyleSheet.flatten([
    styles.input,
    error ? styles.inputError : {},
    style, // `style` prop applies to the RNTextInput
  ]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <RNTextInput
        style={combinedInputStyle}
        placeholderTextColor={theme.colors.onSurfaceMedium} // Theme-based placeholder color
        selectionColor={theme.colors.primary} // Theme-based selection/cursor color
        {...props}
      />
      {error && <AppText style={styles.errorText}>{error}</AppText>}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sm, // Default margin for the whole component wrapper
    },
    input: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.regular,
      backgroundColor: theme.colors.surface,
      color: theme.colors.onSurface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      height: 48, // Default height, can be overridden by `style` prop
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    label: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sizes.caption,
      fontWeight: theme.typography.weights.regular, // Captions are usually regular weight
      color: theme.colors.onSurfaceMedium,
      marginBottom: theme.spacing.xs,
    },
    errorText: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sizes.caption,
      fontWeight: theme.typography.weights.regular,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });
