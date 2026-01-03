import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loadGardenState } from '../utils/storage';
import { GardenState, PrayerTime } from '../types';

interface BadgesGalleryScreenProps {
  navigation?: any;
  route?: any;
}

const BadgesGalleryScreen: React.FC<BadgesGalleryScreenProps> = ({
  navigation,
}) => {
  const [gardenState, setGardenState] = useState<GardenState | null>(null);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    const state = await loadGardenState();
    if (state) {
      setGardenState(state);
    }
  };

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

  const getBadgeInfo = (harvestCount: number) => {
    if (harvestCount >= 3) {
      return {
        name: 'Uzman Bahçıvan',
        icon: 'park',
        color: '#F59E0B',
        bgColor: '#FEF3C7',
      };
    }
    if (harvestCount >= 2) {
      return {
        name: 'Bahçıvan',
        icon: 'yard',
        color: '#EC4899',
        bgColor: '#FCE7F3',
      };
    }
    if (harvestCount >= 1) {
      return {
        name: 'Çiçek Tohumcusu',
        icon: 'local-florist',
        color: '#4CAF50',
        bgColor: '#DCFCE7',
      };
    }
    return null;
  };

  // Tüm rozetleri topla
  const allBadges: Array<{
    prayerTime: PrayerTime;
    badgeInfo: any;
    harvestCount: number;
  }> = [];

  if (gardenState) {
    Object.entries(gardenState.prayers).forEach(([prayerTime, progress]) => {
      const harvestCount = progress.harvestCount || 0;
      if (harvestCount > 0) {
        // Her hasat için bir rozet
        for (let i = 1; i <= harvestCount; i++) {
          const badgeInfo = getBadgeInfo(i);
          if (badgeInfo) {
            allBadges.push({
              prayerTime: prayerTime as PrayerTime,
              badgeInfo,
              harvestCount: i,
            });
          }
        }
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rozetlerim</Text>
        <Text style={styles.headerSubtitle}>
          {allBadges.length} rozet kazandın
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {allBadges.length > 0 ? (
          <View style={styles.badgesGrid}>
            {allBadges.map((badge, index) => (
              <View key={`${badge.prayerTime}-${index}`} style={styles.badgeCard}>
                <View
                  style={[
                    styles.badgeIconContainer,
                    { backgroundColor: badge.badgeInfo.bgColor },
                  ]}>
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
                {badge.badgeInfo.name === 'Bahçıvan' && (
                  <View style={styles.badgeMedalSilver}>
                    <Icon name="workspace-premium" size={24} color="#C0C0C0" />
                  </View>
                )}
                {badge.badgeInfo.name === 'Uzman Bahçıvan' && (
                  <View style={styles.badgeMedalGold}>
                    <Icon name="workspace-premium" size={32} color="#FFD700" />
                  </View>
                )}
                <Text style={styles.badgeName} numberOfLines={1}>
                  {badge.badgeInfo.name}
                </Text>
                <Text style={styles.badgePrayer} numberOfLines={1}>
                  {getPrayerName(badge.prayerTime)} Namazı
                </Text>
                {/* Hasat sayısı - Alt kısımda ortalı */}
                <View style={styles.badgeCountContainer}>
                  <Icon name="star" size={12} color="#F59E0B" />
                  <Text style={styles.badgeCountText}>
                    {badge.harvestCount}. Hasat
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Icon name="emoji-events" size={64} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>Henüz rozet yok</Text>
            <Text style={styles.emptyDescription}>
              Bahçende çiçek yetiştirip hasat ederek rozet kazanmaya başla!
            </Text>
            <View style={styles.emptySteps}>
              <View style={styles.emptyStep}>
                <Icon name="grain" size={24} color="#8B5CF6" />
                <Text style={styles.emptyStepText}>3 tohum ek</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#9CA3AF" />
              <View style={styles.emptyStep}>
                <Icon name="local-florist" size={24} color="#EC4899" />
                <Text style={styles.emptyStepText}>1 çiçek olsun</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#9CA3AF" />
              <View style={styles.emptyStep}>
                <Icon name="emoji-events" size={24} color="#FFD700" />
                <Text style={styles.emptyStepText}>Rozet kazan!</Text>
              </View>
            </View>
          </View>
        )}
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
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  badgeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  badgeCharacterImage: {
    width: 70,
    height: 70,
  },
  badgeMedalSilver: {
    position: 'absolute',
    top: 4,
    right: 4,
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
    top: 2,
    right: 2,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgePrayer: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  badgeCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    marginTop: 64,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptySteps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emptyStep: {
    alignItems: 'center',
    gap: 8,
  },
  emptyStepText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default BadgesGalleryScreen;

