import { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedText } from './ThemedText';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextInput({ label, error, style, ...props }: ThemedInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={styles.container}>
      {label && <ThemedText variant="caption" style={styles.label}>{label}</ThemedText>}
      <RNTextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: getBorderColor(),
            fontFamily: colors.fonts.regular,
          },
          style,
        ]}
        placeholderTextColor={colors.subtext}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <ThemedText 
          variant="caption" 
          style={{ color: colors.error, marginTop: 4 }}
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
