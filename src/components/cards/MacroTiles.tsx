import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MacroTile } from '../items/MacroTile';

interface MacroData {
  consumed: number;
  goal: number;
}

interface MacroTilesProps {
  protein: MacroData;
  carbs: MacroData;
  fat: MacroData;
}

const macroConfig = {
  protein: { label: 'Protein', iconName: 'food-steak', color: '#E74C3C' },
  carbs: { label: 'Carbs', iconName: 'bread-slice', color: '#3498DB' },
  fat: { label: 'Fat', iconName: 'oil', color: '#F1C40F' },
};

export const MacroTiles: React.FC<MacroTilesProps> = ({
  protein,
  carbs,
  fat,
}) => {
  return (
    <View style={styles.container}>
      <MacroTile 
        label={macroConfig.protein.label}
        iconName={macroConfig.protein.iconName}
        consumed={protein.consumed}
        goal={protein.goal}
        color={macroConfig.protein.color}
      />
      <MacroTile 
        label={macroConfig.carbs.label}
        iconName={macroConfig.carbs.iconName}
        consumed={carbs.consumed}
        goal={carbs.goal}
        color={macroConfig.carbs.color}
      />
      <MacroTile 
        label={macroConfig.fat.label}
        iconName={macroConfig.fat.iconName}
        consumed={fat.consumed}
        goal={fat.goal}
        color={macroConfig.fat.color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
}); 