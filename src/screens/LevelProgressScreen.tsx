import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loadGardenState } from '../utils/storage';
import { GardenState } from '../types';

const { width, height } = Dimensions.get('window');

interface LevelProgressScreenProps {
  navigation?: any;
  route?: any;
}

const MAX_LEVELS = 15;
const POINTS_PER_LEVEL = 10;

const LevelProgressScreen: React.FC<LevelProgressScreenProps> = ({
  navigation,
  route,
}) => {
  const [gardenState, setGardenState] = useState<GardenState | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stoneAnims = useRef(
    Array(MAX_LEVELS).fill(0).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentLevel > 0) {
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: currentLevel / MAX_LEVELS,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Animate unlocked stones
      stoneAnims.forEach((anim, index) => {
        if (index < currentLevel) {
          Animated.spring(anim, {
            toValue: 1,
            friction: 5,
            tension: 80,
            delay: index * 100,
            useNativeDriver: true,
          }).start();
        }
      });

      // Scroll to current level
      setTimeout(() => {
        const yOffset = Math.max(0, (MAX_LEVELS - currentLevel) * 80 - height / 2);
        scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
      }, 500);
    }
  }, [currentLevel]);

  const loadData = async () => {
    const state = await loadGardenState();
    if (state) {
      setGardenState(state);
      const badges = state.totalBadges || 0;
      setCurrentLevel(Math.max(1, badges));
      setTotalPoints(badges * POINTS_PER_LEVEL);
    }
  };

  const getLevelName = (level: number): string => {
    if (level <= 3) return 'Tohum Ekici';
    if (level <= 6) return 'Çiçek Tohumcusu';
    if (level <= 9) return 'Bahçıvan';
    if (level <= 12) return 'Uzman Bahçıvan';
    return 'Usta Bahçıvan';
  };

  const getLevelColor = (level: number): string => {
    if (level <= 3) return '#86EFAC';
    if (level <= 6) return '#4ADE80';
    if (level <= 9) return '#22C55E';
    if (level <= 12) return '#16A34A';
    return '#15803D';
  };

  const renderStone = (level: number) => {
    const isUnlocked = level <= currentLevel;
    const isCurrent = level === currentLevel;
    const stoneColor = isUnlocked ? getLevelColor(level) : '#D1D5DB';
    const animValue = stoneAnims[level - 1];

    return (
      <Animated.View
        key={level}
        style={[
          styles.stoneContainer,
          {
            opacity: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
            transform: [
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        {/* Path line */}
        {level < MAX_LEVELS && (
          <View
            style={[
              styles.pathLine,
              { backgroundColor: level < currentLevel ? '#4CAF50' : '#E5E7EB' },
            ]}
          />
        )}

        {/* Stone */}
        <View
          style={[
            styles.stone,
            {
              backgroundColor: stoneColor,
              borderWidth: isCurrent ? 3 : 0,
              borderColor: '#FFD700',
            },
          ]}
        >
          {isUnlocked ? (
            <View style={styles.stoneContent}>
              <Text style={styles.stoneLevel}>{level}</Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Icon name="star" size={12} color="#FFD700" />
                </View>
              )}
            </View>
          ) : (
            <Icon name="lock" size={20} color="#9CA3AF" />
          )}
        </View>

        {/* Level name */}
        <View style={styles.stoneLabelContainer}>
          <Text
            style={[
              styles.stoneLabel,
              { color: isUnlocked ? '#1F2937' : '#9CA3AF' },
            ]}
          >
            Seviye {level}
          </Text>
          {isCurrent && (
            <Text style={styles.stoneSublabel}>{getLevelName(level)}</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderProgressBar = () => {
    const progressHeight = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarOuter}>
          <Animated.View
            style={[
              styles.progressBarInner,
              { height: progressHeight },
            ]}
          />
          {/* Level markers */}
          {Array(MAX_LEVELS)
            .fill(0)
            .map((_, index) => {
              const level = index + 1;
              const isUnlocked = level <= currentLevel;
              const markerPosition = ((MAX_LEVELS - level) / MAX_LEVELS) * 100;
              
              return (
                <View
                  key={level}
                  style={[
                    styles.progressMarker,
                    {
                      top: `${markerPosition}%`,
                      backgroundColor: isUnlocked ? '#4CAF50' : '#D1D5DB',
                    },
                  ]}
                />
              );
            })}
        </View>
        <Text style={styles.progressLabel}>{totalPoints} puan</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/characters/filiz.png')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation?.goBack()}
          >
            <Icon name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Seviye Yolculuğum</Text>
            <View style={styles.levelBadge}>
              <Icon name="emoji-events" size={16} color="#FFD700" />
              <Text style={styles.levelBadgeText}>Seviye {currentLevel}</Text>
            </View>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Stones path */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.stonesScrollView}
            contentContainerStyle={styles.stonesContainer}
            showsVerticalScrollIndicator={false}
          >
            {Array(MAX_LEVELS)
              .fill(0)
              .map((_, index) => renderStone(MAX_LEVELS - index))}
          </ScrollView>

          {/* Progress bar (right side) */}
          {renderProgressBar()}
        </View>

        {/* Bottom action */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation?.navigate('MainTabs')}
          >
            <Text style={styles.continueButtonText}>Bahçeme Dön</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.15,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  headerSpacer: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  stonesScrollView: {
    flex: 1,
  },
  stonesContainer: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  stoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  pathLine: {
    position: 'absolute',
    width: 4,
    height: 40,
    left: 28,
    top: 60,
    borderRadius: 2,
  },
  stone: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  stoneContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stoneLevel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  currentBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  stoneLabelContainer: {
    marginLeft: 16,
  },
  stoneLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  stoneSublabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 2,
  },
  progressBarContainer: {
    width: 50,
    alignItems: 'center',
    paddingVertical: 40,
    paddingRight: 16,
  },
  progressBarOuter: {
    flex: 1,
    width: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  progressMarker: {
    position: 'absolute',
    left: -2,
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LevelProgressScreen;
