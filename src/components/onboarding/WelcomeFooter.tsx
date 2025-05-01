import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeFooterProps {
  onPress: () => void;
}

export const WelcomeFooter: React.FC<WelcomeFooterProps> = ({ onPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff', // Match background
    borderTopWidth: 1,
    borderTopColor: '#e0e0e5', // Slightly darker border
  },
  footerContainer: {
    padding: 20,
    paddingBottom: 30, // Extra padding for safe area
  },
  button: {
    backgroundColor: '#007AFF', // Use a standard blue
    borderRadius: 30, // More rounded corners
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 