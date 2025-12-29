export type Language = 'tr' | 'en';

export type Character = 'boy' | 'girl';

export type PrayerTime = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type SeedState = 'seed' | 'sprout' | 'flower';

export interface PrayerProgress {
  count: number;
  lastCompletedDate: string; // YYYY-MM-DD format
  state: SeedState;
}

export interface GardenState {
  prayers: Record<PrayerTime, PrayerProgress>;
  character: Character;
  language: Language;
  isOnboardingComplete: boolean;
}

export interface Flower {
  id: string;
  prayerTime: PrayerTime;
  position: { row: number; col: number };
  color: string;
  createdAt: string;
}

