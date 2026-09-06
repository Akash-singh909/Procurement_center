import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import useStore from '../../store/useStore';

const AGRI_GREEN = '#2E7D32';
const WHITE = '#FFFFFF';
const LIGHT_GRAY = '#F5F5F5';
const MEDIUM_GRAY = '#E0E0E0';
const DARK_TEXT = '#212121';
const MEDIUM_TEXT = '#757575';
const RED = '#D32F2F';
const CROP_TYPES = ['Wheat', 'Paddy', 'Mustard', 'Maize', 'Cotton', 'Onion', 'Chilli', 'Soybean', 'Barley', 'Gram'];

export default function BookSlot() {
  const router = useRouter();
  const { mandis, bookSlot } = useStore();
  const { mandiId } = useLocalSearchParams();
  const [selectedMandi, setSelectedMandi] = useState(mandiId || mandis[0]?.id);
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [showMandiPicker, setShowMandiPicker] = useState(false);

  const mandi = mandis.find(m => m.id === selectedMandi);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedMandi) newErrors.mandi = 'Please select a Mandi';
    if (!cropType) newErrors.cropType = 'Please select a crop type';
    if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = 'Please enter a valid quantity';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setSubmitting(true);
    const dateTime = new Date(date);
    dateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
    const token = bookSlot(selectedMandi, cropType, parseFloat(quantity), dateTime.toISOString());
    setSubmitting(false);
    router.push(`/farmer/ticket?tokenId=${token.id}`);
  };

  const formatDate = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const onDateChange = (_event, selectedDate) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (newDate < new Date().setHours(0, 0, 0, 0)) {
        Alert.alert("Invalid Date", "Please select a future date");
        return;
      }
      setDate(newDate);
    }
    setShowDatePicker(false);
  };

  const onTimeChange = (_event, selectedTime) => {
    if (selectedTime) setTime(selectedTime);
    setShowTimePicker(false);
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back-outline" size={28} color={DARK_TEXT} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Book Procurement Slot</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <TouchableOpacity style={[styles.inputWrapper, { borderColor: errors.mandi ? RED : MEDIUM_GRAY }]} onPress={() => setShowMandiPicker(true)}>
            <Ionicons name="storefront-outline" size={22} color={AGRI_GREEN} style={styles.inputIcon} />
            <View style={styles.selectContent}><Text style={styles.selectLabel}>Select Mandi</Text><Text style={styles.selectValue}>{mandi?.name || 'Choose a Mandi'}</Text></View>
            <Ionicons name="chevron-down-outline" size={22} color={MEDIUM_TEXT} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.inputWrapper, { borderColor: errors.cropType ? RED : MEDIUM_GRAY }]} onPress={() => setShowCropPicker(true)}>
            <Ionicons name="leaf-outline" size={22} color={AGRI_GREEN} style={styles.inputIcon} />
            <View style={styles.selectContent}><Text style={styles.selectLabel}>Crop Type</Text><Text style={styles.selectValue}>{cropType || 'Select crop type'}</Text></View>
            <Ionicons name="chevron-down-outline" size={22} color={MEDIUM_TEXT} />
          </TouchableOpacity>
          <View style={[styles.inputWrapper, { borderColor: errors.quantity ? RED : MEDIUM_GRAY }]}>
            <Ionicons name="scale-outline" size={22} color={AGRI_GREEN} style={styles.inputIcon} />
            <TextInput style={styles.textInput} placeholder="Enter quantity" value={quantity} onChangeText={setQuantity} keyboardType="decimal-pad" placeholderTextColor={MEDIUM_TEXT} />
            <Text style={styles.inputUnit}>Quintals</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.halfInput}>
              <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={22} color={AGRI_GREEN} style={styles.inputIcon} />
                <View style={styles.selectContent}><Text style={styles.selectLabel}>Date</Text><Text style={styles.selectValue}>{formatDate(date)}</Text></View>
                <Ionicons name="chevron-down-outline" size={22} color={MEDIUM_TEXT} />
              </TouchableOpacity>
            </View>
            <View style={styles.halfInput}>
              <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowTimePicker(true)}>
                <Ionicons name="time-outline" size={22} color={AGRI_GREEN} style={styles.inputIcon} />
                <View style={styles.selectContent}><Text style={styles.selectLabel}>Time Slot</Text><Text style={styles.selectValue}>{formatTime(time)}</Text></View>
                <Ionicons name="chevron-down-outline" size={22} color={MEDIUM_TEXT} />
              </TouchableOpacity>
            </View>
          </View>
          {errors.mandi && <Text style={styles.errorText}>{errors.mandi}</Text>}
          {errors.cropType && <Text style={styles.errorText}>{errors.cropType}</Text>}
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
          <View style={styles.mandiInfoCard}>
            <Text style={styles.infoTitle}><MaterialCommunityIcons name="information-outline" size={18} color={AGRI_GREEN} /> Mandi Information</Text>
            {mandi && (<>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Capacity:</Text><Text style={styles.infoValue}>{mandi.capacity} quintals/day</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Current Queue:</Text><Text style={styles.infoValue}>{mandi.currentQueue} farmers waiting</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Accepted Crops:</Text><Text style={styles.infoValue}>{mandi.crops.join(', ')}</Text></View>
            </>)}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.submitButton, submitting && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={submitting} activeOpacity={0.8}>
            {submitting ? <ActivityIndicator size="large" color={WHITE} /> : <><Ionicons name="checkmark-circle-outline" size={24} color={WHITE} /><Text style={styles.submitButtonText}>Book Slot & Generate Token</Text></>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showDatePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}><Ionicons name="close-outline" size={24} color={MEDIUM_TEXT} /></TouchableOpacity>
            </View>
            <DateTimePicker testID="datePicker" value={date} mode="date" display="spinner" onChange={onDateChange} minimumDate={new Date()} style={styles.datePicker} />
          </View>
        </View>
      )}

      {showTimePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time Slot</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}><Ionicons name="close-outline" size={24} color={MEDIUM_TEXT} /></TouchableOpacity>
            </View>
            <DateTimePicker testID="timePicker" value={time} mode="time" display="spinner" onChange={onTimeChange} is24Hour={false} style={styles.datePicker} />
          </View>
        </View>
      )}

      {showCropPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Crop Type</Text>
              <TouchableOpacity onPress={() => setShowCropPicker(false)}><Ionicons name="close-outline" size={24} color={MEDIUM_TEXT} /></TouchableOpacity>
            </View>
            <FlatList data={CROP_TYPES} keyExtractor={(item) => item} renderItem={({ item }) => (
              <TouchableOpacity style={[styles.cropOption, cropType === item && styles.cropOptionSelected]} onPress={() => { setCropType(item); setShowCropPicker(false); }}>
                <Text style={[styles.cropOptionText, cropType === item && styles.cropOptionTextSelected]}>{item}</Text>
              </TouchableOpacity>
            )} numColumns={2} contentContainerStyle={styles.cropOptionsGrid} />
          </View>
        </View>
      )}

      {showMandiPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Mandi</Text>
              <TouchableOpacity onPress={() => setShowMandiPicker(false)}><Ionicons name="close-outline" size={24} color={MEDIUM_TEXT} /></TouchableOpacity>
            </View>
            <FlatList data={mandis} keyExtractor={(item) => item.id} renderItem={({ item }) => (
              <TouchableOpacity style={styles.mandiOption} onPress={() => { setSelectedMandi(item.id); setShowMandiPicker(false); }}>
                <View style={styles.mandiOptionIcon}><MaterialCommunityIcons name="store" size={24} color={AGRI_GREEN} /></View>
                <View style={styles.mandiOptionInfo}>
                  <Text style={styles.mandiOptionName}>{item.name}</Text>
                  <Text style={styles.mandiOptionLocation}>{item.location} • Queue: {item.currentQueue}</Text>
                </View>
              </TouchableOpacity>
            )} />
          </View>
        </View>
      )}

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_GRAY },
  scrollContent: { paddingBottom: 120 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, backgroundColor: WHITE, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: DARK_TEXT, textAlign: 'center', marginLeft: -12 },
  formContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: DARK_TEXT },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  inputIcon: { marginRight: 14 },
  selectContent: { flex: 1, justifyContent: 'center' },
  selectLabel: { fontSize: 11, color: MEDIUM_TEXT, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  selectValue: { fontSize: 16, color: DARK_TEXT, fontWeight: '500', marginTop: 2 },
  textInput: { flex: 1, fontSize: 16, color: DARK_TEXT, paddingVertical: 4 },
  inputUnit: { fontSize: 16, color: MEDIUM_TEXT, marginLeft: 8 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  halfInput: { width: '48%' },
  errorText: { fontSize: 12, color: RED, marginTop: -12, marginBottom: 16, marginLeft: 4 },
  mandiInfoCard: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 16, marginTop: 8, borderWidth: 1, borderColor: '#C8E6C9' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: AGRI_GREEN, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: 14, color: MEDIUM_TEXT },
  infoValue: { fontSize: 14, fontWeight: '600', color: DARK_TEXT },
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 20, backgroundColor: LIGHT_GRAY, borderTopWidth: 1, borderTopColor: MEDIUM_GRAY },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: AGRI_GREEN, paddingVertical: 18, borderRadius: 14, shadowColor: AGRI_GREEN, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  submitButtonDisabled: { backgroundColor: '#A5D6A7', shadowOpacity: 0.1 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: WHITE, marginLeft: 10 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
  modalContainer: { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%', width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: MEDIUM_GRAY },
  modalTitle: { fontSize: 18, fontWeight: '700', color: DARK_TEXT },
  datePicker: { paddingHorizontal: 20, paddingBottom: 20 },
  mandiOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: MEDIUM_GRAY },
  mandiOptionIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  mandiOptionInfo: { flex: 1 },
  mandiOptionName: { fontSize: 16, fontWeight: '600', color: DARK_TEXT },
  mandiOptionLocation: { fontSize: 13, color: MEDIUM_TEXT, marginTop: 2 },
  cropOptionsGrid: { paddingHorizontal: 20, paddingBottom: 20 },
  cropOption: { flex: 1, backgroundColor: WHITE, borderWidth: 1.5, borderColor: MEDIUM_GRAY, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', margin: 4 },
  cropOptionSelected: { borderColor: AGRI_GREEN, backgroundColor: '#E8F5E9' },
  cropOptionText: { fontSize: 14, fontWeight: '600', color: DARK_TEXT },
  cropOptionTextSelected: { color: AGRI_GREEN },
});
