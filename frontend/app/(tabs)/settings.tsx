import { StyleSheet, View, Switch, TouchableOpacity, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuthStore } from '@/store/authStore';

export default function SettingsScreen() {
  const { colors, mode, scheme, toggleMode, toggleColorScheme } = useTheme();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const isDarkMode = mode === 'dark';
  const isBeastMode = scheme === 'beast';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header with gradient */}
        <Animated.View 
          entering={FadeIn.duration(600)}
          style={[styles.profileSection, { backgroundColor: colors.card }]}
        >
          <LinearGradient
            colors={isBeastMode ? ['#EF4444', '#F59E0B'] : ['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          />
          
          <View style={styles.profileContent}>
            <View style={styles.profileImageContainer}>
              <Image
                source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/default-avatar.jpg')}
                style={styles.profileImage}
              />
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText variant="subtitle" style={styles.profileName}>
                {user?.displayName || 'User'}
              </ThemedText>
              <ThemedText variant="caption" style={styles.profileEmail}>
                {user?.email}
              </ThemedText>
              <TouchableOpacity>
                <ThemedText variant="caption" style={{ color: '#FFFFFF', marginTop: 4 }}>
                  {user?.personality ? `${user.personality} type` : 'Complete personality quiz →'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Settings Sections */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <ThemedText variant="subtitle" style={[styles.sectionTitle, { borderBottomColor: colors.border }]}>
            Appearance
          </ThemedText>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={toggleMode}
          >
            <View style={styles.settingLabelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc' }]}>
                <IconSymbol 
                  name={isDarkMode ? "moon.fill" : "sun.max.fill"} 
                  size={20} 
                  color={isDarkMode ? '#94a3b8' : '#f59e0b'} 
                />
              </View>
              <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDarkMode ? colors.primary : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleMode}
              value={isDarkMode}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={toggleColorScheme}
          >
            <View style={styles.settingLabelContainer}>
              <View style={[styles.iconContainer, { 
                backgroundColor: isBeastMode ? '#fef2f2' : '#f0f9ff'
              }]}>
                <IconSymbol 
                  name={isBeastMode ? "flame.fill" : "leaf.fill"} 
                  size={20} 
                  color={isBeastMode ? '#ef4444' : '#16a34a'} 
                />
              </View>
              <View>
                <ThemedText style={styles.settingLabel}>Beast Mode</ThemedText>
                <ThemedText variant="caption" style={styles.settingDescription}>
                  {isBeastMode ? 'Intense, energetic theme' : 'Calm, focused theme'}
                </ThemedText>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isBeastMode ? colors.primary : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleColorScheme}
              value={isBeastMode}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <ThemedText variant="subtitle" style={[styles.sectionTitle, { borderBottomColor: colors.border }]}>
            Account
          </ThemedText>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLabelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <IconSymbol name="person.fill" size={20} color={colors.primary} />
              </View>
              <ThemedText style={styles.settingLabel}>Edit Profile</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLabelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <IconSymbol name="bell.fill" size={20} color={colors.primary} />
              </View>
              <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <IconSymbol name="lock.fill" size={20} color={colors.primary} />
              </View>
              <ThemedText style={styles.settingLabel}>Privacy</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { backgroundColor: isLoggingOut ? 'transparent' : colors.error + '15', borderRadius: 12 }
          ]} 
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <View style={styles.logoutContent}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={colors.error} />
              <ThemedText style={{ color: colors.error, marginLeft: 8, fontWeight: '600' }}>
                Logout
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
        
        <ThemedText variant="caption" style={[styles.versionText, { color: colors.subtext }]}>
          El-Habitia v1.0.0
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  profileSection: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  profileGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 40,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    padding: 16,
    borderBottomWidth: 1,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
});
