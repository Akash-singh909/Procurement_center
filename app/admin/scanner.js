import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import useStore from '../../store/useStore';

const AGRI_GREEN = '#2E7D32';
const AGRI_GREEN_LIGHT = '#4CAF50';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const DARK_TEXT = '#212121';
const MEDIUM_TEXT = '#757575';

export default function ScannerScreen() {
  const router = useRouter();
  const { scanToken } = useStore();
  const [permission, requestPermission, { isPermissionLoading }] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned || scanning) return;
    setScanning(true);

    try {
      const result = scanToken(data);

      if (result.success) {
        setScanned(true);
        Alert.alert(
          'Token Scanned',
          `Token: ${result.token.id}\nFarmer has reached the Mandi\nMandi: ${result.token.mandiName}\nCrop: ${result.token.cropType}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                setScanning(false);
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Scan Failed',
          result.message,
          [
            { text: 'Try Again', style: 'cancel', onPress: () => setScanning(false) },
            { text: 'Go Back', style: 'destructive', onPress: () => router.back() },
          ]
        );
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert(
        'Scan Error',
        'Unable to process the QR code. Please try again.',
        [
          { text: 'Try Again', style: 'cancel', onPress: () => setScanning(false) },
          { text: 'Go Back', style: 'destructive', onPress: () => router.back() },
        ]
      );
    }
  };

  const handleManualScan = () => {
    router.push('/admin/manual-scan');
  };

  if (isPermissionLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission && requestPermission !== undefined) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.permissionBox}>
          <MaterialCommunityIcons name="camera-off" size={64} color={MEDIUM_TEXT} />
          <Text style={styles.permissionTitle}>Camera Permission Needed</Text>
          <Text style={styles.permissionText}>
            KisanSewa needs camera access to scan farmer QR codes.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!permission?.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.permissionBox}>
          <Ionicons name="lock-closed" size={64} color={MEDIUM_TEXT} />
          <Text style={styles.permissionTitle}>Permission Required</Text>
          <Text style={styles.permissionText}>
            Camera permission is required to scan QR codes.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Request Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={28} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Farmer QR</Text>
        <TouchableOpacity onPress={handleManualScan}>
          <Ionicons name="help-circle-outline" size={24} color={WHITE} />
        </TouchableOpacity>
      </View>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned || scanning ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanWindow}>
            <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, !scanned && styles.statusDotReady]} />
              <Text style={styles.statusText}>
                {scanned ? 'Processing...' : scanning ? 'Scanning...' : 'Place QR code within the frame'}
              </Text>
            </View>
          </View>
        </View>
      </CameraView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleManualScan}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color={AGRI_GREEN} />
          <Text style={styles.footerButtonText}>Enter Token ID Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 14,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: WHITE,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanWindow: {
    width: 260,
    height: 260,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanCorner: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  scanCornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 20,
    borderColor: AGRI_GREEN_LIGHT,
  },
  scanCornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 20,
    borderColor: AGRI_GREEN_LIGHT,
  },
  scanCornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 20,
    borderColor: AGRI_GREEN_LIGHT,
  },
  scanCornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 20,
    borderColor: AGRI_GREEN_LIGHT,
  },
  statusContainer: {
    position: 'absolute',
    bottom: -80,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusDotReady: {
    backgroundColor: AGRI_GREEN,
    shadowColor: AGRI_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  statusText: {
    fontSize: 14,
    color: WHITE,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AGRI_GREEN,
    marginLeft: 8,
  },
  permissionBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: WHITE,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    color: MEDIUM_TEXT,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: AGRI_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
  },
});
