import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';
// Import the Firebase auth functions directly
import { createUserWithEmailAndPassword } from '@/firebase/auth';
// Import Firestore functions for creating user document
import { firestore } from '@/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupScreen() {
  const { colors, scheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSignup = async () => {
    // Reset errors
    setValidationErrors({});
    let isValid = true;

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
        
        // Directly use Firebase auth
        console.log('[Signup] Creating Firebase auth user');
        const userCredential = await createUserWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;
        console.log('[Signup] User created successfully with uid:', firebaseUser.uid);
        
        try {
          // Create user document in Firestore
          console.log('[Signup] Creating user document in Firestore');
          await setDoc(doc(firestore, 'users', firebaseUser.uid), {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || email.split('@')[0], // Use email prefix as default display name
            photoURL: firebaseUser.photoURL,
            createdAt: new Date(),
            currentMode: 'growth', // Default mode
          });
          console.log('[Signup] User document created in Firestore');
        } catch (firestoreError: any) {
          console.error('[Signup] Firestore error:', firestoreError);
          // Even if Firestore creation fails, the user can still proceed
          // We'll just log the error but not stop the authentication flow
        }
        
        // Navigate to personality quiz even if Firestore document creation fails
        console.log('[Signup] Navigating to personality quiz');
        router.navigate('/(auth)/personality');
      } catch (error: any) {
        console.error('[Signup] Error during signup:', error);
        console.error('[Signup] Error code:', error.code);
        console.error('[Signup] Error message:', error.message);
        console.error('[Signup] Full error object:', JSON.stringify(error, null, 2));
        
        const errorCode = error.code || '';
        let errorMessage = 'An error occurred during signup.';
        
        if (errorCode.includes('auth/email-already-in-use')) {
          console.log('[Signup] Detected email already in use error');
          errorMessage = 'This email is already in use.';
        } else if (errorCode.includes('auth/invalid-email')) {
          console.log('[Signup] Detected invalid email error');
          errorMessage = 'Invalid email address.';
        } else if (errorCode.includes('auth/weak-password')) {
          console.log('[Signup] Detected weak password error');
          errorMessage = 'Password is too weak.';
        } else if (error.message) {
          console.log('[Signup] Using error message from exception');
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
      // using Expo's Google authentication or Firebase's Google provider
      Alert.alert('Google Sign In', 'Google sign in implementation required');
      
      // Once you have the Google ID token, you would call:
      // await signInWithGoogle(googleIdToken);
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
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
