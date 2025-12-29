# 📱 Android Emulator'ı Açma - Adım Adım

## 🎯 Yöntem 1: Android Studio'dan (Önerilen)

### Adım 1: Android Studio'yu Aç
- Mac'te: **Spotlight**'ta (Cmd+Space) "Android Studio" yaz ve aç
- Veya **Applications** klasöründen aç

### Adım 2: AVD Manager'ı Aç
Android Studio açıldığında:

**Seçenek A**: Üst menüden
1. **Tools** → **Device Manager** (veya **AVD Manager**)
2. Açılan pencerede mevcut emulator'ları görürsün

**Seçenek B**: Sağ üst köşeden
1. Sağ üstte **Device Manager** ikonuna tıkla (telefon simgesi)
2. Veya **View** → **Tool Windows** → **Device Manager**

### Adım 3: Emulator'ı Başlat
1. **Device Manager** penceresinde mevcut emulator'ları görürsün
2. Bir emulator seç (örn: "Pixel_7_Pro")
3. Sağ tarafta **▶️ Play** butonuna tıkla
4. Emulator açılana kadar bekle (30-60 saniye)

### Adım 4: Kontrol Et
- Emulator açıldığında Android home screen'i görürsün
- Emulator çalışıyorsa hazırsın! ✅

---

## 🎯 Yöntem 2: Komut Satırından (Hızlı)

Terminal'de:

```bash
# Emulator listesini gör
emulator -list-avds

# Bir emulator başlat (isim değiştir)
emulator -avd Pixel_7_Pro &
```

**Not**: `emulator` komutu Android SDK'nın bir parçası. Eğer çalışmazsa, Android Studio'dan aç.

---

## 🎯 Yöntem 3: Emulator Zaten Açık mı?

### Kontrol Et:
1. **Android Studio**'yu aç
2. Alt kısımda **Device Manager** sekmesine bak
3. Açık emulator'lar yeşil nokta ile gösterilir

### Veya Terminal'de:
```bash
adb devices
```

Eğer emulator açıksa şöyle bir çıktı görürsün:
```
List of devices attached
emulator-5554    device
```

---

## ❓ Emulator Yoksa Ne Yapmalı?

### Yeni Emulator Oluştur:

1. **Android Studio** → **Tools** → **Device Manager**
2. **Create Device** butonuna tıkla
3. **Phone** kategorisinden bir cihaz seç (örn: Pixel 7 Pro)
4. **Next** → Sistem görüntüsü seç (API 33 veya 34 önerilir)
5. **Next** → **Finish**
6. Yeni emulator oluşturuldu, **▶️ Play** ile başlat

---

## ✅ Başarı Kontrolü

Emulator açıldığında:
- ✅ Android home screen görünür
- ✅ Emulator çalışıyor (yeşil nokta)
- ✅ `adb devices` komutu emulator'ı gösterir

**Hazırsın!** Şimdi `npm run android` çalıştırabilirsin! 🚀

---

## 🐛 Sorun Olursa

### Emulator açılmıyor?
- Android Studio'yu yeniden başlat
- Emulator'ı kapat ve tekrar aç
- Bilgisayarı yeniden başlat (son çare)

### "emulator" komutu bulunamıyor?
- Android Studio'dan aç (Yöntem 1)
- Veya Android SDK path'ini ekle

### Emulator çok yavaş?
- RAM'i artır (AVD Manager → Edit → Show Advanced Settings)
- HAXM/HAXM altını kontrol et (Intel için)

