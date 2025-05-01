import React from 'react';
import { View, StyleSheet, SafeAreaView, ViewStyle } from 'react-native';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
}); 