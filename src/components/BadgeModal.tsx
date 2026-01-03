import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BadgeCard from './BadgeCard';

const { width, height } = Dimensions.get('window');

type PrayerTime = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

interface BadgeModalProps {
  visible: boolean;
  onClose: () => void;
  onLevelUnlock?: () => void;
  badgeType?: string;
  character?: 'boy' | 'girl';
  level?: number;
  prayerTime?: PrayerTime;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ 
  visible, 
  onClose, 
  onLevelUnlock,
  badgeType,
  character = 'boy',
  level = 1,
  prayerTime = 'fajr',
}) => {
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);
  
  // Bounce animation for speech bubble
  const bounceAnim = useRef(new Animated.Value(0)).current;
  // Rotate animation for loader
  const rotateAnim = useRef(new Animated.Value(0)).current;
  // Scale animation for unlock message
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setShowUnlockMessage(false);
      scaleAnim.setValue(0);
      
      // Start bounce animation when modal is visible
      const bounceLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      bounceLoop.start();
      
      // Show unlock message after 2 seconds
      const unlockTimer = setTimeout(() => {
        setShowUnlockMessage(true);
        
        // Scale in animation for unlock message
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }).start();
        
        // Start rotate animation for loader
        const rotateLoop = Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
        rotateLoop.start();
        
        // Navigate to level progress after 3 more seconds
        const navigateTimer = setTimeout(() => {
          if (onLevelUnlock) {
            onLevelUnlock();
          } else {
            onClose();
          }
        }, 3000);
        
        return () => clearTimeout(navigateTimer);
      }, 2000);
      
      return () => {
        bounceLoop.stop();
        clearTimeout(unlockTimer);
      };
    }
  }, [visible, bounceAnim, rotateAnim, scaleAnim, onLevelUnlock, onClose]);

  // Vakit isimlerini Türkçe olarak döndür
  const getPrayerName = (prayer: PrayerTime): string => {
    const prayerNames: Record<PrayerTime, string> = {
      fajr: 'Sabah',
      dhuhr: 'Öğle',
      asr: 'İkindi',
      maghrib: 'Akşam',
      isha: 'Yatsı',
    };
    return prayerNames[prayer];
  };
  // Rozet tipine göre başlık belirle
  const getMainTitle = () => {
    switch (badgeType) {
      case 'gardener':
      case 'master_gardener':
        return 'Harika iş çıkardın!';
      default:
        return 'Harikasın!';
    }
  };

  // Rozet tipine göre badge card başlığı (vakit + rozet adı)
  const getBadgeCardTitle = () => {
    const prayerName = getPrayerName(prayerTime);
    switch (badgeType) {
      case 'first_harvest':
        return `${prayerName} Namazı Çiçek Tohumcusu`;
      case 'gardener':
        return `${prayerName} Namazı Bahçıvanı`;
      case 'master_gardener':
        return `${prayerName} Namazı Uzman Bahçıvanı`;
      default:
        return `${prayerName} Namazı Çiçek Tohumcusu`;
    }
  };

  const getBadgeInfo = () => {
    switch (badgeType) {
      case 'first_harvest':
        return {
          title: 'Çiçek Tohumcusu',
          subtitle: 'Çiçek Tohumcusu',
          message: 'Toprak seni çok sevdi. Artık bir',
          highlight: 'Çiçek Tohumcususun!',
          icon: 'local-florist',
          color: '#4CAF50',
        };
      case 'gardener':
        return {
          title: 'Bahçıvan',
          subtitle: 'Bahçıvan',
          message: 'Vay canına! Bahçen dillenmeye başladı. Artık gerçek bir',
          highlight: 'Bahçıvansın!',
          icon: 'yard',
          color: '#2E7D32',
        };
      case 'master_gardener':
        return {
          title: 'Uzman Bahçıvan',
          subtitle: 'Uzman Bahçıvan',
          message: 'Bu vakit senin sayende dev bir bahçeye dönüştü. Sen bir',
          highlight: 'Uzman Bahçıvansın!',
          icon: 'park',
          color: '#1B5E20',
        };
      case 'prayer_master':
        return {
          title: 'Namaz Ustası',
          subtitle: 'Namaz Ustası Rozeti',
          message: 'Namazlarını düzenli kılıyorsun. Artık bir',
          highlight: 'Namaz Ustasısın!',
          icon: 'mosque',
          color: '#4CAF50',
        };
      case 'garden_keeper':
        return {
          title: 'Bahçıvan',
          subtitle: 'Bahçıvan Rozeti',
          message: 'Bahçeni çok güzel yetiştirdin. Artık bir',
          highlight: 'Bahçıvansın!',
          icon: 'yard',
          color: '#4CAF50',
        };
      default:
        return {
          title: 'Yeni Rozet',
          subtitle: 'Yeni Rozet',
          message: 'Harika bir iş başardın. Artık bir',
          highlight: 'Şampiyonsun!',
          icon: 'stars',
          color: '#4CAF50',
        };
    }
  };

  const badgeInfo = getBadgeInfo();

  const characterImage = character === 'boy' 
    ? require('../../assets/characters/boy.png')
    : require('../../assets/characters/girl-watering-flower.png');

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}>
          <Icon name="close" size={28} color="#1F2937" />
        </TouchableOpacity>

        {/* Level Badge - Ortada üstte */}
        <View style={styles.levelBadgeContainer}>
          <View style={styles.levelBadge}>
            <View style={styles.levelDot} />
            <Text style={styles.levelText}>SEVİYE {level}</Text>
          </View>
        </View>

        {/* Main Content Area - Karakter büyük ve çerçevesiz */}
        <View style={styles.mainContent}>
          {/* Top Speech Bubble - Dinamik başlık */}
          <View style={styles.topSpeechBubble}>
            <Text style={styles.mainTitle}>{getMainTitle()}</Text>
            <View style={styles.speechBubbleArrowDown} />
          </View>

          {/* Character Container with Circle Bubble */}
          <View style={styles.characterWrapper}>
            {/* Character Image - Büyük ve çerçevesiz */}
            <View style={styles.characterContainer}>
              <Image
                source={characterImage}
                style={styles.characterImage}
                resizeMode="contain"
              />
            </View>

            {/* Circle Speech Bubble - Sağ üstte saksının üstünde, zıplama animasyonlu */}
            <Animated.View 
              style={[
                styles.circleSpeechBubble,
                { transform: [{ translateY: bounceAnim }] }
              ]}>
              <Text style={styles.circleMessageText}>
                {badgeInfo.message}{' '}
                <Text style={styles.messageHighlight}>{badgeInfo.highlight}</Text>
              </Text>
              <View style={styles.circleBubbleArrow} />
            </Animated.View>
          </View>
        </View>

        {/* Earned Badge Section */}
        <View style={styles.badgeSection}>
          <View style={styles.badgeSectionHeader}>
            <Text style={styles.badgeSectionTitle}>KAZANILAN ROZET</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>Tümünü gör</Text>
            </TouchableOpacity>
          </View>

          {/* Badge Card Component */}
          <BadgeCard
            title={getBadgeCardTitle()}
            badgeImage={require('../../assets/characters/cicek.png')}
            isNew={true}
          />
        </View>

        {/* Unlock Message & Loader */}
        <View style={styles.buttonContainer}>
          {showUnlockMessage ? (
            <Animated.View 
              style={[
                styles.unlockContainer,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <Text style={styles.unlockTitle}>🎉 Yeni Seviyenin Kilidi Açıldı!</Text>
              <View style={styles.loaderContainer}>
                <Animated.View
                  style={[
                    styles.loaderIcon,
                    {
                      transform: [
                        {
                          rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Icon name="local-florist" size={40} color="#4CAF50" />
                </Animated.View>
                <Text style={styles.loaderText}>Yolculuğuna devam et...</Text>
              </View>
            </Animated.View>
          ) : (
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingText}>Rozetini kutla! 🌸</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  levelBadgeContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    left: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 90,
    paddingBottom: 0,
  },
  topSpeechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 0,
    position: 'relative',
  },
  speechBubbleArrowDown: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  characterWrapper: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  characterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  characterImage: {
    width: width * 1.0,
    height: height * 0.52,
  },
  circleSpeechBubble: {
    position: 'absolute',
    top: 20,
    right: 16,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  circleBubbleArrow: {
    position: 'absolute',
    bottom: 8,
    left: 15,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderRightWidth: 12,
    borderTopColor: '#DCFCE7',
    borderRightColor: 'transparent',
    transform: [{ rotate: '15deg' }],
  },
  circleMessageText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
  },
  messageHighlight: {
    color: '#16A34A',
    fontWeight: '700',
  },
  badgeSection: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  badgeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  unlockContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  unlockTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  loaderContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  waitingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default BadgeModal;
