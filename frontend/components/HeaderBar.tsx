import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface HeaderBarProps {
  title: string;
  gradientColors: string[];
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
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  
  // Animation for header appearance
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });

  const handleProfilePress = () => {
    router.push('/settings');
  };

  return (
    <Animated.View style={[
      styles.headerContainer,
      { paddingTop: insets.top },
      animatedStyle
    ]}>
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
              >
                <IconSymbol name="chevron.left" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            <ThemedText 
              style={[
                styles.headerTitle,
                { color: colors.text, fontFamily: colors.fonts.bold }
              ]}
            >
              {title}
            </ThemedText>
          </View>
          
          <View style={styles.headerRight}>
            {rightComponent || (
              <TouchableOpacity 
                style={[styles.profileButton, { backgroundColor: colors.card }]} 
                onPress={handleProfilePress}
              >
                <Image
                  source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/default-avatar.jpg')}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
    zIndex: 100,
  },
  headerGradient: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
