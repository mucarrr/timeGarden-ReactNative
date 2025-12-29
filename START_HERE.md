# 🚀 Uygulamayı Başlatma - Adım Adım

## 📋 Hızlı Başlangıç (3 Adım)

### 1️⃣ Metro Bundler'ı Başlat

**Yeni bir terminal aç** ve şunu çalıştır:

```bash
cd /Users/merveucar/Desktop/merve/live/time-garden
npm start
```

**Bekle**: Metro bundler başlayana kadar bekle. Şu mesajı görmelisin:
```
Metro waiting on...
```

**ÖNEMLİ**: Bu terminal'i açık bırak! Metro bundler çalışmaya devam etmeli.

---

### 2️⃣ Android Emulator'ı Aç

- **Android Studio'yu aç**
- **AVD Manager**'dan bir emulator başlat (veya zaten açıksa devam et)

---

### 3️⃣ Uygulamayı Çalıştır

**YENİ BİR TERMİNAL AÇ** (Metro bundler terminal'i açık kalsın!) ve şunu çalıştır:

```bash
cd /Users/merveucar/Desktop/merve/live/time-garden
npm run android
```

**Bekle**: Build tamamlanana kadar bekle (1-2 dakika). Uygulama otomatik olarak açılacak.

---

## ✅ Başarı Kontrolü

Uygulama açıldığında şunları görmelisin:

1. **İlk açılış**: Karakter seçimi ekranı
   - "Karakterini Seç / Choose Your Gardener" başlığı
   - Kız ve Erkek karakter seçenekleri

2. **Karakter seçtikten sonra**: Bahçe ekranı
   - Yeşil bahçe grid'i
   - 5 vakit butonu (Sabah, Öğle, İkindi, Akşam, Yatsı)

---

## 🐛 Sorun Olursa

### Metro bundler çalışmıyor?
```bash
# Port'u temizle
lsof -ti:8081 | xargs kill -9

# Yeniden başlat
npm start
```

### Build hatası?
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Beyaz ekran?
- Metro bundler terminal'inde hata var mı kontrol et
- Emulator'da **Ctrl+M** bas, **Debug** aç, Console'u kontrol et

---

## 📝 Özet

1. **Terminal 1**: `npm start` (Metro bundler - açık kalsın)
2. **Android Studio**: Emulator açık olmalı
3. **Terminal 2**: `npm run android` (Uygulamayı çalıştır)

**Hepsi bu kadar!** 🎉

