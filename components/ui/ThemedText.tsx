import { Text, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type ThemedTextProps = TextProps & {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'button';
  color?: string;
};

export function ThemedText({ 
  style, 
  variant = 'body', 
  color,
  ...props 
}: ThemedTextProps) {
  const { colors } = useTheme();
  
  const variantStyles = {
    title: {
      fontFamily: colors.fonts.bold,
      fontSize: 24,
      color: colors.text,
    },
    subtitle: {
      fontFamily: colors.fonts.semiBold,
      fontSize: 18,
      color: colors.text,
    },
    body: {
      fontFamily: colors.fonts.regular,
      fontSize: 16,
      color: colors.text,
    },
    caption: {
      fontFamily: colors.fonts.regular,
      fontSize: 14,
      color: colors.subtext,
    },
    button: {
      fontFamily: colors.fonts.bold,
      fontSize: 16,
      color: '#FFFFFF',
    },
  };

  return (
    <Text
      style={[
        variantStyles[variant],
        color ? { color } : {},
        style,
      ]}
      {...props}
    />
  );
}
