import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { Character } from '../types';

interface LottieCharacterProps {
  character: Character;
  animation?: 'idle' | 'celebrate' | 'watering';
  style?: ViewStyle;
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

/**
 * Lottie animasyonlu karakter bileşeni
 * 
 * Kullanım:
 * - Lottie JSON dosyalarını assets/animations/ klasörüne ekleyin
 * - Dosya isimleri: boy-idle.json, girl-idle.json, boy-celebrate.json, vb.
 * 
 * Örnek:
 * <LottieCharacter character="boy" animation="idle" size={150} />
 */
const LottieCharacter = forwardRef<LottieView, LottieCharacterProps>(({
  character,
  animation = 'idle',
  style,
  size = 150,
  loop = true,
  autoPlay = true,
}, ref) => {
  const animationRef = useRef<LottieView>(null);

  useImperativeHandle(ref, () => animationRef.current as LottieView);

  useEffect(() => {
    if (autoPlay && animationRef.current) {
      animationRef.current.play();
    }
  }, [autoPlay, animation]);

  // Lottie dosya yolu
  // Not: Gerçek Lottie JSON dosyalarını assets/animations/ klasörüne eklemeniz gerekiyor
  // Şimdilik null - gerçek Lottie dosyaları eklendiğinde aşağıdaki gibi kullanılacak:
  // const animationSource = require(`../assets/animations/${character}-${animation}.json`);
  const animationSource: any = null;

  // Eğer Lottie dosyası yoksa, fallback göster (emoji)
  if (!animationSource) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <View style={[styles.fallbackCircle, character === 'boy' ? styles.boyCircle : styles.girlCircle]}>
          <Text style={styles.emojiContainer}>
            {character === 'boy' ? '👦' : '👧'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LottieView
        ref={animationRef}
        source={animationSource}
        style={{ width: size, height: size }}
        loop={loop}
        autoPlay={autoPlay}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boyCircle: {
    backgroundColor: '#BBDEFB',
  },
  girlCircle: {
    backgroundColor: '#F8BBD0',
  },
  emojiContainer: {
    fontSize: 60,
  } as any,
});

export default LottieCharacter;

