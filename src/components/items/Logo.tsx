import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FoodTrack</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
}); 