import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { authApi } from '../services/api';
import { GardenState, PrayerTime } from '../types';
import { loadGardenState } from '../utils/storage';

interface ProfileScreenProps {
  navigation?: any;
  route?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [gardenState, setGardenState] = useState<GardenState | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
    // Daire için dönen animasyon
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadUserData = async () => {
    const storedUser = await authApi.getStoredUser();
    setUser(storedUser);
    const state = await loadGardenState();
    if (state) {
      setGardenState(state);
    } else if (storedUser?.gardenState) {
      setGardenState(storedUser.gardenState);
    }
  };

  // İstatistikleri hesapla
  const totalFlowers = gardenState
    ? Object.values(gardenState.prayers).reduce(
        (sum, p) => sum + Math.floor(p.count / 3),
        0
      )
    : 0;

  const totalSeeds = gardenState
    ? Object.values(gardenState.prayers).reduce(
        (sum, p) => sum + (p.count % 3),
        0
      )
    : 0;

  const totalPrayers = gardenState
    ? Object.values(gardenState.prayers).reduce((sum, p) => sum + p.count, 0)
    : 0;

  const level = gardenState ? Math.max(1, gardenState.totalBadges || 0) : 1;

  // Biriken değerleri hesapla (hasat edilen rozetlerden)
  const totalBadges = gardenState?.totalBadges || 0;
  const accumulatedFlowersFromBadges = totalBadges * 3; // Her rozet = 3 çiçek hasat edildi
  const accumulatedSeedsFromBadges = totalBadges * 9; // Her rozet = 9 tohum (3 çiçek * 3 tohum)
  const accumulatedPrayersFromBadges = totalBadges * 9; // Her rozet = 9 namaz

  // En çok kıldığı vakti bul
  const getMostPrayedTime = (): string => {
    if (!gardenState) return '-';
    let maxCount = 0;
    let mostPrayed: PrayerTime | null = null;
    Object.entries(gardenState.prayers).forEach(([prayerTime, progress]) => {
      if (progress.count > maxCount) {
        maxCount = progress.count;
        mostPrayed = prayerTime as PrayerTime;
      }
    });
    return mostPrayed ? getPrayerName(mostPrayed) : '-';
  };

  // Toplam gün sayısını hesapla (lastCompletedDate'leri kullanarak)
  const getTotalDays = (): number => {
    if (!gardenState) return 0;
    const uniqueDates = new Set<string>();
    Object.values(gardenState.prayers).forEach((progress) => {
      if (progress.lastCompletedDate) {
        uniqueDates.add(progress.lastCompletedDate);
      }
    });
    return uniqueDates.size;
  };

  // En uzun seri (streak) hesapla - basit mantık: ardışık günler
  const getLongestStreak = (): number => {
    if (!gardenState) return 0;
    // Şimdilik toplam gün sayısını döndür, daha sonra gerçek streak hesaplanabilir
    return getTotalDays();
  };

  // Seviye adını al (badge sayısına göre)
  const getLevelName = (): string => {
    if (totalBadges === 0) return 'Çiçek Tohumcusu';
    if (totalBadges < 3) return 'Çiçek Tohumcusu';
    if (totalBadges < 6) return 'Bahçıvan';
    return 'Uzman Bahçıvan';
  };

  // Son 3 rozeti al
  const getLatestBadges = () => {
    if (!gardenState) return [];
    const badges: Array<{ prayerTime: PrayerTime; harvestCount: number; badgeName: string; lastDate?: string }> = [];
    
    Object.entries(gardenState.prayers).forEach(([prayerTime, progress]) => {
      const harvestCount = progress.harvestCount || 0;
      if (harvestCount > 0) {
        const badgeName = getBadgeName(harvestCount);
        if (badgeName) {
          badges.push({
            prayerTime: prayerTime as PrayerTime,
            harvestCount,
            badgeName,
            lastDate: progress.lastCompletedDate,
          });
        }
      }
    });

    // En son kazanılan rozetleri sırala (lastDate'e göre)
    badges.sort((a, b) => {
      if (!a.lastDate) return 1;
      if (!b.lastDate) return -1;
      return b.lastDate.localeCompare(a.lastDate);
    });

    // Son 3'ü al ve ters çevir (en yeni önce)
    return badges.slice(0, 3);
  };

  // Daire rotasyon animasyonu
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

  const getBadgeName = (harvestCount: number): string => {
    if (harvestCount >= 3) return 'Uzman Bahçıvan';
    if (harvestCount >= 2) return 'Bahçıvan';
    if (harvestCount >= 1) return 'Çiçek Tohumcusu';
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ayarlar İkonu - Sağ Üst Köşe */}
      <TouchableOpacity
        style={styles.settingsIconButton}
        onPress={() => navigation?.navigate('Settings')}
        activeOpacity={0.7}>
        <Icon name="settings" size={24} color="#4CAF50" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header - Karakter ve Kullanıcı Bilgileri */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            {/* Ana karakter daire */}
            <View style={styles.characterCircleMain}>
              <View style={styles.characterCircleInner}>
                <Image
                  source={
                    gardenState?.character === 'boy'
                      ? require('../../assets/characters/boy.png')
                      : require('../../assets/characters/girl-watering-flower.png')
                  }
                  style={styles.characterImageLarge}
                  resizeMode="contain"
                />
              </View>
              
              {/* Lv Badge - Sağ üst köşede */}
              <View style={styles.levelBadgeOnCircle}>
                <Text style={styles.levelTextOnCircle}>Lv.{level}</Text>
              </View>
            </View>
            
