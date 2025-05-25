import React from 'react';
import {Text as RNText, TextProps, StyleSheet} from 'react-native';
import {useTheme} from '@/hooks/useTheme';
import {Theme} from '@/constants/theme'; // Corrected import path

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AppTextProps extends TextProps {
  // We can add custom props like variant (e.g., 'h1', 'body', 'caption') later
  // For now, it will just use default text styling or allow overriding via style prop
}

export function AppText({style, ...props}: AppTextProps): React.ReactElement {
  const theme = useTheme();
  // const styles = makeStyles(theme); // Not strictly needed if all styles are inline or passed

  const textStyle = StyleSheet.flatten([
    {color: theme.colors.onBackground}, // Default color
    {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.regular, // Default typography
    },
    style, // Allow overriding with passed styles
  ]);

  return <RNText style={textStyle} {...props} />;
}

// Optional: if we want predefined variants in the future
// const makeStyles = (theme: Theme) => StyleSheet.create({
//   // text: { // Example of a default style if not directly applied in component
//   //   fontFamily: theme.typography.fontFamily,
//   //   color: theme.colors.onBackground,
//   // },
// });
