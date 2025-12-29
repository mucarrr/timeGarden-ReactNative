import AsyncStorage from '@react-native-async-storage/async-storage';
import { GardenState } from '../types';

const STORAGE_KEY = '@time_garden_state';

/**
 * Bahçe durumunu kaydeder
 */
export const saveGardenState = async (state: GardenState): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving garden state:', error);
    throw error;
  }
};

/**
 * Bahçe durumunu yükler
 */
export const loadGardenState = async (): Promise<GardenState | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as GardenState;
    }
    return null;
  } catch (error) {
    console.error('Error loading garden state:', error);
    return null;
  }
};

/**
 * Varsayılan bahçe durumu
 */
export const getDefaultGardenState = (language: 'tr' | 'en'): GardenState => ({
  prayers: {
    fajr: { count: 0, lastCompletedDate: '', state: 'seed' },
    dhuhr: { count: 0, lastCompletedDate: '', state: 'seed' },
    asr: { count: 0, lastCompletedDate: '', state: 'seed' },
    maghrib: { count: 0, lastCompletedDate: '', state: 'seed' },
    isha: { count: 0, lastCompletedDate: '', state: 'seed' },
  },
  character: 'boy',
  language,
  isOnboardingComplete: false,
});

