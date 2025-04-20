import { Tabs } from 'expo-router';
import { StyleSheet, View, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/theme/ThemeProvider';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useState, useCallback, memo } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { ThemedText } from '@/components/ui/ThemedText';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  useSharedValue,
  FadeIn,
  SlideInUp,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import HeaderBar from '@/components/HeaderBar';

// Constants
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5;
const TAB_BAR_HEIGHT = 65;

// Type definitions
type TabRoute = {
  key: string;
  name: string;
  params?: Readonly<object | undefined>;
};

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

interface TabBarOptions {
  tabBarIcon?: (props: TabBarIconProps) => JSX.Element;
  title?: string;
}

import type { BottomTabBarProps as NavigationBottomTabBarProps } from '@react-navigation/bottom-tabs';

type BottomTabBarProps = NavigationBottomTabBarProps;

/**
 * Main TabsLayout component that handles tab navigation and theme application
 */
export default function TabsLayout() {
  const { colors, scheme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useThemeStore();
  
  // Check authentication state
  const navigationState = useRootNavigationState();
  const { user } = useAuthStore();
  
  // Memoize header gradient colors based on theme to prevent re-calculations
  const getHeaderGradientColors = useCallback((): [string, string, ...string[]] => {
    if (mode === 'dark') {
      return colorScheme === 'beast' 
        ? ['#27272A', '#18181B'] 
        : ['#0a2638', '#051824'];
    } else {
      return colorScheme === 'beast' 
        ? ['#FFFBEB', '#FFF8E6'] 
        : ['#f1f9fe', '#e6f4fd'];
    }
  }, [mode, colorScheme]);
  
  // Authentication check
  useEffect(() => {
    if (!navigationState?.key) return;
    
    if (!user) {
      // Redirect to login if not authenticated
      // Uncomment when ready to implement auth redirect
      // router.replace('/(auth)/login');
    }
  }, [navigationState?.key, user]);

  // Memoized tab bar component to prevent unnecessary re-renders
  const TabBar = useCallback((props: BottomTabBarProps) => (
    <FloatingTabBar {...props} />
  ), []);

  return (
    <ProtectedRoute>
      <GestureHandlerRootView style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.subtext,
            headerShown: false,
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTitleStyle: {
              fontFamily: colors.fonts.semiBold,
              fontSize: 18,
              color: colors.text,
            },
            // Hide default tab bar as we're using custom implementation
            tabBarStyle: {
              display: 'none',
              paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20,
            }
          }}
          tabBar={TabBar}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size, focused }) => (
                <IconSymbol 
                  name={focused ? "house.fill" : "house"} 
                  color={color} 
                  size={size} 
                />
              ),
              header: () => (
                <HeaderBar
                  title="Dashboard" 
                  gradientColors={getHeaderGradientColors()}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="mood-tracker"
            options={{
              title: 'Mood',
              tabBarIcon: ({ color, size, focused }) => (
                <IconSymbol 
                  name={focused ? "heart.fill" : "heart"} 
                  color={color} 
                  size={size} 
                />
              ),
              header: () => (
                <HeaderBar
                  title="Mood Tracker" 
                  gradientColors={getHeaderGradientColors()}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="add-habit"
            options={{
              title: 'Add',
              tabBarIcon: ({ color, size }) => (
                <IconSymbol 
                  name="plus.circle.fill" 
                  color="#FFF" 
                  size={size + 6} 
                />
              ),
              header: () => (
                <HeaderBar
                  title="Add Habit" 
                  gradientColors={getHeaderGradientColors()}
                />
              ),
            }}
            listeners={{
              tabPress: e => {
                // Custom handling for add button can be implemented here
                // e.preventDefault();
                // router.push('/add-habit-modal');
              },
            }}
          />
          <Tabs.Screen
            name="chatbot"
            options={{
              title: 'Chatbot',
              tabBarIcon: ({ color, size, focused }) => (
                <IconSymbol 
                  name={focused ? "bubble.fill" : "bubble"} 
                  color={color} 
                  size={size} 
                />
              ),
              header: () => (
                <HeaderBar
                  title="AI Assistant" 
                  gradientColors={getHeaderGradientColors()}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="community"
            options={{
              title: 'Community',
              tabBarIcon: ({ color, size, focused }) => (
                <IconSymbol 
                  name={focused ? "person.3.fill" : "person.3"} 
                  color={color} 
                  size={size} 
                />
              ),
              header: () => (
                <HeaderBar
                  title="Community" 
                  gradientColors={getHeaderGradientColors()}
                />
              ),
            }}
          />
        </Tabs>
      </GestureHandlerRootView>
    </ProtectedRoute>
  );
}

/**
 * Tab indicator component - Memoized to prevent unnecessary re-renders
 */
const TabIndicator = memo(({ 
  position, 
  accentColor 
}: { 
  position: Animated.SharedValue<number>; 
  accentColor: string;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
      opacity: withTiming(1, { duration: 200 }),
      backgroundColor: accentColor + '20',
    };
  });

  return (
    <Animated.View 
      style={[styles.tabIndicator, animatedStyle]} 
    />
  );
});

/**
 * TabBarItem component for regular tabs - Memoized to prevent re-renders
 */
const TabBarItem = memo(({ 
  route, 
  isFocused, 
  onPress, 
  colors, 
  options 
}: { 
  route: TabRoute; 
  isFocused: boolean; 
  onPress: () => void; 
  colors: any;
  options: TabBarOptions;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItem,
        pressed && styles.pressed
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={options?.title || route.name}
    >
      <View style={styles.tabIconContainer}>
        {options.tabBarIcon?.({
          focused: isFocused,
          color: isFocused ? colors.primary : colors.subtext,
          size: 22,
        }) || (
          <IconSymbol
            name="circle"
            color={isFocused ? colors.primary : colors.subtext}
            size={22}
          />
        )}
      </View>
      
      <ThemedText 
        style={[
          styles.tabLabel,
          { 
            color: isFocused ? colors.primary : colors.subtext,
            fontFamily: isFocused ? colors.fonts.semiBold : colors.fonts.regular,
          }
        ]}
        numberOfLines={1}
      >
        {options?.title || route.name}
      </ThemedText>
    </Pressable>
  );
});

/**
 * AddButton component - Special tab button with gradient background
 */
const AddButton = memo(({ 
  route, 
  isFocused, 
  onPress, 
  colors, 
  options,
  gradientColors
}: { 
  route: TabRoute; 
  isFocused: boolean; 
  onPress: () => void; 
  colors: any;
  options: TabBarOptions;
  gradientColors: [string, string, ...string[]];
}) => {
  return (
    <View style={styles.addButtonContainer}>
      <Animated.View
        entering={FadeIn.delay(300).duration(500)}
        style={styles.addButton}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              styles.addButtonContent,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options?.title || route.name}
          >
            {options.tabBarIcon?.({
              focused: isFocused,
              color: '#FFFFFF',
              size: 24,
            }) || (
              <IconSymbol
                name="plus.circle.fill"
                color="#FFFFFF"
                size={24}
              />
            )}
          </Pressable>
        </LinearGradient>
      </Animated.View>
      <ThemedText 
        style={[
          styles.tabLabelCenter,
          { 
            color: isFocused ? colors.primary : colors.subtext,
            fontFamily: isFocused ? colors.fonts.semiBold : colors.fonts.medium,
          }
        ]}
        numberOfLines={1}
      >
        {options?.title || route.name}
      </ThemedText>
    </View>
  );
});

/**
 * Custom floating tab bar implementation with animations
 */
function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { colorScheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  
  // Animation related values
  const indicatorPosition = useSharedValue(state.index * TAB_WIDTH);
  const [prevIndex, setPrevIndex] = useState(state.index);
  
  // Memoize tab positions to prevent recalculation
  const tabPositions = useCallback(() => [
    0, 
    TAB_WIDTH - 10, 
    TAB_WIDTH * 2 - 20, 
    TAB_WIDTH * 3 - 30, 
    TAB_WIDTH * 4 - 40
  ], [])();
  
  // Generate gradient colors based on theme - memoized
  const gradientColors = useCallback((): [string, string, ...string[]] => {
    return colorScheme === 'beast' 
      ? ['#8B5CF6', '#EC4899'] // Vibrant gradient for beast mode
      : ['#6366F1', '#3B82F6'];  // Calmer gradient for chill mode
  }, [colorScheme])();

  // Update indicator position when tab changes
  useEffect(() => {
    if (prevIndex !== state.index) {
      // Use optimized spring animation for smoother transitions
      indicatorPosition.value = withSpring(tabPositions[state.index], {
        damping: 20,
        stiffness: 150,
        mass: 0.8,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });
      setPrevIndex(state.index);
    }
  }, [state.index, prevIndex, tabPositions, indicatorPosition]);

  return (
    <Animated.View 
      entering={SlideInUp.delay(300).springify()}
      style={[
        styles.floatingTabBar,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: typeof colors.shadow === 'string' ? colors.shadow : '#000',
          bottom: insets.bottom ? insets.bottom + 10 : 25,
          height: TAB_BAR_HEIGHT,
        }
      ]}
      accessibilityRole="tablist"
    >
      {/* Animated Background Indicator */}
      <TabIndicator position={indicatorPosition} accentColor={colors.primary} />
      
      {/* Tab Items */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] || { options: {} };
        const isFocused = state.index === index;
        const isAddButton = route.name === 'add-habit';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            try {
              // Use navigate with merge to avoid stacking screens
              navigation.navigate({ 
                name: route.name, 
                params: undefined, 
                merge: true 
              });
            } catch (error) {
              console.error(`Failed to navigate to ${route.name}:`, error);
            }
          }
        };

        // Special rendering for add button (middle tab)
        if (isAddButton) {
          return (
            <AddButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              colors={colors}
              options={{
                ...options,
                tabBarIcon: props => {
                  const icon = options.tabBarIcon?.(props);
                  return icon && React.isValidElement(icon) ? icon : <></>;
                },
              }}
              gradientColors={gradientColors}
            />
          );
        }

        // Regular tab rendering
        return (
          <TabBarItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            colors={colors}
            options={{
              ...options,
              tabBarIcon: props => {
                const icon = options.tabBarIcon?.(props);
                return icon && React.isValidElement(icon) ? icon : <></>;
              },
            }}
          />
        );
      })}
    </Animated.View>
  );
}

// Optimized styles with better organization
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingTabBar: {
    flexDirection: 'row',
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 30,
    borderWidth: 1,
    elevation: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    zIndex: 1000,
    overflow: 'visible', // Allow the button to show
  },
  tabIndicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '85%',
    borderRadius: 20,
    zIndex: 0,
    marginVertical: 10,
    top: -6,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabIconContainer: {
    width: 45,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  tabLabelCenter: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -30,
    height: 90,
    zIndex: 2,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 3,
    overflow: 'visible',
    position: 'relative',
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonContent: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  }
});