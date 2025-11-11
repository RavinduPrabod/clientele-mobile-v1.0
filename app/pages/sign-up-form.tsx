import { getScreenOptions } from '@/components/shared/headerOption';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { router, Stack } from 'expo-router';
import * as React from 'react';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AuthService from '../services/AuthService';
import { UserStorage } from '@/lib/userStorage';

export default function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
  const { colorScheme } = useColorScheme();
  const [loading, setLoading] = React.useState(false);

  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmpassword, setConfirmPassword] = React.useState('');
  const [uniqueId, setUniqueId] = React.useState('');

  // Get device unique ID when component mounts
  React.useEffect(() => {
    const getDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setUniqueId(id);
    };
    getDeviceId();
  }, []);

  function onUserNameSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  function onSubmitSignUp() {
    handleSignUp();
  }

  function onSubmitSignIn() {
    router.replace('/');
  }

  const handleSignUp = async () => {
    // Validation
    if (!userId.trim() || !password.trim() || !confirmpassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmpassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      const userCredentials = userId + "$" + password + "$" + uniqueId;

      // Call the registration API
      const response = await AuthService.postNewUser(userCredentials);

      if (response.success) {
        // Show success message with approval waiting
        Alert.alert(
          '✅ Registration Successful',
          'Your account has been created successfully!\n\nPlease wait for admin approval before you can sign in.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to Sign In page
                router.replace('/');
              },
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', response.error || 'Unable to create account. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <Stack.Screen
              options={getScreenOptions(colorScheme ?? 'light', {
                pageTitle: '',
                hideBackButton: true,
                showThemeToggle: true
              })}
            />
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
                    onSubmitEditing={onUserNameSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                    onChangeText={(text) => {
                      // Remove any $ symbols from input
                      const cleanedText = text.replace(/\$/g, '');
                      setUserId(cleanedText);
                    }}
                    editable={!loading}
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
                      // Remove any $ symbols from input
                      const cleanedText = text.replace(/\$/g, '');
                      setPassword(cleanedText);
                    }}
                    editable={!loading}
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
                    onChangeText={(text) => {
                      // Remove any $ symbols from input
                      const cleanedText = text.replace(/\$/g, '');
                      setConfirmPassword(cleanedText);
                    }}
                    editable={!loading}
                  />
                </View>

                <Button
                  className={`w-full bg-primary ${loading ? 'opacity-50' : ''}`}
                  onPress={onSubmitSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator className="text-primary-foreground" />
                  ) : (
                    <Text className="text-primary-foreground font-medium">Continue</Text>
                  )}
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