import {View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from '../../types/navigation';

import {OnboardingHeader} from '../../components/onboarding/OnboardingHeader';
import {WelcomeContent} from '../../components/onboarding/WelcomeContent';
import {OnboardingFooter} from '../../components/onboarding/OnboardingFooter';
import theme from '../../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Define prop types for the screen
// interface WelcomeScreenProps {
//   navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
// }

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>
    >();

  const handleNext = () => {
    navigation.navigate('Goals');
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <OnboardingHeader title="Welcome to FoodTrack" currentStep={1} totalSteps={3} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <WelcomeContent />
      </ScrollView>
      <OnboardingFooter
        onPress={handleNext}
        buttonText="Get Started"
        showIcon={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
});
