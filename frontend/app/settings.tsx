import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

// Mock leaderboard data
const LEADERBOARD_DATA = [
  { id: '1', name: 'Sarah J.', streak: 42, points: 1250, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100' },
  { id: '2', name: 'Mike T.', streak: 36, points: 980, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100' },
  { id: '3', name: 'Alex R.', streak: 28, points: 820, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100' },
  { id: '4', name: 'You', streak: 15, points: 650, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100', isCurrentUser: true },
  { id: '5', name: 'Taylor J.', streak: 10, points: 420, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100' },
];

export default function SettingsScreen() {
  const { colors, mode, scheme, toggleMode, toggleColorScheme } = useTheme();
  const { setMode, setColorScheme } = useThemeStore();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(mode === 'dark');
  const [beastMode, setBeastMode] = useState(scheme === 'beast');

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    setMode(darkMode ? 'light' : 'dark');
  };

  // Handle color scheme toggle
  const handleColorSchemeToggle = () => {
    setBeastMode(!beastMode);
    setColorScheme(beastMode ? 'chill' : 'beast');
  };

  // Header gradient colors based on theme
  const getHeaderGradientColors = (): [string, string] => {
    if (mode === 'dark') {
      return scheme === 'beast' 
        ? ['#8B5CF6', '#EC4899'] // Vibrant gradient for beast mode (dark)
        : ['#5d9fd8', '#3a8bc9']; // Calm gradient for chill mode (dark)
    } else {
      return scheme === 'beast' 
        ? ['#DC2626', '#F59E0B'] // Vibrant gradient for beast mode (light)
        : ['#6366F1', '#3B82F6']; // Calm gradient for chill mode (light)
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Custom Header with Back Button */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={getHeaderGradientColors()}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <ThemedText style={styles.headerTitle}>Settings & Profile</ThemedText>
            </LinearGradient>
          </View>
          
          {/* Profile Card */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify().damping(12)}
            style={[styles.profileCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.profileHeader}>
              <Image
                source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/default-avatar.jpg')}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <ThemedText variant="subtitle">
                  {user?.displayName || 'User'}
                </ThemedText>
                <View style={styles.streakContainer}>
                  <IconSymbol 
                    name={scheme === 'beast' ? "flame.fill" : "sparkles"} 
                    size={14} 
                    color={colors.primary} 
                  />
                  <ThemedText 
                    variant="caption" 
                    style={{ color: colors.primary, fontFamily: colors.fonts.semiBold }}
                  >
                    15 day streak
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity style={[styles.editButton, { borderColor: colors.border }]}>
                <IconSymbol name="pencil" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText variant="title" style={{ color: colors.primary }}>87</ThemedText>
                <ThemedText variant="caption" style={{ color: colors.subtext }}>Total Tasks</ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText variant="title" style={{ color: colors.primary }}>15</ThemedText>
                <ThemedText variant="caption" style={{ color: colors.subtext }}>Streak Days</ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText variant="title" style={{ color: colors.primary }}>4</ThemedText>
                <ThemedText variant="caption" style={{ color: colors.subtext }}>Current Habits</ThemedText>
              </View>
            </View>
          </Animated.View>
          
          {/* Leaderboard Section */}
          <Animated.View 
            entering={FadeInDown.delay(300).springify().damping(12)}
          >
            <View style={styles.sectionHeader}>
              <ThemedText variant="subtitle">Leaderboard</ThemedText>
              <TouchableOpacity>
                <ThemedText style={{ color: colors.primary }}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.leaderboardCard, { backgroundColor: colors.card }]}>
              {LEADERBOARD_DATA.map((user, index) => (
                <View 
                  key={user.id}
                  style={[
                    styles.leaderboardItem, 
                    index < LEADERBOARD_DATA.length - 1 && { 
                      borderBottomWidth: 1, 
                      borderBottomColor: colors.border 
                    },
                    user.isCurrentUser && { 
                      backgroundColor: colors.primary + '10'
                    }
                  ]}
                >
                  <ThemedText variant="caption" style={styles.rankNumber}>{index + 1}</ThemedText>
                  <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <ThemedText style={user.isCurrentUser ? { fontFamily: colors.fonts.bold } : {}}>
                      {user.name}
                    </ThemedText>
                    <View style={styles.userStats}>
                      <IconSymbol 
                        name={scheme === 'beast' ? "flame.fill" : "sparkles"} 
                        size={12} 
                        color={colors.primary} 
                      />
                      <ThemedText 
                        variant="caption" 
                        style={{ color: colors.subtext, marginRight: 8 }}
                      >
                        {user.streak} day streak
                      </ThemedText>
                      <IconSymbol name="star.fill" size={12} color={colors.primary} />
                      <ThemedText variant="caption" style={{ color: colors.subtext }}>
                        {user.points} points
                      </ThemedText>
                    </View>
                  </View>
                  {index < 3 && (
                    <View 
                      style={[
                        styles.medal, 
                        { backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }
                      ]}
                    >
                      <ThemedText style={styles.medalText}>{index + 1}</ThemedText>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </Animated.View>
          
          {/* Settings Section */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify().damping(12)}
          >
            <View style={styles.sectionHeader}>
              <ThemedText variant="subtitle">Settings</ThemedText>
            </View>
            
            <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
              {/* Dark Mode Toggle */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol 
                      name={darkMode ? "moon.fill" : "sun.max.fill"} 
                      size={16} 
                      color={colors.primary} 
                    />
                  </View>
                  <ThemedText>Dark Mode</ThemedText>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : darkMode ? colors.primary : '#f4f3f4'}
                />
              </View>
              
              {/* Beast Mode Toggle */}
              <View style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol 
                      name={beastMode ? "flame.fill" : "leaf.fill"} 
                      size={16} 
                      color={colors.primary} 
                    />
                  </View>
                  <View>
                    <ThemedText>{beastMode ? 'Beast Mode' : 'Chill Mode'}</ThemedText>
                    <ThemedText variant="caption" style={{ color: colors.subtext }}>
                      {beastMode 
                        ? 'High intensity theme for action' 
                        : 'Relaxed theme for mindfulness'
                      }
                    </ThemedText>
                  </View>
                </View>
                <Switch
                  value={beastMode}
                  onValueChange={handleColorSchemeToggle}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : beastMode ? colors.primary : '#f4f3f4'}
                />
              </View>
              
              {/* Notifications Toggle */}
              <View style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol 
                      name={notifications ? "bell.fill" : "bell"} 
                      size={16} 
                      color={colors.primary} 
                    />
                  </View>
                  <ThemedText>Notifications</ThemedText>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : notifications ? colors.primary : '#f4f3f4'}
                />
              </View>
            </View>
            
            {/* Log Out Button */}
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: colors.error }]}
              onPress={() => router.replace('/(auth)/landing')}
            >
              <IconSymbol name="lock" size={18} color="#FFFFFF" />
              <ThemedText style={styles.logoutText}>Log Out</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  headerContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  leaderboardCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rankNumber: {
    width: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  medal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
