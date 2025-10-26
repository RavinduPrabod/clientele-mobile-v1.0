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
  const userNameInputRef = React.useRef<TextInput | null>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
  const { colorScheme } = useColorScheme();
  const [loading, setLoading] = React.useState(false);

  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmpassword, setConfirmPassword] = React.useState('');
  const uniqueId = DeviceInfo.getUniqueId();

  function onUserNameSubmitEditing() {
    userNameInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onConfirmPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  function onSubmit() {
   handleSignUp();
  };

  function onSubmitSignIn() {
    router.replace("/");
  }

  const handleSignUp = async () => {
 if (!userId.trim() || !password.trim() || !confirmpassword.trim()) {
      Alert.alert('Error', 'Please enter User ID, Password and Confirm Password');
      return;
    }

    try {
      setLoading(true);

      // Call the login API
      const response = await AuthService.getLoggedUser(userId, password);

      if (response.success && response.data) {
        const userBranches = await UserStorage.getUserBranches();

        if (Array.isArray(userBranches) && userBranches.length > 1) {
          // Navigate to Switch Company page
          router.push('/pages/switch-company-form');
        } else {
          await UserStorage.saveSelectedBranch(userBranches[0]);
          const UserCode = userBranches[0].userId + "$" + userBranches[0].companyId
          const response = await AuthService.getTokenString(UserCode);

          if (response?.data) {
            // Navigate to Dashboard
            router.push('/pages/Dashboard/Dashbord');
          } else {
            console.warn('No data in response:', response);
          }
        }

      } else {
        Alert.alert('Login Failed', response.error || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light')} />
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
                    onSubmitEditing={onConfirmPasswordSubmitEditing}
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
                  onPress={onSubmit}
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