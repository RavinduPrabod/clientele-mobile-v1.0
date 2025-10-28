import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import DeviceService from '../services/DeviceService';
import { Stack } from 'expo-router';
import { getScreenOptions } from '@/components/shared/headerOption';
import { useColorScheme } from 'nativewind';
import { RegisteredDevice } from '../Types/user.types';
import { Text } from '@/components/ui/text';

const DeviceRegistrationsPage = () => {
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await DeviceService.getRegisteredDevices(0);

      // Map API response to match interface
      const mappedData = response.data.map((item: any) => ({
        Id: item.id,
        UserId: item.userId,
        Identifier: item.identifier,
        DeviceType: item.deviceType,
        RequestDateTime: item.requestDateTime,
        Status: item.status,
      }));

      setDevices(mappedData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch devices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveDevice = async (deviceId: number) => {
    try {

      // Find the device first and use it immediately
      const device = devices.find(device => device.Id === deviceId);

      if (!device) {
        Alert.alert('Error', 'Device not found');
        return;
      }

      // Create updated device object with new status
      const updatedDevice = { ...device, Status: 1 };

      // Use the device we just found, not selectedDevice from state
      const response = await DeviceService.UpdateRegisteredDevice(updatedDevice);

      if (response.statusCode === 200) {
        // Update both devices list and selected device
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.Id === deviceId ? updatedDevice : device
          )
        );
        setSelectedDevice(updatedDevice);
        Alert.alert('Success', 'Device approved successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve device');
      console.error(error);
    }
  };

  const removeDevice = async (deviceId: number) => {
    Alert.alert(
      'Confirm Disable',
      'Are you sure you want to disable this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {

            try {

              // Find the device first and use it immediately
              const device = devices.find(device => device.Id === deviceId);

              if (!device) {
                Alert.alert('Error', 'Device not found');
                return;
              }

              // Create updated device object with new status
              const updatedDevice = { ...device, Status: 2 };

              // Use the device we just found, not selectedDevice from state
              const response = await DeviceService.UpdateRegisteredDevice(updatedDevice);

              if (response.statusCode === 200) {
                // Update both devices list and selected device
                setDevices((prevDevices) =>
                  prevDevices.map((device) =>
                    device.Id === deviceId ? updatedDevice : device
                  )
                );
                setSelectedDevice(updatedDevice);
                Alert.alert('Success', 'Device removed successfully');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove device');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const getDeviceTypeLabel = (type: number) => {
    const types: { [key: number]: string } = {
      1: 'Android',
      2: 'iOS',
      3: 'Web',
    };
    return types[type] || 'Unknown';
  };

  const getStatusLabel = (status: number) => {
    const statuses: { [key: number]: string } = {
      1: 'Approved',
      2: 'Pending',
      3: 'Rejected',
    };
    return statuses[status] || 'Unknown';
  };

  const renderDevice = ({ item }: { item: RegisteredDevice }) => {
    const isApproved = item.Status === 1;

    return (
      <>

        <Stack.Screen
          options={getScreenOptions(colorScheme ?? 'light', {
            pageTitle: 'Device Registration',
            hideBackButton: false,
            showThemeToggle: true
          })}
        />
        <View className="flex-1 bg-background mt-0" >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-card border border-border rounded-2xl p-5 mb-0 shadow-sm">
              <View>
                <View style={styles.row}>
                  <Text style={styles.label}>User ID:</Text>
                  <Text style={styles.value}>{item.UserId}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Unique Key:</Text>
                  <Text style={styles.value}>{item.Identifier}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Device Type:</Text>
                  <Text style={styles.value}>
                    ({getDeviceTypeLabel(item.DeviceType)})
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Request Date Time:</Text>
                  <Text style={styles.value}>
                    {new Date(item.RequestDateTime).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={[styles.value, styles.statusText]}>
                    ({getStatusLabel(item.Status)})
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                {!isApproved && (
                  <TouchableOpacity
                    style={[styles.button, styles.approveButton]}
                    onPress={() => approveDevice(item.Id)}
                  >
                    <Text style={styles.buttonText}>Enable</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.removeButton,
                    !isApproved && styles.buttonDisabled,
                  ]}
                  onPress={() => removeDevice(item.Id)}
                  disabled={!isApproved}
                >
                  <Text style={styles.buttonText}>Disable</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No devices registered</Text>
          </View>
        }
      />
    </View>
  );
};



const styles = StyleSheet.create({

  container2: {
    borderWidth: 1,           // The border thickness
    borderColor: '#007AFF',   // Border color
    borderStyle: 'dashed',    // Make it dashed
    width: '100%',            // Full width of the parent
    padding: 0,              // Optional padding inside
    marginVertical: 10,
    marginTop: 0     // Optional spacing outside
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
  },
  listContainer: {
    padding: 16,
    marginTop: 100,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    width: 140,
  },
  value: {
    fontSize: 14,
    flex: 1,
  },
  statusText: {
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    fontSize: 14,
    color:'#ffffffff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default DeviceRegistrationsPage;