import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ui/ThemedText';
import { TextInput } from '@/components/ui/TextInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';
import { createHabit } from '@/api/habit';

// Habit categories
const CATEGORIES = [
  { id: 'wellness', name: 'Wellness', icon: 'heart.fill' },
  { id: 'fitness', name: 'Fitness', icon: 'figure.walk' },
  { id: 'learning', name: 'Learning', icon: 'book.fill' },
  { id: 'health', name: 'Health', icon: 'drop.fill' },
  { id: 'productivity', name: 'Productivity', icon: 'checkmark.circle.fill' },
];

export default function AddHabitScreen() {
  const { colors, scheme } = useTheme();
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [recurrence, setRecurrence] = useState('daily');
  const [isNegative, setIsNegative] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async () => {
    // Simple validation
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a habit name');
      return;
    }
    
    if (!category) {
      Alert.alert('Missing Information', 'Please select a category');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call the API to create the habit
      await createHabit({
        title: name,
        description: description,
        isNegative: isNegative
      });
      
      Alert.alert(
        'Success!', 
        'Your new habit has been created.',
        [
          { text: 'OK', onPress: () => router.push('./index') }
        ]
      );
    } catch (err) {
      console.error('Failed to create habit:', err);
      setError('Failed to create habit. Please try again.');
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View 
            entering={FadeIn.duration(600)}
            style={[styles.formContainer, { backgroundColor: colors.card }]}
          >
            <View style={styles.header}>
              <ThemedText variant="subtitle" style={styles.headerTitle}>Create New Habit</ThemedText>
              <ThemedText variant="caption">What habit would you like to build?</ThemedText>
            </View>
            
            {/* Habit Name */}
            <TextInput
              label="Habit Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Morning Meditation"
              style={styles.input}
            />
            
            {/* Description */}
            <TextInput
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. 10 minutes of mindfulness"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
            
            {/* Category Selection */}
            <View style={styles.sectionContainer}>
              <ThemedText variant="subtitle" style={styles.sectionTitle}>Category</ThemedText>
              <View style={styles.categoriesContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      category === cat.id && { 
                        backgroundColor: colors.primary + '20',
                        borderColor: colors.primary 
                      }
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <View 
                      style={[
                        styles.iconCircle, 
                        { 
                          backgroundColor: category === cat.id 
                            ? colors.primary 
                            : colors.background 
                        }
                      ]}
                    >
                      <IconSymbol 
                        name={cat.icon} 
                        size={16} 
                        color={category === cat.id ? '#FFFFFF' : colors.text} 
                      />
                    </View>
                    <ThemedText 
                      style={[
                        styles.categoryText,
                        category === cat.id && { 
                          color: colors.primary,
                          fontFamily: colors.fonts.semiBold
                        }
                      ]}
                    >
                      {cat.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Recurrence */}
            <View style={styles.sectionContainer}>
              <ThemedText variant="subtitle" style={styles.sectionTitle}>Recurrence</ThemedText>
              <View style={[
                styles.radioGroup, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border 
                }
              ]}>
                <TouchableOpacity 
                  style={[
                    styles.radioButton, 
                    recurrence === 'daily' && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary 
                    }
                  ]}
                  onPress={() => setRecurrence('daily')}
                >
                  <ThemedText 
                    style={[
                      styles.radioText,
                      recurrence === 'daily' && { color: '#FFFFFF' }
                    ]}
                  >
                    Daily
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.radioButton, 
                    recurrence === 'weekly' && { 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary 
                    }
                  ]}
                  onPress={() => setRecurrence('weekly')}
                >
                  <ThemedText 
                    style={[
                      styles.radioText,
                      recurrence === 'weekly' && { color: '#FFFFFF' }
                    ]}
                  >
                    Weekly
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Is Negative Toggle */}
            <View style={styles.toggleContainer}>
              <View>
                <ThemedText>Negative Habit (to avoid)</ThemedText>
                <ThemedText variant="caption" style={{ color: colors.subtext }}>
                  Toggle this for habits you want to break
                </ThemedText>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: colors.error }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isNegative ? colors.error : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setIsNegative}
                value={isNegative}
              />
            </View>
            
            {/* Visibility Toggle */}
            <View style={styles.toggleContainer}>
              <View>
                <ThemedText>Make this habit public</ThemedText>
                <ThemedText variant="caption" style={{ color: colors.subtext }}>
                  Others can see and get inspired by your habit
                </ThemedText>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isPublic ? colors.primary : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setIsPublic}
                value={isPublic}
              />
            </View>
            
            {/* Error message */}
            {error && (
              <ThemedText style={{ color: colors.error, textAlign: 'center', marginTop: 8 }}>
                {error}
              </ThemedText>
            )}
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                { backgroundColor: colors.primary },
                isSubmitting && { opacity: 0.7 }
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ThemedText style={styles.buttonText}>Creating...</ThemedText>
              ) : (
                <ThemedText style={styles.buttonText}>Create Habit</ThemedText>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  input: {
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    width: '30%',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioText: {
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
