import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {OnboardingStackParamList, GoalType} from '../../types/navigation';
import {useGoalsScreenLogic} from '../../hooks/useGoalsScreenLogic';
import {useGoalsScreenNavigation} from '../../hooks/useGoalsScreenNavigation';
import {OnboardingHeader} from '../../components/onboarding/OnboardingHeader';
import {GoalsList} from '../../components/onboarding/GoalsList';
import {OnboardingFooter} from '../../components/onboarding/OnboardingFooter';
import theme from '../../constants/theme';

interface GoalsScreenProps {
  // Even if navigation is handled by a hook, it's good practice to type it
  // if the screen is part of a navigator stack.
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Goals'>;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = () => {
  const {goals, selectedGoalId, selectGoal} = useGoalsScreenLogic();
  const {goToDetails} = useGoalsScreenNavigation();

  const handlePressContinue = () => {
    if (selectedGoalId) {
      goToDetails(selectedGoalId);
    }
  };

  const renderHeader = () => (
    <OnboardingHeader
      title="What's your goal?"
      subtitle="Select your primary goal and we'll customize your experience"
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoalsList
        goals={goals}
        selectedGoalId={selectedGoalId}
        onSelectGoal={selectGoal}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContentContainer}
      />

      <OnboardingFooter
        onPress={handlePressContinue}
        disabled={!selectedGoalId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
});

export default GoalsScreen;
