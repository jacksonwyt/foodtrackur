import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useGoalsScreenLogic } from '../../hooks/useGoalsScreenLogic';
import { useGoalsScreenNavigation } from '../../hooks/useGoalsScreenNavigation';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { GoalsList } from '../../components/onboarding/GoalsList';
import { OnboardingFooter } from '../../components/onboarding/OnboardingFooter';

export const GoalsScreen: React.FC = () => {
  const { goals, selectedGoalId, selectGoal } = useGoalsScreenLogic();
  const { goToDetails } = useGoalsScreenNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <OnboardingHeader
          title="What's your goal?"
          subtitle="Select your primary goal and we'll customize your experience"
        />
        <GoalsList
          goals={goals}
          selectedGoalId={selectedGoalId}
          onSelectGoal={selectGoal}
        />
      </ScrollView>

      <OnboardingFooter
        onPress={goToDetails}
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
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
});

export default GoalsScreen; 