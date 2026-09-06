import React from 'react';
import { View, Text, TextInput } from 'react-native';

export const Card = ({ children, title }) => (
  <View className="bg-white rounded-2xl p-4 shadow-md shadow-black/5 mb-4">
    {title && <Text className="text-xl font-bold text-dark mb-2">{title}</Text>}
    {children}
  </View>
);
