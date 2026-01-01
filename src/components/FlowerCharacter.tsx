import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../styles/theme';

interface FlowerCharacterProps {
  size?: number;
  style?: ViewStyle;
  animated?: boolean;
}

const FlowerCharacter: React.FC<FlowerCharacterProps> = ({
  size = 176,
  style,
  animated = true,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    // Float animation
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    float.start();

    // Pulse animation for glow
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => {
      float.stop();
      pulse.stop();
    };
  }, [animated, floatAnim, pulseAnim]);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Glow Effect */}
      {animated && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              width: size * 1.2,
              height: size * 1.2,
              borderRadius: (size * 1.2) / 2,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Avatar Circle */}
      <Animated.View
        style={[
          styles.avatarCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: animated ? [{ translateY: floatTranslateY }] : [],
          },
        ]}>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp2hyjhPsFsJx_O0aJianOPjzTrPRizA3KsAvth_uADJTGSRTXMU6o84v_3WzuVq5dblPXml-0MbBNBNOu7hRz5umFgHWlFEeSgLD7eyfVeFLfCemzECfJFLh9cZQPEEK0_byRQ4YWzMJJI7Uqyi_LnpnytdiBNcc3GHri2FnYDHjr_8U07Wb0W6jzy52Ft2lq2saOnlS8l2bTHl1vdrXk0gz9WbSptRUzYpGHqUTiUAofKD1kHg0N5vgqucmNCcphRy6IX8JrQpo',
          }}
          style={styles.avatarImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    backgroundColor: `${Colors.primary}33`, // 20% opacity
  },
  avatarCircle: {
    backgroundColor: Colors.surface,
    ...Shadows.logo,
    borderWidth: 4,
    borderColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

export default FlowerCharacter;

