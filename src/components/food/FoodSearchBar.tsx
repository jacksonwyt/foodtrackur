import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; // Assuming Ionicons is used

interface FoodSearchBarProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>; // Style for the container View
  // Add any specific props needed for the search bar, e.g., onClear
}

export const FoodSearchBar: React.FC<FoodSearchBarProps> = ({
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search food database..."
        placeholderTextColor="#999"
        clearButtonMode="while-editing"
        // Add other relevant TextInput props like autoCapitalize, autoCorrect, etc.
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light background for the search bar
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16, // Add margin below the search bar
    height: 45, // Fixed height
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%', // Ensure input fills height
  },
});
