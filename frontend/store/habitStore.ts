import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for our habits
export interface Habit {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  streak?: number;
  completed?: boolean;
  isNegative?: boolean;
}

export interface MappedHabit {
  id: string;
  title: string;
  description: string;
  category: string;
  streak: number;
  completed: boolean;
  isNegative: boolean;
}

interface HabitState {
  habits: MappedHabit[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setHabits: (habits: MappedHabit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<MappedHabit>) => void;
  toggleCompletion: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearHabits: () => void;
}

// Helper function to map API habit to our app format
const mapHabit = (habit: Habit): MappedHabit => ({
  id: habit._id || String(Math.random()),
  title: habit.title,
  description: habit.description || '',
  category: habit.category || 'wellness',
  streak: habit.streak || 0,
  completed: habit.completed || false,
  isNegative: habit.isNegative || false
});

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      loading: false,
      error: null,
      
      // Set the entire habits array
      setHabits: (habits) => set({ habits }),
      
      // Add a single habit to the list
      addHabit: (habit) => {
        const mappedHabit = mapHabit(habit);
        console.log('[HabitStore] Adding new habit:', mappedHabit);
        set((state) => ({ 
          habits: [...state.habits, mappedHabit]
        }));
      },
      
      // Update a habit with new values
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map(habit => 
          habit.id === id ? { ...habit, ...updates } : habit
        )
      })),
      
      // Toggle the completed status of a habit
      toggleCompletion: (id) => set((state) => ({
        habits: state.habits.map(habit => 
          habit.id === id ? { ...habit, completed: !habit.completed } : habit
        )
      })),
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearHabits: () => set({ habits: [] }),
    }),
    {
      name: 'el-habitia-habits-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper functions for API calls
export const fetchHabitsApi = async (): Promise<MappedHabit[]> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const response = await fetch('http://192.168.24.47:5001/api/habit/get-habits', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch habits');
  }

  const data = await response.json();
  
  if (!data.habits || !Array.isArray(data.habits)) {
    throw new Error('Invalid response structure');
  }
  
  return data.habits.map(mapHabit);
};

export const trackHabitApi = async (habitTitle: string): Promise<any> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`http://192.168.24.47:5001/api/habit/track-habit/${habitTitle}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to track habit');
  }

  return await response.json();
};

export const addHabitApi = async (habitData: Omit<Habit, '_id'>): Promise<Habit> => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch('http://192.168.24.47:5001/api/habit/create-habit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habitData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create habit');
  }

  return await response.json();
};

// Hook to load habits with loading state management
export const useLoadHabits = () => {
  const { setHabits, setLoading, setError } = useHabitStore();
  
  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[HabitStore] Loading habits...');
      
      const habits = await fetchHabitsApi();
      console.log('[HabitStore] Loaded habits:', habits.length);
      
      setHabits(habits);
      return habits;
    } catch (err) {
      console.error('[HabitStore] Failed to load habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load habits');
      
      // Fallback data
      const fallbackHabits = [
        { id: '1', title: 'Morning Meditation', streak: 5, completed: true, category: 'wellness', description: '', isNegative: false },
        { id: '2', title: 'Read 20 pages', streak: 12, completed: false, category: 'learning', description: '', isNegative: false  },
        { id: '3', title: 'Workout', streak: 3, completed: false, category: 'fitness', description: '', isNegative: false  },
        { id: '4', title: 'Drink 2L water', streak: 15, completed: true, category: 'health', description: '', isNegative: false  },
      ];
      
      setHabits(fallbackHabits);
      return fallbackHabits;
    } finally {
      setLoading(false);
    }
  };
  
  return loadHabits;
};
