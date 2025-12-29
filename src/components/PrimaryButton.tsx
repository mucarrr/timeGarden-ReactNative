import React from 'react';
import {
  TouchableOpacity,
  Text,
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
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  showArrow = true,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      {showArrow && (
        <IconWrapper 
          name="arrow-forward" 
          size={24} 
          color={Colors.textDark}
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
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...CommonStyles.buttonText,
  },
});

export default PrimaryButton;

