import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-2">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}

function HeaderActions({ showProfileButton = true }: { showProfileButton?: boolean }) {
  const router = useRouter();

  function handleProfilePress() {
    router.push('/pages/profile');
  }

  return (
    <View style={styles.actionContainer}>
      <ThemeToggle />
      {showProfileButton && (
        <Pressable onPress={handleProfilePress} style={styles.profileButton}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

export function getScreenOptions(
  colorScheme: 'light' | 'dark' = 'light',
  options?: { showProfileButton?: boolean }
) {
  const { showProfileButton = true } = options || {};

  return {
    title: '',
    headerTransparent: true,
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor:
        colorScheme === 'light'
          ? THEME.light.background
          : THEME.dark.background,
    },
    headerRight: () => <HeaderActions showProfileButton={showProfileButton} />,
  };
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  profileButton: {
    marginLeft: 4,
    padding: 6,
  },
  profileIcon: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    fontSize: 16,
  },
});