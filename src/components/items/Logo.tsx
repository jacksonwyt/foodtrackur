import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/useTheme';
import {AppText as Text} from '../common/AppText';

export const Logo: React.FC = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>FoodTrack</Text>
    </View>
  );
};

const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    // Padding is handled by the parent header in HomeScreen, so this might be optional
    // If specific alignment needed, it can be adjusted here.
    // For now, removing it to rely on parent padding.
    // paddingHorizontal: theme.spacing.md,
  },
  text: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
});
