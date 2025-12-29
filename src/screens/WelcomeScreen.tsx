import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import IconWrapper from '../components/IconWrapper';
import { Colors, CommonStyles, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation?: any;
  userName?: string;
  onContinue?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  navigation,
  userName = 'Ahmet',
  onContinue,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const popInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pop-in animation
    Animated.timing(popInAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Float animation
    const floatAnimation = Animated.loop(
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
    floatAnimation.start();

    return () => {
      floatAnimation.stop();
    };
  }, [floatAnim, popInAnim]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else if (navigation) {
      navigation.navigate('Onboarding');
    }
  };

  const floatStyle = {
    transform: [
      {
        translateY: floatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const popInStyle = {
    opacity: popInAnim,
    transform: [
      {
        scale: popInAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
      {
        translateY: popInAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.patternOverlay} />

      {/* Main Content - Centered */}
      <View style={styles.content}>
        {/* Welcome Card */}
        <Animated.View style={[styles.welcomeCard, popInStyle]}>
          {/* Waving Hand Icon */}
          <View style={styles.wavingHandContainer}>
            <View style={styles.wavingHandCircle}>
              <Text style={styles.wavingHandEmoji}>👋</Text>
            </View>
          </View>

          {/* Welcome Text */}
          <Text style={styles.welcomeTitle}>
            Hoş Geldin{'\n'}
            <Text style={styles.userName}>{userName}!</Text>
          </Text>
          <Text style={styles.welcomeText}>
            Birlikte namazlarımızı kılarak, çok güzel bir bahçe oluşturmaya ne
            dersin?
          </Text>

        </Animated.View>

        {/* Character Avatar - Like Loading Screen */}
        <Animated.View style={[styles.avatarContainer, floatStyle]}>
          {/* Avatar Circle - Circular */}
          <View style={styles.avatarCircle}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp2hyjhPsFsJx_O0aJianOPjzTrPRizA3KsAvth_uADJTGSRTXMU6o84v_3WzuVq5dblPXml-0MbBNBNOu7hRz5umFgHWlFEeSgLD7eyfVeFLfCemzECfJFLh9cZQPEEK0_byRQ4YWzMJJI7Uqyi_LnpnytdiBNcc3GHri2FnYDHjr_8U07Wb0W6jzy52Ft2lq2saOnlS8l2bTHl1vdrXk0gz9WbSptRUzYpGHqUTiUAofKD1kHg0N5vgqucmNCcphRy6IX8JrQpo',
              }}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>

          {/* Gardener Badge - At bottom edge of circle, centered */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BAHÇIVAN</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton title="Devam Et" onPress={handleContinue} />
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
    backgroundColor: Colors.backgroundPattern,
    opacity: 0.6,
    // Pattern effect - can be enhanced with SVG or ImageBackground
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  welcomeCard: {
    width: '100%',
    maxWidth: 384,
    ...CommonStyles.card,
    position: 'relative',
    zIndex: 20,
    // No shadow - clean design
  },
  wavingHandContainer: {
    position: 'absolute',
    top: -24,
    right: 8,
    zIndex: 10,
  },
  wavingHandCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ rotate: '12deg' }],
  },
  wavingHandEmoji: {
    fontSize: 32,
    opacity: 0.9,
    // Make emoji darker by using filter or overlay
  },
  welcomeTitle: {
    ...CommonStyles.title,
    marginBottom: Spacing.md,
  },
  userName: {
    color: Colors.textDark,
  },
  welcomeText: {
    ...CommonStyles.subtitle,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
    width: '100%',
  },
  avatarCircle: {
    width: 176,
    height: 176,
    borderRadius: BorderRadius.xl, // Perfect circle
    backgroundColor: Colors.surface,
    ...Shadows.logo,
    borderWidth: 4,
    borderColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0, // At bottom edge of circle
    left: 0,
    right: 0,
    alignItems: 'center', // Center horizontally
    zIndex: 20,
  },
  badge: {
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  badgeText: {
    color: Colors.badgeText,
    fontSize: FontSizes.bodyTiny,
    fontWeight: FontWeights.bold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
    zIndex: 10,
  },
});

export default WelcomeScreen;

