import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeightFormData } from '../../hooks/useWeightFormData';
import { useWeightHistoryData } from '../../hooks/useWeightHistoryData';
import { useWeightDerivedData } from '../../hooks/useWeightDerivedData';
import { WeightChartCard } from '../../components/weight/WeightChartCard';
import { WeightHistoryItem } from '../../components/weight/WeightHistoryItem';

const WeightScreen: React.FC = () => {
  const {
    weight,
    setWeight,
    note,
    setNote,
    isFormValid,
    resetForm,
  } = useWeightFormData();

  const {
    weightHistory,
    addWeightEntry,
  } = useWeightHistoryData();

  const {
    chartData,
    weightTrend,
    currentWeight,
    history,
  } = useWeightDerivedData(weightHistory);

  const validForm = isFormValid();

  const handleLogWeight = () => {
    const numericWeight = parseFloat(weight);
    if (validForm && !isNaN(numericWeight)) {
      addWeightEntry(numericWeight, note);
      resetForm();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Weight Tracking</Text>

        <WeightChartCard
          chartData={chartData}
          weightTrend={weightTrend}
          currentWeight={currentWeight}
        />

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Log Today's Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight"
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note about your weigh-in"
              placeholderTextColor="#999"
              multiline
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>History</Text>
        <View style={styles.history}>
          {history.map((entry) => (
            <WeightHistoryItem key={entry.id} entry={entry} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !validForm && styles.buttonDisabled]}
          onPress={handleLogWeight}
          disabled={!validForm}
        >
          <Text style={styles.buttonText}>Log Weight</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  noteInput: {
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  history: {
    gap: 12,
    marginBottom: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WeightScreen; 