import { getScreenOptions } from '@/components/shared/headerOption';
import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { router, Stack } from 'expo-router';
import * as React from 'react';
import { useColorScheme } from 'nativewind';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
  const { colorScheme } = useColorScheme();

  function onUsernameSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  function onSubmit() {
    // Handle registration logic
  }

  function onSubmitSignIn() {
    router.replace("/");
  }

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light', { showProfileButton: false })} />
      <View className="flex-1 bg-background" style={{ marginTop: 60 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} className="bg-background">
          <View style={styles.container}>
            {/* Logo Section - Fixed at Top */}
            <View className="items-center pt-16 pb-8 bg-muted/30">
              <Image
                source={require('assets/images/LogoWord.png')}
                style={styles.logo}
              />
            </View>

            {/* Content Section */}
            <View style={styles.content}>
              {/* Header Section */}
              <View style={styles.header}>
                <Text className="text-foreground text-4xl font-bold text-center mb-2">Register</Text>
                <Text className="text-muted-foreground text-base text-center">
                  Create Your New Account
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    placeholder="Enter Your Username"
                    autoCapitalize="none"
                    onSubmitEditing={onUsernameSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                    onChangeText={(text) => {
                      if (text.includes('$')) {
                        Alert.alert('Invalid Character', 'The "$" symbol is not allowed in the username.');
                        return; // Prevent update
                      }
                      //onSubmit(text);
                    }}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    placeholder="Enter Your Password"
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={onPasswordSubmitEditing}
                    onChangeText={(text) => {
                      if (text.includes('$')) {
                        Alert.alert('Invalid Character', 'The "$" symbol is not allowed in the password.');
                        return; // Prevent update
                      }
                      //onSubmit(text);
                    }}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    ref={confirmPasswordInputRef}
                    id="confirmPassword"
                    placeholder="Enter Your Confirm Password"
                    secureTextEntry
                    returnKeyType="send"
                    onSubmitEditing={onSubmit}
                    onChangeText={(text) => {
                      if (text.includes('$')) {
                        Alert.alert('Invalid Character', 'The "$" symbol is not allowed in the password.');
                        return; // Prevent update
                      }
                      //onSubmit(text);
                    }}
                  />
                </View>

                <Button
                  className="w-full bg-primary"
                  onPress={onSubmit}
                >
                  <Text className="text-primary-foreground font-medium">Continue</Text>
                </Button>
              </View>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                </Text>
                <Pressable onPress={onSubmitSignIn}>
                  <Text className="text-primary text-sm underline">Sign In</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  logo: {
    width: 280,
    height: 80,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formSection: {
    gap: 20,
    marginBottom: 20,
  },
  inputGroup: {
    gap: 6,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});