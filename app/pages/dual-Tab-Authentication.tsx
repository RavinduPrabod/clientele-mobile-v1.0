import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View, ActivityIndicator, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AuthService from '../services/AuthService';
import { UserStorage } from '../../lib/userStorage';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';
import DeviceInfo from 'react-native-device-info';

type TabType = 'signin' | 'signup';

export default function AuthForm() {
  const [activeTab, setActiveTab] = React.useState<TabType>('signin');
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { colorScheme } = useColorScheme();
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const [uniqueId, setUniqueId] = React.useState('');

  // Animation values
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const getDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setUniqueId(id);
    };
    getDeviceId();
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;

    // Fade out and fade in animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Slide animation
    Animated.timing(slideAnim, {
      toValue: tab === 'signin' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setActiveTab(tab);
    // Clear form when switching tabs
    setUserId('');
    setPassword('');
    setConfirmPassword('');
  };

  function onUserIdSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    if (activeTab === 'signup') {
      confirmPasswordInputRef.current?.focus();
    } else {
      handleSubmit();
    }
  }

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both User ID and Password');
      return;
    }

    try {
      setLoading(true);
      const userCredentials = userId + "$" + password + "$" + uniqueId;
      const response = await AuthService.getLoggedUser(userCredentials);

      if (response.success && response.data) {
        const userBranches = await UserStorage.getUserBranches();

        if (Array.isArray(userBranches) && userBranches.length > 1) {
          router.push('/pages/switch-company-form');
        } else if (userBranches.length === 1) {
          await UserStorage.saveSelectedBranch(userBranches[0]);
          const UserCode = userBranches[0].userId + "$" + userBranches[0].companyId;
          const tokenResponse = await AuthService.getTokenString(UserCode);

          if (tokenResponse?.data) {
            router.push('/pages/Dashboard/Dashbord');
          } else {
            Alert.alert('Error', 'Failed to get authentication token');
          }
        } else {
          Alert.alert('Error', 'No assigned companies found for the given User.');
        }
      } else {
        switch (response.statusCode) {
          case 401:
            Alert.alert('Login Failed', 'Invalid credentials');
            break;
          case 404:
            Alert.alert('Login Failed', response.error || response.data);
            break;
          default:
            Alert.alert('Login Failed', response.error || response.data);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Login Failed', 'Invalid credentials');
      } else if (error.response?.status === 404) {
        Alert.alert('Login Failed', error.response?.data?.message || error.message || 'No assigned companies found for the given User.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!userId.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
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
      const response = await AuthService.postNewUser(userCredentials);

      if (response.success) {
        Alert.alert(
          '✅ Registration Successful',
          'Your account has been created successfully!\n\nPlease wait for admin approval before you can sign in.',
          [
            {
              text: 'OK',
              onPress: () => {
                handleTabChange('signin');
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

  const handleSubmit = () => {
    if (activeTab === 'signin') {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  const tabIndicatorTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180],
  });

  return (
    <>
      <Stack.Screen
        options={getScreenOptions(colorScheme ?? 'light', {
          pageTitle: '',
          hideBackButton: true,
          showThemeToggle: true,
        })}
      />
      <View style={styles.mainContainer} className="bg-background">
        {/* Fixed Logo Header - Completely Static */}
        <View style={styles.logoContainer} className="bg-background">
          <Image
            source={require('assets/images/LogoWord.png')}
            style={styles.logo}
          />
        </View>

        {/* Fixed Tab Switcher - Static */}
        <View style={styles.fixedTabContainer} className="bg-background">
          <View className="bg-muted rounded-full p-1 flex-row" style={styles.tabWrapper}>
            <Animated.View 
              className="bg-primary rounded-full"
              style={[
                styles.tabIndicator,
                {
                  transform: [{ translateX: tabIndicatorTranslate }],
                },
              ]}
            />
            <Pressable
              style={styles.tab}
              onPress={() => handleTabChange('signin')}
              disabled={loading}
            >
              <Text 
                className={`font-semibold ${activeTab === 'signin' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
              >
                Sign In
              </Text>
            </Pressable>
            <Pressable
              style={styles.tab}
              onPress={() => handleTabChange('signup')}
              disabled={loading}
            >
              <Text 
                className={`font-semibold ${activeTab === 'signup' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Scrollable Content with Keyboard Handling */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Animated Form Section */}
              <Animated.View 
                style={[
                  styles.formContainer,
                  { opacity: fadeAnim }
                ]}
              >
                {/* Header */}
                <View style={styles.header}>
                  <Text className="text-foreground text-3xl font-bold mb-2">
                    {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
                  </Text>
                  <Text className="text-muted-foreground text-base">
                    {activeTab === 'signin' 
                      ? 'Login to Your Account' 
                      : 'Sign up to get started'}
                  </Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                  <View style={styles.inputGroup}>
                    <Label htmlFor="userId">Username</Label>
                    <Input
                      id="userId"
                      placeholder="Enter Your Username"
                      value={userId}
                      onChangeText={(text) => {
                        const cleanedText = text.replace(/\$/g, '');
                        setUserId(cleanedText);
                      }}
                      autoComplete="username"
                      autoCapitalize="none"
                      onSubmitEditing={onUserIdSubmitEditing}
                      returnKeyType="next"
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
                        const cleanedText = text.replace(/\$/g, '');
                        setPassword(cleanedText);
                      }}
                      secureTextEntry
                      returnKeyType={activeTab === 'signup' ? 'next' : 'send'}
                      onSubmitEditing={onPasswordSubmitEditing}
                      editable={!loading}
                    />
                  </View>

                  {/* Reserve space for confirm password to prevent layout shift */}
                  <View style={activeTab === 'signup' ? styles.inputGroup : styles.hiddenInputGroup}>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      ref={confirmPasswordInputRef}
                      id="confirmPassword"
                      placeholder="Confirm Your Password"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        const cleanedText = text.replace(/\$/g, '');
                        setConfirmPassword(cleanedText);
                      }}
                      secureTextEntry
                      returnKeyType="send"
                      onSubmitEditing={handleSubmit}
                      editable={!loading && activeTab === 'signup'}
                    />
                  </View>

                  <Button
                    className={`w-full bg-primary ${loading ? 'opacity-50' : ''}`}
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.submitButton}
                  >
                    {loading ? (
                      <ActivityIndicator className="text-primary-foreground" />
                    ) : (
                      <Text className="text-primary-foreground font-semibold text-base">
                        {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                      </Text>
                    )}
                  </Button>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 0,
  },
  logo: {
    width: 280,
    height: 80,
    resizeMode: 'contain',
  },
  fixedTabContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
  },
  tabWrapper: {
    position: 'relative',
    height: 50,
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    left: 0,
    top: 0,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  formContainer: {
    width: '100%',
    minHeight: 400,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
  },
  formSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  hiddenInputGroup: {
    gap: 8,
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 14,
  },
});