import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSubscriptionScreenLogic } from '../../hooks/useSubscriptionScreenLogic';
import FeatureListItem from '../../components/subscription/FeatureListItem';
import PlanCard from '../../components/subscription/PlanCard';
import SubscriptionHeader from '../../components/subscription/SubscriptionHeader';
import SubscriptionFooter from '../../components/subscription/SubscriptionFooter';

const SubscriptionScreen: React.FC = () => {
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
              icon={feature.icon as any}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </View>

        <View style={styles.plans}>
          {plans.map((plan) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    marginBottom: 32,
  },
  plans: {
    gap: 16,
    marginBottom: 24,
  },
});

export default SubscriptionScreen; 