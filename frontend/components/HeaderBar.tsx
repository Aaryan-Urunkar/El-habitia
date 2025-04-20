import React, { useEffect, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  FadeIn,
  SlideInDown
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface HeaderBarProps {
  title: string;
  gradientColors: readonly [string, string, ...string[]];
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function HeaderBar({ 
  title, 
  gradientColors,
  showBackButton = false,
  onBackPress,
  rightComponent
}: HeaderBarProps) {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  
  // Animation for header appearance
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 600 });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  const handleProfilePress = () => {
    router.push('/settings');
  };

  const handleSchedulePress = () => {
    router.push('/schedule');
  };

  // Memoize shadow style to prevent recalculation
  const shadowStyle = useMemo(() => ({
    ...styles.headerContainer,
    shadowColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
    elevation: 8,
  }), [mode]);

  return (
    <Animated.View 
      style={[
        shadowStyle,
        { paddingTop: insets.top },
        animatedStyle
      ]}
      entering={SlideInDown.springify().damping(15)}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {showBackButton && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={onBackPress || (() => router.back())}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <IconSymbol name="chevron.left" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            <Animated.View entering={FadeIn.delay(100).duration(300)}>
              <ThemedText 
                style={[
                  styles.headerTitle,
                  { color: colors.text, fontFamily: colors.fonts.bold }
                ]}
                numberOfLines={1}
              >
                {title}
              </ThemedText>
            </Animated.View>
          </View>
          
          <View style={styles.headerRight}>
            {rightComponent || (
              <>
                <TouchableOpacity 
                  style={[styles.scheduleButton, { backgroundColor: colors.card }]} 
                  onPress={handleSchedulePress}
                  accessibilityLabel="Schedule"
                  accessibilityRole="button"
                >
                  <IconSymbol name="calendar" size={20} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.profileButton, { backgroundColor: colors.card }]} 
                  onPress={handleProfilePress}
                  accessibilityLabel="Profile"
                  accessibilityRole="button"
                >
                  <Image
                    source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/default-avatar.jpg')}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </LinearGradient>
      
      {/* Bottom rounded overlay effect */}
      <View style={[styles.bottomOverlay, { backgroundColor: colors.background }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    overflow: 'visible',
    zIndex: 100,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    position: 'relative',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerGradient: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      }
    }),
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      }
    }),
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: -1,
    transform: [{ translateY: 3 }],
  },
});