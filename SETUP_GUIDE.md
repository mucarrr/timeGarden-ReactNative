# 🚀 Proje Kurulum Rehberi

## ✅ Durum
- ✅ Kod yazıldı
- ✅ Paketler kuruldu (`npm install` tamamlandı)
- ⏳ Native proje initialize edilmeli

## 📱 Seçenek 1: React Native CLI ile (Önerilen)

### Adım 1: React Native CLI'ı global kur (eğer yoksa)
```bash
npm install -g react-native-cli
```

### Adım 2: Yeni bir React Native projesi oluştur (geçici)
```bash
cd /Users/merveucar/Desktop/merve/live
npx react-native init TimeGardenTemp --version 0.72.6
```

### Adım 3: ios ve android klasörlerini kopyala
```bash
cp -r TimeGardenTemp/ios /Users/merveucar/Desktop/merve/live/time-garden/
cp -r TimeGardenTemp/android /Users/merveucar/Desktop/merve/live/time-garden/
rm -rf TimeGardenTemp
```

### Adım 4: iOS Pod'ları kur
```bash
cd /Users/merveucar/Desktop/merve/live/time-garden/ios
pod install
cd ..
```

### Adım 5: Projeyi çalıştır
```bash
# Android
npm run android

# iOS
npm run ios
```

---

## 📱 Seçenek 2: Expo ile (Daha Kolay)

Eğer React Native CLI ile uğraşmak istemiyorsan, Expo kullanabiliriz. Ama kodda küçük değişiklikler gerekebilir.

---

## 🎯 Hızlı Çözüm (Ben Yapabilirim)

Bana "ios ve android klasörlerini oluştur" dersen, ben otomatik olarak oluşturabilirim. Ama bunun için React Native template'ine ihtiyacım var.

---

## ⚠️ Önemli Notlar

1. **Node Versiyonu**: Node v23.3.0 kullanıyorsun, bu çok yeni. React Native 0.72.6 için Node 18-20 arası önerilir. Ama çalışabilir.

2. **Deprecated Uyarıları**: Normal, endişelenme.

3. **Vulnerabilities**: Dev dependencies'de, şimdilik sorun değil.

---

## 🚀 Şimdi Ne Yapmalıyım?

**Seçenek A**: Ben ios/android klasörlerini oluşturayım (biraz zaman alabilir)
**Seçenek B**: Sen manuel olarak yukarıdaki adımları takip et
**Seçenek C**: Expo'ya geçelim (daha kolay ama kod değişikliği gerekir)

Hangisini tercih edersin?

