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
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import BadgeModal from '../components/BadgeModal';
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
  
  // Animation refs for harvest buttons (scale and opacity)
  const harvestButtonAnims = useRef<{ [key: string]: Animated.Value }>({});
  const harvestButtonOpacityAnims = useRef<{ [key: string]: Animated.Value }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [badgeType, setBadgeType] = useState<string>('first_harvest');
  const confettiAnims = useRef<Animated.Value[]>([]);
  const [flyingFlowers, setFlyingFlowers] = useState<Array<{
    id: string;
    prayerTime: PrayerTime;
    startX?: number;
    startY?: number;
    anims: {
      translateY: Animated.Value;
      translateX: Animated.Value;
      opacity: Animated.Value;
      scale: Animated.Value;
    };
  }>>([]);

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

  // Initialize harvest button animations
  useEffect(() => {
    const pulseAnimations: Animated.CompositeAnimation[] = [];
    
    prayerTimes.forEach(prayerTime => {
      const parcelState = getParcelState(prayerTime);
      
      // Only animate if flowerCount is 3, 5, or 7
      if (parcelState.flowerCount === 3 || parcelState.flowerCount === 5 || parcelState.flowerCount === 7) {
        if (!harvestButtonAnims.current[prayerTime]) {
          harvestButtonAnims.current[prayerTime] = new Animated.Value(1);
        }
        
        const scaleAnim = harvestButtonAnims.current[prayerTime];
        
        if (scaleAnim) {
          // Scale pulse animation (büyüme-küçülme)
          const pulseAnim = Animated.loop(
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.15,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          );
          pulseAnimations.push(pulseAnim);
          pulseAnim.start();
        }
      } else {
        // Reset animation if flowerCount is not 3, 5, or 7
        if (harvestButtonAnims.current[prayerTime]) {
          harvestButtonAnims.current[prayerTime].setValue(1);
        }
      }
    });

    return () => {
      pulseAnimations.forEach(anim => anim.stop());
    };
  }, [gardenState]);

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

  // Hasat eşiğini hesapla: seviye 1-2 için 3, seviye 3-4 için 5, seviye 5+ için 7
  const getHarvestThreshold = (): number => {
    const level = calculateLevel();
    if (level <= 2) return 3;
    if (level <= 4) return 5;
    return 7;
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
      // Check if harvest threshold is reached
      const harvestThreshold = getHarvestThreshold();
      if (newFlowerCount >= harvestThreshold) {
        Alert.alert('🌾 Şimdi Hasat Zamanı!', `${harvestThreshold} çiçek biriktirdin! Hasat edebilirsin.`);
      } else {
        Alert.alert('🎉', 'Çiçek açtı! Bahçende yeni bir çiçek var!');
      }
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

  // Handle harvest: Convert flowers to badge
  const handleHarvest = async (prayerTime: PrayerTime) => {
    const parcelState = getParcelState(prayerTime);
    const harvestThreshold = getHarvestThreshold();
    
    if (parcelState.flowerCount < harvestThreshold) {
      return; // Should not happen, but safety check
    }

    // Get parcel position for animation start
    const color = getPrayerColor(prayerTime);
    const flowerCount = harvestThreshold;
    
    // Find parcel index
    const parcelIndex = prayerTimes.indexOf(prayerTime);
    
    // Calculate starting position (center of parcel right section)
    // Assuming parcel is in gardenPlots, we'll use approximate positions
    const parcelHeight = 600 / 5; // gardenPlots maxHeight / 5 parcels
    const startY = 200 + (parcelIndex * parcelHeight) + (parcelHeight / 2); // Approximate center
    const startX = width * 0.7; // Right side of parcel
    
    // Create flying flowers with unique IDs and starting positions
    const newFlyingFlowers = Array.from({ length: flowerCount }, (_, index) => ({
      id: `${prayerTime}-${Date.now()}-${index}`,
      prayerTime,
      startX,
      startY: startY + (index * 20) - 20, // Slight vertical offset
      anims: {
        translateY: new Animated.Value(0),
        translateX: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
      },
    }));

    // Add flying flowers to state
    setFlyingFlowers(prev => [...prev, ...newFlyingFlowers]);

    // Animate flowers flying to top (towards badge area)
    const animations = newFlyingFlowers.map((flower, index) => {
      const angle = (index / flowerCount) * Math.PI * 1.5; // Spread out
      const distance = 200;
      const targetX = Math.cos(angle) * distance;
      const targetY = -startY - 100; // Fly upward to top

      return Animated.parallel([
        Animated.timing(flower.anims.translateY, {
          toValue: targetY,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(flower.anims.translateX, {
          toValue: targetX,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(flower.anims.opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(flower.anims.scale, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]);
    });

    // Start all animations
    Animated.parallel(animations).start(() => {
      // Remove flying flowers after animation completes
      setFlyingFlowers(prev => prev.filter(f => !newFlyingFlowers.find(nf => nf.id === f.id)));
    });

    // Update garden state: remove harvested flowers
    const currentProgress = gardenState.prayers[prayerTime];
    const newCount = currentProgress.count - (flowerCount * 3); // Remove harvested flowers (each flower = 3 count)
    
    const newProgress = {
      ...currentProgress,
      count: Math.max(0, newCount),
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

    // Show confetti animation
    setShowConfetti(true);
    
    // Create simple confetti animation
    confettiAnims.current = Array.from({ length: 20 }, () => new Animated.Value(0));
    const confettiAnimations = confettiAnims.current.map((anim, i) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 2000,
        delay: i * 50,
        useNativeDriver: true,
      });
    });
    Animated.parallel(confettiAnimations).start();

    // Open BadgeModal after confetti animation
    setTimeout(() => {
      setShowConfetti(false);
      confettiAnims.current.forEach(anim => anim.setValue(0));
      setBadgeType('first_harvest');
      setBadgeModalVisible(true);
    }, 2000);
  };

  const prayerTimes: PrayerTime[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const totalFlowers = calculateTotalFlowers();
  const userName = 'Ahmet'; // TODO: Get from storage or props

  // Seviye hesaplama: Her 10 çiçek = 1 seviye
  const calculateLevel = (): number => {
    return Math.floor(totalFlowers / 10) + 1;
  };

  const userLevel = calculateLevel();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
      {/* Background gradient effects */}
      <View style={styles.backgroundGradient} />
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Level Badge with Character Image */}
        <View style={styles.levelBadgeContainer}>
          <View style={styles.levelImageContainer}>
            <Image
              source={
                gardenState.character === 'boy'
                  ? require('../../assets/characters/boy.png')
                  : require('../../assets/characters/girl-watering-flower.png')
              }
              style={styles.levelImage}
              resizeMode="contain"
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{userLevel}</Text>
            </View>
          </View>
        </View>

        {/* Statistics Button */}
        <TouchableOpacity style={styles.statisticsButton} activeOpacity={0.8}>
          <Icon name="bar-chart" size={20} color="#4CAF50" />
          <Text style={styles.statisticsText}>İstatistiklerim</Text>
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
                      <Icon name={iconName} size={40} color="rgba(255, 255, 255, 0.5)" />
                    </View>
                  ) : parcelState.currentProgress === 1 ? (
                    <View style={styles.seedParcelContent}>
                      <Icon name="grain" size={40} color={color} />
                    </View>
                  ) : (
                    <View style={styles.sproutParcelContent}>
                      <Icon name="eco" size={40} color={color} />
                    </View>
                  )}
                </TouchableOpacity>
                
                {/* Sağ taraf: Biriken çiçekler */}
                <View style={styles.parcelRight}>
                  {parcelState.flowerCount > 0 ? (
                    <View style={styles.flowersContainer}>
                      {Array.from({ length: Math.min(parcelState.flowerCount, 3) }).map((_, i) => {
                        // Farklı boyutlar
                        const size = 32 + (i % 3) * 4; // 32, 36, 40
                        // Hafif rotasyon
                        const rotation = (i % 7) * 5 - 15; // -15° ile +15° arası
                        
                        return (
                          <View
                            key={i}
                            style={[
                              styles.flowerIconNatural,
                              {
                                transform: [{ rotate: `${rotation}deg` }],
                              },
                            ]}>
                            <Icon
                              name="local-florist"
                              size={size}
                              color={color}
                            />
                          </View>
                        );
                      })}
                      {parcelState.flowerCount > 3 && (
                        <Text style={styles.flowerCountText}>
                          +{parcelState.flowerCount - 3}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.noFlowersContainer}>
                    </View>
                  )}
                  
                  {/* Hasat Butonu - 3, 5 veya 7 çiçek olduğunda görünür */}
                  {(parcelState.flowerCount === 3 || parcelState.flowerCount === 5 || parcelState.flowerCount === 7) && (
                    <Animated.View
                      style={[
                        styles.harvestButtonContainer,
                        {
                          transform: [
                            {
                              scale: harvestButtonAnims.current[prayerTime] || new Animated.Value(1),
                            },
                          ],
                        },
                      ]}>
                      <TouchableOpacity
                        style={styles.harvestButton}
                        onPress={() => handleHarvest(prayerTime)}
                        activeOpacity={0.8}>
                        <View style={styles.harvestButtonGlowRing} />
                        <View style={styles.harvestButtonOuter}>
                          <View style={styles.harvestButtonInner}>
                            <Icon name="content-cut" size={28} color="#4A4A4A" />
                          </View>
                          <View style={styles.harvestButtonShine} />
                          <View style={styles.harvestButtonSparkle1} />
                          <View style={styles.harvestButtonSparkle2} />
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Flying Flowers Overlay */}
      {flyingFlowers.length > 0 && (
        <View style={styles.flyingFlowersOverlay} pointerEvents="none">
          {flyingFlowers.map(flower => {
            const color = getPrayerColor(flower.prayerTime);
            return (
              <Animated.View
                key={flower.id}
                style={[
                  styles.flyingFlower,
                  {
                    left: flower.startX || width * 0.7,
                    top: flower.startY || height * 0.5,
                    transform: [
                      { translateX: flower.anims.translateX },
                      { translateY: flower.anims.translateY },
                      { scale: flower.anims.scale },
                    ],
                    opacity: flower.anims.opacity,
                  },
                ]}>
                <Icon name="local-florist" size={40} color={color} />
              </Animated.View>
            );
          })}
        </View>
      )}

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

      {/* Confetti Animation */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <View style={styles.confettiFallback}>
            {Array.from({ length: 20 }).map((_, i) => {
              const anim = confettiAnims.current[i] || new Animated.Value(0);
              const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#FFD700', '#FF8C00'];
              const startX = (i * 5) % 100;
              const rotation = i * 18;
              
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.confettiPiece,
                    {
                      backgroundColor: colors[i % colors.length],
                      left: `${startX}%`,
                      transform: [
                        {
                          translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, height + 50],
                          }),
                        },
                        {
                          translateX: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (Math.random() - 0.5) * 200],
                          }),
                        },
                        {
                          rotate: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', `${rotation + 360}deg`],
                          }),
                        },
                      ],
                      opacity: anim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1, 0],
                      }),
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      )}

      {/* Badge Modal */}
      <BadgeModal
        visible={badgeModalVisible}
        onClose={() => setBadgeModalVisible(false)}
        badgeType={badgeType}
        character={gardenState.character}
        level={userLevel}
      />
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
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    zIndex: 20,
    gap: 8,
  },
  levelBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelImage: {
    width: 60,
    height: 60,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '700',
  },
  statisticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
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
  statisticsText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
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
    overflow: 'visible',
    zIndex: 1,
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
    overflow: 'visible',
    zIndex: 50,
  },
  emptyParcelContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedParcelContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sproutParcelContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  flowerIconNatural: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  flowerCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  harvestButtonContainer: {
    position: 'absolute',
    right: -8,
    top: '50%',
    marginTop: -50, // Biraz daha yukarıda
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 100,
  },
  harvestButton: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
  },
  harvestButtonOuter: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: '#C0C0C0', // Parlak gümüş dış çerçeve
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
    position: 'relative',
    overflow: 'visible',
    borderWidth: 3,
    borderColor: '#E8E8E8', // Parlak kenarlık
  },
  harvestButtonInner: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4D4D4', // Parlak gümüş
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF', // Beyaz parlak kenarlık
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  harvestButtonShine: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 24,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    transform: [{ rotate: '-35deg' }],
  },
  harvestButtonGlowRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  harvestButtonSparkle1: {
    position: 'absolute',
    top: -4,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  harvestButtonSparkle2: {
    position: 'absolute',
    bottom: 2,
    left: 6,
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    pointerEvents: 'none',
  },
  confettiAnimation: {
    width: '100%',
    height: '100%',
  },
  confettiFallback: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  confettiPiece: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: -20,
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
  flyingFlowersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  flyingFlower: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
