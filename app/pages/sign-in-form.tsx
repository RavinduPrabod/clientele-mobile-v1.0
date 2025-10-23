import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, type TextInput, View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AuthService from '../services/AuthService'; 
import { UserStorage } from '../../lib/userStorage';
import { getScreenOptions } from '@/components/shared/headerOption';
import { useColorScheme } from 'nativewind';

export default function SignInForm() {
  const [userId, setUserId] = React.useState('admin');
  const [password, setPassword] = React.useState('dms@123');
  const [loading, setLoading] = React.useState(false);
  const { colorScheme } = useColorScheme();
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();

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

  async function onSubmit() {
    handleLogin();
  }

  async function onSubmitSignUp() {
    router.push("/pages/sign-up-form");
  }

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light', { showProfileButton: false })} />
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
    width: 150,
    height: 50,
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