# Lottie Animasyon Kurulum Rehberi 🎬

## 1. Paket Kurulumu

```bash
npm install lottie-react-native
# veya
yarn add lottie-react-native
```

### iOS için ek adım:
```bash
cd ios && pod install && cd ..
```

## 2. Lottie Dosyalarını Hazırlama

### Seçenek A: After Effects (Tasarımcılar için)
1. After Effects'te karakter animasyonunu tasarla
2. [Bodymovin](https://github.com/airbnb/lottie-web) plugin'ini yükle
3. Export → JSON formatında kaydet
4. Dosyaları `assets/animations/` klasörüne kopyala

### Seçenek B: LottieFiles (Hazır Animasyonlar)
1. [LottieFiles.com](https://lottiefiles.com) sitesine git
2. "Gardener" veya "Character" araması yap
3. Beğendiğin animasyonu indir (JSON formatında)
4. Dosyaları `assets/animations/` klasörüne kopyala

### Seçenek C: Figma → Lottie
1. Figma'da karakteri tasarla
2. [Figma to Lottie](https://www.figma.com/community/plugin/809860933443519853) plugin'ini kullan
3. JSON olarak export et

## 3. Dosya Yapısı

```
assets/
└── animations/
    ├── boy-idle.json          # Erkek karakter - durma animasyonu
    ├── boy-celebrate.json     # Erkek karakter - kutlama
    ├── boy-watering.json      # Erkek karakter - sulama
    ├── girl-idle.json         # Kız karakter - durma animasyonu
    ├── girl-celebrate.json    # Kız karakter - kutlama
    └── girl-watering.json     # Kız karakter - sulama
```

## 4. Kullanım Örneği

### CharacterSelector'da:
```tsx
import LottieCharacter from './LottieCharacter';

<LottieCharacter 
  character="boy" 
  animation="idle" 
  size={150}
  loop={true}
/>
```

### GardenScreen'de (Çiçek açtığında):
```tsx
import LottieCharacter from './LottieCharacter';

// Çiçek açtığında kutlama animasyonu
<LottieCharacter 
  character={selectedCharacter} 
  animation="celebrate" 
  size={200}
  loop={false}
  autoPlay={true}
/>
```

## 5. Performans İpuçları

1. **Dosya boyutunu küçült**: LottieFiles'da optimize et
2. **Gereksiz animasyonları kaldır**: Sadece gerekli frame'leri tut
3. **Cache kullan**: Aynı animasyonu tekrar yükleme
4. **Loop kontrolü**: Gereksiz yere loop açma

## 6. Örnek Animasyon Senaryoları

### Senaryo 1: Karakter Seçimi
- **idle** animasyonu sürekli oynar
- Kullanıcı seçim yaptığında hafif **bounce** efekti

### Senaryo 2: Vakit Tamamlandı
- Karakter **watering** animasyonu oynar
- Tohum düşer (Reanimated ile)

### Senaryo 3: Çiçek Açtı
- Karakter **celebrate** animasyonu oynar (1 kez)
- Sonra **idle**'a döner

## 7. Test Etme

```tsx
// Test komponenti
import React from 'react';
import { View } from 'react-native';
import LottieCharacter from './components/LottieCharacter';

const TestScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieCharacter character="boy" animation="idle" size={200} />
      <LottieCharacter character="girl" animation="celebrate" size={200} />
    </View>
  );
};
```

## 8. Sorun Giderme

### Animasyon oynatılmıyor:
- JSON dosyasının doğru yolda olduğundan emin ol
- `require()` path'ini kontrol et
- Lottie dosyasının geçerli JSON olduğunu doğrula

### Performans sorunu:
- Dosya boyutunu kontrol et (200KB altı olmalı)
- Gereksiz frame'leri temizle
- Loop'u kapat

### iOS'ta çalışmıyor:
- `pod install` çalıştırdın mı?
- Xcode'da clean build yap

## 9. Sonraki Adımlar

1. ✅ Lottie paketini kur
2. ✅ Animasyon dosyalarını hazırla/hazırlat
3. ✅ `LottieCharacter` bileşenini kullan
4. ✅ CharacterSelector'ı güncelle
5. ✅ GardenScreen'e karakter ekle
6. ✅ Animasyon senaryolarını test et

---

**Not**: Şimdilik emoji fallback kullanıyoruz. Lottie dosyaları hazır olduğunda otomatik olarak geçiş yapacak! 🎉

