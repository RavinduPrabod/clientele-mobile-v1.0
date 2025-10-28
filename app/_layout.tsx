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
import { useEffect, useState } from 'react';
import CustomSplashScreen from './Utils/CustomSplashScreen';

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
  const [isLoading, setIsLoading] = useState(true);

  // Check if current route should show bottom navigation
  const shouldShowBottomNav = !ROUTES_WITHOUT_NAV.includes(pathname);

  useEffect(() => {
    async function prepare() {
      try {
        // Add your initialization logic here:
        // - Load fonts
        // - Check authentication
        // - Load cached data
        
        // Minimum splash screen duration
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    }

    prepare();
  }, []);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

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