import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  FlatListProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {GoalItem} from './GoalItem';
import type {Goal} from '../../hooks/useGoalsScreenLogic'; // Import type
import {GoalType} from '../../types/navigation'; // Import GoalType using relative path
import theme from '../../constants/theme'; // Import the centralized theme

// We only define props specific to GoalsList or those we want to override type for.
// Standard FlatListProps like ListHeaderComponent, contentContainerStyle will be passed via ...rest
interface GoalsListProps
  extends Omit<FlatListProps<Goal>, 'data' | 'renderItem'> {
  goals: Goal[];
  selectedGoalId: GoalType | null;
  onSelectGoal: (id: GoalType) => void;
  // ListHeaderComponent and contentContainerStyle are implicitly part of FlatListProps<Goal>
  // and will be passed correctly with {...rest}
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  selectedGoalId,
  onSelectGoal,
  // ListHeaderComponent, contentContainerStyle, etc., are captured by ...rest
  ...rest
}) => {
  return (
    <FlatList
      data={goals}
      renderItem={({item}) => (
        <GoalItem
          goal={item}
          isSelected={selectedGoalId === item.id}
          onPress={() => onSelectGoal(item.id)}
        />
      )}
      keyExtractor={item => item.id}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />} // Add separator
      // ListHeaderComponent and contentContainerStyle are passed via {...rest}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1, // Ensure list takes available space within its container
  },
  separator: {
    height: theme.spacing.md, // Use theme spacing for separation between items
  },
});