            {/* İsim */}
            <Text style={styles.userNameBelowCircle}>
              {user?.nickname || 'Küçük Bahçıvan'}
            </Text>
            
            {/* Seviye Badge - Oval */}
            <View style={styles.levelNameBadge}>
              <Icon name="wb-sunny" size={16} color="#4CAF50" />
              <Text style={styles.levelNameText}>
                Seviye: {getLevelName()}
              </Text>
            </View>
          </View>
        </View>

        {/* İstatistikler Kartları */}
        <View style={styles.statsSection}>
          <View style={styles.statsSectionHeader}>
            <Icon name="bar-chart" size={20} color="#4CAF50" />
            <Text style={styles.statsSectionTitle}>İstatistikler</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statCardBackground, styles.statCardBackgroundRight]}>
                <Icon name="local-florist" size={70} color="#DCFCE7" />
              </View>
              <Text style={styles.statValue}>{accumulatedFlowersFromBadges || totalFlowers}</Text>
              <Text style={styles.statLabel}>Toplam Çiçek</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statCardBackground, styles.statCardBackgroundRight]}>
                <Icon name="whatshot" size={70} color="#FEE2E2" />
              </View>
              <Text style={styles.statValue}>{getLongestStreak()}</Text>
              <Text style={styles.statLabel}>En Uzun Seri</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statCardBackground, styles.statCardBackgroundRight]}>
                <Icon name="mosque" size={70} color="#E0E7FF" />
              </View>
              <Text style={styles.statValue}>{(accumulatedFlowersFromBadges || totalFlowers) * 3}</Text>
              <Text style={styles.statLabel}>Toplam Namaz</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statCardBackground, styles.statCardBackgroundRight]}>
                <Icon name="emoji-events" size={70} color="#FEF3C7" />
              </View>
              <Text style={styles.statValue}>{totalBadges}</Text>
              <Text style={styles.statLabel}>Toplam Rozet</Text>
            </View>
          </View>
        </View>

        {/* Rozetler Önizleme */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="emoji-events" size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Rozetlerim</Text>
            </View>
            <TouchableOpacity onPress={() => navigation?.navigate('Badges')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          {gardenState && getLatestBadges().length > 0 ? (
            <View style={styles.badgesContainer}>
              {getLatestBadges().map((badge, index) => {
                // Rozet rengini belirle - badge tipine göre
                let badgeColor = '#DCFCE7'; // Çiçek Tohumcusu - yeşil
                if (badge.badgeName === 'Bahçıvan') {
                  badgeColor = '#FCE7F3'; // pembe
                } else if (badge.badgeName === 'Uzman Bahçıvan') {
                  badgeColor = '#FEF3C7'; // sarı
                }
                
                return (
                  <View key={`${badge.prayerTime}-${index}`} style={styles.badgeCard}>
                    <View style={[styles.badgeCircle, { backgroundColor: badgeColor }]}>
                      <Image
                        source={
                          gardenState?.character === 'boy'
                            ? require('../../assets/characters/boy.png')
                            : require('../../assets/characters/girl-watering-flower.png')
                        }
                        style={styles.badgeCharacterImage}
                        resizeMode="contain"
                      />
                    </View>
                    {/* Madalya - Sağ üst köşe */}
                    {badge.badgeName === 'Bahçıvan' && (
                      <View style={styles.badgeMedalSilver}>
                        <Icon name="workspace-premium" size={24} color="#C0C0C0" />
                      </View>
                    )}
                    {badge.badgeName === 'Uzman Bahçıvan' && (
                      <View style={styles.badgeMedalGold}>
                        <Icon name="workspace-premium" size={32} color="#FFD700" />
                      </View>
                    )}
                    <Text style={styles.badgeName} numberOfLines={2}>
                      {getPrayerName(badge.prayerTime)} Namazı {badge.badgeName === 'Çiçek Tohumcusu' ? 'Çiçek Tohumcusu' : badge.badgeName === 'Bahçıvan' ? 'Bahçıvanı' : 'Uzman Bahçıvanı'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyBadges}>
              <Icon name="emoji-events" size={48} color="#D1D5DB" />
              <Text style={styles.emptyBadgesText}>
                Henüz rozet kazanmadın
              </Text>
              <Text style={styles.emptyBadgesSubtext}>
                Bahçende çiçek yetiştirip hasat ederek rozet kazan!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  settingsIconButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position: 'relative',
  },
  profileContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  characterCircleMain: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginBottom: 16,
    position: 'relative',
  },
  characterCircleInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#86EFAC',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    padding: 24,
  },
  characterImageLarge: {
    width: 160,
    height: 160,
  },
  userNameBelowCircle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  levelBadgeOnCircle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  levelTextOnCircle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  levelNameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  levelNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  statsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 100,
  },
  statCardBackground: {
    position: 'absolute',
    opacity: 0.5,
    right: -10,
    top: '50%',
    transform: [{ translateY: -35 }],
  },
  statCardBackgroundRight: {
    right: -10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    zIndex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
    zIndex: 1,
  },
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  badgeCard: {
    alignItems: 'center',
    width: 105,
    position: 'relative',
  },
  badgeCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  badgeCharacterImage: {
    width: 80,
    height: 80,
  },
  badgeMedalSilver: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeMedalGold: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  badgeName: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyBadges: {
    width: '100%',
    alignItems: 'center',
    padding: 32,
  },
  emptyBadgesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyBadgesSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default ProfileScreen;

