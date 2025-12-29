# 🔧 Metro Bundler Hatası - Çözüm

## ❌ Sorun
```
Error: Cannot find module 'metro-cache-key'
```

## ✅ Çözüm

### Yöntem 1: Eksik Paketi Kur (Önerilen)

Terminal'de şu komutu çalıştır:

```bash
cd /Users/merveucar/Desktop/merve/live/time-garden
npm install metro-cache-key --save-dev
```

### Yöntem 2: Tüm Paketleri Yeniden Kur

Eğer yukarıdaki çalışmazsa:

```bash
cd /Users/merveucar/Desktop/merve/live/time-garden
rm -rf node_modules package-lock.json
npm install
```

**Not**: `rm -rf` komutu izin sorunu verirse, Finder'dan manuel olarak `node_modules` klasörünü sil.

### Yöntem 3: Node Versiyonu Sorunu

Node.js v23.3.0 çok yeni ve React Native 0.72.6 ile uyumlu olmayabilir.

**Çözüm**: Node versiyonunu düşür:

```bash
# nvm kullanıyorsan
nvm install 18
nvm use 18

# Sonra paketleri tekrar kur
npm install
```

## 🚀 Sonra Metro'yu Başlat

```bash
npm start
```

## 📝 Alternatif: Android Studio ile Çalıştır

Metro sorunu yaşarken, Android Studio'dan direkt çalıştırabilirsin:

1. Android Studio'yu aç
2. Projeyi aç: `/Users/merveucar/Desktop/merve/live/time-garden/android`
3. "Run" butonuna bas

---

**Öneri**: Önce `npm install metro-cache-key --save-dev` komutunu dene. Çalışmazsa Node versiyonunu 18'e düşür.

