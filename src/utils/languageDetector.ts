import { NativeModules, Platform } from 'react-native';
import { Language } from '../types';

/**
 * Cihazın dilini ve lokasyonunu kontrol ederek uygun dili tespit eder
 */
export const detectLanguage = async (): Promise<Language> => {
  try {
    // Önce cihaz dilini kontrol et
    let deviceLanguage: string | undefined;
    
    if (Platform.OS === 'ios') {
      // iOS için
      try {
        deviceLanguage = 
          NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
      } catch (e) {
        console.warn('iOS language detection failed:', e);
      }
    } else {
      // Android için
      try {
        deviceLanguage = NativeModules.I18nManager?.localeIdentifier;
      } catch (e) {
        console.warn('Android language detection failed:', e);
      }
    }

    if (deviceLanguage) {
      const langCode = deviceLanguage.toLowerCase().substring(0, 2);
      if (langCode === 'tr') {
        return 'tr';
      }
    }

    // Varsayılan olarak İngilizce
    return 'en';
  } catch (error) {
    console.warn('Language detection failed, defaulting to English:', error);
    return 'en';
  }
};

