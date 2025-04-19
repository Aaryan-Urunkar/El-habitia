import { createContext, useContext, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { ThemeMode, ColorScheme, themes } from '@/styles/themes';

type ThemeContextType = {
  colors: typeof themes.light.chill;
  mode: ThemeMode;
  scheme: ColorScheme;
  toggleMode: () => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme() as 'light' | 'dark';
  const { mode, colorScheme, setMode, setColorScheme } = useThemeStore();
  
  // Use system theme if not set manually
  const activeColorScheme = mode || systemColorScheme;
  const colors = themes[activeColorScheme][colorScheme];
  
  const toggleMode = () => {
    setMode(activeColorScheme === 'light' ? 'dark' : 'light');
  };
  
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'chill' ? 'beast' : 'chill');
  };
  
  return (
    <ThemeContext.Provider value={{ 
      colors, 
      mode: activeColorScheme, 
      scheme: colorScheme,
      toggleMode, 
      toggleColorScheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
