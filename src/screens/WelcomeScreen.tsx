import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import IconWrapper from '../components/IconWrapper';
import FlowerCharacter from '../components/FlowerCharacter';
import { authApi } from '../services/api';
import { Colors, CommonStyles, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation?: any;
  route?: any;
  userName?: string;
  onContinue?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  navigation,
  route,
  userName: propUserName,
  onContinue,
}) => {
  const [userName, setUserName] = useState(propUserName || 'Bahçıvan');
  const isReturningUser = route?.params?.isReturningUser || false;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const popInAnim = useRef(new Animated.Value(0)).current;

  // Fetch user from storage on mount
  useEffect(() => {
    const fetchUser = async () => {
      const user = await authApi.getStoredUser();
      if (user?.nickname) {
        setUserName(user.nickname);
      }
    };
    fetchUser();
  }, []);

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
    // Returning user direkt bahçeye gitsin, yeni user onboarding'e
    if (isReturningUser) {
      navigation?.navigate('Garden');
    } else if (onContinue) {
      onContinue();
    } else {
      navigation?.navigate('Onboarding');
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
            {isReturningUser ? 'Yeniden Hoş Geldin' : 'Hoş Geldin'}{'\n'}
            <Text style={styles.userName}>{userName}!</Text>
          </Text>
          <Text style={styles.welcomeText}>
            {isReturningUser 
              ? 'Bahçen seni bekliyordu! Hadi kaldığımız yerden devam edelim.'
              : 'Birlikte namazlarımızı kılarak, çok güzel bir bahçe oluşturmaya ne dersin?'
            }
          </Text>

        </Animated.View>

        {/* Character Avatar - Like Loading Screen */}
        <Animated.View style={[styles.avatarContainer, floatStyle]}>
          <FlowerCharacter size={176} animated={true} />
          
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
    color: Colors.textDark, // Same as SignUpScreen title color
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
    paddingBottom: Spacing.xl * 2, // Same bottom spacing as other screens
    paddingTop: 24,
    zIndex: 10,
  },
});

export default WelcomeScreen;

