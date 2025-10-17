import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, type TextInput, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AuthService from '../services/AuthService'; 

export default function SignInForm() {
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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
        // Data is automatically saved in AuthService.getLoggedUser
        // Now we can navigate to Switch Company page
        
        console.log('Login successful! Branches saved.');
        
        // Navigate to Switch Company page
        router.push('/pages/switch-company-form');
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>
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
                onChangeText={setUserId}
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
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                editable={!loading}
              />
            </View>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
              onPress={onSubmit}
              disabled={loading}
              style={styles.signInButton}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">Sign In</Text>
              )}
            </Button>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={onSubmitSignUp} disabled={loading}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
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
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
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
  signUpText: {
    color: '#666',
  },
  signUpLink: {
    color: '#22c55e',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
  },
});