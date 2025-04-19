import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export default function SignupScreen() {
  const { colors, scheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  });

  const handleSignup = async () => {
    // Reset errors
    setValidationErrors({ name: undefined, email: undefined, password: undefined, confirmPassword: undefined });
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      setValidationErrors(prev => ({ ...prev, name: 'Name is required' }));
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      setValidationErrors(prev => ({ ...prev, email: 'Email is required' }));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      isValid = false;
    }

    // Password validation
    if (!password) {
      setValidationErrors(prev => ({ ...prev, password: 'Password is required' }));
      isValid = false;
    } else if (password.length < 6) {
      setValidationErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      isValid = false;
    }

    if (isValid) {
      try {
        setIsLoading(true);
        console.log('[Signup] Starting signup process with email:', email);
        
        // Replace axios with fetch
        const response = await fetch(`http://192.168.24.47:5001/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        });

        console.log('[Signup] Response status:', response.status);
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('[Signup] Server error response:', responseData);
          throw new Error(responseData.message || 'Signup failed');
        }

        console.log('[Signup] User created successfully:', responseData);
        
        // Store user token in AsyncStorage
        if (responseData.token) {
          await AsyncStorage.setItem('userToken', responseData.token);
          console.log('[Signup] Auth token stored in AsyncStorage');
        } else {
          console.warn('[Signup] No token received from server');
        }
        
        // Navigate to preference form instead of personality quiz
        console.log('[Signup] Navigating to preference form');
        router.navigate('/(auth)/personality');
      } catch (error) {
        console.error('[Signup] Error during signup:', error);
        
        let errorMessage = 'An error occurred during signup.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        Alert.alert('Signup Failed', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      // This is a placeholder. You'll need to implement Google Sign-In
      // using Expo's Google authentication
      Alert.alert('Google Sign In', 'Google sign in implementation required');
      
      // Once you have the Google ID token, you would call:
      // const response = await fetch('http://localhost:3000/api/routes/google-signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: googleIdToken }),
      // });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Google Sign In Failed', errorMessage);
    }
  };

  // Determine color gradient based on theme
  const gradientColors = scheme === 'chill' 
    ? ['#6366F1', '#A5B4FC'] 
    : ['#DC2626', '#F59E0B'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
            <ThemedText style={styles.backText}>Back</ThemedText>
          </TouchableOpacity>
          
          <View style={styles.header}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1611224885990-ab7363d7f2fc?q=80&w=250&auto=format&fit=crop" }}
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText variant="title" style={styles.welcomeText}>Create Account</ThemedText>
            <ThemedText variant="caption" style={styles.tagline}>
              {scheme === 'chill' 
                ? 'Join a community of habit builders' 
                : 'Take the first step to crushing your goals'}
            </ThemedText>
          </View>
          
            <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              autoCapitalize="words"
              error={validationErrors.name}
              style={styles.input}
            />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={validationErrors.email}
              style={styles.input}
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              error={validationErrors.password}
              style={styles.input}
            />
            
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              error={validationErrors.confirmPassword}
              style={styles.input}
            />
            
            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signUpButton}
            />
            
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <ThemedText variant="caption" style={styles.dividerText}>OR</ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>
            
            <Button
              title="Sign up with Google"
              variant="outline"
              onPress={handleGoogleSignIn}
              leftIcon={<Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" }} style={styles.googleIcon} />}
              style={styles.googleButton}
            />
            
            <View style={styles.footer}>
              <ThemedText variant="caption">Already have an account?</ThemedText>
              <Link href="/login" asChild>
              <TouchableOpacity>
                <ThemedText style={{ color: colors.primary, fontFamily: colors.fonts.semiBold }}>
                Sign In
                </ThemedText>
              </TouchableOpacity>
              </Link>
            </View>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 8,
  },
  tagline: {
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  input: {
    marginBottom: 16,
  },
  signUpButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButton: {
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    marginLeft: 4,
  },
});