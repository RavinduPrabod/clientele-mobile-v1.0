import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import AuthService from "../services/AuthService";
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from "@/components/shared/headerOption";

export default function ProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  function handleSwitchShop() {
    AuthService.logout();
    router.push('/pages/switch-company-form')
  }

  function handleSignOut() {
    AuthService.logout();
    router.replace('/');
  }

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light', { showProfileButton: false })} />
      <View className="flex-1 bg-background" style={{ marginTop: 60 }}>
        <View style={styles.container}>
          {/* Header */}
          <View className="flex-row items-center py-4 px-3 border-b border-border bg-card">
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text className="text-foreground text-2xl">←</Text>
            </Pressable>
            <Text className="text-foreground text-xl font-bold">👤 Profile</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* User Info */}
            <View className="flex-row items-center bg-card rounded-xl p-4 mb-5 border border-border">
              <Text style={styles.userIcon}>👤</Text>
              <Text className="text-foreground text-base font-semibold">Username</Text>
            </View>

            {/* Main Options */}
            <Pressable
              className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border"
              onPress={handleSwitchShop}>
              <Text style={styles.optionIcon}>🔄</Text>
              <Text className="text-foreground text-base font-semibold">Switch Shop</Text>
            </Pressable>

            <Pressable className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border">
              <Text style={styles.optionIcon}>🔒</Text>
              <Text className="text-foreground text-base font-semibold">Password Reset</Text>
            </Pressable>

            {/* Bottom Options */}
            <Pressable className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border">
              <Text style={styles.optionIcon}>❓</Text>
              <Text className="text-foreground text-base font-semibold">Help Center</Text>
            </Pressable>

            <Pressable className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border">
              <Text style={styles.optionIcon}>ℹ️</Text>
              <Text className="text-foreground text-base font-semibold">About</Text>
            </Pressable>

            <Pressable
              className="flex-row items-center bg-card rounded-xl p-4 mb-3 border border-border"
              onPress={handleSignOut}>
              <Text style={styles.optionIcon}>↩️</Text>
              <Text className="text-foreground text-base font-semibold">Log Out</Text>
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