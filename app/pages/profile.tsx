import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  function handleSwitchShop(){
    router.push('/pages/switch-company-form')
  }

  function handleSignOut(){
    router.push('/pages/sign-in-form')
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>👤 Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info */}
        <View style={styles.userCard}>
          <Text style={styles.userIcon}>👤</Text>
          <Text style={styles.username}>Username</Text>
        </View>

        {/* Main Options */}
        <Pressable style={styles.option} onPress={handleSwitchShop}>
          <Text style={styles.optionIcon}>🔄</Text>
          <Text style={styles.optionText}>Switch Shop</Text>
        </Pressable>

        <Pressable style={styles.option}>
          <Text style={styles.optionIcon}>🔒</Text>
          <Text style={styles.optionText}>Password Reset</Text>
        </Pressable>

        {/* Bottom Options */}
        <Pressable style={styles.option}>
          <Text style={styles.optionIcon}>❓</Text>
          <Text style={styles.optionText}>Help Center</Text>
        </Pressable>

        <Pressable style={styles.option}>
          <Text style={styles.optionIcon}>ℹ️</Text>
          <Text style={styles.optionText}>About</Text>
        </Pressable>

        <Pressable style={styles.option} onPress={handleSignOut}>
          <Text style={styles.optionIcon}>↩️</Text>
          <Text style={styles.optionText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  backIcon: {
    fontSize: 22,
    color: "#444",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b8860b", // golden brown
  },
  content: {
    padding: 16,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
});
