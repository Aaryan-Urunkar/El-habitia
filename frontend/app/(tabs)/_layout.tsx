import { Tabs } from 'expo-router';
import { StyleSheet, View, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/theme/ThemeProvider';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useState } from 'react';
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
  SlideInUp
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import HeaderBar from '@/components/HeaderBar';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5;

// Constant for tab bar height
const TAB_BAR_HEIGHT = 65; // Fixed height for the tab bar

export default function TabsLayout() {
  const { colors, scheme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useThemeStore();
  
  // Check authentication state here if needed
  const navigationState = useRootNavigationState();
  const { user } = useAuthStore();
  
  // Header gradient colors based on theme
  const getHeaderGradientColors = (): [string, string, ...string[]] => {
    if (mode === 'dark') {
      return colorScheme === 'beast' 
        ? ['#27272A', '#18181B'] 
        : ['#0a2638', '#051824'];
    } else {
      return colorScheme === 'beast' 
        ? ['#FFFBEB', '#FFF8E6'] 
        : ['#f1f9fe', '#e6f4fd'];
    }
  };
  
  useEffect(() => {
    if (!navigationState?.key) return;
    
    if (!user) {
      // Redirect to login if not authenticated
      // router.replace('/(auth)/login');
    }
  }, [navigationState?.key, user]);

  return (
    <ProtectedRoute>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.subtext,
            headerShown: false, // Hide the default header as we're using custom header
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTitleStyle: {
              fontFamily: colors.fonts.semiBold,
              fontSize: 18,
              color: colors.text,
            },
            // Add bottom padding to ensure content isn't hidden behind the tab bar
            tabBarStyle: {
              display: 'none', // Hide default tab bar as we're using custom implementation
              paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20,
            }
          }}
          tabBar={props => <FloatingTabBar {...props} />}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size, focused }) => (
                <IconSymbol name={focused ? "house.fill" : "house"} color={color} size={size} />
              ),
              // Custom header for Dashboard
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
                <IconSymbol name={focused ? "heart.fill" : "heart"} color={color} size={size} />
              ),
              // Custom header for Mood Tracker
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
                <IconSymbol name="plus.circle.fill" color="#FFF" size={size + 6} />
              ),
              // Custom header for Add Habit
              header: () => (
                <HeaderBar
                  title="Add Habit" 
                  gradientColors={getHeaderGradientColors()}
                />
              ),
            }}
            listeners={{
              tabPress: e => {
                // Optional: prevent default navigation and implement a modal
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
                <IconSymbol name={focused ? "bubble.fill" : "bubble"} color={color} size={size} />
              ),
              // Custom header for Chatbot
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
                <IconSymbol name={focused ? "person.3.fill" : "person.3"} color={color} size={size} />
              ),
              // Custom header for Community
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

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { colorScheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  
  // Animation related values
  const indicatorPosition = useSharedValue(state.index * TAB_WIDTH);
  const [prevIndex, setPrevIndex] = useState(state.index);
  
  // Fixed positions for each tab indicator
  const tabPositions = [0, TAB_WIDTH - 10, TAB_WIDTH * 2 - 20, TAB_WIDTH * 3 - 30, TAB_WIDTH * 4 - 40];

  // Update indicator position when tab changes with improved spring configuration
  useEffect(() => {
    if (prevIndex !== state.index) {
      // Use the pre-calculated position for exact alignment
      indicatorPosition.value = withSpring(tabPositions[state.index], {
        damping: 20,
        stiffness: 150,
        mass: 0.8, // Lower mass for quicker response
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });
      setPrevIndex(state.index);
      
      // Ensure navigation is properly set up
      const route = state.routes[state.index];
      if (route && !descriptors[route.key]?.navigation) {
        console.log(`Warning: Missing navigation for route ${route.name}`);
      }
    }
  }, [state.index, prevIndex, tabPositions]);
  
  // Generate gradient colors based on theme
  const gradientColors: [string, string, ...string[]] = colorScheme === 'beast' 
    ? ['#8B5CF6', '#EC4899'] // Vibrant gradient for beast mode
    : ['#6366F1', '#3B82F6']; // Calmer gradient for chill mode

  // Helper function to safely render tab bar icon
  interface TabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
  }

  interface TabBarOptions {
    tabBarIcon?: (props: TabBarIconProps) => JSX.Element;
  }

  const renderTabBarIcon = (options: TabBarOptions, props: TabBarIconProps): JSX.Element => {
    if (options.tabBarIcon && typeof options.tabBarIcon === 'function') {
      return options.tabBarIcon(props);
    }
    
    // Fallback icon if tabBarIcon is not provided
    return <IconSymbol name="circle" color={props.color} size={props.size} />;
  };

  // Improved animated style for the sliding indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      opacity: withTiming(1, { duration: 200 }),
      width: TAB_WIDTH, // Fixed width for consistent sizing
    };
  });

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
    >
      {/* Animated Background Indicator with improved styling */}
      <Animated.View 
        style={[
          styles.tabIndicator,
          indicatorStyle,
          { 
            backgroundColor: colors.primary + '20',
            borderRadius: 20,
          }
        ]} 
      />
      
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] || {};
        const isFocused = state.index === index;
        const isAddButton = route.name === 'add-habit';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Check if the route exists before navigating
            try {
              // Use navigate with merge to avoid stacking screens
              navigation.navigate({ name: route.name, params: undefined, merge: true });
            } catch (error) {
              console.error(`Failed to navigate to ${route.name}:`, error);
            }
          }
        };

        // Special styling for the add button (middle tab)
        if (isAddButton) {
          return (
            <View 
              key={route.key}
              style={[styles.tabItem, styles.addButtonContainer]}
            >
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
                  >
                    {renderTabBarIcon(options, {
                      focused: isFocused,
                      color: '#FFFFFF',
                      size: 24,
                    })}
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
              >
                {options?.title || route.name}
              </ThemedText>
            </View>
          );
        }

        // Regular tab styling
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <View style={styles.tabIconContainer}>
              {renderTabBarIcon(options, {
                focused: isFocused,
                color: isFocused ? colors.primary : colors.subtext,
                size: 22,
              })}
            </View>
            
            <ThemedText 
              style={[
                styles.tabLabel,
                { 
                  color: isFocused ? colors.primary : colors.subtext,
                  fontFamily: isFocused ? colors.fonts.semiBold : colors.fonts.regular,
                }
              ]}
            >
              {options?.title || route.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    overflow: 'visible', // Changed from 'hidden' to allow the button to show
  },
  tabIndicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '70%',  // Slightly shorter to better center behind icons
    borderRadius: 20,
    zIndex: 0,
    marginVertical: 10, // Increased margin to center it better vertically
    top: 5, // Add top position to center it vertically
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
  activeTabBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    zIndex: -1,
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
    justifyContent: 'flex-start',
    marginTop: -30,
    height: 90,
    zIndex: 2, // Ensure it's above the tab bar
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
    elevation: 8, // Increased from 5
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Increased from 0.25
    shadowRadius: 8, // Increased from 5
    zIndex: 3, // Higher than the container
    overflow: 'visible', // Make sure it's not being clipped
    position: 'relative', // Ensure proper positioning
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
  },
  expandIndicator: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  expandIndicatorBar: {
    width: 40,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.5,
  },
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
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
  headerTitle: {
    fontSize: 22,
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