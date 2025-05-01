import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useWelcomeScreenNavigation } from '../../hooks/useWelcomeScreenNavigation';
import { WelcomeContent } from '../../components/onboarding/WelcomeContent';
import { WelcomeFooter } from '../../components/onboarding/WelcomeFooter';

export const WelcomeScreen: React.FC = () => {
  const { goToGoals } = useWelcomeScreenNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WelcomeContent />
      </ScrollView>
      <WelcomeFooter onPress={goToGoals} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1, // Ensures content can scroll if needed, but footer stays at bottom
    justifyContent: 'space-between',
  },
  // Removed styles related to content, illustration, title, subtitle,
  // features, feature, featureIcon, featureContent, featureTitle, featureDescription,
  // footer, button, buttonText
});

// Export default if this is the primary export for the route
// (Assuming file-based routing where Welcome.tsx matches a route)
export default WelcomeScreen; 