// headerOption.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

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

interface HeaderActionsProps {
  showThemeToggle?: boolean;
}

function HeaderActions({ showThemeToggle = true }: HeaderActionsProps) {
  if (!showThemeToggle) {
    return null;
  }

  return (
    <View style={styles.actionContainer}>
      <ThemeToggle />
    </View>
  );
}

interface ScreenOptionsConfig {
  showThemeToggle?: boolean;
}

export function getScreenOptions(
  colorScheme: 'light' | 'dark' = 'light',
  config: ScreenOptionsConfig = {}
) {
  const { showThemeToggle = true } = config;

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
    headerRight: () => <HeaderActions showThemeToggle={showThemeToggle} />,
  };
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
});

// ================================================================
// USAGE EXAMPLES:
// ================================================================

/*
// Example 1: Show theme toggle (default behavior)
import { getScreenOptions } from '@/components/shared/headerOption';
import { useColorScheme } from 'nativewind';

export default function MyScreen() {
  const { colorScheme } = useColorScheme();
  
  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light')} />
      // Your screen content
    </>
  );
}

// Example 2: Hide theme toggle
export default function MyScreen() {
  const { colorScheme } = useColorScheme();
  
  return (
    <>
      <Stack.Screen 
        options={getScreenOptions(colorScheme ?? 'light', { 
          showThemeToggle: false 
        })} 
      />
      // Your screen content
    </>
  );
}

// Example 3: Show theme toggle explicitly
export default function MyScreen() {
  const { colorScheme } = useColorScheme();
  
  return (
    <>
      <Stack.Screen 
        options={getScreenOptions(colorScheme ?? 'light', { 
          showThemeToggle: true 
        })} 
      />
      // Your screen content
    </>
  );
}
*/