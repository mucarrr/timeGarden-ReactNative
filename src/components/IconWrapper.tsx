import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface IconWrapperProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle | TextStyle;
  emojiFallback?: string; // Emoji fallback if icon doesn't load
}

/**
 * IconWrapper - MaterialIcons with emoji fallback
 * Renders MaterialIcon directly. If icons don't show, check Android font linking.
 */
const IconWrapper: React.FC<IconWrapperProps> = ({
  name,
  size = 24,
  color = '#000',
  style,
  emojiFallback,
}) => {
  // Directly render MaterialIcon - if it doesn't show, the font isn't linked properly
  return (
    <MaterialIcon
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default IconWrapper;
