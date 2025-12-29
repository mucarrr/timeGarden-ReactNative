# Vakit Bahçesi / Time Garden 🌸

Çocukların namaz vakitlerini takip etmelerine yardımcı olan sevimli bir React Native uygulaması.

## 🌱 Özellikler

### 1. "3 Tohum = 1 Çiçek" Algoritması
- Her vakit için 3 kez tamamlandığında çiçek açılır
- İlk vakit: Tohum (Seed) düşer
- İkinci vakit: Filiz (Sprout) olur
- Üçüncü vakit: Çiçek (Flower) açar ve bahçeye kalıcı olarak yerleşir

### 2. Karakter Seçimi
- Kız ve Erkek karakter seçenekleri
- 2D çizim karakterler (performans için)
- Dinamik isimler (TR: Zeynep, EN: Sophie)

### 3. Dil Desteği
- Otomatik dil tespiti (IP/Lokasyon bazlı)
- Türkçe (TR) ve İngilizce (EN) desteği
- Dinamik logo: "Vakit Bahçesi" / "Time Garden"

### 4. Bahçe Görünümü
- Grid bazlı bahçe alanı
- İzometrik/2D tasarım
- Her çiçek kalıcı olarak bahçede görünür

### 5. Vakit Takibi
- 5 vakit için ayrı takip
- Her vakit için durum gösterimi (Tohum/Filiz/Çiçek)
- Görsel ikonlar ile durum takibi

## 📱 Teknoloji Stack

- React Native
- TypeScript
- React Navigation
- AsyncStorage (veri saklama)
- i18n (lokalizasyon)
- React Native Vector Icons

## 🚀 Kurulum

```bash
npm install
# veya
yarn install
```

## 📂 Proje Yapısı

```
time-garden/
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── GardenScreen.tsx
│   │   └── ...
│   ├── components/
│   │   ├── CharacterSelector.tsx
│   │   ├── GardenGrid.tsx
│   │   ├── PrayerButton.tsx
│   │   └── ...
│   ├── utils/
│   │   ├── languageDetector.ts
│   │   ├── prayerTracker.ts
│   │   └── storage.ts
│   ├── i18n/
│   │   ├── tr.json
│   │   └── en.json
│   └── types/
│       └── index.ts
├── assets/
│   ├── images/
│   │   ├── characters/
│   │   └── garden/
│   └── icons/
└── package.json
```

## 🎨 Tasarım Prensipleri

- Canlı yeşiller
- Gökyüzü mavisi
- Pastel çiçek renkleri
- Çocuk dostu, sevimli arayüz
- Basit ve anlaşılır navigasyon

