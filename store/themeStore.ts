import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, ColorScheme } from '@/styles/themes';

interface ThemeState {
  mode: ThemeMode | null;
  colorScheme: ColorScheme;
  setMode: (mode: ThemeMode | null) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: null, // null means follow system
      colorScheme: 'chill',
      setMode: (mode) => set({ mode }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: 'el-habitia-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
