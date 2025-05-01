import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Achievement } from '../../hooks/useProgressData'; // Adjust path if necessary

interface AchievementsListProps {
  achievements: Achievement[];
}

const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    // Optionally render a message if there are no achievements
    return null; // Or <Text>No achievements yet!</Text>
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Recent Achievements</Text>
      <View style={styles.achievementsContainer}>
        {achievements.map((achievement) => (
          <View key={achievement.title} style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Ionicons name={achievement.icon} size={24} color="#FFC107" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <Text style={styles.achievementDate}>
                {achievement.date.toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  achievementsContainer: {
    gap: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  achievementIcon: {
    backgroundColor: '#FFF9C4', // Light yellow background for icon
    padding: 8,
    borderRadius: 20, // Make it circular
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default AchievementsList; 