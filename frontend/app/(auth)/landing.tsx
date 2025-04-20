import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Dimensions,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle, 
  interpolateColor,
  SlideInDown,
  FadeIn,
  FadeInDown,
  runOnJS,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type MoodTheme = {
  name: string;
  primaryGradient: [string, string, string];
  secondaryGradient: [string, string, string];
  buttonGradient: [string, string];
  image: any;
  tagline: string;
  accentColor: string;
};

const moodThemes: MoodTheme[] = [
  {
    name: "Energetic",
    primaryGradient: ['#FF416C', '#FF765F', '#FF9E4F'],
    secondaryGradient: ['#FF5E62', '#FF8C3F', '#FFBD3F'],
    buttonGradient: ['#FF416C', '#FF9E4F'],
    image: require('@/assets/images/energetic-mood.webp'),
    tagline: "Convert energy into lasting habits",
    accentColor: '#FFC371'
  },
  {
    name: "Calm",
    primaryGradient: ['#4568DC', '#6190E8', '#A6BFFF'],
    secondaryGradient: ['#3A7BD5', '#5D8CE8', '#83A4F4'],
    buttonGradient: ['#4568DC', '#83A4F4'],
    image: require('@/assets/images/calm-mood.png'),
    tagline: "Develop mindful habits for inner peace",
    accentColor: '#B8C6F4'
  },
  {
    name: "Focused",
    primaryGradient: ['#0F2027', '#203A43', '#2C5364'],
    secondaryGradient: ['#134E5E', '#1C7293', '#2A9D8F'],
    buttonGradient: ['#0F2027', '#2A9D8F'],
    image: require('@/assets/images/focused-mood.png'),
    tagline: "Build routines for laser-sharp focus",
    accentColor: '#48E5C2'
  },
  {
    name: "Creative",
    primaryGradient: ['#6441A5', '#8E44AD', '#C86DD7'],
    secondaryGradient: ['#834D9B', '#9466C0', '#D56FA4'],
    buttonGradient: ['#6441A5', '#D56FA4'],
    image: require('@/assets/images/energetic-mood.webp'), // Update with actual creative mood image
    tagline: "Nurture habits that spark imagination",
    accentColor: '#E2B5FF'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [nextThemeIndex, setNextThemeIndex] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Animation values
  const backgroundProgress = useSharedValue(0);
  const imageOpacity = useSharedValue(1);
  const imageScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const navigationProgress = useSharedValue(0);
  const dotIndicatorWidth = useSharedValue(8);
  
  // Get current and next theme
  const currentTheme = moodThemes[currentThemeIndex];
  const nextTheme = moodThemes[nextThemeIndex];

  // Animation for image
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
      transform: [
        { scale: imageScale.value }
      ]
    };
  });

  // Animation for button
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundProgress.value,
      [0, 1],
      [currentTheme.buttonGradient[0], nextTheme.buttonGradient[0]]
    );
    
    return {
      backgroundColor,
      transform: [{ scale: buttonScale.value }]
    };
  });

  // Animation for active dot indicator
  const activeDotStyle = useAnimatedStyle(() => {
    return {
      width: dotIndicatorWidth.value,
      backgroundColor: interpolateColor(
        backgroundProgress.value,
        [0, 1],
        [currentTheme.accentColor, nextTheme.accentColor]
      )
    };
  });

  // Animation for highlighted text
  const highlightedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        backgroundProgress.value,
        [0, 1],
        [currentTheme.accentColor, nextTheme.accentColor]
      )
    };
  });

  const cycleMoodTheme = () => {
    // Animate image fade out and scale down
    imageOpacity.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) });
    imageScale.value = withTiming(0.8, { duration: 400 });
    
    // Animate background transition
    backgroundProgress.value = withTiming(1, { duration: 1000 }, () => {
      runOnJS(completeThemeTransition)();
    });

    // Animate dot indicator
    dotIndicatorWidth.value = withTiming(20, { duration: 600, easing: Easing.inOut(Easing.quad) });
    
    setNextThemeIndex((currentThemeIndex + 1) % moodThemes.length);
  };

  const completeThemeTransition = () => {
    setCurrentThemeIndex(nextThemeIndex);
    backgroundProgress.value = 0;
    setNextThemeIndex((nextThemeIndex + 1) % moodThemes.length);
    
    // Animate image fade in and scale up
    imageOpacity.value = withTiming(1, { duration: 600, easing: Easing.in(Easing.quad) });
    imageScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    
    // Reset dot indicator with a small delay
    setTimeout(() => {
      dotIndicatorWidth.value = withTiming(8, { duration: 300 });
    }, 200);
  };

  // Auto cycle every 5.5 seconds
  useEffect(() => {
    if (isNavigating) return;
    
    const interval = setInterval(() => {
      cycleMoodTheme();
    }, 5500);
    
    return () => clearInterval(interval);
  }, [currentThemeIndex, nextThemeIndex, isNavigating]);

  const handleSignUp = () => {
    setIsNavigating(true);
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    
    setTimeout(() => {
      buttonScale.value = withSpring(1.05, { damping: 12, stiffness: 200 });
      navigationProgress.value = withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) }, () => {
        runOnJS(router.replace)('./signup');
      });
    }, 150);
  };

  const handleSignIn = () => {
    setIsNavigating(true);
    navigationProgress.value = withTiming(1, { duration: 500 }, () => {
      runOnJS(router.replace)('./login');
    });
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <AnimatedGradient
        colors={[
          interpolateColor(backgroundProgress.value, [0, 1], [currentTheme.primaryGradient[0], nextTheme.primaryGradient[0]]),
          interpolateColor(backgroundProgress.value, [0, 1], [currentTheme.primaryGradient[1], nextTheme.primaryGradient[1]]),
          interpolateColor(backgroundProgress.value, [0, 1], [currentTheme.primaryGradient[2], nextTheme.primaryGradient[2]])
        ]}
        style={[styles.container, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={styles.logoContainer}
          entering={FadeInDown.delay(200).springify()}
        >
          <IconSymbol name="chart.line.uptrend.xyaxis" size={56} color="#FFFFFF" />
          <Text style={styles.logoText}>Elevate</Text>
        </Animated.View>

        <Animated.View 
          style={styles.contentContainer}
          entering={SlideInDown.delay(300).springify()}
        >
          <Animated.View 
            style={[styles.moodImageContainer, imageAnimatedStyle]}
          >
            <Image 
              source={currentTheme.image} 
              style={styles.moodImage}
              resizeMode="contain"
            />
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Be <Animated.Text style={[styles.highlightText, highlightedTextStyle]}>{currentTheme.name}</Animated.Text>
            </Text>
            
            <Text style={styles.tagline}>
              {currentTheme.tagline}
            </Text>
            
            <Text style={styles.description}>
              Transform your potential through habit tracking, mood analysis, and personalized growth insights.
            </Text>
          </View>
          
          <View style={styles.pagination}>
            {moodThemes.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot, 
                  index === currentThemeIndex && activeDotStyle
                ]} 
              />
            ))}
          </View>
          
          <View style={styles.buttonContainer}>
            <AnimatedGradient
              colors={[
                interpolateColor(backgroundProgress.value, [0, 1], [currentTheme.buttonGradient[0], nextTheme.buttonGradient[0]]),
                interpolateColor(backgroundProgress.value, [0, 1], [currentTheme.buttonGradient[1], nextTheme.buttonGradient[1]])
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.signUpButtonGradient, buttonAnimatedStyle]}
            >
              <TouchableOpacity
                onPress={handleSignUp}
                style={styles.signUpButton}
                activeOpacity={0.9}
                disabled={isNavigating}
              >
                <Text style={styles.signUpButtonText}>Get Started</Text>
                <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </AnimatedGradient>
            
            <TouchableOpacity
              onPress={handleSignIn}
              style={styles.signInButton}
              activeOpacity={0.7}
              disabled={isNavigating}
            >
              <Text style={styles.signInButtonText}>I already have an account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={styles.footer}
          entering={FadeIn.delay(600)}
        >
          <Text style={styles.footerText}>Transform • Elevate • Thrive</Text>
        </Animated.View>
      </AnimatedGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginLeft: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  moodImageContainer: {
    width: width * 0.75,
    height: height * 0.28,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  moodImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  highlightText: {
    fontSize: 38,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 32,
    height: 24,
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  signUpButtonGradient: {
    width: '85%',
    borderRadius: 16,
    padding: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  signUpButton: {
    paddingVertical: 18,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  signInButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
    marginBottom: Platform.OS === 'ios' ? 16 : 0,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  }
});