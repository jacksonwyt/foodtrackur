import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SettingsItemData {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
}

interface SettingsListItemProps {
  item: SettingsItemData;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ item }) => {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={item.icon} size={24} color="#333" />
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <View style={styles.settingRight}>
        {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff', // Ensure background for touchable area
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Increased gap
  },
  settingLabel: {
    fontSize: 16,
    color: '#111',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
});

export default SettingsListItem; 