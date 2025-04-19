import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeStore } from '@/store/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Habit type
interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  streak: number;
  completed: boolean;
  isNegative?: boolean;
}

export default function DashboardScreen() {
  const { colors, scheme } = useTheme();
  const { user } = useAuthStore();
  const { setMode, setColorScheme } = useThemeStore();
  const [selectedTab, setSelectedTab] = useState<'today' | 'all'>('today');
  const [moodMode, setMoodMode] = useState<'growth' | 'action'>('growth');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch habits when component mounts
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Habits] Fetching habits...');
      
      // Direct API call
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://192.168.24.47:5001/api/habit/get-all-habits', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[Habits] Server returned non-JSON response:', contentType);
        console.error('[Habits] Status code:', response.status);
        
        // Try to get response text for debugging
        try {
          const responseText = await response.text();
          console.error('[Habits] Response text preview:', responseText.substring(0, 200));
        } catch (e) {
          console.error('[Habits] Could not read response text');
        }
        
        throw new Error(`Server returned non-JSON response with status ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[Habits] JSON Parse error:', parseError);
        console.error('[Habits] Response text:', responseText.substring(0, 200) + '...');
        throw new Error('Failed to parse server response as JSON');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch habits');
      }
      
      console.log('[Habits] Raw API response:', JSON.stringify(data, null, 2));
      
      // Check if habits array exists in the response
      const habitsData = data.habits || [];
      if (!Array.isArray(habitsData)) {
        console.error('[Habits] Expected habits array in response but got:', data);
        throw new Error('Invalid server response structure');
      }
      
      // Map the API response to our Habit interface
      const mappedHabits: Habit[] = habitsData.map((habit: any) => {
        const mappedHabit = {
          id: habit._id || habit.id || String(Math.random()),
          title: habit.title,
          description: habit.description,
          category: habit.category || 'wellness', // Default category if none provided
          streak: habit.streak || 0,
          completed: habit.completed || false,
          isNegative: habit.isNegative || false
        };
        
        console.log('[Habits] Mapped habit:', JSON.stringify(mappedHabit, null, 2));
        return mappedHabit;
      });
      
      console.log('[Habits] All mapped habits:', JSON.stringify(mappedHabits, null, 2));
      setHabits(mappedHabits);
    } catch (err) {
      console.error('[Habits] Failed to fetch habits:', err);
      setError('Failed to load habits. Please try again.');
      
      // Let's improve our logging to help with debugging
      if (err instanceof Error) {
        console.error('[Habits] Error details:', err.message);
      }
      
      // Fallback to sample data if API fails
      const fallbackHabits = [
        { id: '1', title: 'Morning Meditation', streak: 5, completed: true, category: 'wellness' },
        { id: '2', title: 'Read 20 pages', streak: 12, completed: false, category: 'learning' },
        { id: '3', title: 'Workout', streak: 3, completed: false, category: 'fitness' },
        { id: '4', title: 'Drink 2L water', streak: 15, completed: true, category: 'health' },
      ];
      
      console.log('[Habits] Using fallback habits data:', JSON.stringify(fallbackHabits, null, 2));
      setHabits(fallbackHabits);
    } finally {
      setLoading(false);
    }
  };

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
      // Optimistically update the UI
      setHabits(currentHabits => 
        currentHabits.map(habit => {
          if (habit.id === id) {
            const updatedHabit = { ...habit, completed: !habit.completed };
            console.log('[Habits] Updated habit in UI:', updatedHabit);
            return updatedHabit;
          }
          return habit;
        })
      );
      
      // Direct API call
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('[Habits] Calling API to track habit:', title);
      const response = await fetch('http://192.168.24.47:5001/api/habit/track-habit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to track habit');
      }
      
      console.log('[Habits] Track habit API response:', data);
      
      // Refresh habits after successful API call
      console.log('[Habits] Refreshing habits after successful habit tracking');
      fetchHabits();
      
    } catch (err) {
      console.error('[Habits] Failed to update habit:', err);
      Alert.alert('Error', 'Failed to update habit. Please try again.');
      
      // Revert the optimistic update
      const originalCompletion = habitToUpdate.completed;
      console.log('[Habits] Reverting to original completion status:', originalCompletion);
      setHabits(currentHabits => 
        currentHabits.map(habit => 
          habit.id === id ? { ...habit, completed: originalCompletion } : habit
        )
      );
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
