import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import IconWrapper from './IconWrapper';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../styles/theme';

interface TopInfoButtonProps {
  icon: string;
  iconColor?: string;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  emojiFallback?: string;
}

const TopInfoButton: React.FC<TopInfoButtonProps> = ({
  icon,
  iconColor = '#60A5FA',
  title,
  onPress,
  style,
  textStyle,
  emojiFallback,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.8}
      onPress={onPress}>
      <IconWrapper
        name={icon}
        size={18}
        color={iconColor}
        emojiFallback={emojiFallback}
      />
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 36,
  },
  buttonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
  },
});

export default TopInfoButton;

