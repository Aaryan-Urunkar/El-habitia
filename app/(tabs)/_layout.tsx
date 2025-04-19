import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/components/theme/ThemeProvider';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { ThemedText } from '@/components/ui/ThemedText';

export default function TabsLayout() {
  const { colors, scheme } = useTheme();
  const { user, isLoading } = useAuthStore();
  const rootNavigationState = useRootNavigationState();
  
  useEffect(() => {
    // Only redirect when the navigation is ready and authentication check is complete
    if (!isLoading && !user && rootNavigationState?.key) {
      router.replace('/(auth)/landing');
    }
  }, [user, isLoading, rootNavigationState?.key]);

  // Show loading state while checking authentication
  if (isLoading || !rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  // Don't render tabs until we're sure user is authenticated
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: colors.fonts.medium,
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontFamily: colors.fonts.semiBold,
          fontSize: 18,
          color: colors.text,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          title: 'Add Habit',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="plus.circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person.3" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="gearshape" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
