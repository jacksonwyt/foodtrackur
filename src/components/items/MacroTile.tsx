import React, {ComponentProps} from 'react';
import {View, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useTheme} from '../../hooks/useTheme';
import {AppText as Text} from '../common/AppText';

interface MacroTileProps {
  label: string;
  // Use the actual type for icon names from MaterialCommunityIcons
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  consumed: number;
  goal: number;
  color: string;
  iconBackgroundColor?: string; // Optional background color for icon
}

export const MacroTile: React.FC<MacroTileProps> = ({
  label,
  iconName,
  consumed,
  goal,
  color,
  // iconBackgroundColor will be set using theme inside the component
}) => {
  const theme = useTheme(); // Initialize theme
  // Default iconBackgroundColor using theme, can be overridden by prop if needed in future
  const iconBgColor = theme.colors.background; // Or theme.colors.surface if tile is on background
  const styles = makeStyles(theme); // Pass theme to styles

  // Ensure goal is not zero to avoid division by zero
  const safeGoal = Math.max(goal, 1);
  const cappedConsumed = Math.max(consumed, 0); // Ensure consumed is not negative
  const progress = Math.min(cappedConsumed / safeGoal, 1) * 100; // Progress capped at 100%
  const remaining = Math.max(safeGoal - cappedConsumed, 0);

  return (
    <View style={styles.tile}>
      <View
        style={[styles.iconContainer, {backgroundColor: iconBgColor}]}>
        <MaterialCommunityIcons
          name={iconName} // Use iconName prop
          size={20} // Slightly smaller icon
          color={color}
        />
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="tail">
        <Text style={styles.mainValueText}>{remaining}g</Text>
        <Text style={styles.remainingLabelText}> left</Text>
      </Text>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {backgroundColor: color, width: `${progress}%`},
          ]}
        />
      </View>
    </View>
  );
};

// Styles extracted from MacroTiles.tsx specific to a single tile
const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs, // Use theme spacing
  },
  iconContainer: {
    width: 36, // Keep specific size if design requires
    height: 36,
    borderRadius: theme.borderRadius.round, // Make it fully round
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs, // Use theme spacing
  },
  macroLabel: {
    fontSize: theme.typography.sizes.overline, // Use theme typography
    color: theme.colors.textSecondary, // Use theme color
    marginBottom: theme.spacing.xxs, // Use theme spacing
    fontWeight: theme.typography.weights.medium, // Use theme typography
  },
  valueText: {
    marginBottom: theme.spacing.xs, // Use theme spacing
    height: theme.typography.sizes.body * theme.typography.lineHeights.normal, // Ensure consistent height based on font
    alignItems: 'flex-end',
  },
  mainValueText: { // Renamed from consumedText for clarity
    fontSize: theme.typography.sizes.body, // Use theme typography
    fontWeight: theme.typography.weights.semibold, // Use theme typography
    color: theme.colors.text, // Use theme color
  },
  remainingLabelText: { // Renamed from goalText for clarity and new purpose
    fontSize: theme.typography.sizes.bodySmall, // Use theme typography
    color: theme.colors.textSecondary, // Use theme color
  },
  progressContainer: {
    width: '100%',
    height: 5, // Keep specific size if design requires
    backgroundColor: theme.colors.border, // Use theme color
    borderRadius: theme.borderRadius.round, // Make it fully round
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.round, // Make it fully round
  },
});
