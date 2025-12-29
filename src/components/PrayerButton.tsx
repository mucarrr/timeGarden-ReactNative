import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { PrayerTime, SeedState } from '../types';

interface PrayerButtonProps {
  prayerTime: PrayerTime;
  state: SeedState;
  isCompletedToday: boolean;
  onPress: () => void;
}

const PrayerButton: React.FC<PrayerButtonProps> = ({
  prayerTime,
  state,
  isCompletedToday,
  onPress,
}) => {
  const { t } = useTranslation();
  const scale = React.useRef(new Animated.Value(1)).current;
  const iconScale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (isCompletedToday) return;
    
    // Buton basma animasyonu
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
    ]).start();
    
    // İkon animasyonu
    Animated.sequence([
      Animated.spring(iconScale, {
        toValue: 1.3,
        useNativeDriver: true,
        tension: 50,
        friction: 2,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 3,
      }),
    ]).start();

    onPress();
  };

  const buttonAnimatedStyle = {
    transform: [{ scale }],
  };

  const iconAnimatedStyle = {
    transform: [{ scale: iconScale }],
  };

  const getIcon = (state: SeedState) => {
    switch (state) {
      case 'seed':
        return 'radio-button-unchecked';
      case 'sprout':
        return 'eco';
      case 'flower':
        return 'local-florist';
      default:
        return 'radio-button-unchecked';
    }
  };

  const getColor = (state: SeedState) => {
    switch (state) {
      case 'seed':
        return '#8D6E63'; // Kahverengi (toprak)
      case 'sprout':
        return '#66BB6A'; // Yeşil (filiz)
      case 'flower':
        return '#FF6B9D'; // Pembe (çiçek)
      default:
        return '#9E9E9E';
    }
  };

  const prayerName = t(`prayerTimes.${prayerTime}`);
  const stateName = t(`states.${state}`);

  return (
    <Pressable
      style={[
        styles.button,
        isCompletedToday && styles.completedButton,
        { borderColor: getColor(state) },
      ]}
      onPress={handlePress}
      disabled={isCompletedToday}>
      <Animated.View style={[buttonAnimatedStyle, iconAnimatedStyle]}>
        <Icon
          name={getIcon(state)}
          size={32}
          color={getColor(state)}
          style={styles.icon}
        />
      </Animated.View>
      <Text style={styles.prayerName}>{prayerName}</Text>
      <Text style={[styles.stateName, { color: getColor(state) }]}>
        {stateName}
      </Text>
      {isCompletedToday && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>{t('completed')}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  completedButton: {
    opacity: 0.7,
  },
  icon: {
    marginBottom: 8,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  stateName: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default PrayerButton;

