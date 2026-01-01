import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import IconWrapper from '../components/IconWrapper';
import { Colors, CommonStyles, FontSizes, FontWeights, Spacing, BorderRadius } from '../styles/theme';

interface PrayerTimesSelectionScreenProps {
  navigation?: any;
  onComplete?: () => void;
}

const PrayerTimesSelectionScreen: React.FC<PrayerTimesSelectionScreenProps> = ({
  navigation,
  onComplete,
}) => {
  const sunPulseAnim = useRef(new Animated.Value(1)).current;
  const waterBounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sun pulse animation
    const sunPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(sunPulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sunPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    sunPulse.start();

    // Water drop bounce animation
    const waterBounce = Animated.loop(
      Animated.sequence([
        Animated.timing(waterBounceAnim, {
          toValue: 1,
          duration: 1250,
          useNativeDriver: true,
        }),
        Animated.timing(waterBounceAnim, {
          toValue: 0,
          duration: 1250,
          useNativeDriver: true,
        }),
      ]),
    );
    waterBounce.start();

    return () => {
      sunPulse.stop();
      waterBounce.stop();
    };
  }, [sunPulseAnim, waterBounceAnim]);

  const waterBounceTranslateY = waterBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    } else if (navigation) {
      // Navigate to next screen
      navigation.navigate('Garden');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Pattern Overlay */}
      <View style={styles.patternOverlay} />
      
      {/* Decorative Circles */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      {/* Content */}
      <View style={styles.content}>
        {/* Header Badge */}
        <View style={styles.headerBadgeContainer}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>VAKIT BAHÇESI</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Central Circle with Plant */}
          <View style={styles.centralCircleContainer}>
            {/* Glow effect */}
            <View style={styles.glowEffect} />
            
            {/* Main Circle */}
            <View style={styles.centralCircle}>
              {/* Ground/Soil */}
              <View style={styles.ground} />
              
              {/* Plant Icon */}
              <View style={styles.plantIconContainer}>
                <IconWrapper
                  name="spa"
                  size={160}
                  color={Colors.primary}
                  emojiFallback="🌱"
                />
              </View>
              
              {/* Sun Icon (animated) */}
              <Animated.View
                style={[
                  styles.sunContainer,
                  {
                    transform: [{ scale: sunPulseAnim }],
                  },
                ]}>
                <IconWrapper
                  name="wb-sunny"
                  size={32}
                  color="#FFC107"
                  emojiFallback="☀️"
                />
              </Animated.View>
            </View>

            {/* Water Drop (animated) */}
            <Animated.View
              style={[
                styles.waterDropContainer,
                {
                  transform: [{ translateY: waterBounceTranslateY }],
                },
              ]}>
              <View style={styles.waterDrop}>
                <IconWrapper
                  name="water-drop"
                  size={20}
                  color="#FFFFFF"
                  emojiFallback="💧"
                />
              </View>
            </Animated.View>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Text style={styles.title}>
              Günde kaç vakit ile{'\n'}başlayalım?
            </Text>
            <Text style={styles.subtitle}>
              Unutma her vakit namazın bir tohum demek. Gel birlikte ilk tohumumuzu atalım.
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Devam Et"
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    opacity: 0.6,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: `${Colors.primary}1A`, // 10% opacity
    opacity: 0.1,
  },
  decorativeCircle2: {
    position: 'absolute',
    top: '33%',
    left: -80,
    width: 224,
    height: 224,
    borderRadius: 112,
    backgroundColor: `${Colors.primary}0D`, // 5% opacity
    opacity: 0.05,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl * 2.5,
    paddingBottom: 0, // Button container handles bottom padding
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerBadgeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerBadgeText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    color: '#4c9a66',
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -Spacing.xl * 1.5,
  },
  centralCircleContainer: {
    position: 'relative',
    marginBottom: Spacing.xl * 2.5,
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${Colors.primary}4D`, // 30% opacity
    borderRadius: 120,
    transform: [{ scale: 1.1 }],
    opacity: 0.3,
  },
  centralCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 6,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 35,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '35%',
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
  },
  plantIconContainer: {
    position: 'relative',
    zIndex: 10,
    transform: [{ translateY: 16 }],
  },
  sunContainer: {
    position: 'absolute',
    top: 32,
    right: 32,
  },
  waterDropContainer: {
    position: 'absolute',
    right: -8,
    top: 40,
  },
  waterDrop: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.lg,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.title * 1.2,
    color: Colors.textDark, // Same as SignUpScreen title color
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...CommonStyles.subtitle,
    color: Colors.textSecondary, // Same as SignUpScreen subtitle color
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: Spacing.sm,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl * 2, // Same bottom spacing as other screens
  },
});

export default PrayerTimesSelectionScreen;

