import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface FoodPrediction {
  name: string;
  confidence: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const ScanResultsScreen: React.FC = () => {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [predictions, setPredictions] = useState<FoodPrediction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUri) {
      setError('No image provided');
      setIsAnalyzing(false);
      return;
    }

    // Simulate API call to analyze food image
    setTimeout(() => {
      setPredictions([
        {
          name: 'Grilled Chicken Salad',
          confidence: 0.92,
          calories: 350,
          macros: {
            protein: 32,
            carbs: 12,
            fat: 18,
          },
        },
        {
          name: 'Caesar Salad',
          confidence: 0.85,
          calories: 290,
          macros: {
            protein: 22,
            carbs: 15,
            fat: 16,
          },
        },
      ]);
      setIsAnalyzing(false);
    }, 2000);
  }, [imageUri]);

  const handleFoodSelect = (food: FoodPrediction) => {
    // Here you would typically log the food
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Results</Text>
      </View>

      <ScrollView style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color="#FF3B30" />
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: imageUri as string }}
              style={styles.image}
              resizeMode="cover"
            />

            {isAnalyzing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Analyzing your food...</Text>
              </View>
            ) : (
              <View style={styles.results}>
                <Text style={styles.sectionTitle}>We found these matches:</Text>
                {predictions.map((food, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.foodCard}
                    onPress={() => handleFoodSelect(food)}
                  >
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.confidence}>
                        {Math.round(food.confidence * 100)}% match
                      </Text>
                    </View>
                    
                    <View style={styles.nutritionInfo}>
                      <Text style={styles.calories}>{food.calories} cal</Text>
                      <View style={styles.macros}>
                        <Text style={styles.macro}>P: {food.macros.protein}g</Text>
                        <Text style={styles.macro}>C: {food.macros.carbs}g</Text>
                        <Text style={styles.macro}>F: {food.macros.fat}g</Text>
                      </View>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {!isAnalyzing && !error && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/food/add')}
          >
            <Text style={styles.buttonText}>Add Food Manually</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  results: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 14,
    color: '#666',
  },
  nutritionInfo: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  calories: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macro: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#000',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default ScanResultsScreen; 