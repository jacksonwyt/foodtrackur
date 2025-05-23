import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from './AppText'; // Using our themed AppText
import {Theme} from '../../constants/theme';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'solid' | 'outline' | 'ghost';
  isLoading?: boolean;
  // Add other props like icon, size, etc., as needed
}

export function AppButton({
  title,
  onPress,
  disabled,
  style,
  variant = 'solid',
  isLoading = false,
  ...props
}: AppButtonProps): React.ReactElement {
  const theme = useTheme();
  const styles = makeStyles(theme, variant, disabled || isLoading);

  return (
    <TouchableOpacity
      style={[styles.button, style]} // Ensure external styles can also be applied
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7} // Standard active opacity
      {...props}>
      {isLoading ? (
        <ActivityIndicator size="small" color={styles.text.color} />
      ) : (
        <AppText style={styles.text}>{title}</AppText>
      )}
    </TouchableOpacity>
  );
}

const makeStyles = (
  theme: Theme,
  variant: AppButtonProps['variant'],
  isDisabled: boolean,
) => {
  const buttonStyles: ViewStyle = {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const textStyles: TextStyle = {
    ...theme.typography.button,
    color: theme.colors.onPrimary,
    textAlign: 'center',
  };

  if (variant === 'outline') {
    buttonStyles.backgroundColor = 'transparent';
    textStyles.color = theme.colors.primary;
  } else if (variant === 'ghost') {
    buttonStyles.backgroundColor = 'transparent';
    buttonStyles.borderColor = 'transparent';
    textStyles.color = theme.colors.primary;
  }

  if (isDisabled) {
    buttonStyles.backgroundColor =
      variant === 'solid' ? theme.colors.surfaceDisabled : 'transparent';
    textStyles.color = theme.colors.onSurfaceDisabled;
    buttonStyles.borderColor =
      variant === 'outline'
        ? theme.colors.onSurfaceDisabled
        : buttonStyles.borderColor;
    if (variant === 'ghost') buttonStyles.borderColor = 'transparent';
    buttonStyles.opacity = 0.6; // Common practice for disabled state
  }

  return StyleSheet.create({
    button: buttonStyles,
    text: textStyles,
  });
};
