import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeStore } from '@/store/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore, useLoadHabits, trackHabitApi, Habit } from '@/store/habitStore';

export default function DashboardScreen() {
  const { colors, scheme } = useTheme();
  const { user } = useAuthStore();
  const { setMode, setColorScheme } = useThemeStore();
  const [selectedTab, setSelectedTab] = useState<'today' | 'all'>('today');
  const [moodMode, setMoodMode] = useState<'growth' | 'action'>('growth');
  
  // Use our Zustand store
  const { habits, loading, error, updateHabit, addHabit } = useHabitStore();
  const loadHabits = useLoadHabits();
  
  // Fetch habits when component mounts
  useEffect(() => {
    loadHabits();
  }, []);

  // Toggle habit completion
  const toggleHabitCompletion = async (id: string, title: string) => {
    const habitToUpdate = habits.find(h => h.id === id);
    if (!habitToUpdate) {
      console.log('[Habits] No habit found with id:', id);
      return;
    }

    console.log('[Habits] Toggling habit completion:', habitToUpdate);
    console.log('[Habits] Current completion status:', habitToUpdate.completed);
    
    try {
      // Only proceed with API call if habit is not completed
      if (!habitToUpdate.completed) {
        // Optimistically update the UI
        updateHabit(id, { completed: true });
        
        // Call the track habit API
        const response = await trackHabitApi(title);
        console.log('[Habits] Habit tracking response:', response);
        
        // If the habit has a new streak, update it
        if (response && response.streak) {
          updateHabit(id, { streak: response.streak });
        }
        
        // Move to "All Habits" tab after completion
        setSelectedTab('all');

        // Reload habits to ensure UI is in sync with backend
        loadHabits();
      } else {
        // If already completed, just show an alert
        Alert.alert(
          "Habit Already Completed", 
          "This habit has already been completed today."
        );
      }
    } catch (err) {
      console.error('[Habits] Failed to update habit:', err);
      Alert.alert('Error', 'Failed to update habit. Please try again.');
      
      // Revert the optimistic update
      updateHabit(id, { completed: habitToUpdate.completed });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wellness':
        return 'heart.fill';
      case 'learning':
        return 'book.fill';
      case 'fitness':
        return 'figure.walk';
      case 'health':
        return 'drop.fill';
      case 'productivity':
        return 'checkmark.circle.fill';
      default:
        return 'star.fill';
    }
  };

  const toggleMoodMode = () => {
    const newMode = moodMode === 'growth' ? 'action' : 'growth';
    setMoodMode(newMode);
    
    // Update theme based on mood mode
    if (newMode === 'growth') {
      // Growth mode uses light chill theme
      setMode('light');
      setColorScheme('chill');
    } else {
      // Action mode uses dark beast theme
      setMode('dark');
      setColorScheme('beast');
    }
  };

  // Filter habits for Today tab - only show uncompleted habits
  const todayHabits = habits.filter(h => !h.completed);
  console.log('[Habits] Today habits count:', todayHabits.length);
  
  const displayHabits = selectedTab === 'today' ? todayHabits : habits;
  console.log('[Habits] Display habits count:', displayHabits.length, 'for tab:', selectedTab);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* The header is now part of the tab navigator */}
        
        {/* Toggle Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              selectedTab === 'today' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedTab('today')}
          >
            <ThemedText 
              style={{ 
                color: selectedTab === 'today' ? '#FFFFFF' : colors.text,
                fontFamily: colors.fonts.medium 
              }}
            >
              Today
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              selectedTab === 'all' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedTab('all')}
          >
            <ThemedText 
              style={{ 
                color: selectedTab === 'all' ? '#FFFFFF' : colors.text,
                fontFamily: colors.fonts.medium 
              }}
            >
              All Habits
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Mood Toggle Button - now as a standalone component */}
        <TouchableOpacity 
          style={[styles.moodToggleButton, { backgroundColor: colors.card }]} 
          onPress={toggleMoodMode}
        >
          <ThemedText style={styles.moodIcon}>
            {moodMode === 'growth' ? '🌿' : '⚡'}
          </ThemedText>
          <ThemedText variant="caption" style={styles.moodText}>
            {moodMode === 'growth' ? 'Switch to Action Mode' : 'Switch to Growth Mode'}
          </ThemedText>
        </TouchableOpacity>
        
        {/* Habits List */}
        <View style={styles.habitsContainer}>
          {loading ? (
            <ThemedText style={{ textAlign: 'center' }}>Loading habits...</ThemedText>
          ) : error ? (
            <ThemedText style={{ textAlign: 'center', color: colors.error }}>{error}</ThemedText>
          ) : displayHabits.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
              <IconSymbol name="checkmark.circle" size={48} color={colors.primary} />
              <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
                {selectedTab === 'today' ? 'All done for today! Great job!' : 'No habits yet. Add some habits to get started!'}
              </ThemedText>
            </View>
          ) : (
            displayHabits.map((habit, index) => (
              <Animated.View 
                key={habit.id} 
                entering={FadeInDown.delay(index * 100).springify()}
                style={[
                  styles.habitCard, 
                  { 
                    backgroundColor: colors.card,
                    borderLeftColor: colors.primary,
                  }
                ]}
              >
                <TouchableOpacity 
                  style={[
                    styles.checkbox, 
                    { 
                      borderColor: colors.primary,
                      backgroundColor: habit.completed ? colors.primary : 'transparent' 
                    }
                  ]}
                  onPress={() => toggleHabitCompletion(habit.id, habit.title)}
                >
                  {habit.completed && (
                    <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
                
                <View style={styles.habitInfo}>
                  <ThemedText>{habit.title}</ThemedText>
                  {habit.description && (
                    <ThemedText variant="caption" style={{ color: colors.subtext }}>
                      {habit.description}
                    </ThemedText>
                  )}
                  <View style={styles.streakContainer}>
                    <IconSymbol 
                      name={scheme === 'beast' ? "flame.fill" : "sparkles"} 
                      size={12} 
                      color={colors.primary} 
                    />
                    <ThemedText variant="caption" style={{ color: colors.primary }}>
                      {habit.streak} day streak
                    </ThemedText>
                  </View>
                </View>
                
                <View style={[styles.categoryBadge, { backgroundColor: colors.background }]}>
                  <IconSymbol name={getCategoryIcon(habit.category)} size={14} color={colors.primary} />
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    // Remove paddingBottom as it's now handled by the tab navigator
  },
  moodToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  moodIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  moodText: {
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  habitsContainer: {
    gap: 12,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
    marginLeft: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  categoryBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 16,
  },
});
