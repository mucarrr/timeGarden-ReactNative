# 🚀 Uygulamayı Çalıştırma

## 📱 Android'de Çalıştırma

### Adım 1: Metro Bundler'ı Başlat
```bash
npm start
```
Bu komut Metro bundler'ı başlatır (JavaScript kodunu derler).

### Adım 2: Android'i Çalıştır
**Yeni bir terminal aç** ve şunu çalıştır:
```bash
npm run android
```

Veya **aynı terminal'de** Metro bundler'ı arka planda çalıştır:
```bash
npm start &
npm run android
```

## 📱 iOS'ta Çalıştırma

### Önce Pod Install (İlk Kez)
```bash
cd ios
pod install
cd ..
```

### Sonra Çalıştır
```bash
npm run ios
```

## 🔍 Uygulama Nerede?

Uygulama çalıştıktan sonra:

1. **Android Emulator'da**: Uygulama otomatik olarak açılır
2. **Fiziksel Cihazda**: Cihazda "Time Garden" veya "Vakit Bahçesi" uygulamasını bulabilirsin

### Uygulama Adı
- **Türkçe**: "Vakit Bahçesi"
- **İngilizce**: "Time Garden"

## ⚠️ Sorun Giderme

### Uygulama Açılmıyor?

1. **Metro bundler çalışıyor mu?**
   - Terminal'de `npm start` çalıştır
   - "Metro waiting on..." mesajını görmelisin

2. **Build hatası mı var?**
   - Android Studio'da hataları kontrol et
   - `npm run android` komutunu tekrar çalıştır

3. **Emulator çalışıyor mu?**
   - Android Studio'da emulator'ı başlat
   - Veya fiziksel cihaz bağlı mı kontrol et

### Uygulama Bulunamıyor?

Uygulama yüklendikten sonra:
- **Android**: App drawer'da "Time Garden" veya "Vakit Bahçesi" ara
- **iOS**: Home screen'de uygulama ikonunu bul

## 🎯 Hızlı Başlangıç

```bash
# Terminal 1: Metro bundler
npm start

# Terminal 2: Android
npm run android
```

**Not**: İlk build 2-5 dakika sürebilir. Sabırlı ol! 😊

