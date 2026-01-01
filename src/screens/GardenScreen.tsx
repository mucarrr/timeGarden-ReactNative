import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  PrayerTime,
  GardenState,
  SeedState,
} from '../types';
import {
  completePrayer,
  isPrayerCompletedToday,
  shouldCreateFlower,
} from '../utils/prayerTracker';
import { saveGardenState, loadGardenState } from '../utils/storage';

const { width, height } = Dimensions.get('window');

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
  const { t } = useTranslation();

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const state = await loadGardenState();
      if (state) {
        setGardenState(state);
      }
    } catch (error) {
      console.error('Error loading garden state:', error);
    }
  };

  // Calculate total flowers: sum of (count // 3) for each prayer time
  const calculateTotalFlowers = (): number => {
    let totalFlowers = 0;
    Object.values(gardenState.prayers).forEach(progress => {
      totalFlowers += Math.floor(progress.count / 3);
    });
    return totalFlowers;
  };

  // Get prayer time icon
  const getPrayerIcon = (prayerTime: PrayerTime): string => {
    switch (prayerTime) {
      case 'fajr':
        return 'wb-sunny'; // Morning sun
      case 'dhuhr':
        return 'wb-sunny'; // Noon sun
      case 'asr':
        return 'wb-cloudy'; // Afternoon with clouds
      case 'maghrib':
        return 'nightlight-round'; // Evening moon
      case 'isha':
        return 'nightlight-round'; // Night moon
      default:
        return 'radio-button-unchecked';
    }
  };

  // Get prayer time color
  const getPrayerColor = (prayerTime: PrayerTime): string => {
    switch (prayerTime) {
      case 'fajr':
        return '#F59E0B'; // yellow-500
      case 'dhuhr':
        return '#EF4444'; // red-500
      case 'asr':
        return '#4CAF50'; // green-500
      case 'maghrib':
        return '#6366F1'; // indigo-500
      case 'isha':
        return '#A855F7'; // purple-500
      default:
        return '#9E9E9E';
    }
  };

  // Get parcel state (empty or has seed/sprout/flower)
  const getParcelState = (prayerTime: PrayerTime) => {
    const progress = gardenState.prayers[prayerTime];
    return {
      state: progress.state,
      count: progress.count,
      isEmpty: progress.count === 0,
    };
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

    // Check if flower was created
    if (shouldCreateFlower(oldProgress, newProgress)) {
      Alert.alert('🎉', 'Çiçek açtı! Bahçende yeni bir çiçek var!');
    }
  };

  const prayerTimes: PrayerTime[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const totalFlowers = calculateTotalFlowers();
  const userName = 'Ahmet'; // TODO: Get from storage or props

  return (
    <SafeAreaView style={styles.container}>
      {/* Background gradient effects */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Greeting Button */}
        <TouchableOpacity style={styles.greetingButton} activeOpacity={0.8}>
          <View style={styles.greetingIconContainer}>
            <Icon name="face" size={20} color="#F97316" />
          </View>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingLabel}>Merhaba,</Text>
            <Text style={styles.greetingName}>{userName}</Text>
          </View>
        </TouchableOpacity>

        {/* Flower Count Button */}
        <TouchableOpacity style={styles.flowerCountButton} activeOpacity={0.8}>
          <View style={styles.flowerIconContainer}>
            <Icon name="local-florist" size={20} color="#EC4899" />
          </View>
          <View style={styles.flowerTextContainer}>
            <Text style={styles.flowerLabel}>ÇİÇEK</Text>
            <Text style={styles.flowerCount}>{totalFlowers}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Garden Area */}
      <View style={styles.gardenContainer}>
        {/* Banner: 3 Tohum = 1 Çiçek */}
        <View style={styles.banner}>
          <Icon name="grain" size={16} color="#2E7D32" />
          <Text style={styles.bannerText}>3 Tohum = 1 Çiçek</Text>
          <Icon name="local-florist" size={16} color="#EC4899" />
        </View>

        {/* Garden Plots */}
        <View style={styles.gardenPlots}>
          {prayerTimes.map((prayerTime, index) => {
            const parcelState = getParcelState(prayerTime);
            const iconName = getPrayerIcon(prayerTime);
            
            return (
              <TouchableOpacity
                key={prayerTime}
                style={styles.parcel}
                activeOpacity={0.7}
                onPress={() => handlePrayerComplete(prayerTime)}>
                {parcelState.isEmpty ? (
                  <View style={styles.emptyParcelContent}>
                    <Icon name={iconName} size={24} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.emptyParcelText}>
                      {index + 1}. Parsel (Boş)
                    </Text>
                  </View>
                ) : (
                  <View style={styles.filledParcelContent}>
                    <Icon 
                      name={parcelState.state === 'flower' ? 'local-florist' : parcelState.state === 'sprout' ? 'eco' : 'grain'} 
                      size={32} 
                      color={getPrayerColor(prayerTime)} 
                    />
                    <Text style={styles.filledParcelText}>
                      {t(`prayerTimes.${prayerTime}`)}
                    </Text>
                    <Text style={styles.filledParcelCount}>
                      {parcelState.count}/3
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Section: Vakit Tohumları */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomSectionHandle} />
        <View style={styles.bottomSectionContent}>
          <Text style={styles.bottomSectionTitle}>VAKİT TOHUMLARI</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.prayerSeedsContainer}>
            {prayerTimes.map(prayerTime => {
              const progress = gardenState.prayers[prayerTime];
              const isCompleted = isPrayerCompletedToday(progress);
              const iconName = getPrayerIcon(prayerTime);
              const color = getPrayerColor(prayerTime);
              
              return (
                <TouchableOpacity
                  key={prayerTime}
                  style={styles.prayerSeedButton}
                  activeOpacity={0.7}
                  onPress={() => handlePrayerComplete(prayerTime)}>
                  <View style={[styles.prayerSeedIconContainer, { borderColor: isCompleted ? color : '#E5E7EB' }]}>
                    <Icon name={iconName} size={28} color={color} />
                  </View>
                  <View style={styles.prayerSeedTextContainer}>
                    <Text style={styles.prayerSeedName}>
                      {t(`prayerTimes.${prayerTime}`)}
                    </Text>
                    <Icon name="grain" size={20} color={color} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.33,
    backgroundColor: 'rgba(129, 212, 250, 0.3)',
    zIndex: 0,
  },
  backgroundCircle1: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(254, 240, 138, 0.4)',
    zIndex: 0,
  },
  backgroundCircle2: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 0,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 8,
    zIndex: 20,
  },
  greetingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  greetingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingTextContainer: {
    marginLeft: 12,
  },
  greetingLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
  },
  flowerCountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  flowerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerTextContainer: {
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  flowerLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  flowerCount: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '700',
  },
  gardenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  gardenPlots: {
    width: '100%',
    height: '100%',
    maxHeight: 600,
    backgroundColor: '#81C784',
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#A5D6A7',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  parcel: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyParcelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyParcelText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '500',
  },
  filledParcelContent: {
    alignItems: 'center',
    gap: 4,
  },
  filledParcelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  filledParcelCount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 8,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 30,
  },
  bottomSectionHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  bottomSectionContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  bottomSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  prayerSeedsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  prayerSeedButton: {
    width: width * 0.18,
    alignItems: 'center',
    gap: 8,
  },
  prayerSeedIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  prayerSeedTextContainer: {
    alignItems: 'center',
    gap: 2,
  },
  prayerSeedName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default GardenScreen;
