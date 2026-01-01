import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import IconWrapper from './IconWrapper';
import { CommonStyles, Colors } from '../styles/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showArrow?: boolean;
  disabled?: boolean;
  iconColor?: string;
  leftIcon?: string; // Icon name for left side icon (e.g., "yard")
  leftIconSize?: number;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  showArrow = true,
  disabled = false,
  iconColor,
  leftIcon,
  leftIconSize = 24,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        isPressed && styles.buttonPressed,
        style,
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
      disabled={disabled}>
      {leftIcon && (
        <IconWrapper 
          name={leftIcon} 
          size={leftIconSize} 
          color={iconColor || Colors.textDark}
          emojiFallback="🌱"
        />
      )}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      {showArrow && !leftIcon && (
        <IconWrapper 
          name="arrow-forward" 
          size={24} 
          color={iconColor || Colors.textDark}
          emojiFallback="→"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...CommonStyles.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonPressed: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
    transform: [{ translateY: 6 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...CommonStyles.buttonText,
  },
});

export default PrimaryButton;

