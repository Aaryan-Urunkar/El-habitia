import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { TextInput } from '@/components/ui/TextInput';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { colors, scheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine color scheme based on app theme
  const gradientColors: [string, string] = scheme === 'beast' 
    ? ['#8B5CF6', '#EC4899']  // Vibrant gradient for beast mode
    : ['#6366F1', '#3B82F6'];  // Calmer gradient for chill mode

  function handleLogin() {
    if (!email.trim() || !password) {
      return;
    }
    
    // Simulate loading for better UX
    setIsLoading(true);
    
    // Simple timeout to simulate network request
    setTimeout(() => {
      router.replace('/(tabs)/dashboard');
    }, 800);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
            <ThemedText style={styles.backText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
        
        <Animated.View 
          entering={FadeInDown.duration(800).springify()}
          style={styles.contentContainer}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <Image 
              source={require('@/assets/images/default-avatar.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.welcomeText}>Welcome Back</ThemedText>
            <ThemedText variant="caption" style={styles.subtitleText}>
              {scheme === 'beast' ? 'Time to crush your goals' : 'Continue your journey'}
            </ThemedText>
          </LinearGradient>
          
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              style={styles.input}
            />
            
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <ThemedText variant="caption" style={{ color: colors.primary }}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.loginButton, 
                { backgroundColor: colors.primary },
                isLoading && styles.disabledButton
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  Log In
                </ThemedText>
              )}
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <ThemedText variant="caption">Don't have an account?</ThemedText>
              <Link href="./signup" asChild>
                <TouchableOpacity>
                  <ThemedText style={{ color: colors.primary, fontFamily: colors.fonts.semiBold }}>
                    Sign Up
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  headerCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  input: {
    marginBottom: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
});
