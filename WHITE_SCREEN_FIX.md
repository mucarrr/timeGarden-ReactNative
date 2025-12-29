# 🔧 Beyaz Ekran Sorunu - Çözüm

## ✅ Yapılanlar

1. **ErrorBoundary eklendi** - Hataları yakalayıp gösterir
2. **languageDetector güvenli hale getirildi** - Try-catch ile korundu

## 🔍 Sorun Tespiti

Beyaz ekran genellikle şu nedenlerden olur:
- JavaScript hatası
- Metro bundler bağlantı sorunu
- Native modül hatası

## 🚀 Çözüm Adımları

### 1. Metro Bundler Loglarını Kontrol Et

Terminal'de Metro bundler çalışıyor mu? Şu mesajları görmelisin:
```
Metro waiting on...
```

Eğer hata varsa, terminal'de kırmızı hata mesajları görürsün.

### 2. Uygulamayı Yeniden Başlat

```bash
# Metro bundler'ı durdur (Ctrl+C)
# Sonra tekrar başlat
npm start

# Başka terminal'de
npm run android
```

### 3. Cache'i Temizle

```bash
# Metro cache'i temizle
npm start -- --reset-cache

# Android cache'i temizle
cd android
./gradlew clean
cd ..
npm run android
```

### 4. React Native Debugger Aç

Emulator'da:
1. **Ctrl+M** (Mac) veya **Ctrl+M** (Windows/Linux) bas
2. **Debug** seçeneğini aç
3. Chrome DevTools'da Console'u kontrol et

### 5. Logcat'i Kontrol Et (Android)

```bash
adb logcat | grep -i "react"
```

## 📱 Hata Mesajı Görüyor musun?

ErrorBoundary ekledim. Eğer JavaScript hatası varsa, artık beyaz ekran yerine hata mesajı göreceksin.

**Metro bundler terminal'inde hata var mı?** Oraya bak, hata mesajını paylaş!

