import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/theme';

interface FoodListItemProps extends TouchableOpacityProps {
  name: string;
  calories: number;
  // Add other relevant props like serving size, brand, etc.
}

export const FoodListItem: React.FC<FoodListItemProps> = ({
  name,
  calories,
  style,
  ...props
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.calories}>{calories} kcal</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  name: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxs,
  },
  calories: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
  },
});
