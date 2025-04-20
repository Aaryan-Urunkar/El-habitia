import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ui/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Habit {
  id: string;
  title: string;
  description?: string;
  mode: 'growth' | 'beast';
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
}

// Sample data - replace with your actual data
const sampleHabits: Habit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start the day with a clear mind',
    mode: 'growth',
    startTime: '06:30',
    endTime: '07:00',
    daysOfWeek: [1, 2, 3, 4, 5]
  },
  {
    id: '2',
    title: 'Workout',
    description: 'Strength training',
    mode: 'beast',
    startTime: '17:30',
    endTime: '18:30',
    daysOfWeek: [1, 3, 5]
  },
  {
    id: '3',
    title: 'Reading',
    description: 'Knowledge growth',
    mode: 'growth',
    startTime: '21:00',
    endTime: '22:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    id: '4',
    title: 'HIIT Session',
    description: 'High intensity workout',
    mode: 'beast',
    startTime: '07:30',
    endTime: '08:00',
    daysOfWeek: [2, 4, 6]
  }
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>(sampleHabits);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [timePickerMode, setTimePickerMode] = useState<'start' | 'end'>('start');
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [tempTime, setTempTime] = useState<Date>(new Date());

  // Filter habits for selected day
  const filteredHabits = habits.filter(habit => 
    habit.daysOfWeek.includes(selectedDay)
  ).sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalVisible(true);
  };

  const handleTimePress = (mode: 'start' | 'end', timeString: string) => {
    setTimePickerMode(mode);
    
    // Parse time string to Date
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    setTempTime(date);
    
    setShowTimePicker(true);
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedDate && editingHabit) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      // Create updated habit
      const updatedHabit = { 
        ...editingHabit,
        [timePickerMode === 'start' ? 'startTime' : 'endTime']: timeString 
      };
      
      // Validate that end time is after start time
      if (timePickerMode === 'end' && updatedHabit.endTime < updatedHabit.startTime) {
        Alert.alert('Invalid Time', 'End time must be after start time');
        return;
      }

      setEditingHabit(updatedHabit);
    }
  };

  const handleSaveChanges = () => {
    if (!editingHabit) return;
    
    // Update habit in state
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === editingHabit.id ? editingHabit : habit
      )
    );
    
    setModalVisible(false);
    setEditingHabit(null);
  };

  const toggleDaySelection = (dayIndex: number) => {
    if (!editingHabit) return;
    
    const updatedDays = [...editingHabit.daysOfWeek];
    const existingIndex = updatedDays.indexOf(dayIndex);
    
    if (existingIndex >= 0) {
      updatedDays.splice(existingIndex, 1);
    } else {
      updatedDays.push(dayIndex);
    }
    
    setEditingHabit({
      ...editingHabit,
      daysOfWeek: updatedDays
    });
  };

  const renderTimePickerButton = (mode: 'start' | 'end', time: string, label: string) => {
    return (
      <View style={styles.timePickerContainer}>
        <Text style={styles.timePickerLabel}>{label}</Text>
        <TouchableOpacity
          style={[styles.timeButton, {borderColor: colors.border}]}
          onPress={() => handleTimePress(mode, time)}
        >
          <IconSymbol 
            name="clock" 
            size={16} 
            color={colors.primary} 
            style={styles.timeIcon}
          />
          <Text style={[styles.timeText, {color: colors.text}]}>{time}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style={scheme === 'chill' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <ThemedText variant="title">My Schedule</ThemedText>
      </View>
      
      {/* Days of week selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDay === index && { 
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary
              }
            ]}
            onPress={() => handleDayPress(index)}
          >
            <ThemedText
              style={[
                styles.dayText,
                selectedDay === index && { color: colors.primary, fontWeight: '600' }
              ]}
            >
              {day}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Schedule display */}
      <ScrollView style={styles.scheduleContainer}>
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => (
            <TouchableOpacity 
              key={habit.id} 
              style={[
                styles.habitCard,
                { backgroundColor: colors.card, borderLeftColor: habit.mode === 'growth' ? colors.success : colors.primary }
              ]}
              onPress={() => handleEditHabit(habit)}
            >
              <View style={styles.habitTimeContainer}>
                <ThemedText style={styles.habitTime}>
                  {habit.startTime} - {habit.endTime}
                </ThemedText>
              </View>
              
              <View style={styles.habitContent}>
                <View style={styles.habitHeader}>
                  <ThemedText variant="subtitle" style={styles.habitTitle}>
                    {habit.title}
                  </ThemedText>
                  <View 
                    style={[
                      styles.modeBadge, 
                      { backgroundColor: habit.mode === 'growth' ? colors.success + '20' : colors.primary + '20' }
                    ]}
                  >
                    <IconSymbol 
                      name={habit.mode === 'growth' ? 'leaf.fill' : 'flame.fill'} 
                      size={12} 
                      color={habit.mode === 'growth' ? colors.success : colors.primary}
                    />
                    <ThemedText style={styles.modeText}>
                      {habit.mode === 'growth' ? 'Growth' : 'Beast'}
                    </ThemedText>
                  </View>
                </View>
                
                {habit.description && (
                  <ThemedText variant="caption" style={{ color: colors.subtext }}>
                    {habit.description}
                  </ThemedText>
                )}
              </View>
              
              <IconSymbol name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="calendar" size={64} color={colors.subtext} />
            <ThemedText style={styles.emptyStateText}>
              No habits scheduled for {daysOfWeek[selectedDay]}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <ThemedText variant="title">Edit Schedule</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {editingHabit && (
              <>
                <ThemedText variant="subtitle">{editingHabit.title}</ThemedText>
                
                <View style={styles.timeSelectors}>
                  {renderTimePickerButton('start', editingHabit.startTime, 'Start Time')}
                  {renderTimePickerButton('end', editingHabit.endTime, 'End Time')}
                </View>

                <ThemedText style={styles.daysSelectorLabel}>Days of Week</ThemedText>
                <View style={styles.daysSelector}>
                  {daysOfWeek.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.daySelectorButton,
                        {
                          backgroundColor: editingHabit.daysOfWeek.includes(index) 
                            ? colors.primary 
                            : colors.background
                        }
                      ]}
                      onPress={() => toggleDaySelection(index)}
                    >
                      <Text 
                        style={[
                          styles.daySelectorText,
                          {
                            color: editingHabit.daysOfWeek.includes(index) 
                              ? 'white' 
                              : colors.text
                          }
                        ]}
                      >
                        {day.charAt(0)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.saveButton, {backgroundColor: colors.primary}]}
                  onPress={handleSaveChanges}
                >
                  <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Time Picker (for Android) */}
      {showTimePicker && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.3)',
  },
  dayText: {
    fontWeight: '500',
    fontSize: 14,
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  habitTimeContainer: {
    marginRight: 12,
    alignItems: 'center',
    minWidth: 75,
  },
  habitTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  habitContent: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  habitTitle: {
    fontWeight: '600',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timePickerContainer: {
    width: '48%',
  },
  timePickerLabel: {
    marginBottom: 8,
    fontSize: 14,
    opacity: 0.8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeText: {
    fontSize: 16,
  },
  daysSelectorLabel: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 14,
    opacity: 0.8,
  },
  daysSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  daySelectorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelectorText: {
    fontWeight: '600',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
});
