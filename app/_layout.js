// KisanSewa — Root layout (expo-router, file-based)
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import './global.css';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          headerStyle: { backgroundColor: '#2E7D32' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#F5F7F4' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="farmer/dashboard" options={{ title: 'Farmer Dashboard' }} />
        <Stack.Screen name="farmer/book" options={{ title: 'Book a Slot' }} />
        <Stack.Screen name="farmer/ticket" options={{ title: 'Your Token' }} />
        <Stack.Screen name="admin/dashboard" options={{ title: 'Admin Dashboard' }} />
        <Stack.Screen name="admin/scanner" options={{ title: 'Scan QR' }} />
      </Stack>
      <StatusBar style="light" backgroundColor="#2E7D32" />
    </>
  );
}
