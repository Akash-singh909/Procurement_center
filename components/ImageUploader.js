import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../app/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const ImageUploader = ({ onUpload }) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop();
      const storageRef = ref(storage, `uploads/${fileName}`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.button}>
      <Ionicons name="image-outline" size={20} color="#2E7D32" />
      <Text style={styles.text}>Upload Image</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { flexDirection: 'row', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  text: { marginLeft: 8, color: '#2E7D32', fontWeight: '600' },
});
