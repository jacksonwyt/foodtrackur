import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface SubscriptionFooterProps {
  subscribeButtonText: string;
  termsText: string;
  guaranteeText: string;
  onSubscribe: () => void;
}

const SubscriptionFooter: React.FC<SubscriptionFooterProps> = ({
  subscribeButtonText,
  termsText,
  guaranteeText,
  onSubscribe,
}) => {
  return (
    <View style={styles.footer}>
      <Text style={styles.guarantee}>{guaranteeText}</Text>
      <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
        <Text style={styles.buttonText}>{subscribeButtonText}</Text>
      </TouchableOpacity>
      <Text style={styles.terms}>{termsText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    alignItems: 'center', // Center items horizontally
  },
  guarantee: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16, // Add space below guarantee text
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 30, // Make it more pill-shaped
    width: '100%', // Make button take full width
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SubscriptionFooter;
