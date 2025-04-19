// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle, StyleSheet, Text, TextProps } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

type WeightType = 'regular' | 'medium' | 'bold' | 'light' | 'semibold';

interface IconSymbolProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
  weight?: WeightType;
  symbol?: boolean;
}

// Convert the weight name to SF Symbol weight value
const getWeightValue = (weight: WeightType): number => {
  switch (weight) {
    case 'light':
      return 300;
    case 'regular':
      return 400;
    case 'medium':
      return 500;
    case 'semibold':
      return 600;
    case 'bold':
      return 700;
    default:
      return 400;
  }
};

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({ 
  name, 
  size = 24, 
  color = '#000', 
  weight = 'regular',
  symbol = true,
  style,
  ...props 
}: IconSymbolProps) {
  // For iOS/macOS, SF Symbols are used directly
  // For other platforms, need to implement a fallback (e.g., using vector icons)
  
  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color,
          fontWeight: getWeightValue(weight).toString() as any,
        },
        style,
      ]}
      {...props}>
      {symbol ? `${name}` : name}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'system',
  },
});
