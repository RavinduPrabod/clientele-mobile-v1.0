import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

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
    router.push("/pages/sign-in-form");
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
            <Text style={styles.registerText}>Register</Text>
            <Text style={styles.subtitle}>
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
                  Alert.alert('Invalid Character', 'The "$" symbol is not allowed in the username.');
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
                  Alert.alert('Invalid Character', 'The "$" symbol is not allowed in the username.');
                  return; // Prevent update
                }
                //onSubmit(text);
              }}
              />
            </View>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onPress={onSubmit}
            >
              <Text className="text-white font-medium">Continue</Text>
            </Button>
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={onSubmitSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
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
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#f8f9fa',
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
  registerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#efb209',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
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
  signInText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signInLink: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerText: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 16,
  },
});