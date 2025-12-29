import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import GardenGrid from '../components/GardenGrid';
import PrayerButton from '../components/PrayerButton';
import LottieCharacter from '../components/LottieCharacter';
import {
  PrayerTime,
  GardenState,
  Flower,
  SeedState,
} from '../types';
import {
  completePrayer,
  isPrayerCompletedToday,
  shouldCreateFlower,
  getTodayDate,
} from '../utils/prayerTracker';
import { saveGardenState, loadGardenState } from '../utils/storage';

const { width } = Dimensions.get('window');
const FLOWER_COLORS = ['#FF6B9D', '#FFB74D', '#BA68C8', '#4FC3F7', '#81C784'];

interface GardenScreenProps {
  navigation?: any;
  initialGardenState: GardenState;
  onStateUpdate: (state: GardenState) => void;
  onResetToOnboarding?: () => void;
}

const GardenScreen: React.FC<GardenScreenProps> = ({
  navigation,
  initialGardenState,
  onStateUpdate,
  onResetToOnboarding,
}) => {
  const [gardenState, setGardenState] = useState<GardenState>(initialGardenState);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const characterAnimationRef = useRef<LottieView>(null);
  const celebrationScale = React.useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();

  useEffect(() => {
    loadFlowers();
  }, []);

  const loadFlowers = async () => {
    try {
      const state = await loadGardenState();
      if (state) {
        // Çiçekleri oluştur (state'den)
        const newFlowers: Flower[] = [];
        Object.entries(state.prayers).forEach(([prayerTime, progress]) => {
          if (progress.state === 'flower' && progress.count >= 3) {
            // Rastgele pozisyon (basit implementasyon)
            const row = Math.floor(Math.random() * 6);
            const col = Math.floor(Math.random() * 6);
            const color = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];

            newFlowers.push({
              id: `${prayerTime}-${progress.count}`,
              prayerTime: prayerTime as PrayerTime,
              position: { row, col },
              color,
              createdAt: getTodayDate(),
            });
          }
        });
        setFlowers(newFlowers);
      }
    } catch (error) {
      console.error('Error loading flowers:', error);
    }
  };

  const handlePrayerComplete = async (prayerTime: PrayerTime) => {
    const currentProgress = gardenState.prayers[prayerTime];

    if (isPrayerCompletedToday(currentProgress)) {
      Alert.alert(t('completed'), 'Bu vakit bugün zaten tamamlandı!');
      return;
    }

    const oldProgress = { ...currentProgress };
    const newProgress = completePrayer(currentProgress);

    const updatedPrayers = {
      ...gardenState.prayers,
      [prayerTime]: newProgress,
    };

    const newGardenState: GardenState = {
      ...gardenState,
      prayers: updatedPrayers,
    };

    setGardenState(newGardenState);
    await saveGardenState(newGardenState);
    onStateUpdate(newGardenState);

    // Çiçek açtı mı kontrol et
    if (shouldCreateFlower(oldProgress, newProgress)) {
      const row = Math.floor(Math.random() * 6);
      const col = Math.floor(Math.random() * 6);
      const color = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];

      const newFlower: Flower = {
        id: `${prayerTime}-${Date.now()}`,
        prayerTime,
        position: { row, col },
        color,
        createdAt: getTodayDate(),
      };

      setFlowers(prev => [...prev, newFlower]);
      
      // Kutlama animasyonu
      setShowCelebration(true);
      Animated.sequence([
        Animated.spring(celebrationScale, {
          toValue: 1.3,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        Animated.spring(celebrationScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 5,
        }),
      ]).start();
      
      // Karakter kutlama animasyonu
      if (characterAnimationRef.current) {
        characterAnimationRef.current.play();
      }

      // 3 saniye sonra kutlama mesajını kapat
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);

      Alert.alert('🎉', 'Çiçek açtı! Bahçende yeni bir çiçek var!');
    }
  };

  const celebrationAnimatedStyle = {
    transform: [{ scale: celebrationScale }],
  };

  const prayerTimes: PrayerTime[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  const handleGoBack = () => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    } else if (onResetToOnboarding) {
      // Onboarding'e dönmek için state'i sıfırla
      onResetToOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Icon name="local-florist" size={20} color="#4CAF50" />
          <Text style={styles.title}>{t('garden')}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.gardenContainer}>
        <GardenGrid flowers={flowers} />
        
        {/* Karakter - Bahçede duruyor */}
        <View style={styles.characterContainer}>
          <LottieCharacter
            ref={characterAnimationRef}
            character={gardenState.character}
            animation={showCelebration ? 'celebrate' : 'idle'}
            size={100}
            loop={!showCelebration}
            autoPlay={true}
          />
        </View>

        {/* Kutlama efekti */}
        {showCelebration && (
          <Animated.View
            style={[styles.celebrationContainer, celebrationAnimatedStyle]}>
            <Text style={styles.celebrationText}>🎉</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.prayerButtonsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.prayerButtons}>
          {prayerTimes.map(prayerTime => (
            <PrayerButton
              key={prayerTime}
              prayerTime={prayerTime}
              state={gardenState.prayers[prayerTime].state}
              isCompletedToday={isPrayerCompletedToday(
                gardenState.prayers[prayerTime],
              )}
              onPress={() => handlePrayerComplete(prayerTime)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  gardenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerButtonsContainer: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  prayerButtons: {
    paddingHorizontal: 15,
    gap: 15,
  },
  characterContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  celebrationContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 20,
  },
  celebrationText: {
    fontSize: 80,
  },
});

export default GardenScreen;

