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
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import {
  PrayerTime,
  GardenState,
  SeedState,
} from '../types';
import {
  shouldCreateFlower,
  getTodayDate,
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
  const [draggingSeed, setDraggingSeed] = useState<{ prayerTime: PrayerTime; x: number; y: number; startX: number; startY: number } | null>(null);
  const { t } = useTranslation();
  const gardenPlotsRef = useRef<View>(null);
  const seedButtonRefs = useRef<{ [key: string]: any }>({});

  // Vakit isimlerini Türkçe olarak döndür
  const getPrayerName = (prayerTime: PrayerTime): string => {
    const prayerNames: Record<PrayerTime, string> = {
      fajr: 'Sabah',
      dhuhr: 'Öğle',
      asr: 'İkindi',
      maghrib: 'Akşam',
      isha: 'Yatsı',
    };
    return prayerNames[prayerTime];
  };

  // Bahçedeki duruma göre tohum/filiz ikonunu döndür
  const getSeedIcon = (prayerTime: PrayerTime): string => {
    const parcelState = getParcelState(prayerTime);
    // currentProgress: 0 = boş, 1 = tohum, 2 = filiz
    if (parcelState.currentProgress === 2) {
      return 'eco'; // Filiz
    }
    return 'grain'; // Tohum (0 veya 1)
  };

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
    const totalCount = progress.count;
    const currentProgress = totalCount % 3; // 0, 1, veya 2 (tohum alanındaki ilerleme)
    const flowerCount = Math.floor(totalCount / 3); // Biriken çiçek sayısı
    
    return {
      currentProgress, // 0: boş, 1: tohum, 2: filiz
      flowerCount, // Biriken çiçek sayısı
      totalCount,
    };
  };

  const handlePrayerComplete = async (prayerTime: PrayerTime) => {
    const currentProgress = gardenState.prayers[prayerTime];

    // Development: Her tıklamada count'u artır (bugün kontrolü yok)
    const oldProgress = { ...currentProgress };
    
    // Count'u artır
    const newCount = currentProgress.count + 1;
    const currentProgressValue = newCount % 3; // 0, 1, veya 2
    
    // State'i hesapla (sadece görüntüleme için)
    let newState: SeedState;
    if (currentProgressValue === 0) {
      newState = 'seed'; // Çiçek oldu, sıfırlandı
    } else if (currentProgressValue === 1) {
      newState = 'seed';
    } else {
      newState = 'sprout';
    }

    const newProgress = {
      count: newCount,
      lastCompletedDate: getTodayDate(),
      state: newState,
    };

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

    // Check if flower was created (3. tıklamada)
    const oldFlowerCount = Math.floor(oldProgress.count / 3);
    const newFlowerCount = Math.floor(newCount / 3);
    if (newFlowerCount > oldFlowerCount) {
      Alert.alert('🎉', 'Çiçek açtı! Bahçende yeni bir çiçek var!');
    }
  };

  // Check if drop position is over a parcel
  const checkDropOnParcel = (x: number, y: number, draggedPrayerTime: PrayerTime) => {
    // Get garden plots position
    if (!gardenPlotsRef.current) return;
    
    gardenPlotsRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      // Check if drop is within garden plots bounds
      if (x >= px && x <= px + width && y >= py && y <= py + height) {
        // Calculate which parcel (0-4) based on y position
        const relativeY = y - py;
        const parcelHeight = height / 5;
        const parcelIndex = Math.floor(relativeY / parcelHeight);
        
        if (parcelIndex >= 0 && parcelIndex < prayerTimes.length) {
          const targetPrayerTime = prayerTimes[parcelIndex];
          
          // Check if dragged seed matches the target parcel's prayer time
          if (draggedPrayerTime === targetPrayerTime) {
            // Correct parcel - add seed
            handlePrayerComplete(targetPrayerTime);
          } else {
            // Wrong parcel - show warning
            Alert.alert(
              '⚠️ Yanlış Parsel',
              `${getPrayerName(draggedPrayerTime)} tohumu ${getPrayerName(targetPrayerTime)} parseline atılamaz!`,
              [{ text: 'Tamam', style: 'default' }]
            );
          }
        }
      }
    });
  };

  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (prayerTime: PrayerTime) => {
    // Get button position
    const buttonRef = seedButtonRefs.current[prayerTime];
    if (buttonRef && buttonRef.measure) {
      buttonRef.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
        setDraggingSeed({
          prayerTime,
          startX: px + width / 2,
          startY: py + height / 2,
          x: px + width / 2,
          y: py + height / 2,
        });
        setIsDragging(true);
      });
    }
  };

  const onDragUpdate = (prayerTime: PrayerTime, translationX: number, translationY: number) => {
    // Only start dragging if moved more than 10 pixels
    const distance = Math.sqrt(translationX * translationX + translationY * translationY);
    if (distance > 10 && draggingSeed && draggingSeed.prayerTime === prayerTime) {
      setDraggingSeed({
        ...draggingSeed,
        x: draggingSeed.startX + translationX,
        y: draggingSeed.startY + translationY,
      });
    } else if (distance <= 10 && draggingSeed) {
      // Reset if not moved enough
      setDraggingSeed(null);
      setIsDragging(false);
    }
  };

  const onDragEnd = (prayerTime: PrayerTime) => {
    if (draggingSeed && draggingSeed.prayerTime === prayerTime) {
      checkDropOnParcel(draggingSeed.x, draggingSeed.y, prayerTime);
    }
    setDraggingSeed(null);
    setIsDragging(false);
  };

  const prayerTimes: PrayerTime[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const totalFlowers = calculateTotalFlowers();
  const userName = 'Ahmet'; // TODO: Get from storage or props

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <View ref={gardenPlotsRef} style={styles.gardenPlots}>
          {prayerTimes.map((prayerTime, index) => {
            const parcelState = getParcelState(prayerTime);
            const iconName = getPrayerIcon(prayerTime);
            const color = getPrayerColor(prayerTime);
            
            const isEmpty = parcelState.currentProgress === 0 && parcelState.flowerCount === 0;
            
            return (
              <View key={prayerTime} style={[styles.parcel, isEmpty && styles.parcelEmpty]}>
                {/* Sol taraf: Tohum atma alanı */}
                <TouchableOpacity
                  style={styles.parcelLeft}
                  activeOpacity={0.7}
                  onPress={() => handlePrayerComplete(prayerTime)}>
                  {parcelState.currentProgress === 0 ? (
                    <View style={styles.emptyParcelContent}>
                      <Icon name={iconName} size={20} color="rgba(255, 255, 255, 0.5)" />
                      <Text style={styles.emptyParcelText}>
                        {index + 1}. Parsel
                      </Text>
                    </View>
                  ) : parcelState.currentProgress === 1 ? (
                    <View style={styles.seedParcelContent}>
                      <Icon name="grain" size={24} color={color} />
                      <Text style={styles.seedParcelText}>Tohum</Text>
                    </View>
                  ) : (
                    <View style={styles.sproutParcelContent}>
                      <Icon name="eco" size={24} color={color} />
                      <Text style={styles.sproutParcelText}>Filiz</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                {/* Sağ taraf: Biriken çiçekler */}
                <View style={styles.parcelRight}>
                  {parcelState.flowerCount > 0 ? (
                    <View style={styles.flowersContainer}>
                      {Array.from({ length: parcelState.flowerCount }).map((_, i) => (
                        <Icon
                          key={i}
                          name="local-florist"
                          size={28}
                          color={color}
                          style={styles.flowerIcon}
                        />
                      ))}
                      {parcelState.flowerCount > 3 && (
                        <Text style={styles.flowerCountText}>
                          +{parcelState.flowerCount - 3}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.noFlowersContainer}>
                      <Text style={styles.noFlowersText}>Çiçek Bahçem</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Bottom Section: Bugünün Hasadı */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomSectionHandle} />
        <View style={styles.bottomSectionContent}>
          <Text style={styles.bottomSectionTitle}>BUGÜNÜN HASADI</Text>
          <View style={styles.prayerSeedsContainer}>
            {prayerTimes.map(prayerTime => {
              const iconName = getPrayerIcon(prayerTime);
              const color = getPrayerColor(prayerTime);
              const isThisDragging = draggingSeed?.prayerTime === prayerTime;
              const seedIcon = getSeedIcon(prayerTime);
              
              return (
                <PanGestureHandler
                  key={prayerTime}
                  minPointers={1}
                  maxPointers={1}
                  avgTouches={true}
                  onHandlerStateChange={(event) => {
                    const { state, translationX, translationY } = event.nativeEvent;
                    if (state === State.BEGAN) {
                      // Don't set dragging immediately, wait for movement
                    } else if (state === State.ACTIVE) {
                      onDragUpdate(prayerTime, translationX, translationY);
                    } else if (state === State.END || state === State.CANCELLED) {
                      onDragEnd(prayerTime);
                    }
                  }}
                  onGestureEvent={(event) => {
                    const { translationX, translationY } = event.nativeEvent;
                    const distance = Math.sqrt(translationX * translationX + translationY * translationY);
                    if (distance > 10) {
                      // Only start dragging if moved enough
                      if (!draggingSeed) {
                        onDragStart(prayerTime);
                      } else if (draggingSeed.prayerTime === prayerTime) {
                        onDragUpdate(prayerTime, translationX, translationY);
                      }
                    }
                  }}>
                  <Animated.View 
                    ref={(ref) => { seedButtonRefs.current[prayerTime] = ref; }}
                    style={[styles.prayerSeedButton, isThisDragging && styles.prayerSeedButtonDragging]}>
                    <View style={styles.prayerSeedButtonInner}>
                      <View style={[styles.prayerSeedIconContainer, { borderColor: '#E5E7EB' }]}>
                        <Icon name={iconName} size={28} color={color} />
                      </View>
                      <View style={styles.prayerSeedTextContainer}>
                        <Text style={styles.prayerSeedName}>
                          {getPrayerName(prayerTime)}
                        </Text>
                        <Icon name={seedIcon} size={20} color={color} />
                      </View>
                    </View>
                  </Animated.View>
                </PanGestureHandler>
              );
            })}
          </View>
        </View>
      </View>

      {/* Dragging Seed Overlay - Sadece ikon karesi */}
      {draggingSeed && (
        <View
          style={[
            styles.draggingSeedIconOnly,
            {
              left: draggingSeed.x - 32,
              top: draggingSeed.y - 32,
            },
          ]}
          pointerEvents="none">
          <Icon
            name={getPrayerIcon(draggingSeed.prayerTime)}
            size={28}
            color={getPrayerColor(draggingSeed.prayerTime)}
          />
        </View>
      )}
      </SafeAreaView>
    </GestureHandlerRootView>
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
    paddingBottom: 16,
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
    backgroundColor: '#1B5E20', // Canlı ve koyu yeşil
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#2E7D32',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  parcel: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#5D4037', // Canlı ve koyu kahverengi
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 3,
    overflow: 'hidden',
  },
  parcelEmpty: {
    backgroundColor: '#8D6E63', // Soft kahverengi (boş parseller için)
  },
  parcelLeft: {
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 2,
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
  },
  parcelRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  emptyParcelContent: {
    alignItems: 'center',
    gap: 4,
  },
  emptyParcelText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '500',
  },
  seedParcelContent: {
    alignItems: 'center',
    gap: 4,
  },
  seedParcelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sproutParcelContent: {
    alignItems: 'center',
    gap: 4,
  },
  sproutParcelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  flowersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  flowerIcon: {
    margin: 2,
  },
  flowerCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  noFlowersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFlowersText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
    paddingBottom: 16,
    marginTop: 12,
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
    marginTop: 8,
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
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  prayerSeedButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 2,
  },
  prayerSeedButtonInner: {
    width: '100%',
    alignItems: 'center',
  },
  prayerSeedButtonDragging: {
    opacity: 0.5,
  },
  draggingSeedIconOnly: {
    position: 'absolute',
    width: 64,
    height: 64,
    zIndex: 1000,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
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
    gap: 4,
    marginTop: 4,
  },
  prayerSeedName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default GardenScreen;
