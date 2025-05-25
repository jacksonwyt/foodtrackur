import React from 'react';
import {View, StyleSheet, SafeAreaView, ViewStyle} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({children, style}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
});
