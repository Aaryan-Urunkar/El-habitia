import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeStore } from '@/store/themeStore';

export default function DashboardScreen() {
  const { colors, scheme } = useTheme();
  const { user } = useAuthStore();
  const { setMode, setColorScheme } = useThemeStore();
  const [selectedTab, setSelectedTab] = useState<'today' | 'all'>('today');
  const [moodMode, setMoodMode] = useState<'growth' | 'action'>('growth');

  // Placeholder data for habits - moved to local state to avoid Firebase dependencies
  const [habits, setHabits] = useState([
    { id: '1', name: 'Morning Meditation', streak: 5, completed: true, category: 'wellness' },
    { id: '2', name: 'Read 20 pages', streak: 12, completed: false, category: 'learning' },
    { id: '3', name: 'Workout', streak: 3, completed: false, category: 'fitness' },
    { id: '4', name: 'Drink 2L water', streak: 15, completed: true, category: 'health' },
  ]);

  // Toggle habit completion
  const toggleHabitCompletion = (id: string) => {
    setHabits(currentHabits => 
      currentHabits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
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

  const todayHabits = habits.filter(h => !h.completed);
  const displayHabits = selectedTab === 'today' ? todayHabits : habits;

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
          {displayHabits.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
              <IconSymbol name="checkmark.circle" size={48} color={colors.primary} />
              <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
                All done for today! Great job!
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
                  onPress={() => toggleHabitCompletion(habit.id)}
                >
                  {habit.completed && (
                    <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
                
                <View style={styles.habitInfo}>
                  <ThemedText>{habit.name}</ThemedText>
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
