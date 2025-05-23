import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MacroTile} from '../items/MacroTile';
import {useTheme} from '../../hooks/useTheme';

interface MacroData {
  consumed: number;
  goal: number;
}

interface MacroTilesProps {
  protein: MacroData;
  carbs: MacroData;
  fat: MacroData;
}

export const MacroTiles: React.FC<MacroTilesProps> = ({
  protein,
  carbs,
  fat,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const macroConfig = {
    protein: {label: 'Protein', iconName: 'food-steak', color: theme.colors.protein},
    carbs: {label: 'Carbs', iconName: 'bread-slice', color: theme.colors.carbs},
    fat: {label: 'Fat', iconName: 'oil', color: theme.colors.fat},
  };

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

const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
