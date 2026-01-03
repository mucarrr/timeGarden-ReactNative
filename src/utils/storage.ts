import { GardenState } from '../types';
import { gardenApi } from '../services/api';

/**
 * Bahçe durumunu kaydeder (sadece server'a)
 */
export const saveGardenState = async (state: GardenState): Promise<void> => {
  try {
    await gardenApi.syncToServer(state);
  } catch (error) {
    console.error('Error saving garden state:', error);
    // Server hatası olsa bile devam et (offline durumda)
  }
};

/**
 * Bahçe durumunu yükler (server'dan)
 */
export const loadGardenState = async (): Promise<GardenState | null> => {
  try {
    return await gardenApi.loadFromServer();
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
    fajr: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
    dhuhr: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
    asr: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
    maghrib: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
    isha: { count: 0, lastCompletedDate: '', state: 'seed', harvestCount: 0 },
  },
  character: 'boy',
  language,
  isOnboardingComplete: false,
  totalBadges: 0,
});

