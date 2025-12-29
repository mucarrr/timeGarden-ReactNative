import { PrayerTime, PrayerProgress, SeedState } from '../types';

/**
 * 3 Tohum = 1 Çiçek algoritması
 * Her vakit için 3 kez tamamlandığında çiçek açılır
 */
export const calculateSeedState = (count: number): SeedState => {
  if (count === 0) return 'seed';
  if (count === 1) return 'seed';
  if (count === 2) return 'sprout';
  if (count >= 3) return 'flower';
  return 'seed';
};

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
export const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

/**
 * Bir vakit için bugün tamamlanmış mı kontrol eder
 */
export const isPrayerCompletedToday = (progress: PrayerProgress): boolean => {
  return progress.lastCompletedDate === getTodayDate();
};

/**
 * Vakit tamamlandığında progress'i günceller
 */
export const completePrayer = (progress: PrayerProgress): PrayerProgress => {
  const today = getTodayDate();
  
  // Eğer bugün zaten tamamlanmışsa, count'u artırma
  if (progress.lastCompletedDate === today) {
    return progress;
  }

  // Yeni gün, count'u artır
  const newCount = progress.count + 1;
  const newState = calculateSeedState(newCount);

  return {
    count: newCount,
    lastCompletedDate: today,
    state: newState,
  };
};

/**
 * Çiçek açıldı mı kontrol eder (3. tamamlanma)
 */
export const shouldCreateFlower = (oldProgress: PrayerProgress, newProgress: PrayerProgress): boolean => {
  return oldProgress.state !== 'flower' && newProgress.state === 'flower';
};

