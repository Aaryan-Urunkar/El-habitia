import { StyleSheet, View, Switch, TouchableOpacity, ScrollView, Image, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
// Removing the Button import since we'll implement our own button
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
        <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
          <Image
            source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/default-avatar.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <ThemedText variant="subtitle">{user?.displayName || 'User'}</ThemedText>
            <ThemedText variant="caption">{user?.email}</ThemedText>
            <ThemedText variant="caption" style={{ color: colors.primary, marginTop: 4 }}>
              {user?.personality ? `${user.personality} type` : 'Complete personality quiz'}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>Appearance</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <IconSymbol 
                name={isDarkMode ? "moon.fill" : "sun.max.fill"} 
                size={22} 
                color={colors.text} 
                style={styles.settingIcon}
              />
              <ThemedText>Dark Mode</ThemedText>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleMode}
              value={isDarkMode}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <IconSymbol 
                name={isBeastMode ? "flame.fill" : "leaf.fill"} 
                size={22} 
                color={colors.text} 
                style={styles.settingIcon}
              />
              <ThemedText>Beast Mode</ThemedText>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleColorScheme}
              value={isBeastMode}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>Account</ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <IconSymbol name="person.fill" size={22} color={colors.text} style={styles.settingIcon} />
              <ThemedText>Edit Profile</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <IconSymbol name="bell.fill" size={22} color={colors.text} style={styles.settingIcon} />
              <ThemedText>Notifications</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <IconSymbol name="lock.fill" size={22} color={colors.text} style={styles.settingIcon} />
              <ThemedText>Privacy</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Replace the Button component with a direct TouchableOpacity implementation */}
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { borderColor: colors.error, borderWidth: 1, borderRadius: 8 }
          ]} 
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <ThemedText style={{ color: colors.error, textAlign: 'center' }}>
              Logout
            </ThemedText>
          )}
        </TouchableOpacity>
        
        <ThemedText variant="caption" style={styles.versionText}>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 16,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
  },
});
