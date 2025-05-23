import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {WeightStackParamList} from '../../types/navigation';
import {useWeightHistoryData} from '../../hooks/useWeightHistoryData';
import {useWeightDerivedData} from '../../hooks/useWeightDerivedData';
import {WeightChartCard} from '../../components/weight/WeightChartCard';
import {WeightHistoryItem} from '../../components/weight/WeightHistoryItem';

// Added prop type
type WeightScreenProps = NativeStackScreenProps<
  WeightStackParamList,
  'WeightMain'
>;

const WeightScreen: React.FC<WeightScreenProps> = ({navigation, route}) => {
  // const navigation = useNavigation<NativeStackNavigationProp<WeightStackParamList>>(); // No longer needed, use prop

  const {weightHistory} = useWeightHistoryData();

  const {chartData, weightTrend, currentWeight, history} =
    useWeightDerivedData(weightHistory);

  const navigateToLogWeight = () => {
    navigation.navigate('LogWeight');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Weight Progress</Text>

        <WeightChartCard
          chartData={chartData}
          weightTrend={weightTrend}
          currentWeight={currentWeight}
        />

        <Text style={styles.sectionTitle}>History</Text>
        <View style={styles.historyListContainer}>
          {history.length > 0 ? (
            history.map(entry => (
              <WeightHistoryItem key={entry.id.toString()} entry={entry} />
            ))
          ) : (
            <Text style={styles.emptyHistoryText}>
              No weight entries yet. Log your first weight!
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={navigateToLogWeight}>
          <Text style={styles.buttonText}>Log New Weight</Text>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#343a40',
  },
  historyListContainer: {
    marginBottom: 20,
  },
  emptyHistoryText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 20,
    marginBottom: 20,
  },
  history: {
    gap: 12,
    marginBottom: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default WeightScreen;
