import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useSubscriptionScreenLogic} from '../../hooks/useSubscriptionScreenLogic';
import FeatureListItem from '../../components/subscription/FeatureListItem';
import PlanCard from '../../components/subscription/PlanCard';
import SubscriptionHeader from '../../components/subscription/SubscriptionHeader';
import SubscriptionFooter from '../../components/subscription/SubscriptionFooter';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SubscriptionStackParamList} from '../../types/navigation';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';

type SubscriptionScreenProps = NativeStackScreenProps<
  SubscriptionStackParamList,
  'SubscriptionMain'
>;

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {
    features,
    plans,
    selectedPlanId,
    setSelectedPlanId,
    handleSubscribe,
    handleClose,
  } = useSubscriptionScreenLogic();

  return (
    <View style={styles.container}>
      <SubscriptionHeader title="Upgrade to Pro" onClose={handleClose} />

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Unlock all features and take control of your nutrition
        </Text>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <FeatureListItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </View>

        <View style={styles.plans}>
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              isPopular={plan.isPopular}
              isSelected={selectedPlanId === plan.id}
              onSelect={setSelectedPlanId}
            />
          ))}
        </View>
      </ScrollView>

      <SubscriptionFooter
        subscribeButtonText="Subscribe Now"
        guaranteeText="7-day money-back guarantee • Cancel anytime"
        termsText="By subscribing you agree to our Terms of Service and Privacy Policy"
        onSubscribe={handleSubscribe}
      />
    </View>
  );
};

const makeStyles = (theme: Theme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    subtitle: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    features: {
      marginBottom: theme.spacing.xl,
    },
    plans: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
  });

export default SubscriptionScreen;
