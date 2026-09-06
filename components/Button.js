import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export const Button = ({ title, onPress, variant = 'primary', disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`px-6 py-3 rounded-xl ${variant === 'primary' ? 'bg-agri' : 'bg-gray-200'} ${disabled ? 'opacity-50' : ''}`}
    activeOpacity={0.8}
  >
    <Text className={`text-center font-bold ${variant === 'primary' ? 'text-white' : 'text-dark'}`}>{title}</Text>
  </TouchableOpacity>
);
