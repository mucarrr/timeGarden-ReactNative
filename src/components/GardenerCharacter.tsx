import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, Path, G, Ellipse } from 'react-native-svg';
import { Animated } from 'react-native';
import { Character } from '../types';

interface GardenerCharacterProps {
  character: Character;
  animation?: 'idle' | 'celebrate' | 'watering';
  size?: number;
  style?: ViewStyle;
}

/**
 * Tutarlı bahçıvan karakter seti
 * Erkek ve kız karakterler aynı tasarım dili, farklı renkler
 */
const GardenerCharacter: React.FC<GardenerCharacterProps> = ({
  character,
  animation = 'idle',
  size = 150,
  style,
}) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const celebrateScale = useRef(new Animated.Value(1)).current;
  const wateringRotate = useRef(new Animated.Value(0)).current;

  // Idle animasyonu: Hafif nefes alma
  useEffect(() => {
    if (animation === 'idle') {
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      );
      breathe.start();
      return () => breathe.stop();
    }
  }, [animation, breatheAnim]);

  // Celebrate animasyonu: Zıplama
  useEffect(() => {
    if (animation === 'celebrate') {
      const celebrate = Animated.loop(
        Animated.sequence([
          Animated.spring(celebrateScale, {
            toValue: 1.2,
            useNativeDriver: true,
            tension: 50,
            friction: 3,
          }),
          Animated.spring(celebrateScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 3,
          }),
        ]),
      );
      celebrate.start();
      return () => celebrate.stop();
    }
  }, [animation, celebrateScale]);

  // Watering animasyonu: Sulama hareketi
  useEffect(() => {
    if (animation === 'watering') {
      const watering = Animated.loop(
        Animated.sequence([
          Animated.timing(wateringRotate, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(wateringRotate, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      watering.start();
      return () => watering.stop();
    }
  }, [animation, wateringRotate]);

  // Karakter renkleri
  const colors = {
    boy: {
      hat: '#4A90E2', // Mavi şapka
      overall: '#66BB6A', // Yeşil tulum
      skin: '#FFDBAC', // Ten rengi
      hair: '#8B4513', // Kahverengi saç
      eyes: '#000000', // Siyah gözler
      mouth: '#E91E63', // Pembe ağız
      wateringCan: '#FFA726', // Turuncu sulama kabı
    },
    girl: {
      hat: '#E91E63', // Pembe şapka/bandana
      overall: '#BA68C8', // Mor-pembe elbise
      skin: '#FFDBAC', // Ten rengi
      hair: '#2C1810', // Siyah saç
      eyes: '#4CAF50', // Yeşil gözler
      mouth: '#E91E63', // Pembe ağız
      wateringCan: '#FF6B9D', // Pembe sulama kabı
    },
  };

  const charColors = colors[character];
  const viewBox = '0 0 150 200';
  const scaleAnim = animation === 'celebrate' ? celebrateScale : breatheAnim;
  const armRotation = wateringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size * 1.33 }, style]}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}>
        <Svg width={size} height={size * 1.33} viewBox={viewBox}>
          {/* Kafa */}
          <Circle cx={75} cy={50} r={35} fill={charColors.skin} />
          
          {/* Saç */}
          {character === 'boy' ? (
            // Erkek: Kısa saç
            <Path
              d="M 40 45 Q 40 30 50 30 Q 75 25 100 30 Q 110 30 110 45 Q 110 60 100 60 L 50 60 Q 40 60 40 45 Z"
              fill={charColors.hair}
            />
          ) : (
            // Kız: Uzun saç
            <Path
              d="M 40 45 Q 40 30 50 30 Q 75 25 100 30 Q 110 30 110 45 Q 110 60 100 60 L 50 60 Q 40 60 40 45 Z"
              fill={charColors.hair}
            />
          )}
          
          {/* Şapka/Bandana */}
          {character === 'boy' ? (
            // Erkek: Mavi şapka
            <G>
              <Circle cx={75} cy={35} r={30} fill={charColors.hat} />
              <Path
                d="M 45 35 Q 45 20 75 20 Q 105 20 105 35"
                fill={charColors.hat}
              />
            </G>
          ) : (
            // Kız: Pembe bandana
            <G>
              <Path
                d="M 45 35 Q 45 25 75 25 Q 105 25 105 35 Q 105 45 75 45 Q 45 45 45 35 Z"
                fill={charColors.hat}
              />
              {/* Bandana üzerine çiçek */}
              <Circle cx={75} cy={35} r={5} fill="#FFEB3B" />
            </G>
          )}
          
          {/* Gözler */}
          <Circle cx={65} cy={48} r={4} fill={charColors.eyes} />
          <Circle cx={85} cy={48} r={4} fill={charColors.eyes} />
          
          {/* Göz parıltısı */}
          <Circle cx={66} cy={47} r={1.5} fill="#FFFFFF" />
          <Circle cx={86} cy={47} r={1.5} fill="#FFFFFF" />
          
          {/* Gülümseme */}
          <Path
            d="M 60 58 Q 75 68 90 58"
            stroke={charColors.mouth}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Vücut - Tulum/Elbise */}
          <Path
            d="M 60 85 L 50 160 L 100 160 L 90 85 Z"
            fill={charColors.overall}
          />
          
          {/* Tulum askıları */}
          <Path
            d="M 60 85 L 55 100 L 50 100 L 50 85 Z"
            fill={charColors.overall}
          />
          <Path
            d="M 90 85 L 95 100 L 100 100 L 100 85 Z"
            fill={charColors.overall}
          />
          
          {/* Kol (Sulama animasyonu için - basitleştirilmiş) */}
          {animation === 'watering' ? (
            <G>
              <Path
                d="M 70 100 L 50 130 L 45 125 L 65 95 Z"
                fill={charColors.skin}
              />
              {/* Sulama kabı */}
              <G transform="translate(30, 120)">
                <Path
                  d="M 0 0 L 15 0 L 15 20 L 0 20 Z"
                  fill={charColors.wateringCan}
                />
                <Path
                  d="M 15 5 L 20 5 L 20 10 L 15 10 Z"
                  fill={charColors.wateringCan}
                />
                {/* Su damlaları */}
                <Circle cx={7} cy={25} r={2} fill="#4FC3F7" opacity={0.7} />
                <Circle cx={10} cy={28} r={1.5} fill="#4FC3F7" opacity={0.7} />
                <Circle cx={5} cy={27} r={1.5} fill="#4FC3F7" opacity={0.7} />
              </G>
            </G>
          ) : (
            // Normal kol
            <Path
              d="M 70 100 L 50 130 L 45 125 L 65 95 Z"
              fill={charColors.skin}
            />
          )}
          
          {/* Diğer kol */}
          <Path
            d="M 80 100 L 100 130 L 105 125 L 85 95 Z"
            fill={charColors.skin}
          />
          
          {/* Ayaklar */}
          <Ellipse cx={65} cy={170} rx={8} ry={12} fill="#8B4513" />
          <Ellipse cx={85} cy={170} rx={8} ry={12} fill="#8B4513" />
          
          {/* Celebrate animasyonu için eller havada */}
          {animation === 'celebrate' && (
            <G>
              <Path
                d="M 45 95 L 40 75 L 50 75 Z"
                fill={charColors.skin}
              />
              <Path
                d="M 105 95 L 110 75 L 100 75 Z"
                fill={charColors.skin}
              />
            </G>
          )}
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GardenerCharacter;

