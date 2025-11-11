// components/shared/BottomNavigation.tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';

type NavItem = {
  id: string;
  label: string;
  icon: string;
  route: string;
};

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', route: '/pages/Dashboard/Dashbord' },
  { id: 'purchase', label: 'Purchase', icon: '🛍️', route: '/pages/purchase' },
  { id: 'cart', label: 'Cart', icon: '🛒', route: '/pages/cart' },
  { id: 'sales', label: 'Sales', icon: '💵', route: '/pages/sales' },
  { id: 'profile', label: 'Profile', icon: '👤', route: '/pages/profile' },
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();

  const isActive = (route: string) => {
    return pathname === route;
  };

  const handleNavPress = (route: string) => {
    router.push(route as never);
  };

  return (
    <View
      className={`border-t ${colorScheme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}
      style={styles.container}
    >
      {navItems.map((item) => {
        const active = isActive(item.route);
        return (
          <Pressable
            key={item.id}
            style={styles.navItem}
            onPress={() => handleNavPress(item.route)}
          >
            <View style={[
              styles.iconContainer,
              active && styles.iconContainerActive
            ]}>
              <Text style={[
                styles.icon,
                active && styles.iconActive
              ]}>
                {item.icon}
              </Text>
            </View>
            <Text
              className={active ? 'text-primary' : 'text-muted-foreground'}
              style={[
                styles.label,
                active && styles.labelActive
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingBottom: 12,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  icon: {
    fontSize: 22,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});