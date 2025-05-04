import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGoalsScreenLogic } from '../../hooks/useGoalsScreenLogic';
import { useGoalsScreenNavigation } from '../../hooks/useGoalsScreenNavigation';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { GoalsList } from '../../components/onboarding/GoalsList';
import { OnboardingFooter } from '../../components/onboarding/OnboardingFooter';

export const GoalsScreen: React.FC = () => {
  const { goals, selectedGoalId, selectGoal } = useGoalsScreenLogic();
  const { goToDetails } = useGoalsScreenNavigation();

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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
});

export default GoalsScreen; 