import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../../components/Screen'; // Adjust path as necessary
import { RootStackParamList } from '../../types/navigation'; // Adjust path as necessary

// Define the navigation prop type for this screen
type FoodLogHubNavigationProp = StackNavigationProp<RootStackParamList, 'FoodLogHub'>;

const FoodLogHubScreen: React.FC = () => {
  const navigation = useNavigation<FoodLogHubNavigationProp>();

  const navigateToSearch = () => {
    // Navigate to the actual FoodSearch route
    navigation.navigate('FoodSearch');
  };

  const navigateToScan = () => {
    navigation.navigate('Scan'); // Navigate to the existing Scan screen
  };

  const navigateToCreate = () => {
    navigation.navigate('AddMeal'); // Navigate to the AddMeal screen (FoodDB/add.tsx)
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Log Food</Text>
        <Text style={styles.subtitle}>How would you like to add food?</Text>

        <TouchableOpacity style={styles.button} onPress={navigateToSearch}>
          <Text style={styles.buttonText}>Search Food Database</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToScan}>
          <Text style={styles.buttonText}>Scan Food with AI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToCreate}>
          <Text style={styles.buttonText}>Create Custom Food</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    width: '85%',
    alignItems: 'center',
    gap: 20, // Add space between elements
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF', // Example blue color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default FoodLogHubScreen; 