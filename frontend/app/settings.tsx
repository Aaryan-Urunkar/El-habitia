import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

enum SettingsTab {
  Profile = 'profile',
  Leaderboard = 'leaderboard',
  Settings = 'settings'
}

export default function SettingsScreen() {
  const { colors, mode } = useTheme();
  const { user, logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<SettingsTab>(SettingsTab.Profile);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all data from AsyncStorage
              await AsyncStorage.clear();
              // Call the logout function from auth store
              logout();
              // Navigate back to login screen
              router.replace('/(auth)/landing');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Failed', 'An error occurred while logging out.');
            }
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    router.back();
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case SettingsTab.Profile:
        return (
          <Animated.View entering={FadeInRight.delay(100)} style={styles.tabContent}>
            <View style={styles.profileHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.card }]}>
                <Image
                  source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/default-avatar.jpg')}
                  style={styles.profileImage}
                />
              </View>
              <ThemedText style={[styles.userName, { fontFamily: colors.fonts.bold }]}>
                {user?.displayName || 'User'}
              </ThemedText>
              <ThemedText style={[styles.userEmail, { color: colors.subtext, fontFamily: colors.fonts.regular }]}>
                {user?.email || 'No email provided'}
              </ThemedText>
            </View>

            <View style={[styles.statsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={[styles.sectionTitle, { fontFamily: colors.fonts.semiBold }]}>Stats</ThemedText>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { fontFamily: colors.fonts.bold }]}>42</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.subtext }]}>Habits</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { fontFamily: colors.fonts.bold }]}>87%</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.subtext }]}>Completion</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { fontFamily: colors.fonts.bold }]}>28</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: colors.subtext }]}>Day Streak</ThemedText>
                </View>
              </View>
            </View>

            <View style={[styles.achievementsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={[styles.sectionTitle, { fontFamily: colors.fonts.semiBold }]}>Achievements</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementScroll}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <View 
                    key={item} 
                    style={[styles.achievementBadge, { backgroundColor: colors.background, borderColor: colors.border }]}
                  >
                    <IconSymbol name="trophy.fill" color={colors.primary} size={24} />
                    <ThemedText style={[styles.achievementText, { fontFamily: colors.fonts.medium }]}>
                      {`Trophy ${item}`}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        );
      
      case SettingsTab.Leaderboard:
        return (
          <Animated.View entering={FadeInRight.delay(100)} style={styles.tabContent}>
            <View style={[styles.leaderboardContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={[styles.sectionTitle, { fontFamily: colors.fonts.semiBold }]}>Global Leaderboard</ThemedText>
              
              {/* Leaderboard entries */}
              {[1, 2, 3, 4, 5].map((rank) => (
                <View 
                  key={rank}
                  style={[
                    styles.leaderboardItem,
                    { borderBottomColor: colors.border }
                  ]}
                >
                  <View style={styles.rankContainer}>
                    <ThemedText style={[styles.rankNumber, { fontFamily: colors.fonts.bold }]}>{rank}</ThemedText>
                  </View>
                  
                  <View style={styles.leaderUserInfo}>
                    <Image
                      source={require('@/assets/images/default-avatar.jpg')}
                      style={styles.leaderAvatar}
                    />
                    <ThemedText style={[styles.leaderName, { fontFamily: colors.fonts.medium }]}>
                      {rank === 3 && user?.displayName ? user.displayName : `User ${rank}`}
                    </ThemedText>
                  </View>
                  
                  <ThemedText style={[styles.leaderScore, { fontFamily: colors.fonts.bold }]}>
                    {1000 - (rank * 50)} pts
                  </ThemedText>
                </View>
              ))}
              
              <TouchableOpacity 
                style={[styles.viewMoreButton, { borderColor: colors.border }]}
              >
                <ThemedText style={{ fontFamily: colors.fonts.medium }}>View Full Leaderboard</ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      
      case SettingsTab.Settings:
        return (
          <Animated.View entering={FadeInRight.delay(100)} style={styles.tabContent}>
            <View style={[styles.settingsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={[styles.sectionTitle, { fontFamily: colors.fonts.semiBold }]}>Account Settings</ThemedText>
              
              <TouchableOpacity 
                style={[styles.settingsItem, { borderBottomColor: colors.border }]}
              >
                <IconSymbol name="person" color={colors.text} size={20} />
                <ThemedText style={[styles.settingsItemText, { fontFamily: colors.fonts.medium }]}>
                  Edit Profile
                </ThemedText>
                <IconSymbol name="chevron.right" color={colors.subtext} size={16} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.settingsItem, { borderBottomColor: colors.border }]}
              >
                <IconSymbol name="bell" color={colors.text} size={20} />
                <ThemedText style={[styles.settingsItemText, { fontFamily: colors.fonts.medium }]}>
                  Notifications
                </ThemedText>
                <IconSymbol name="chevron.right" color={colors.subtext} size={16} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.settingsItem, { borderBottomColor: colors.border }]}
              >
                <IconSymbol name="lock" color={colors.text} size={20} />
                <ThemedText style={[styles.settingsItemText, { fontFamily: colors.fonts.medium }]}>
                  Privacy & Security
                </ThemedText>
                <IconSymbol name="chevron.right" color={colors.subtext} size={16} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.settingsItem, { borderBottomColor: colors.border }]}
              >
                <IconSymbol name="paintbrush" color={colors.text} size={20} />
                <ThemedText style={[styles.settingsItemText, { fontFamily: colors.fonts.medium }]}>
                  Appearance
                </ThemedText>
                <IconSymbol name="chevron.right" color={colors.subtext} size={16} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.logoutButton, { borderColor: colors.error }]}
                onPress={handleLogout}
              >
                <IconSymbol name="arrow.right.square" color={colors.error} size={20} />
                <ThemedText style={[styles.logoutButtonText, { color: colors.error, fontFamily: colors.fonts.medium }]}>
                  Logout
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      
      default:
        return null;
    }
  };

  // Create tab switch buttons
  const TabButton = ({ tab, title, icon }: { tab: SettingsTab, title: string, icon: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && [styles.activeTabButton, { borderBottomColor: colors.primary }]
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <IconSymbol 
        name={icon} 
        color={activeTab === tab ? colors.primary : colors.subtext} 
        size={18} 
      />
      <ThemedText 
        style={[
          styles.tabButtonText,
          { 
            color: activeTab === tab ? colors.primary : colors.subtext,
            fontFamily: activeTab === tab ? colors.fonts.semiBold : colors.fonts.medium
          }
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <LinearGradient
        colors={mode === 'dark' ? ['#27272A', '#18181B'] : ['#FFFBEB', '#FFF8E6']}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <IconSymbol name="arrow.left" color={colors.text} size={24} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { fontFamily: colors.fonts.bold }]}>
          Settings
        </ThemedText>
        <View style={styles.headerRight} />
      </LinearGradient>
      
      {/* Tab Navigation */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        <TabButton tab={SettingsTab.Profile} title="Profile" icon="person.fill" />
        <TabButton tab={SettingsTab.Leaderboard} title="Leaderboard" icon="trophy.fill" />
        <TabButton tab={SettingsTab.Settings} title="Settings" icon="gear" />
      </View>
      
      {/* Content Area */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerRight: {
    width: 40,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabButtonText: {
    marginLeft: 6,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  statsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  achievementsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  achievementScroll: {
    flexDirection: 'row',
  },
  achievementBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 90,
    height: 90,
    borderWidth: 1,
  },
  achievementText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  leaderboardContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 18,
  },
  leaderUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  leaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  leaderName: {
    marginLeft: 10,
    fontSize: 16,
  },
  leaderScore: {
    fontSize: 16,
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  settingsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingsItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
