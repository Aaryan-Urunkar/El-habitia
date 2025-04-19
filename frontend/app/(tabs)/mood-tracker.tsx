import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/ui/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import  HeaderBar from '@/components/HeaderBar';
import { useThemeStore } from '@/store/themeStore';

// Mock data for mood history
const MOCK_MOOD_DATA = [
  { date: '2023-05-01', mood: 'great', note: 'Had a productive day!' },
  { date: '2023-05-02', mood: 'good', note: 'Completed my morning routine.' },
  { date: '2023-05-03', mood: 'okay', note: 'Missed my workout today.' },
  { date: '2023-05-04', mood: 'bad', note: 'Struggled with focus.' },
  { date: '2023-05-05', mood: 'great', note: 'Got a promotion at work!' },
  { date: '2023-05-06', mood: 'great', note: 'Perfect day with family.' },
  { date: '2023-05-07', mood: 'good', note: 'Made progress on my side project.' },
];

const MOOD_TYPES = [
  { id: 'great', emoji: '😁', label: 'Great', color: '#4CAF50' },
  { id: 'good', emoji: '🙂', label: 'Good', color: '#8BC34A' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#FFC107' },
  { id: 'bad', emoji: '😔', label: 'Bad', color: '#FF9800' },
  { id: 'awful', emoji: '😢', label: 'Awful', color: '#F44336' },
];

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const BAR_WIDTH = CHART_WIDTH / 7 - 10; // 7 days with spacing

// MoodCategoryButton component similar to what's in index.tsx
function MoodCategoryButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
      <View style={styles.iconContainer}>
        <ThemedText style={styles.icon}>{icon}</ThemedText>
      </View>
      <ThemedText style={styles.categoryLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

export default function MoodTrackerScreen() {
  const { colors, scheme, mode } = useTheme();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodData, setMoodData] = useState(MOCK_MOOD_DATA);
  const [activeView, setActiveView] = useState<'today' | 'history'>('today');
  const { colorScheme } = useThemeStore();

  // Get current date formatted
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate mood stats from data
  const getMoodStats = () => {
    const counts = { great: 0, good: 0, okay: 0, bad: 0, awful: 0 };
    moodData.forEach(item => {
      counts[item.mood as keyof typeof counts] = (counts[item.mood as keyof typeof counts] || 0) + 1;
    });
    
    // Find the most common mood
    let mostCommonMood = 'good';
    let maxCount = 0;
    
    Object.entries(counts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count as number;
        mostCommonMood = mood;
      }
    });
    
    return {
      counts,
      mostCommonMood,
      totalDays: moodData.length,
      averageRating: (
        (counts.great * 5 + counts.good * 4 + counts.okay * 3 + counts.bad * 2 + counts.awful * 1) / 
        (counts.great + counts.good + counts.okay + counts.bad + counts.awful)
      ).toFixed(1)
    };
  };
  
  const stats = getMoodStats();
  
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

  // Handle mood selection and submission
  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newMoodEntry = {
      date: today,
      mood: selectedMood,
      note: moodNote,
    };
    
    // In a real app, this would be sent to your backend
    setMoodData([...moodData, newMoodEntry]);
    setSelectedMood(null);
    setMoodNote('');
    
    // Switch to history view to see the new entry
    setActiveView('history');
  };
  
  // Get the appropriate gradient colors based on mood and theme
  const getMoodGradient = (mood: string): [string, string] => {
    switch(mood) {
      case 'great':
        return scheme === 'beast' ? ['#10B981', '#059669'] : ['#10B981', '#34D399'];
      case 'good':
        return scheme === 'beast' ? ['#8B5CF6', '#6D28D9'] : ['#8B5CF6', '#A78BFA'];
      case 'okay':
        return scheme === 'beast' ? ['#F59E0B', '#D97706'] : ['#F59E0B', '#FBBF24'];
      case 'bad':
        return scheme === 'beast' ? ['#F97316', '#EA580C'] : ['#F97316', '#FB923C'];
      case 'awful':
        return scheme === 'beast' ? ['#EF4444', '#B91C1C'] : ['#EF4444', '#F87171'];
      default:
        return scheme === 'beast' ? ['#6366F1', '#4F46E5'] : ['#6366F1', '#818CF8'];
    }
  };
  
  // Find mood details by id
  const getMoodDetails = (moodId: string) => {
    return MOOD_TYPES.find(m => m.id === moodId) || MOOD_TYPES[0];
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <HeaderBar
              title="Mood Tracker" 
              gradientColors={getHeaderGradientColors()}
            />
      <View style={styles.container}>
        {/* Header Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeView === 'today' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveView('today')}
          >
            <ThemedText 
              style={{ 
                color: activeView === 'today' ? '#FFFFFF' : colors.text,
                fontFamily: colors.fonts.medium 
              }}
            >
              Today's Mood
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeView === 'history' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveView('history')}
          >
            <ThemedText 
              style={{ 
                color: activeView === 'history' ? '#FFFFFF' : colors.text,
                fontFamily: colors.fonts.medium 
              }}
            >
              Mood History
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeView === 'today' ? (
            <Animated.View entering={FadeIn.duration(400)}>
              {/* Question Card - Similar to index.tsx */}
              <View style={styles.dateContainer}>
                <ThemedText variant="caption" style={{ color: colors.subtext }}>TODAY</ThemedText>
                <ThemedText variant="subtitle">{getCurrentDate()}</ThemedText>
              </View>
              
              <LinearGradient
                colors={scheme === 'beast' 
                  ? ["#27272A", "#18181B"] // Darker gradient for beast mode
                  : ["#E0F7FA", "#B2EBF2"]}
                style={styles.questionCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ThemedText style={[
                  styles.questionText,
                  { color: scheme === 'beast' ? '#FFFFFF' : '#000000' }
                ]}>
                  How are you feeling today?
                </ThemedText>

                <View style={styles.categoriesContainer}>
                  <View style={styles.categoryRow}>
                    {MOOD_TYPES.slice(0, 3).map(mood => (
                      <MoodCategoryButton 
                        key={mood.id}
                        icon={mood.emoji} 
                        label={mood.label}
                        onPress={() => setSelectedMood(mood.id)}
                      />
                    ))}
                  </View>
                  <View style={styles.categoryRow}>
                    {MOOD_TYPES.slice(3).map(mood => (
                      <MoodCategoryButton 
                        key={mood.id}
                        icon={mood.emoji} 
                        label={mood.label}
                        onPress={() => setSelectedMood(mood.id)}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput 
                    style={[
                      styles.input, 
                      { 
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: scheme === 'beast' ? colors.border : 'transparent',
                        borderWidth: scheme === 'beast' ? 1 : 0
                      }
                    ]} 
                    placeholder="Add a note about your day..." 
                    placeholderTextColor={colors.subtext}
                    value={moodNote}
                    onChangeText={setMoodNote}
                  />
                  <TouchableOpacity 
                    style={[styles.sendButton, { backgroundColor: colors.primary }]}
                    onPress={handleMoodSubmit}
                    disabled={!selectedMood}
                  >
                    <Feather name="send" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              <ThemedText style={[
                styles.sectionTitle,
                { color: scheme === 'beast' ? colors.text : "#555" }
              ]}>Recommendation based on mood</ThemedText>

              <View style={[
                styles.recommendationCard, 
                { 
                  backgroundColor: colors.card,
                  borderColor: scheme === 'beast' ? colors.border : 'transparent',
                  borderWidth: scheme === 'beast' ? 1 : 0 
                }
              ]}>
                <ThemedText style={[
                  styles.recommendationTitle,
                  { color: colors.text }
                ]}>Improve your sleep</ThemedText>

                <View style={styles.sleepInfoContainer}>
                  <View style={styles.sleepCircleContainer}>
                    <View style={[
                      styles.sleepCircleOuter, 
                      { 
                        borderColor: scheme === 'beast' ? '#EF4444' : colors.primary, 
                        opacity: 0.3 
                      }
                    ]}>
                      <View style={[
                        styles.sleepCircleInner, 
                        { 
                          borderColor: scheme === 'beast' ? '#EF4444' : colors.primary, 
                          opacity: 0.6 
                        }
                      ]}>
                        <View style={[
                          styles.sleepCircleCore, 
                          { 
                            backgroundColor: scheme === 'beast' ? '#EF4444' : colors.primary 
                          }
                        ]} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.sleepTextContainer}>
                    <ThemedText style={styles.sleepMainText}>Complete a short guided meditation</ThemedText>
                    <ThemedText style={[styles.courseText, { color: colors.primary }]}>See more sleep courses →</ThemedText>
                  </View>
                </View>
              </View>
              
              {/* Existing mood tips cards */}
              <View style={[styles.tipsCard, { backgroundColor: colors.card }]}>
                <ThemedText variant="subtitle" style={styles.sectionTitle}>Mood Boosters</ThemedText>
                
                <View style={styles.tipsList}>
                  <View style={[styles.tipItem, { borderColor: colors.border }]}>
                    <View style={[styles.tipIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="sun.max.fill" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.tipContent}>
                      <ThemedText style={styles.tipTitle}>Get some sunlight</ThemedText>
                      <ThemedText variant="caption" style={{ color: colors.subtext }}>
                        15 minutes of sunlight can boost your vitamin D and mood
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={[styles.tipItem, { borderColor: colors.border }]}>
                    <View style={[styles.tipIcon, { backgroundColor: colors.success + '20' }]}>
                      <IconSymbol name="figure.walk" size={18} color={colors.success} />
                    </View>
                    <View style={styles.tipContent}>
                      <ThemedText style={styles.tipTitle}>Take a short walk</ThemedText>
                      <ThemedText variant="caption" style={{ color: colors.subtext }}>
                        Even a 10-minute walk can clear your mind and reduce stress
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <View style={[styles.tipIcon, { backgroundColor: colors.secondary + '20' }]}>
                      <IconSymbol name="drop.fill" size={18} color={colors.secondary} />
                    </View>
                    <View style={styles.tipContent}>
                      <ThemedText style={styles.tipTitle}>Stay hydrated</ThemedText>
                      <ThemedText variant="caption" style={{ color: colors.subtext }}>
                        Dehydration can affect your mood and energy levels
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(400)}>
              {/* Mood History Section */}
              <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
                <ThemedText variant="subtitle" style={styles.sectionTitle}>Weekly Mood Chart</ThemedText>
                
                <View style={styles.chartContainer}>
                  {/* Chart bars */}
                  <View style={styles.chart}>
                    {moodData.slice(-7).map((day, index) => {
                      const moodDetails = getMoodDetails(day.mood);
                      // Calculate height based on mood (5 is great, 1 is awful)
                      const moodValue = 5 - MOOD_TYPES.findIndex(m => m.id === day.mood);
                      const height = (moodValue / 5) * 100; // percentage of max height
                      
                      return (
                        <Animated.View
                          key={`${day.date}-${index}`}
                          entering={FadeInDown.delay(index * 100).springify()}
                          style={styles.barContainer}
                        >
                          <LinearGradient
                            colors={getMoodGradient(day.mood)}
                            style={[
                              styles.bar,
                              { height: `${height}%` }
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          />
                          <ThemedText style={styles.barLabel}>
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2)}
                          </ThemedText>
                        </Animated.View>
                      );
                    })}
                  </View>
                  
                  {/* Y-axis labels */}
                  <View style={styles.chartLabels}>
                    {MOOD_TYPES.map((mood, index) => (
                      <ThemedText 
                        key={mood.id} 
                        style={[
                          styles.chartLabel, 
                          { top: `${(index * 20) + 10}%`, color: colors.subtext }
                        ]}
                      >
                        {mood.emoji}
                      </ThemedText>
                    ))}
                  </View>
                </View>
              </View>
              
              {/* Mood Insights Section */}
              <View style={[styles.insightsCard, { backgroundColor: colors.card }]}>
                <ThemedText variant="subtitle" style={styles.sectionTitle}>Your Mood Insights</ThemedText>
                
                <View style={styles.statContainer}>
                  <View style={styles.statItem}>
                    <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
                    <ThemedText variant="caption" style={{ color: colors.subtext, marginTop: 8 }}>
                      Average Mood
                    </ThemedText>
                    <ThemedText style={{ fontFamily: colors.fonts.semiBold }}>
                      {stats.averageRating}/5.0
                    </ThemedText>
                  </View>
                  
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  
                  <View style={styles.statItem}>
                    <ThemedText style={{ fontSize: 24 }}>
                      {getMoodDetails(stats.mostCommonMood).emoji}
                    </ThemedText>
                    <ThemedText variant="caption" style={{ color: colors.subtext, marginTop: 8 }}>
                      Most Common
                    </ThemedText>
                    <ThemedText style={{ fontFamily: colors.fonts.semiBold }}>
                      {getMoodDetails(stats.mostCommonMood).label}
                    </ThemedText>
                  </View>
                  
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  
                  <View style={styles.statItem}>
                    <IconSymbol name="calendar" size={24} color={colors.primary} />
                    <ThemedText variant="caption" style={{ color: colors.subtext, marginTop: 8 }}>
                      Days Tracked
                    </ThemedText>
                    <ThemedText style={{ fontFamily: colors.fonts.semiBold }}>
                      {stats.totalDays}
                    </ThemedText>
                  </View>
                </View>
                
                <TouchableOpacity style={[styles.viewAllButton, { borderColor: colors.border }]}>
                  <ThemedText style={{ color: colors.primary }}>View All Entries</ThemedText>
                  <IconSymbol name="chevron.right" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  dateContainer: {
    marginBottom: 16,
  },
  moodCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tipsList: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  chartContainer: {
    height: 200,
    flexDirection: 'row',
    marginVertical: 20,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  chartLabels: {
    width: 30,
    height: '100%',
    justifyContent: 'space-between',
    position: 'relative',
  },
  chartLabel: {
    position: 'absolute',
    right: 0,
    fontSize: 12,
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  insightsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    gap: 8,
  },
  
  // New styles for card components from index.tsx
  questionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#000',
    marginBottom: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  categoryButton: {
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF", // This should remain light to contrast with emojis
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Medium',
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  recommendationCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 15,
  },
  sleepInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sleepCircleContainer: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  sleepCircleOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sleepCircleInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sleepCircleCore: {
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.9,
  },
  sleepTextContainer: {
    flex: 1,
  },
  sleepMainText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    marginBottom: 5,
  },
  courseText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
  },
});
