import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useStore from '../../store/useStore';

const AGRI_GREEN = '#2E7D32';
const WHITE = '#FFFFFF';
const LIGHT_GRAY = '#F5F5F5';
const MEDIUM_GRAY = '#E0E0E0';
const DARK_TEXT = '#212121';
const MEDIUM_TEXT = '#757575';
const RED = '#D32F2F';
const ORANGE = '#F57C00';
const GREEN = '#388E3C';

function MandiCard({ item }) {
  const router = useRouter();
  const getCapacityColor = (current, capacity) => {
    const p = (current / capacity) * 100;
    if (p >= 80) return RED;
    if (p >= 50) return ORANGE;
    return GREEN;
  };
  const getCapacityLabel = (current, capacity) => {
    const p = Math.round((current / capacity) * 100);
    if (p >= 80) return 'High';
    if (p >= 50) return 'Medium';
    return 'Low';
  };
  const capacityColor = getCapacityColor(item.currentQueue, item.capacity);
  const capacityLabel = getCapacityLabel(item.currentQueue, item.capacity);
  const percentage = Math.round((item.currentQueue / item.capacity) * 100);

  return (
    <View style={styles.mandiCard} key={item.id}>
      <View style={styles.cardHeader}>
        <View style={styles.mandiIcon}>
          <MaterialCommunityIcons name="store" size={28} color={AGRI_GREEN} />
        </View>
        <View style={styles.mandiInfo}>
          <Text style={styles.mandiName}>{item.name}</Text>
          <Text style={styles.mandiLocation}>
            <Ionicons name="location-outline" size={14} color={MEDIUM_TEXT} />{' '}{item.location}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.currentQueue}</Text>
          <Text style={styles.statLabel}>Current Queue</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.capacity}</Text>
          <Text style={styles.statLabel}>Daily Capacity</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <View style={styles.capacityBadge}>
            <View style={[styles.capacityDot, { backgroundColor: capacityColor }]} />
            <Text style={[styles.capacityText, { color: capacityColor }]}>
              {capacityLabel} ({percentage}%)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cropsRow}>
        <Text style={styles.cropsLabel}>Accepted Crops:</Text>
        <View style={styles.cropsTags}>
          {item.crops.map((crop, i) => (
            <View key={i} style={styles.cropTag}>
              <Text style={styles.cropTagText}>{crop}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push(`/farmer/book?mandiId=${item.id}`)}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-plus-outline" size={20} color={WHITE} />
        <Text style={styles.bookButtonText}>Book Procurement Slot</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FarmerDashboard() {
  const router = useRouter();
  const { mandis } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderMandi = ({ item, index }) => <MandiCard item={item} index={index} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-outline" size={28} color={DARK_TEXT} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Farmer Dashboard</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.headerSubtitle}>
          <Text style={styles.greeting}>Welcome back, Farmer!</Text>
          <Text style={styles.subtitle}>Select a Mandi to book your procurement slot</Text>
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[AGRI_GREEN]} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={mandis}
            renderItem={renderMandi}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="store-outline" size={64} color={MEDIUM_GRAY} />
                <Text style={styles.emptyText}>No Mandis available</Text>
              </View>
            }
          />
        </ScrollView>
      </View>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/farmer/book')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={WHITE} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_GRAY },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, backgroundColor: WHITE, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerTitle: { flex: 1, fontSize: 24, fontWeight: '800', color: DARK_TEXT, textAlign: 'center' },
  headerSubtitle: { paddingLeft: 44 },
  greeting: { fontSize: 16, fontWeight: '600', color: DARK_TEXT },
  subtitle: { fontSize: 14, color: MEDIUM_TEXT, marginTop: 2 },
  content: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  mandiCard: { backgroundColor: WHITE, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: MEDIUM_GRAY },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  mandiIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  mandiInfo: { flex: 1 },
  mandiName: { fontSize: 20, fontWeight: '700', color: DARK_TEXT },
  mandiLocation: { fontSize: 14, color: MEDIUM_TEXT, marginTop: 2, flexDirection: 'row', alignItems: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: MEDIUM_GRAY, marginBottom: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: DARK_TEXT },
  statLabel: { fontSize: 11, color: MEDIUM_TEXT, marginTop: 2, textAlign: 'center' },
  divider: { width: 1, height: 40, backgroundColor: MEDIUM_GRAY },
  capacityBadge: { flexDirection: 'row', alignItems: 'center' },
  capacityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  capacityText: { fontSize: 12, fontWeight: '600' },
  cropsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  cropsLabel: { fontSize: 13, color: MEDIUM_TEXT, fontWeight: '500', marginRight: 8, marginTop: 2, minWidth: 100 },
  cropsTags: { flex: 1, flexWrap: 'wrap', flexDirection: 'row' },
  cropTag: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  cropTagText: { fontSize: 12, fontWeight: '600', color: AGRI_GREEN },
  bookButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: AGRI_GREEN, paddingVertical: 14, borderRadius: 12 },
  bookButtonText: { fontSize: 16, fontWeight: '700', color: WHITE, marginLeft: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: MEDIUM_TEXT, marginTop: 16 },
  fabContainer: { position: 'absolute', bottom: 30, right: 24 },
  fab: { width: 64, height: 64, borderRadius: 32, backgroundColor: AGRI_GREEN, justifyContent: 'center', alignItems: 'center', shadowColor: AGRI_GREEN, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
});
