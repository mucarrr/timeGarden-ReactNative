# ⚡ Hızlı Başlangıç - Şimdi Yap!

## 🎯 Durum
✅ Paketler kuruldu  
⏳ iOS/Android klasörleri eksik

## 🚀 Hemen Yap (Terminal'de)

### 1. Geçici React Native projesi oluştur
```bash
cd /Users/merveucar/Desktop/merve/live
npx react-native@0.72.6 init TimeGardenTemp --skip-install
```

### 2. ios ve android klasörlerini kopyala
```bash
cp -r TimeGardenTemp/ios /Users/merveucar/Desktop/merve/live/time-garden/
cp -r TimeGardenTemp/android /Users/merveucar/Desktop/merve/live/time-garden/
```

### 3. Geçici projeyi sil
```bash
rm -rf TimeGardenTemp
```

### 4. iOS Pod'ları kur (Mac'teysen)
```bash
cd /Users/merveucar/Desktop/merve/live/time-garden/ios
pod install
cd ..
```

### 5. Projeyi çalıştır! 🎉
```bash
# Android için
npm run android

# VEYA iOS için
npm run ios
```

---

## ⚠️ Önemli: package.json'ı Güncelle

ios/android klasörlerini kopyaladıktan sonra, `package.json`'daki `name` alanını kontrol et. Eğer "TimeGardenTemp" yazıyorsa, "time-garden" olarak değiştir.

---

## 🎬 Alternatif: Expo Kullan (Daha Kolay)

Eğer yukarıdaki adımlar zor geliyorsa, Expo'ya geçebiliriz. Daha kolay ama kodda küçük değişiklikler gerekir.

---

## 💡 İpucu

Eğer hata alırsan:
- Android: Android Studio ve emulator açık olmalı
- iOS: Xcode ve simulator açık olmalı
- Metro bundler: `npm start` ile ayrı terminal'de çalıştır

---

**Hangi yolu tercih edersin?**
1. React Native CLI (yukarıdaki adımlar)
2. Expo (daha kolay, ben yardımcı olurum)

