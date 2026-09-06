import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useStore from '../../store/useStore';

const AGRI_GREEN = '#2E7D32';
const AGRI_GREEN_LIGHT = '#4CAF50';
const WHITE = '#FFFFFF';
const LIGHT_GRAY = '#F5F5F5';
const MEDIUM_GRAY = '#E0E0E0';
const DARK_TEXT = '#212121';
const MEDIUM_TEXT = '#757575';
const RED = '#D32F2F';
const ORANGE = '#F57C00';
const BLUE = '#1976D2';

export default function AdminDashboard() {
  const router = useRouter();
  const { mandis, tokens, getAdminStats } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const stats = getAdminStats();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mandi Admin</Text>
          <Text style={styles.headerSubtitle}>Live Queue Management</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={DARK_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[AGRI_GREEN]} />}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <View style={styles.statIcon}><Ionicons name="people-outline" size={32} color={WHITE} /></View>
            <Text style={styles.statValue}>{stats.totalExpectedToday}</Text>
            <Text style={styles.statLabel}>Total Expected Today</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <View style={styles.statIcon}><Ionicons name="time-outline" size={32} color={WHITE} /></View>
            <Text style={styles.statValue}>{stats.currentQueueLength}</Text>
            <Text style={styles.statLabel}>Current Queue</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <View style={styles.statIcon}><Ionicons name="checkmark-done-outline" size={32} color={WHITE} /></View>
            <Text style={styles.statValue}>{stats.reachedToday}</Text>
            <Text style={styles.statLabel}>Reached Today</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <View style={styles.statIcon}><Ionicons name="scale-outline" size={32} color={WHITE} /></View>
            <Text style={styles.statValue}>{stats.weighedToday}</Text>
            <Text style={styles.statLabel}>Weighed Today</Text>
          </View>
        </View>

        <View style={styles.mandiSection}>
          <Text style={styles.sectionTitle}>Mandi Overview</Text>
          {mandis.map((mandi) => {
            const pct = Math.round((mandi.currentQueue / mandi.capacity) * 100);
            const col = pct >= 80 ? RED : pct >= 50 ? ORANGE : AGRI_GREEN;
            return (
              <View key={mandi.id} style={styles.mandiRow}>
                <View style={styles.mandiRowLeft}>
                  <View style={styles.mandiSmallIcon}><MaterialCommunityIcons name="store" size={20} color={AGRI_GREEN} /></View>
                  <View style={styles.mandiRowInfo}>
                    <Text style={styles.mandiRowName}>{mandi.name}</Text>
                    <Text style={styles.mandiRowLocation}>{mandi.location}</Text>
                  </View>
                </View>
                <View style={styles.mandiRowRight}>
                  <View style={styles.capacityBar}>
                    <View style={[styles.capacityFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: col }]} />
                  </View>
                  <Text style={styles.mandiQueue}>{mandi.currentQueue}/{mandi.capacity}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Tokens</Text>
          {tokens.slice(-5).reverse().map((token) => {
            const sc = token.status === 'Booked' ? '#2196F3' : token.status === 'Reached' ? ORANGE : token.status === 'Weighed' ? AGRI_GREEN : '#4CAF50';
            return (
              <View key={token.id} style={styles.tokenRow}>
                <View style={styles.tokenRowLeft}>
                  <View style={styles.tokenIcon}><FontAwesome5 name="seedling" size={16} color={AGRI_GREEN} /></View>
                  <View style={styles.tokenRowInfo}>
                    <Text style={styles.tokenRowId}>{token.id}</Text>
                    <Text style={styles.tokenRowCrop}>{token.cropType} • {token.quantity} QTL</Text>
                  </View>
                </View>
                <View style={[styles.tokenStatusBadge, { backgroundColor: sc + '20' }]}>
                  <Text style={[styles.tokenStatusText, { color: sc }]}>{token.status}</Text>
                </View>
              </View>
            );
          })}
          {tokens.length === 0 && (
            <View style={styles.emptyTokens}>
              <Ionicons name="receipt-outline" size={48} color={MEDIUM_GRAY} />
              <Text style={styles.emptyTokensText}>No tokens booked yet</Text>
            </View>
          )}
        </View>
        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/admin/scanner')} activeOpacity={0.8}>
          <Ionicons name="scan-outline" size={32} color={WHITE} />
          <Text style={styles.fabText}>Scan Farmer QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_GRAY },
  scrollContent: { paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, backgroundColor: WHITE, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: DARK_TEXT, marginBottom: 2 },
  headerSubtitle: { fontSize: 14, color: MEDIUM_TEXT },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  statCard: { width: '48%', borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  statCardBlue: { backgroundColor: BLUE }, statCardRed: { backgroundColor: RED }, statCardOrange: { backgroundColor: ORANGE }, statCardGreen: { backgroundColor: AGRI_GREEN },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '800', color: WHITE, marginBottom: 2 },
  statLabel: { fontSize: 12, color: WHITE, fontWeight: '600', textAlign: 'center', opacity: 0.9 },
  mandiSection: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: DARK_TEXT, marginBottom: 12 },
  mandiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  mandiRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  mandiSmallIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mandiRowInfo: { flex: 1 },
  mandiRowName: { fontSize: 15, fontWeight: '700', color: DARK_TEXT }, mandiRowLocation: { fontSize: 12, color: MEDIUM_TEXT, marginTop: 2 },
  mandiRowRight: { alignItems: 'flex-end', minWidth: 100 },
  capacityBar: { width: 80, height: 6, backgroundColor: MEDIUM_GRAY, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  capacityFill: { height: '100%', borderRadius: 3 },
  mandiQueue: { fontSize: 13, fontWeight: '600', color: DARK_TEXT },
  recentSection: { paddingHorizontal: 16, paddingTop: 8 },
  tokenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: WHITE, borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  tokenRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  tokenIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  tokenRowInfo: { flex: 1 }, tokenRowId: { fontSize: 14, fontWeight: '700', color: DARK_TEXT }, tokenRowCrop: { fontSize: 12, color: MEDIUM_TEXT, marginTop: 2 },
  tokenStatusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }, tokenStatusText: { fontSize: 13, fontWeight: '700' },
  emptyTokens: { alignItems: 'center', paddingVertical: 40 }, emptyTokensText: { fontSize: 14, color: MEDIUM_TEXT, marginTop: 12 },
  spacer: { height: 40 },
  fabContainer: { position: 'absolute', bottom: 30, right: 24 },
  fab: { width: 150, height: 60, borderRadius: 30, backgroundColor: AGRI_GREEN, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: AGRI_GREEN, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  fabText: { fontSize: 14, fontWeight: '700', color: WHITE, marginLeft: 8 },
});
