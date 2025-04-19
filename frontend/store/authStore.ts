import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  personality?: 'adventurer' | 'achiever' | 'explorer' | 'socializer';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  updateUserPersonality: (personality: User['personality']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, isAuthenticated: false, error: null }),
      updateUserPersonality: (personality) => 
        set((state) => ({
          user: state.user ? { ...state.user, personality } : null,
        })),
    }),
    {
      name: 'el-habitia-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
