import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, type TextInput, View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AuthService from '../services/AuthService';
import { UserStorage } from '../../lib/userStorage';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';
import DeviceInfo from 'react-native-device-info';

export default function SignInForm() {
  const [userId, setUserId] = React.useState('admin');
  const [password, setPassword] = React.useState('dms@123');
  const [loading, setLoading] = React.useState(false);
  const { colorScheme } = useColorScheme();
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const [uniqueId, setUniqueId] = React.useState('');

  // Get device unique ID when component mounts
  React.useEffect(() => {
    const getDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setUniqueId(id);
    };
    getDeviceId();
  }, []);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both User ID and Password');
      return;
    }

    try {
      setLoading(true);

      // Validate input
      if (!userId || !password) {
        Alert.alert('Error', 'User ID and password are required');
        return;
      }

      const userCredentials = userId + "$" + password + "$" + uniqueId;
      console.log("userCredentials", userCredentials);

      // Call the login API
      const response = await AuthService.getLoggedUser(userCredentials);

      console.log("response",response);

      if (response.success && response.data) {
        const userBranches = await UserStorage.getUserBranches();

        if (Array.isArray(userBranches) && userBranches.length > 1) {
          // Navigate to Switch Company page
          router.push('/pages/switch-company-form');
        } else if (userBranches.length === 1) {
          await UserStorage.saveSelectedBranch(userBranches[0]);
          const UserCode = userBranches[0].userId + "$" + userBranches[0].companyId;
          const tokenResponse = await AuthService.getTokenString(UserCode);

          if (tokenResponse?.data) {
            // Navigate to Dashboard
            router.push('/pages/Dashboard/Dashbord');
          } else {
            console.warn('No data in token response:', tokenResponse);
            Alert.alert('Error', 'Failed to get authentication token');
          }
        } else {
          // No branches found
          Alert.alert('Error', 'No assigned companies found for the given User.');
        }

      } else {
        // Handle different error status codes
        switch (response.statusCode) {
          case 401:
            Alert.alert('Login Failed', 'Invalid credentials');
            break;
          case 404:
            // Use the error message from the response for 404
            Alert.alert('Login Failed', response.error || response.data);
            break;
          default:
            Alert.alert('Login Failed', response.error || response.data);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific error cases in catch block if needed
      if (error.response?.status === 401) {
        Alert.alert('Login Failed', 'Invalid credentials');
      } else if (error.response?.status === 404) {
        // Use error message from the error response for 404
        Alert.alert('Login Failed', error.response?.data?.message || error.message || 'No assigned companies found for the given User.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit() {
    handleLogin();
  }

  async function onSubmitSignUp() {
    router.push("/pages/sign-up-form");
  }

  return (
    <>
      <Stack.Screen
        options={getScreenOptions(colorScheme ?? 'light', {
          pageTitle: '',
          hideBackButton: true,
          showThemeToggle: true
        })}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} className="bg-background">
        <View style={styles.container}>
          {/* Logo Section - Fixed at Top */}
          <View style={styles.logoContainer}>
            <Image
              source={require('assets/images/LogoWord.png')}
              style={styles.logo}
            />
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <Text className="text-foreground text-3xl font-bold mb-2">Welcome Back</Text>
              <Text className="text-muted-foreground text-base">
                Login to Your Account
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  placeholder="Enter Your Username"
                  value={userId}
                  onChangeText={(text) => {
                    // Remove any $ symbols from input
                    const cleanedText = text.replace(/\$/g, '');
                    setUserId(cleanedText);
                  }}
                  autoComplete="username"
                  autoCapitalize="none"
                  onSubmitEditing={onEmailSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Label htmlFor="password">Password</Label>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChangeText={(text) => {
                    // Remove any $ symbols from input
                    const cleanedText = text.replace(/\$/g, '');
                    setPassword(cleanedText);
                  }}
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  editable={!loading}
                />
              </View>

              <Button
                className={`w-full bg-primary ${loading ? 'opacity-50' : ''}`}
                onPress={onSubmit}
                disabled={loading}
                style={styles.signInButton}
              >
                {loading ? (
                  <ActivityIndicator className="text-primary-foreground" />
                ) : (
                  <Text className="text-primary-foreground font-medium">Sign In</Text>
                )}
              </Button>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text className="text-muted-foreground">
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={onSubmitSignUp} disabled={loading}>
                <Text className="text-primary font-semibold">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 280,
    height: 80,
    resizeMode: 'contain',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  formSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  signInButton: {
    marginTop: 10,
    paddingVertical: 12,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});