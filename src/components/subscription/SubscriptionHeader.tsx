import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SubscriptionHeaderProps {
  title: string;
  onClose: () => void;
}

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({ title, onClose }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20, // Adjust top padding for iOS status bar
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff', // Ensure header has a background
  },
  closeButton: {
    // Make the touchable area larger if needed
    padding: 8, // Add padding to increase touch area
    marginRight: 8, // Adjust spacing
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    // Removed marginLeft to let flexbox handle spacing if needed, or adjust as required
  },
});

export default SubscriptionHeader; 