import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import IconWrapper from '../components/IconWrapper';
import PrimaryButton from '../components/PrimaryButton';
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

interface AbdestAlmaScreenProps {
  navigation?: any;
  character?: Character;
}

interface AbdestStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  bgColorDark: string;
  position?: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  fullWidth?: boolean;
}

const AbdestAlmaScreen: React.FC<AbdestAlmaScreenProps> = ({ navigation, character = 'boy' }) => {
  const steps: AbdestStep[] = [
    {
      id: 1,
      title: 'Niyet Et',
      description: '"Niyet ettim Allah rızası için abdest almaya" de.',
      icon: 'favorite',
      iconColor: '#ef4444',
      bgColor: '#fef2f2',
      bgColorDark: 'rgba(239, 68, 68, 0.1)',
      position: 'right-top',
    },
    {
      id: 2,
      title: 'Elleri Yıka',
      description: 'Ellerini bileklerine kadar güzelce üç kere yıka.',
      icon: 'water-drop',
      iconColor: '#3b82f6',
      bgColor: '#eff6ff',
      bgColorDark: 'rgba(59, 130, 246, 0.1)',
      position: 'left-bottom',
    },
    {
      id: 3,
      title: 'Ağza Su Ver',
      description: 'Sağ elinle ağzına üç kere su al ve iyice çalkala.',
      icon: 'water-drop',
      iconColor: '#06b6d4',
      bgColor: '#ecfeff',
      bgColorDark: 'rgba(6, 182, 212, 0.1)',
      position: 'right-bottom',
    },
    {
      id: 4,
      title: 'Burna Su Ver',
      description: 'Burnuna sağ elinle üç kere su çek ve sol elinle temizle.',
      icon: 'air',
      iconColor: '#14b8a6',
      bgColor: '#f0fdfa',
      bgColorDark: 'rgba(20, 184, 166, 0.1)',
      position: 'left-top',
    },
    {
      id: 5,
      title: 'Yüzü Yıka',
      description:
        'Alnının en üstünden çene altına kadar tüm yüzünü üç kere yıka.',
      icon: 'face',
      iconColor: '#f97316',
      bgColor: '#fff7ed',
      bgColorDark: 'rgba(249, 115, 22, 0.1)',
      fullWidth: true,
    },
    {
      id: 6,
      title: 'Kolları Yıka',
      description: 'Önce sağ, sonra sol kolunu dirseklerle beraber yıka.',
      icon: 'pan-tool',
      iconColor: '#6366f1',
      bgColor: '#eef2ff',
      bgColorDark: 'rgba(99, 102, 241, 0.1)',
    },
    {
      id: 7,
      title: 'Başı Mesh Et',
      description: 'Islak sağ elinle başının üzerini bir kere mesh et.',
      icon: 'psychology',
      iconColor: '#a855f7',
      bgColor: '#faf5ff',
      bgColorDark: 'rgba(168, 85, 247, 0.1)',
    },
    {
      id: 8,
      title: 'Kulak/Boyun',
      description: 'İşaret parmağınla kulağını, başparmağınla boynunu sil.',
      icon: 'hearing',
      iconColor: '#ec4899',
      bgColor: '#fdf2f8',
      bgColorDark: 'rgba(236, 72, 153, 0.1)',
    },
    {
      id: 9,
      title: 'Ayakları Yıka',
      description: 'Önce sağ, sonra sol ayağını topuklarla beraber yıka.',
      icon: 'directions-walk',
      iconColor: '#84cc16',
      bgColor: '#f7fee7',
      bgColorDark: 'rgba(132, 204, 22, 0.1)',
    },
  ];

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleComplete = () => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation) {
      navigation.navigate('Start');
    }
  };

  const renderStep = (step: AbdestStep) => {
    // Tüm kutular fullWidth stiliyle alt alta
    return (
      <View
        key={step.id}
        style={[
          styles.stepCard,
          styles.fullWidthCard,
          { backgroundColor: Colors.surface },
        ]}>
        <View style={styles.fullWidthContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: step.bgColor,
                width: 64,
                height: 64,
              },
            ]}>
            <IconWrapper
              name={step.icon}
              size={32}
              color={step.iconColor}
            />
          </View>
          <View style={styles.fullWidthText}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>ADIM {step.id}</Text>
            </View>
            <Text style={styles.stepTitleLarge}>{step.title}</Text>
            <Text style={styles.stepDescriptionLarge}>{step.description}</Text>
          </View>
        </View>
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>Nasıl Abdest Alırım?</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.stepsGrid}>
          {steps.map(step => renderStep(step))}
          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="Öğrendim, Başlayalım!"
          onPress={handleComplete}
          leftIcon="check-circle"
          leftIconSize={24}
          showArrow={false}
          iconColor={Colors.textDark}
        />
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
  stepsGrid: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'column',
    gap: Spacing.md,
  },
  stepCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    position: 'relative',
  },
  fullWidthCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md * 1.25,
    minHeight: 'auto',
  },
  iconContainer: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    zIndex: 10,
    position: 'relative',
    borderWidth: 4,
    borderColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stepContent: {
    alignItems: 'center',
    zIndex: 10,
    position: 'relative',
    width: '100%',
  },
  fullWidthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md * 1.25,
    zIndex: 10,
    position: 'relative',
    flex: 1,
  },
  fullWidthText: {
    flex: 1,
    zIndex: 10,
    position: 'relative',
  },
  stepBadge: {
    paddingHorizontal: Spacing.xs * 1.5,
    paddingVertical: Spacing.xs * 0.5,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: Spacing.xs,
    alignSelf: 'flex-start',
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
  },
  stepTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  stepTitleLarge: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  stepDescription: {
    fontSize: FontSizes.bodyTiny,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  stepDescriptionLarge: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  spacer: {
    height: Spacing.xl,
    width: '100%',
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 30,
    position: 'relative',
  },
});

export default AbdestAlmaScreen;

