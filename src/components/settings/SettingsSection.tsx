import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SettingsListItem, { SettingsItemData } from './SettingsListItem';

interface SettingsSectionProps {
  title: string;
  items: SettingsItemData[];
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionItemsContainer}>
      {items.map((item, index) => (
        <SettingsListItem key={index} item={item} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24, // Reduced margin slightly
  },
  sectionTitle: {
    fontSize: 16, // Smaller section title
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
    paddingHorizontal: 4, // Slight horizontal padding
  },
  sectionItemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d0d0d0',
    overflow: 'hidden', // Clip items to rounded border
    paddingHorizontal: 16, // Padding inside the container
  },
});

export default SettingsSection; 