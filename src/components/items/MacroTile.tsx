import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MacroTileProps {
  label: string;
  // Use keyof typeof MaterialCommunityIcons.glyphMap for stronger icon typing
  // However, this can be complex, so using string for simplicity now.
  iconName: string; 
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
  iconBackgroundColor = '#f0f0f0', // Default background color
}) => {
  // Ensure goal is not zero to avoid division by zero
  const safeGoal = Math.max(goal, 1);
  const cappedConsumed = Math.max(consumed, 0); // Ensure consumed is not negative
  const progress = Math.min(cappedConsumed / safeGoal, 1) * 100; // Progress capped at 100%

  return (
    <View style={styles.tile}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <MaterialCommunityIcons 
          name={iconName} // Use iconName prop
          size={20} // Slightly smaller icon
          color={color} 
        />
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="tail">
        <Text style={styles.consumedText}>{cappedConsumed}</Text>
        {/* Handle goal being potentially 0 for display */}
        <Text style={styles.goalText}> / {Math.max(goal, 0)}g</Text> 
      </Text>
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { backgroundColor: color, width: `${progress}%` }
          ]} 
        />
      </View>
    </View>
  );
};

// Styles extracted from MacroTiles.tsx specific to a single tile
const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5, // Adjust padding slightly
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  macroLabel: {
    fontSize: 12,
    color: '#636366',
    marginBottom: 4,
    fontWeight: '500',
  },
  valueText: {
    marginBottom: 6,
    height: 20, // Ensure consistent height
    alignItems: 'flex-end', // Align baseline
  },
  consumedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  goalText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  progressContainer: {
    width: '100%',
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2.5,
  },
}); 