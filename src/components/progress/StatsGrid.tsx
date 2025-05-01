import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stat } from '../../hooks/useProgressData'; // Adjust path if necessary

interface StatsGridProps {
  stats: Stat[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <View style={styles.statsGrid}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name={stat.icon} size={24} color="#000" />
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          {stat.change && (
            <View style={styles.statChange}>
              <Ionicons
                name={stat.isPositive ? 'trending-down' : 'trending-up'} // Assuming positive means weight loss/streak gain = good
                size={16}
                color={stat.isPositive ? '#4CAF50' : '#FF6B6B'}
              />
              <Text
                style={[
                  styles.statChangeText,
                  stat.isPositive ? styles.positiveChange : styles.negativeChange,
                ]}
              >
                {stat.change}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (Dimensions.get('window').width - 64) / 2, // (Width - padding*2 - gap) / 2
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1, // Allow text to wrap if needed
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveChange: {
    color: '#4CAF50',
  },
  negativeChange: {
    color: '#FF6B6B',
  },
});

export default StatsGrid; 