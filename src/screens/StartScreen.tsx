import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TopInfoButton from '../components/TopInfoButton';
import IconWrapper from '../components/IconWrapper';
import FlowerCharacter from '../components/FlowerCharacter';
import { Colors, CommonStyles, FontSizes, FontWeights, Spacing, BorderRadius } from '../styles/theme';

interface StartScreenProps {
  navigation?: any;
  onComplete?: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  navigation,
  onComplete,
}) => {
  const hourglassRotate = useRef(new Animated.Value(0)).current;
  const hourglassScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    // Hourglass rotation animation
    const hourglassRotation = Animated.loop(
      Animated.sequence([
        Animated.timing(hourglassRotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(hourglassRotate, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    hourglassRotation.start();

    // Hourglass scale animation (sand falling effect)
    const hourglassScaleAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(hourglassScale, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(hourglassScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    hourglassScaleAnim.start();

    return () => {
      hourglassRotation.stop();
      hourglassScaleAnim.stop();
    };
  }, [hourglassRotate, hourglassScale]);

  const hourglassRotation = hourglassRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handlePlantSeed = () => {
    if (onComplete) {
      onComplete();
    } else if (navigation) {
      navigation.navigate('Garden');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Pattern Overlay */}
      <View style={styles.patternOverlay} />

      {/* Top Buttons */}
      <View style={styles.topButtonContainer}>
        <TopInfoButton
          icon="schedule"
          iconColor="#60A5FA"
          title="Namaz Vakitleri"
          onPress={() => {
            if (navigation) {
              navigation.navigate('NamazVakitleri');
            }
          }}
          emojiFallback="🕐"
        />
        <TopInfoButton
          icon="water-drop"
          iconColor="#60A5FA"
          title="Nasıl Abdest Alırım?"
          onPress={() => {
            if (navigation) {
              navigation.navigate('AbdestAlma');
            }
          }}
          emojiFallback="💧"
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Flower Character */}
        <View style={styles.flowerContainer}>
          <FlowerCharacter size={160} animated={true} />
        </View>

        {/* Speech Bubble */}
        <View style={styles.speechBubbleContainer}>
          {/* Bubble Tail */}
          <View style={styles.bubbleTail} />
          
          {/* Bubble Content */}
          <View style={styles.speechBubble}>
            <View style={styles.bubbleHeader}>
              <IconWrapper
                name="stars"
                size={24}
                color="#FFC107"
                emojiFallback="⭐"
              />
              <Text style={styles.bubbleTitle}>
                Hedef Seçimi Tamamlandı!
              </Text>
              <IconWrapper
                name="stars"
                size={24}
                color="#FFC107"
                emojiFallback="⭐"
              />
            </View>
            <Text style={styles.bubbleText}>
              "Haydi başlayalım. Şimdi abdest alıp namaz kılmaya ne dersin?
              Seni burada bekleyeceğim. Namaz kıldığında birlikte tohumumuzu
              toprağa atacağız. Abdest almayı unutma."
            </Text>
          </View>
        </View>

        {/* Hourglass Animation */}
        <Animated.View
          style={[
            styles.hourglassContainer,
            {
              transform: [
                { rotate: hourglassRotation },
                { scale: hourglassScale },
              ],
            },
          ]}>
          <IconWrapper
            name="hourglass-empty"
            size={48}
            color={Colors.primary}
            emojiFallback="⏳"
          />
        </Animated.View>
      </View>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Tohum At"
          onPress={handlePlantSeed}
          leftIcon="yard"
          leftIconSize={28}
          showArrow={false}
          iconColor={Colors.textDark}
        />
        
        {/* Remind Later Button */}
        <TouchableOpacity
          style={styles.remindLaterButton}
          onPress={() => {
            // Handle remind later action
            if (navigation) {
              navigation.navigate('Garden');
            }
          }}
          activeOpacity={0.7}>
          <Text style={styles.remindLaterButtonText}>
            Daha Sonra Hatırlat
          </Text>
        </TouchableOpacity>
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
  topButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl * 1.5,
    paddingBottom: Spacing.md,
    zIndex: 20,
    gap: Spacing.sm,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    marginTop: -Spacing.xl * 1.5,
  },
  flowerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  speechBubbleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  bubbleTail: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    transform: [{ rotate: '45deg' }],
    zIndex: 20,
  },
  speechBubble: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl * 2, // More rounded like design
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    width: '100%',
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bubbleTitle: {
    ...CommonStyles.title,
    fontSize: FontSizes.subtitle,
    color: Colors.primary,
    textAlign: 'center',
  },
  bubbleText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
    lineHeight: 22,
    textAlign: 'center',
  },
  hourglassContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2.5,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  remindLaterButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  remindLaterButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default StartScreen;

