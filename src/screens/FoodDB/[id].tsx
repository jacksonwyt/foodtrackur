import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import { useFoodDBItem } from '../../hooks/useFoodDBItem';
import { useFoodDBItemNavigation } from '../../hooks/useFoodDBItemNavigation';

const FoodDBItemScreen: React.FC = () => {
  const { id, foodItem, isLoading, error } = useFoodDBItem();
  const { goBack, navigateToEdit } = useFoodDBItemNavigation();

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Go Back" onPress={goBack} />
      </View>
    );
  }

  if (!foodItem) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Food item not found.</Text>
        <Button title="Go Back" onPress={goBack} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{foodItem.name}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailItem}>Food ID: {foodItem.id}</Text>
        <Text style={styles.detailItem}>Calories: {foodItem.calories} kcal</Text>
        <Text style={styles.detailItem}>Protein: {foodItem.protein} g</Text>
        <Text style={styles.detailItem}>Carbs: {foodItem.carbs} g</Text>
        <Text style={styles.detailItem}>Fat: {foodItem.fat} g</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => navigateToEdit(foodItem.id)} />
        <Button title="Back" onPress={goBack} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  }
});

export default FoodDBItemScreen; 