import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AnimatedFlowerProps {
  color: string;
  size?: number;
  delay?: number;
}

/**
 * Çiçek açma animasyonu - Reanimated ile
 * Tohum → Filiz → Çiçek geçiş animasyonu
 */
const AnimatedFlower: React.FC<AnimatedFlowerProps> = ({
  color,
  size = 40,
  delay = 0,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Opacity animasyonu
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Tohum → Filiz → Çiçek animasyonu
      Animated.sequence([
        // Tohum (küçük)
        Animated.spring(scale, {
          toValue: 0.3,
          useNativeDriver: true,
          tension: 100,
          friction: 3,
        }),
        // Filiz (orta)
        Animated.delay(200),
        Animated.spring(scale, {
          toValue: 0.6,
          useNativeDriver: true,
          tension: 100,
          friction: 3,
        }),
        // Çiçek (tam boyut)
        Animated.delay(300),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 5,
        }),
      ]).start();

      // Hafif döndürme efekti
      Animated.delay(500);
      Animated.spring(rotation, {
        toValue: 360,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, opacity, scale, rotation]);

  const animatedStyle = {
    transform: [
      { scale },
      { rotate: rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      })},
    ],
    opacity,
  };

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <Icon name="local-florist" size={size} color={color} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedFlower;

