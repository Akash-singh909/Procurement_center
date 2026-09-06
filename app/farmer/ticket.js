import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import useStore from '../../store/useStore';

const AGRI_GREEN = '#2E7D32';
const AGRI_GREEN_LIGHT = '#4CAF50';
const WHITE = '#FFFFFF';
const LIGHT_GRAY = '#F5F5F5';
const MEDIUM_GRAY = '#E0E0E0';
const DARK_TEXT = '#212121';
const MEDIUM_TEXT = '#757575';

const STEPS = [
  { key: 'Booked', label: 'Booked', icon: 'calendar-outline' },
  { key: 'Reached', label: 'Reached', icon: 'walk-outline' },
  { key: 'Weighed', label: 'Weighed', icon: 'scale-outline' },
  { key: 'Paid', label: 'Paid', icon: 'cash-outline' },
];

export default function TicketScreen() {
  const router = useRouter();
  const { tokenId } = useLocalSearchParams();
  const { activeToken, getTokenById, updateTokenStatus } = useStore();

  const token = tokenId ? getTokenById(tokenId) : activeToken;

  useEffect(() => {
    // No frozen mutation: no navigation.setOptions() mutation
  }, []);

  if (!token) {
    Alert.alert('Error', 'Token not found', [
      { text: 'OK', onPress: () => router.push('/farmer/dashboard') },
    ]);
    return null;
  }

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCurrentStepIndex = () => {
    return STEPS.findIndex(s => s.key === token.status) !== -1 ? STEPS.findIndex(s => s.key === token.status) : 0;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/farmer/dashboard')}>
          <Ionicons name="chevron-back-outline" size={28} color={DARK_TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Token</Text>
        <TouchableOpacity onPress={() => router.push('/farmer/dashboard')}>
          <Ionicons name="close-outline" size={28} color={MEDIUM_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View>
            <View style={styles.qrContainer}>
              <Svg width={180} height={180} viewBox="0 0 100 100">
                <QRCode size={90} value={token.qrPayload} />
              </Svg>
              <View style={styles.tokenBadge}>
                <Text style={styles.tokenBadgeText}>Token #{token.id.slice(-4)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenId}>{token.id}</Text>
            <View style={styles.tokenStatusBadge}>
              <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.tokenStatus}>{token.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="storefront-outline" size={20} color={AGRI_GREEN} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Mandi</Text>
                <Text style={styles.detailValue}>{token.mandiName}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="leaf-outline" size={20} color={AGRI_GREEN} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Crop</Text>
                <Text style={styles.detailValue}>{token.cropType}</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="scale-outline" size={20} color={AGRI_GREEN} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{token.quantity} Quintals</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color={AGRI_GREEN} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{formatDate(token.dateTime)}</Text>
                <Text style={styles.detailTime}>{formatTime(token.dateTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Tracking Status</Text>
          <View style={styles.timeline}>
            {STEPS.map((step, index) => {
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;
              const isLast = index === STEPS.length - 1;
              return (
                <View key={step.key} style={styles.timelineStep}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.stepCircle, isActive && styles.stepCircleActive, isCurrent && styles.stepCircleCurrent]}>
                      <Ionicons name={step.icon} size={16} color={isActive ? WHITE : MEDIUM_TEXT} />
                    </View>
                    {!isLast && <View style={[styles.stepLine, isActive && styles.stepLineActive]} />}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{step.label}</Text>
                    {isCurrent && <Text style={styles.stepStatus}>Current Status</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/farmer/dashboard')} activeOpacity={0.8}>
            <Ionicons name="home-outline" size={20} color={AGRI_GREEN} />
            <Text style={styles.actionButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Scan this QR at Mandi entrance for smooth processing</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_GRAY },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, backgroundColor: WHITE, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: DARK_TEXT },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, alignItems: 'center' },
  card: { backgroundColor: WHITE, borderRadius: 24, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6, marginBottom: 20 },
  qrContainer: { alignItems: 'center', marginBottom: 16 },
  tokenBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  tokenBadgeText: { fontSize: 14, fontWeight: '700', color: AGRI_GREEN },
  tokenInfo: { alignItems: 'center' },
  tokenId: { fontSize: 18, fontWeight: '700', color: DARK_TEXT, marginBottom: 8 },
  tokenStatusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  tokenStatus: { fontSize: 14, fontWeight: '600', color: AGRI_GREEN },
  detailsCard: { backgroundColor: WHITE, borderRadius: 20, padding: 20, width: '100%', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  detailContent: { marginLeft: 10 },
  detailLabel: { fontSize: 11, color: MEDIUM_TEXT, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: '600', color: DARK_TEXT, marginTop: 2 },
  detailTime: { fontSize: 13, color: MEDIUM_TEXT, marginTop: 2 },
  timelineContainer: { backgroundColor: WHITE, borderRadius: 20, padding: 20, width: '100%', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: DARK_TEXT, marginBottom: 16 },
  timeline: { paddingLeft: 4 },
  timelineStep: { flexDirection: 'row', marginBottom: 16 },
  timelineLeft: { alignItems: 'center', marginRight: 16 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: LIGHT_GRAY, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: MEDIUM_GRAY },
  stepCircleActive: { backgroundColor: AGRI_GREEN, borderColor: AGRI_GREEN },
  stepCircleCurrent: { borderWidth: 4, borderColor: AGRI_GREEN_LIGHT },
  stepLine: { width: 2, height: 40, backgroundColor: MEDIUM_GRAY, marginTop: 4 },
  stepLineActive: { backgroundColor: AGRI_GREEN },
  stepContent: { flex: 1, justifyContent: 'center' },
  stepLabel: { fontSize: 16, fontWeight: '500', color: MEDIUM_TEXT },
  stepLabelActive: { color: DARK_TEXT, fontWeight: '700' },
  stepStatus: { fontSize: 12, color: AGRI_GREEN, fontWeight: '600', marginTop: 2 },
  actionButtons: { width: '100%', marginBottom: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: WHITE, borderWidth: 1, borderColor: AGRI_GREEN, paddingVertical: 14, borderRadius: 14 },
  actionButtonText: { fontSize: 16, fontWeight: '600', color: AGRI_GREEN, marginLeft: 8 },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 13, color: MEDIUM_TEXT, textAlign: 'center', lineHeight: 20 },
});
