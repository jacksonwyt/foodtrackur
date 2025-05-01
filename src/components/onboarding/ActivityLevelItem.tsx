import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';

interface ActivityLevelItemProps extends TouchableOpacityProps {
  title: string;
  description: string;
  isSelected: boolean;
}

export const ActivityLevelItem: React.FC<ActivityLevelItemProps> = ({
  title,
  description,
  isSelected,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.activityButton,
        isSelected && styles.selectedActivity,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.activityTitle, isSelected && styles.selectedText]}>
        {title}
      </Text>
      <Text
        style={[styles.activityDescription, isSelected && styles.selectedText]}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedActivity: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
}); 