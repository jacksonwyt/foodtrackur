import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface PlanCardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  isPopular: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  id,
  title,
  price,
  description,
  isPopular,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[styles.planCard, isSelected && styles.selectedPlan]}
      onPress={() => onSelect(id)}>
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{title}</Text>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>
      <Text style={styles.planPrice}>
        ${price}
        <Text style={styles.planPeriod}>/mo</Text>
      </Text>
      <Text style={styles.planDescription}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  planCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  selectedPlan: {
    borderColor: '#000',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  popularBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlanCard;
