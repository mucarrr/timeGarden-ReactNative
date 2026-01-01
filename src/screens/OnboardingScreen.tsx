import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import CharacterSelector from '../components/CharacterSelector';
import PrimaryButton from '../components/PrimaryButton';
import IconWrapper from '../components/IconWrapper';
import { Character, Language } from '../types';
import { detectLanguage } from '../utils/languageDetector';
import { changeLanguage } from '../i18n';
import { Colors, CommonStyles, FontSizes, FontWeights, Spacing, BorderRadius } from '../styles/theme';

interface OnboardingScreenProps {
  navigation?: any;
  onComplete: (character: Character, language: Language) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation, onComplete }) => {
  const [character, setCharacter] = useState<Character>('boy');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    // Dil tespiti
    const initLanguage = async () => {
      try {
        const detectedLang = await detectLanguage();
        setLanguage(detectedLang);
        changeLanguage(detectedLang);
      } catch (error) {
        console.error('Language detection error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, []);

  const handleContinue = () => {
    onComplete(character, language);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{t('appName')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (navigation && navigation.canGoBack()) {
              navigation.goBack();
            }
          }}>
          <IconWrapper
            name="arrow-back"
            size={24}
            color={Colors.textDark}
            emojiFallback="←"
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <IconWrapper
            name="local-florist"
            size={20}
            color={Colors.primary}
            emojiFallback="🌱"
          />
          <Text style={styles.logo}>{t('appName')}</Text>
        </View>
        <TouchableOpacity style={styles.languageButton}>
          <Text style={styles.languageText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{t('chooseCharacter')}</Text>
        <Text style={styles.subtitle}>{t('chooseCharacterSubtitle')}</Text>

        <CharacterSelector
          selectedCharacter={character}
          onSelect={setCharacter}
        />

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>
          <Text style={styles.infoText}>{t('characterChangeInfo')}</Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonWrapper}>
        <PrimaryButton
          title={t('continue')}
          onPress={handleContinue}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 20,
    ...CommonStyles.title,
    color: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
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
  logo: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semiBold,
    color: Colors.textDark,
  },
  languageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semiBold,
    color: Colors.textDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl * 2,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.title * 1.2,
    color: Colors.textDark, // Same as SignUpScreen title color
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...CommonStyles.subtitle,
    textAlign: 'center',
    marginBottom: Spacing.xl * 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoIconText: {
    color: Colors.surface,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.textDark,
    lineHeight: 20,
  },
  buttonWrapper: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl * 2,
  },
});

export default OnboardingScreen;

