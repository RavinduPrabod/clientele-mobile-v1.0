// _layout.tsx
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { BottomNavigation } from '@/components/shared/BottomNavigation';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Routes where bottom navigation should be hidden
const ROUTES_WITHOUT_NAV = [
  '/',
  '/pages/sign-in-form',
  '/pages/sign-up-form',
  '/pages/switch-company-form'
];

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const pathname = usePathname();

  // Check if current route should show bottom navigation
  const shouldShowBottomNav = !ROUTES_WITHOUT_NAV.includes(pathname);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: true }} />
        {shouldShowBottomNav && <BottomNavigation />}
      </View>
      <PortalHost />
    </ThemeProvider>
  );
}