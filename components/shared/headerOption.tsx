// headerOption.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
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

function HeaderActions({ showThemeToggle = true }: { showThemeToggle?: boolean }) {
  if (!showThemeToggle) return null;
  
  return (
    <View style={styles.actionContainer}>
      <ThemeToggle />
    </View>
  );
}

function HeaderTitle({ title }: { title?: string }) {
  if (!title) return null;
  
  return (
    <View style={styles.titleContainer}>
      <Text className="text-foreground text-xl font-bold">
        {title}
      </Text>
    </View>
  );
}

export function getScreenOptions(
  colorScheme: 'light' | 'dark' = 'light',
  options?: { hideBackButton?: boolean; pageTitle?: string; showThemeToggle?: boolean }
) {
  const { hideBackButton = false, pageTitle, showThemeToggle = true } = options || {};

  return {
    title: '',
    headerTransparent: true,
    headerShadowVisible: false,
    headerBackVisible: !hideBackButton,
    headerStyle: {
      backgroundColor:
        colorScheme === 'light'
          ? THEME.light.background
          : THEME.dark.background,
        
    },
    headerLeft: pageTitle ? () => <HeaderTitle title={pageTitle} /> : undefined,
    headerRight: () => <HeaderActions showThemeToggle={showThemeToggle} />,
  };
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  titleContainer: {
    marginLeft: 16,
  },
});

// ================================================================
// USAGE EXAMPLES:
// ================================================================

/*
// Example 1: Basic usage (default - shows theme toggle)
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

// Example 2: With page title (left aligned)
export default function DashboardScreen() {
  const { colorScheme } = useColorScheme();
  
  return (
    <>
      <Stack.Screen 
        options={getScreenOptions(colorScheme ?? 'light', { 
          pageTitle: 'Dashboard' 
        })} 
      />
      // Your screen content
    </>
  );
}

// Example 3: Hide theme toggle
export default function SomeScreen() {
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

// Example 4: With page title and hidden back button
export default function SignInScreen() {
  const { colorScheme } = useColorScheme();
  
  return (
    <>
      <Stack.Screen 
        options={getScreenOptions(colorScheme ?? 'light', { 
          pageTitle: 'Sign In',
          hideBackButton: true 
        })} 
      />
      // Your screen content
    </>
  );
}

// Example 5: All options combined
export default function ProfileScreen() {
  const { colorScheme } = useColorScheme();
  
  return (
    <>
      <Stack.Screen 
        options={getScreenOptions(colorScheme ?? 'light', { 
          pageTitle: 'My Profile',
          hideBackButton: false,
          showThemeToggle: true
        })} 
      />
      // Your screen content
    </>
  );
}

// Example 6: Page with title but no theme toggle
export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  
  return (
    <>
      <Stack.Screen 
        options={getScreenOptions(colorScheme ?? 'light', { 
          pageTitle: 'Settings',
          showThemeToggle: false
        })} 
      />
      // Your screen content
    </>
  );
}
*/