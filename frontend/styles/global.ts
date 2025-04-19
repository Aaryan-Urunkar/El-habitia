import { StyleSheet } from 'react-native';
import { ThemeMode, ColorScheme, themes } from './themes';

export const createGlobalStyles = (mode: ThemeMode, scheme: ColorScheme) => {
  const colors = themes[mode][scheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: colors.spacing.md,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: colors.spacing.md,
      ...colors.shadow.md,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontFamily: colors.fonts.bold,
      fontSize: 24,
      color: colors.text,
      marginBottom: colors.spacing.sm,
    },
    subtitle: {
      fontFamily: colors.fonts.semiBold,
      fontSize: 18,
      color: colors.text,
      marginBottom: colors.spacing.sm,
    },
    text: {
      fontFamily: colors.fonts.regular,
      fontSize: 16,
      color: colors.text,
    },
    subtext: {
      fontFamily: colors.fonts.regular,
      fontSize: 14,
      color: colors.subtext,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: colors.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontFamily: colors.fonts.bold,
      color: '#FFFFFF',
      fontSize: 16,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: colors.spacing.md,
      fontFamily: colors.fonts.regular,
      fontSize: 16,
      color: colors.text,
      marginBottom: colors.spacing.md,
    },
  });
};
