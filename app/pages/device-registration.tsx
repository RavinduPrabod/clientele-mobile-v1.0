// app/pages/device-registration.tsx
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, StyleSheet, View, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';

// Type definition for device
type Device = {
  id: string;
  userId: string;
  deviceType: string;
  macAddress: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
};

// Mock data - replace with your API call
const mockDevices: Device[] = [
  {
    id: '1',
    userId: 'USR001',
    deviceType: 'Android Phone',
    macAddress: '00:1B:44:11:3A:B7',
    requestDate: '2025-01-15',
    status: 'pending',
  },
  {
    id: '2',
    userId: 'USR002',
    deviceType: 'iPhone',
    macAddress: 'A4:83:E7:2F:5C:1D',
    requestDate: '2025-01-14',
    status: 'pending',
  },
  {
    id: '3',
    userId: 'USR003',
    deviceType: 'Android Tablet',
    macAddress: '6C:AD:F8:9B:2E:4A',
    requestDate: '2025-01-13',
    status: 'pending',
  },{
    id: '4',
    userId: 'USR004',
    deviceType: 'PC',
    macAddress: '6C:AD:F8:9B:2E:4A',
    requestDate: '2025-01-13',
    status: 'pending',
  },
];

export default function DeviceRegistration() {
  const { colorScheme } = useColorScheme();
  const [devices, setDevices] = React.useState<Device[]>(mockDevices);
  const [loading, setLoading] = React.useState<string | null>(null);

  // Load devices from API
  React.useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      // TODO: Replace with your API call
      // const response = await DeviceService.getPendingDevices();
      // setDevices(response.data);
      
      // For now, using mock data
      setDevices(mockDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Error', 'Failed to load devices');
    }
  };

  const handleApprove = async (deviceId: string) => {
    setLoading(deviceId);
    try {
      // TODO: Replace with your API call
      // await DeviceService.approveDevice(deviceId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === deviceId
            ? { ...device, status: 'approved' as const }
            : device
        )
      );
      
      Alert.alert('Success', 'Device approved successfully');
    } catch (error) {
      console.error('Error approving device:', error);
      Alert.alert('Error', 'Failed to approve device');
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async (deviceId: string) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this device registration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setLoading(deviceId);
            try {
              // TODO: Replace with your API call
              // await DeviceService.removeDevice(deviceId);
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 500));
              
              setDevices(prevDevices =>
                prevDevices.filter(device => device.id !== deviceId)
              );
              
              Alert.alert('Success', 'Device removed successfully');
            } catch (error) {
              console.error('Error removing device:', error);
              Alert.alert('Error', 'Failed to remove device');
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType.toLowerCase().includes('iphone')) return '📱';
    if (deviceType.toLowerCase().includes('android')) return '📱';
    if (deviceType.toLowerCase().includes('tablet')) return '📋';
    return '📱';
  };

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light')} />
      <View className="flex-1 bg-background" style={{ marginTop: 110 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text className="text-foreground text-3xl font-bold mb-2">
              Device Registration
            </Text>
            <Text className="text-muted-foreground text-sm">
              Approve or remove pending device registrations
            </Text>
          </View>

          {/* Devices List */}
          <View style={styles.contentContainer}>
            {devices.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📱</Text>
                <Text className="text-muted-foreground text-base text-center mt-4">
                  No pending device registrations
                </Text>
              </View>
            ) : (
              devices.map((device) => (
                <View
                  key={device.id}
                  className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-sm"
                >
                  {/* Device Header */}
                  <View style={styles.deviceHeader}>
                    <View className="w-12 h-12 rounded-full bg-muted justify-center items-center">
                      <Text style={styles.deviceIcon}>
                        {getDeviceIcon(device.deviceType)}
                      </Text>
                    </View>
                    <View style={styles.deviceHeaderText}>
                      <Text className="text-foreground text-lg font-bold">
                        {device.deviceType}
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        Requested on {device.requestDate}
                      </Text>
                    </View>
                  </View>

                  {/* Device Details */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text className="text-muted-foreground text-xs font-medium mb-1">
                          User ID
                        </Text>
                        <Text className="text-foreground text-sm font-semibold">
                          {device.userId}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text className="text-muted-foreground text-xs font-medium mb-1">
                          Device Type
                        </Text>
                        <Text className="text-foreground text-sm font-semibold">
                          {device.deviceType}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text className="text-muted-foreground text-xs font-medium mb-1">
                          MAC Address
                        </Text>
                        <Text className="text-foreground text-sm font-semibold font-mono">
                          {device.macAddress}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  {device.status === 'pending' && (
                    <View style={styles.actionButtons}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.button,
                          styles.approveButton,
                          pressed && styles.buttonPressed,
                          loading === device.id && styles.buttonDisabled,
                        ]}
                        onPress={() => handleApprove(device.id)}
                        disabled={loading === device.id}
                      >
                        <Text style={styles.approveButtonText}>
                          {loading === device.id ? '⏳ Processing...' : '✓ Approve'}
                        </Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.button,
                          styles.removeButton,
                          pressed && styles.buttonPressed,
                          loading === device.id && styles.buttonDisabled,
                        ]}
                        onPress={() => handleRemove(device.id)}
                        disabled={loading === device.id}
                      >
                        <Text style={styles.removeButtonText}>
                          {loading === device.id ? '⏳ Processing...' : '✕ Remove'}
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {/* Status Badge */}
                  {device.status !== 'pending' && (
                    <View style={styles.statusBadge}>
                      <Text
                        style={[
                          styles.statusText,
                          device.status === 'approved'
                            ? styles.approvedStatus
                            : styles.rejectedStatus,
                        ]}
                      >
                        {device.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.3,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceIcon: {
    fontSize: 24,
  },
  deviceHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  detailsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
  },
  detailItem: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  removeButton: {
    backgroundColor: '#ef4444',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  approveButtonText: {
    color: '#45c00cff',
    fontSize: 15,
    fontWeight: '700',
  },
  removeButtonText: {
    color: '#d21414ff',
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  approvedStatus: {
    color: '#10b981',
  },
  rejectedStatus: {
    color: '#ef4444',
  },
});