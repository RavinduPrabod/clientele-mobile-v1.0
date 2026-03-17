import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import AuthService from "../services/AuthService";
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from "@/components/shared/headerOption";
import { UserStorage } from "@/lib/userStorage";
import * as Device from "expo-device";
import { Bold } from "lucide-react-native";
import { useCart } from "@/lib/cartContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const [userName, setUserName] = React.useState<string | null>(null);
  const [companyName, setcompanyName] = React.useState<string | null>(null);
  const [branchName, setBranchName] = React.useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = React.useState<string>("");
  const [isPageDisabled, setIsPageDisabled] = React.useState(false);
  const { tempCart, clearCart } = useCart();

  React.useEffect(() => {
    loadProfileDetails();
  }, []);

  const loadProfileDetails = async () => {
    try {
      const currentBranch = await UserStorage.getSelectedBranch();

      setUserName(currentBranch?.userId || "Unknown User");
      setcompanyName(currentBranch?.companyName || "N/A");
      setBranchName(currentBranch?.locationName || "N/A");

      const info = `${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? ""}`;
      const os = `${Device.osName ?? ""} ${Device.osVersion ?? ""}`;
      setDeviceInfo(`${info.trim()} • ${os.trim()}`);
    } catch (error) {
      console.error("Error loading profile details:", error);
    }
  };

  function handleSwitchShop() {
    AuthService.logout();
    router.push("/pages/switch-company-form");
  }

  function handleRegistedDevice() {
    router.push("/pages/device-registration");
  }

  function handleAssignedCompanies() {
    router.push("/pages/assigned-companies");
  }

  function cleanSignout() {
    clearCart();
    setIsPageDisabled(false);
    AuthService.logout();
    router.replace("/");
  }

function handleSignOut() {
  const initializePage = async () => {
    // Fixed condition: should be > 0 (cart has items), not < 0
    if (tempCart.length === 0) {
      cleanSignout();
    } else {
      // Fixed string interpolation
      const cartType = tempCart[0].type === 1 ? "purchase" : "sales";

      Alert.alert(
        'Cart Validation',
        `Cart already has ${cartType} items. Do you want to clear it?`,
        [
          {
            text: 'No',
            onPress: () => {
              // Do nothing, just dismiss alert
              router.back();
            },
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => {
              // Use setTimeout to defer the action after Alert dismisses
              setTimeout(() => {
                cleanSignout();
              }, 100);
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  initializePage();
}

  return (
    <>
      <Stack.Screen
        options={{
          ...getScreenOptions(colorScheme ?? 'light', { hideBackButton: false, pageTitle: 'Profile' }),
          gestureEnabled: false,
        }}
      />
      <View
        className="flex-1 bg-background"
        style={{ marginTop: 120 }}
        pointerEvents={isPageDisabled ? 'none' : 'auto'}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            {/* User Info */}
            <View className="bg-card rounded-xl p-4 mb-5 border border-border">
              <View className="flex-row items-center mb-2">
                <Text style={styles.userIcon}>👤</Text>
                <Text className="text-foreground text-base font-semibold" style={{ fontSize: 20 }}>{userName}</Text>
              </View>
              <View className="pl-2">
                <Text className="text-foreground text-sm" style={{ textAlign: 'left' }}>
                  🏢 <Text style={{ fontSize: 15, fontWeight: 'semibold' }}>{companyName}</Text> 📍{branchName}
                </Text>
              </View>
            </View>

            {/* Main Options */}
            <Pressable
              className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border"
              onPress={handleSwitchShop}>
              <Text style={styles.optionIcon}>🔄</Text>
              <Text className="text-foreground text-base font-semibold">Switch Shop</Text>
            </Pressable>

            {/* ✅ Only visible to admin
            {userName?.toLowerCase() === "admin" && (
              <Pressable
                className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border"
                onPress={handleRegistedDevice}>
                <Text style={styles.optionIcon}>📱</Text>
                <Text className="text-foreground text-base font-semibold">Registered Devices</Text>
              </Pressable>
            )}

            <Pressable className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border"
              onPress={handleAssignedCompanies}>
              <Text style={styles.optionIcon}>🏢</Text>
              <Text className="text-foreground text-base font-semibold">Assigned Companies</Text>
            </Pressable>

            <Pressable className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border">
              <Text style={styles.optionIcon}>🔒</Text>
              <Text className="text-foreground text-base font-semibold">Password Reset</Text>
            </Pressable> */}

            {/* Bottom Options */}
            {/* <Pressable className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border">
              <Text style={styles.optionIcon}>❓</Text>
              <Text className="text-foreground text-base font-semibold">Help Center</Text>
            </Pressable>

            <Pressable className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border">
              <Text style={styles.optionIcon}>ℹ️</Text>
              <Text className="text-foreground text-base font-semibold">About</Text>
            </Pressable> */}

            <Pressable
              className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border"
              onPress={handleSignOut}>
              <Text style={styles.optionIcon}>↩️</Text>
              <Text className="text-foreground text-base font-semibold">Sign Out</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  content: {
    padding: 16,
  },
  userIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
});
