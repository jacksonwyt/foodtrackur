import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Assuming you use Expo and have access to vector icons

interface WaterIntakeCardProps {
  currentIntake: number;
  targetIntake: number;
  onIncrement: () => void;
  onDecrement: () => void;
  style?: object;
}

const ICON_SIZE = 24;
const ICON_COLOR = '#007AFF'; // A common blue color for actions

export function WaterIntakeCard({
  currentIntake,
  targetIntake,
  onIncrement,
  onDecrement,
  style,
}: WaterIntakeCardProps) {
  const glasses = Array.from({ length: targetIntake }, (_, i) => i < currentIntake);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <FontAwesome5 name="glass-whiskey" size={ICON_SIZE} color={ICON_COLOR} />
        <Text style={styles.title}>Water Intake</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.intakeText}>
          {currentIntake} / {targetIntake} glasses
        </Text>
        <View style={styles.glassesContainer}>
          {glasses.map((isFilled, index) => (
            <FontAwesome5
              key={index}
              name={isFilled ? 'glass-whiskey' : 'glass-whiskey'} // Could use different icons for filled/empty
              size={20}
              color={isFilled ? ICON_COLOR : '#D3D3D3'} // Light grey for empty
              style={styles.glassIcon}
            />
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDecrement} style={styles.button} disabled={currentIntake <= 0}>
          <FontAwesome5 name="minus-circle" size={ICON_SIZE} color={currentIntake <= 0 ? '#D3D3D3' : ICON_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncrement} style={styles.button} disabled={currentIntake >= targetIntake}>
          <FontAwesome5 name="plus-circle" size={ICON_SIZE} color={currentIntake >= targetIntake ? '#D3D3D3' : ICON_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    alignItems: 'center',
    marginBottom: 15,
  },
  intakeText: {
    fontSize: 16,
    marginBottom: 10,
  },
  glassesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows glasses to wrap if many
    justifyContent: 'center',
  },
  glassIcon: {
    margin: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  button: {
    padding: 10,
  },
}); 