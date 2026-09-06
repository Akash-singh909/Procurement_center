import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AGRI_GREEN = '#2E7D32';
const WHITE = '#FFFFFF';
const MEDIUM_GRAY = '#E0E0E0';
const DARK_TEXT = '#212121';
const MEDIUM_TEXT = '#757575';

export default function Index() {
  const router = useRouter();

  const handleRoleSelect = (role) => {
    if (role === 'farmer') {
      router.push('/farmer/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <MaterialCommunityIcons name="tractor" size={80} color={AGRI_GREEN} />
        </View>
        <Text style={styles.appName}>KisanSewa</Text>
        <Text style={styles.tagline}>Smart Procurement Queue Management</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('farmer')}
          activeOpacity={0.8}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="person-outline" size={35} color={AGRI_GREEN} />
          </View>
          <Text style={styles.roleTitle}>Farmer</Text>
          {/* <Text style={styles.roleSubtitle}>Book procurement slots, track queue status, get QR tokens</Text> */}
          <Ionicons name="chevron-forward-outline" size={25} color={MEDIUM_TEXT} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('admin')}
          activeOpacity={0.8}
        >
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="qrcode-scan" size={35} color={AGRI_GREEN} />
          </View>
          <Text style={styles.roleTitle}>Admin</Text>
          {/* <Text style={styles.roleSubtitle}>Scan farmer QR codes, manage live queue, track arrivals</Text> */}
          <Ionicons name="chevron-forward-outline" size={10} color={MEDIUM_TEXT} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>KisanSewa Policy © 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: AGRI_GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: DARK_TEXT,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: MEDIUM_TEXT,
    marginTop: 4,
    fontWeight: '400',
  },
  cardContainer: {
    width: '100%',
    marginBottom: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: MEDIUM_GRAY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: MEDIUM_TEXT,
    flex: 1,
    lineHeight: 20,
    
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: MEDIUM_TEXT,
    fontWeight: '500',
  },
});
