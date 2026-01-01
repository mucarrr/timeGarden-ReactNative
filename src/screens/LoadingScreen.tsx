import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, CommonStyles } from '../styles/theme';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const progressWidth = useRef(new Animated.Value(0)).current;
  const flowerScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress bar animation (0% → 100% over 2.5 seconds)
    const progressAnimation = Animated.timing(progressWidth, {
      toValue: 1.0,
      duration: 2500,
      useNativeDriver: false,
    });

    // Update progress text during animation
    const progressListener = progressWidth.addListener(({ value }) => {
      setProgressPercent(Math.round(value * 100));
    });

    progressAnimation.start();

    // Flower bounce animation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.spring(flowerScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        Animated.spring(flowerScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
      ]),
    );
    bounceAnimation.start();

    // After 2.5 seconds, complete loading
    const timer = setTimeout(() => {
      console.log('⏰ Loading timer completed, calling onLoadingComplete');
      onLoadingComplete();
    }, 2500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      bounceAnimation.stop();
      progressWidth.removeListener(progressListener);
    };
  }, [progressWidth, flowerScale, fadeAnim, onLoadingComplete]);

  const progressBarStyle = {
    width: progressWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  const fadeStyle = {
    opacity: fadeAnim,
  };

  const flowerStyle = {
    transform: [{ scale: flowerScale }],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Pattern - Simple grid pattern using View */}
      <View style={styles.patternContainer} />

      {/* Main Content */}
      <Animated.View style={[styles.content, fadeStyle]}>
        {/* Logo and Title Container */}
        <View style={styles.logoTitleContainer}>
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/characters/children.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* App Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleMain}>Vakit Bahçesi</Text>
            <Text style={styles.titleSub}>Time Garden</Text>
          </View>
        </View>
      </Animated.View>

      {/* Loading & Progress Area */}
      <View style={styles.loadingArea}>
        {/* Flower Growth Metaphor */}
        <View style={styles.stagesContainer}>
          {/* Stage 1: Seed */}
          <View style={[styles.stage, styles.stageInactive]}>
            <Text style={styles.seedIcon}>🌾</Text>
          </View>
          {/* Stage 2: Sprout */}
          <View style={[styles.stage, styles.stageInactive]}>
            <Text style={styles.sproutIcon}>🌱</Text>
          </View>
          {/* Stage 3: Flower (Active/Blooming) */}
          <Animated.View style={[styles.stage, flowerStyle]}>
            <Text style={styles.flowerIcon}>🌸</Text>
          </Animated.View>
        </View>

        {/* Loading Text & Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.loadingText}>Bahçeniz hazırlanıyor...</Text>
            <Text style={styles.progressText}>{progressPercent}%</Text>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, progressBarStyle]}>
              <View style={styles.progressBarShine} />
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Footer Version */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f6',
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f6f8f6',
    opacity: 0.3,
    // Simple pattern effect - can be enhanced with SVG later
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  logoTitleContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 360,
    height: 360,
    marginBottom: -40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  titleMain: {
    ...CommonStyles.title,
    fontSize: 36,
    color: Colors.textDark, // Same as SignUpScreen title color
    letterSpacing: -0.5,
  },
  titleSub: {
    ...CommonStyles.subtitle,
    fontSize: 18,
    color: Colors.textSecondary, // Same as SignUpScreen subtitle color
  },
  loadingArea: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 24,
    zIndex: 10,
  },
  stagesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 60,
    marginBottom: 8,
    width: '100%',
    paddingHorizontal: 20,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    marginHorizontal: 12,
    minWidth: 40,
  },
  stageInactive: {
    opacity: 0.4,
  },
  seedIcon: {
    fontSize: 32,
    textAlign: 'center',
  },
  sproutIcon: {
    fontSize: 40,
    textAlign: 'center',
  },
  flowerIcon: {
    fontSize: 48,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    maxWidth: 320,
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#102216',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#13ec5b',
    minWidth: 40,
    textAlign: 'right',
  },
  progressBarContainer: {
    width: '100%',
    height: 16,
    backgroundColor: '#cfe7d7',
    borderRadius: 9999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#13ec5b',
    borderRadius: 9999,
    position: 'relative',
  },
  progressBarShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 9999,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
    zIndex: 10,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#4c9a66',
    opacity: 0.7,
  },
});

export default LoadingScreen;

