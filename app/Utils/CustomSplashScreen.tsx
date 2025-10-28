import React, { useEffect, useRef } from 'react';
import { View, Animated, Image } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function CustomSplashScreen() {
  const { colorScheme } = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}>
        <Image
          source={require('@/assets/images/SplashLogo.gif')}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}