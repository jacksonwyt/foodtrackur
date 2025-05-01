import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { useFoodDetailsData } from '../../hooks/useFoodDetailsData';
import { useFoodDetailsNavigation } from '../../hooks/useFoodDetailsNavigation';
import { FoodDetailsHeader } from '../../components/food/details/FoodDetailsHeader';
import { FoodMainInfo } from '../../components/food/details/FoodMainInfo';
import { FoodMacros } from '../../components/food/details/FoodMacros';
import { FoodIngredients } from '../../components/food/details/FoodIngredients';
import { FoodDetailsFooter } from '../../components/food/details/FoodDetailsFooter';
import { RootStackParamList } from '../../types/navigation';

type FoodDetailsScreenRouteProp = RouteProp<RootStackParamList, 'FoodDetails'>;

const FoodDetailsScreen: React.FC = () => {
  const route = useRoute<FoodDetailsScreenRouteProp>();
  const foodId = route.params.foodId;

  const { food, isLoading, error } = useFoodDetailsData(foodId);
  const { handleGoBack, handleNavigateToEdit } = useFoodDetailsNavigation();

  if (isLoading) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.screen}>
        <FoodDetailsHeader title="Error" onBackPress={handleGoBack} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error loading food details: {error.message}</Text>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  if (!food) {
    return (
      <Screen style={styles.screen}>
        <FoodDetailsHeader title="Not Found" onBackPress={handleGoBack} />
        <View style={[styles.content, styles.centerContent]}>
          <Text style={styles.notFoundText}>Food item not found</Text>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <FoodDetailsHeader title="Food Details" onBackPress={handleGoBack} />
      <ScrollView style={styles.content}>
        <FoodMainInfo food={food} />
        <FoodMacros macros={food.macros} />
        <FoodIngredients ingredients={food.ingredients} />
      </ScrollView>
      <FoodDetailsFooter onEditPress={() => handleNavigateToEdit(food.id)} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodDetailsScreen;