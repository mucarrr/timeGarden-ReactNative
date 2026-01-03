import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import IconWrapper from '../components/IconWrapper';
import {
  Colors,
  CommonStyles,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
} from '../styles/theme';
import { Character } from '../types';

// Karakter görselleri
const boyImage = require('../../assets/characters/boy.png');
const girlImage = require('../../assets/characters/girl-watering-flower.png');

interface NamazVakitleriScreenProps {
  navigation?: any;
  character?: Character;
}

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  color: string;
  bgColor: string;
  bgColorDark: string;
}

const NamazVakitleriScreen: React.FC<NamazVakitleriScreenProps> = ({
  navigation,
  character = 'boy',
}) => {
  // Statik namaz vakitleri (sonradan API'den gelecek)
  const prayerTimes: PrayerTime[] = [
    {
      name: 'Sabah',
      time: '05:30',
      icon: 'wb-sunny',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      bgColorDark: 'rgba(245, 158, 11, 0.1)',
    },
    {
      name: 'Öğle',
      time: '12:45',
      icon: 'wb-sunny',
      color: '#f97316',
      bgColor: '#fed7aa',
      bgColorDark: 'rgba(249, 115, 22, 0.1)',
    },
    {
      name: 'İkindi',
      time: '16:20',
      icon: 'wb-sunny',
      color: '#eab308',
      bgColor: '#fef9c3',
      bgColorDark: 'rgba(234, 179, 8, 0.1)',
    },
    {
      name: 'Akşam',
      time: '19:15',
      icon: 'nightlight-round',
      color: '#8b5cf6',
      bgColor: '#e9d5ff',
      bgColorDark: 'rgba(139, 92, 246, 0.1)',
    },
    {
      name: 'Yatsı',
      time: '21:00',
      icon: 'nightlight-round',
      color: '#6366f1',
      bgColor: '#c7d2fe',
      bgColorDark: 'rgba(99, 102, 241, 0.1)',
    },
  ];

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const getCurrentPrayerTime = () => {
    // Basit bir mantık - şu anki saate göre bir sonraki namaz vaktini göster
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let i = 0; i < prayerTimes.length; i++) {
      const [hour, minute] = prayerTimes[i].time.split(':').map(Number);
      if (
        currentHour < hour ||
        (currentHour === hour && currentMinute < minute)
      ) {
        return i;
      }
    }
    return 0; // Eğer tüm vakitler geçtiyse sabah namazını göster
  };

  const currentPrayerIndex = getCurrentPrayerTime();

  return (
    <SafeAreaView style={styles.container}>
      {/* Pattern Overlay */}
      <View style={styles.patternOverlay} />

      {/* Floating decorative elements */}
      <View style={[styles.floatingElement, styles.floatingElement1]} />
      <View style={[styles.floatingElement, styles.floatingElement2]} />
      <View style={[styles.floatingElement, styles.floatingElement3]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}>
          <IconWrapper
            name="arrow-back"
            size={24}
            color={Colors.textDark}
            emojiFallback="←"
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image
            source={character === 'boy' ? boyImage : girlImage}
            style={styles.headerCharacterIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Namaz Vakitleri</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Current Prayer Time Highlight */}
        <View style={styles.currentPrayerContainer}>
          <Text style={styles.currentPrayerLabel}>Sıradaki Namaz</Text>
          <View
            style={[
              styles.currentPrayerCard,
              {
                backgroundColor: prayerTimes[currentPrayerIndex].bgColor,
                borderColor: prayerTimes[currentPrayerIndex].color,
              },
            ]}>
            <View
              style={[
                styles.currentPrayerIcon,
                {
                  backgroundColor: prayerTimes[currentPrayerIndex].color,
                },
              ]}>
              <IconWrapper
                name={prayerTimes[currentPrayerIndex].icon}
                size={32}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.currentPrayerInfo}>
              <Text
                style={[
                  styles.currentPrayerName,
                  { color: prayerTimes[currentPrayerIndex].color },
                ]}>
                {prayerTimes[currentPrayerIndex].name}
              </Text>
              <Text style={styles.currentPrayerTime}>
                {prayerTimes[currentPrayerIndex].time}
              </Text>
            </View>
          </View>
        </View>

        {/* All Prayer Times List */}
        <View style={styles.prayerTimesList}>
          {prayerTimes.map((prayer, index) => {
            const isCurrent = index === currentPrayerIndex;
            return (
              <View
                key={index}
                style={[
                  styles.prayerTimeCard,
                  {
                    backgroundColor: Colors.surface,
                    borderLeftWidth: isCurrent ? 4 : 0,
                    borderLeftColor: isCurrent ? prayer.color : 'transparent',
                  },
                ]}>
                <View
                  style={[
                    styles.prayerIconContainer,
                    {
                      backgroundColor: prayer.bgColor,
                    },
                  ]}>
                  <IconWrapper
                    name={prayer.icon}
                    size={24}
                    color={prayer.color}
                  />
                </View>
                <View style={styles.prayerInfo}>
                  <Text style={styles.prayerName}>{prayer.name}</Text>
                  {isCurrent && (
                    <Text style={styles.currentBadge}>Sıradaki</Text>
                  )}
                </View>
                <Text style={[styles.prayerTime, { color: prayer.color }]}>
                  {prayer.time}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
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
  floatingElement: {
    position: 'absolute',
    borderRadius: 9999,
    zIndex: 0,
  },
  floatingElement1: {
    top: 40,
    left: 24,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(147, 197, 253, 0.2)',
  },
  floatingElement2: {
    bottom: 128,
    right: 24,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(19, 236, 91, 0.1)',
  },
  floatingElement3: {
    top: '50%',
    left: '33%',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(254, 240, 138, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl * 1.5,
    paddingBottom: Spacing.md,
    backgroundColor: 'rgba(246, 248, 246, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 20,
    position: 'relative',
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
    borderRadius: BorderRadius.full,
    zIndex: 10,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  headerCharacterIcon: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
  },
  currentPrayerContainer: {
    marginBottom: Spacing.xl,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  currentPrayerLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  currentPrayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    ...Shadows.card,
    gap: Spacing.md,
  },
  currentPrayerIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPrayerInfo: {
    flex: 1,
  },
  currentPrayerName: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  currentPrayerTime: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  prayerTimesList: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.sm,
  },
  prayerTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    gap: Spacing.md,
  },
  prayerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  prayerName: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  currentBadge: {
    fontSize: FontSizes.bodyTiny,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    backgroundColor: 'rgba(19, 236, 91, 0.1)',
    paddingHorizontal: Spacing.xs * 1.5,
    paddingVertical: Spacing.xs * 0.5,
    borderRadius: BorderRadius.full,
  },
  prayerTime: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
  },
  spacer: {
    height: Spacing.xl,
  },
});

export default NamazVakitleriScreen;

