// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle, StyleSheet, Text, TextProps, Platform } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'plus.circle': 'add-circle-outline',
  'plus.circle.fill': 'add-circle',
  'person.3': 'groups',
  'person.3.fill': 'groups',
  'calendar': 'calendar-today',
  'calendar.fill': 'calendar-month',
  'gearshape': 'settings',
  'gearshape.fill': 'settings',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'book.fill': 'book',
  'book': 'menu-book',
  'figure.walk': 'directions-walk',
  'drop.fill': 'water-drop',
  'drop': 'water',
  'star.fill': 'star',
  'star': 'star-outline',
  'flame.fill': 'local-fire-department',
  'leaf.fill': 'eco',
  'checkmark': 'check',
  'checkmark.circle': 'check-circle-outline',
  'checkmark.circle.fill': 'check-circle',
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
  'lock.fill': 'lock',
  'lock': 'lock-outline',
  'person.fill': 'person',
  'person': 'person-outline',
  'sparkles': 'auto-awesome',
  'moon.fill': 'nightlight-round',
  'sun.max.fill': 'wb-sunny',
  'plus': 'add',
  'bubble': 'chat-bubble-outline',
  'bubble.fill': 'chat-bubble',
  'message': 'message',
  'message.fill': 'message',
  'chart.bar.fill': 'bar-chart',
  'bubble.left.fill': 'chat-bubble',
  'bubble.left.right.fill': 'question-answer',
  'arrow.up': 'arrow-upward',
  'bubble.left.and.bubble.right': 'forum',
  'arrowshape.turn.up.right': 'reply',
  'trophy.fill': 'emoji-events'
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
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
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
  // For non-iOS platforms, use Material Icons
  const materialName = MAPPING[name as IconSymbolName];
  
  if (Platform.OS !== 'ios' && materialName) {
    return (
      <MaterialIcons
        name={materialName}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // This is a fallback that simply shows the name as text
  // (only reached if the name is not mapped for non-iOS platforms)
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
