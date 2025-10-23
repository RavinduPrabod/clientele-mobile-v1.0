
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import SignInForm from './pages/sign-in-form';
import { getScreenOptions } from '@/components/shared/headerOption';

export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light')} />
      <View className="flex-1 justify-center p-4">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow justify-center mt-safe"
          keyboardDismissMode="interactive">
          <View className="w-full max-w-sm self-center">
            <SignInForm />
          </View>
        </ScrollView>
      </View>
    </>

  );
}

