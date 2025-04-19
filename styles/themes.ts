export type ThemeMode = 'light' | 'dark';
export type ColorScheme = 'chill' | 'beast';

export const fonts = {
  regular: 'Nunito-Regular',
  medium: 'Nunito-Medium',
  semiBold: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  extraBold: 'Nunito-ExtraBold',
};

const baseSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const baseShadow = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Define the themes
export const themes = {
  light: {
    chill: {
      // Cool, smooth, light colors
      background: '#F8FAFC',
      card: '#FFFFFF',
      primary: '#6366F1',
      secondary: '#A5B4FC',
      accent: '#818CF8',
      text: '#1E293B',
      subtext: '#64748B',
      border: '#E2E8F0',
      notification: '#38BDF8',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      shadow: baseShadow,
      spacing: baseSpacing,
      fonts,
    },
    beast: {
      // Warm, intense, light colors
      background: '#FFFBEB',
      card: '#FFFFFF',
      primary: '#DC2626',
      secondary: '#FBBF24',
      accent: '#F59E0B',
      text: '#0F172A',
      subtext: '#475569',
      border: '#FECACA',
      notification: '#F97316',
      success: '#16A34A',
      warning: '#EAB308',
      error: '#B91C1C',
      shadow: baseShadow,
      spacing: baseSpacing,
      fonts,
    },
  },
  dark: {
    chill: {
      // Cool, smooth, dark colors
      background: '#0F172A',
      card: '#1E293B',
      primary: '#818CF8',
      secondary: '#6366F1',
      accent: '#A5B4FC',
      text: '#F1F5F9',
      subtext: '#CBD5E1',
      border: '#334155',
      notification: '#0EA5E9',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      shadow: baseShadow,
      spacing: baseSpacing,
      fonts,
    },
    beast: {
      // Warm, intense, dark colors
      background: '#18181B',
      card: '#27272A',
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#F97316',
      text: '#FAFAFA',
      subtext: '#D4D4D8',
      border: '#7F1D1D',
      notification: '#EA580C',
      success: '#16A34A',
      warning: '#CA8A04',
      error: '#DC2626',
      shadow: baseShadow,
      spacing: baseSpacing,
      fonts,
    },
  },
};
