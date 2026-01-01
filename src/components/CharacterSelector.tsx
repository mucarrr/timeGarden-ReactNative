import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Image,
} from 'react-native';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Character } from '../types';
import { useTranslation } from 'react-i18next';
import LottieCharacter from './LottieCharacter';

interface CharacterSelectorProps {
  selectedCharacter: Character;
  onSelect: (character: Character) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  selectedCharacter,
  onSelect,
}) => {
  const { t } = useTranslation();
  const boyScale = React.useRef(new Animated.Value(1)).current;
  const girlScale = React.useRef(new Animated.Value(1)).current;

  const handleSelect = (character: Character) => {
    const scaleValue = character === 'boy' ? boyScale : girlScale;
    
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 50,
        friction: 3,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 3,
      }),
    ]).start();
    
    onSelect(character);
  };

  const boyAnimatedStyle = {
    transform: [{ scale: boyScale }],
  };

  const girlAnimatedStyle = {
    transform: [{ scale: girlScale }],
  };

  return (
    <View style={styles.container}>
      <View style={styles.charactersContainer}>
        {/* Erkek Karakter */}
        <TouchableOpacity
          style={[
            styles.characterCard,
            selectedCharacter === 'boy' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('boy')}
          activeOpacity={0.7}>
          {selectedCharacter === 'boy' && (
            <View style={styles.checkmarkContainer}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
            </View>
          )}
          <Animated.View style={[styles.characterWrapper, boyAnimatedStyle]}>
            <Image
              source={require('../../assets/characters/boy.png')}
              style={styles.boyImage}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.characterName}>{t('boy')}</Text>
        </TouchableOpacity>

        {/* Kız Karakter */}
        <TouchableOpacity
          style={[
            styles.characterCard,
            selectedCharacter === 'girl' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('girl')}
          activeOpacity={0.7}>
          {selectedCharacter === 'girl' && (
            <View style={styles.checkmarkContainer}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
            </View>
          )}
          <Animated.View style={[styles.characterWrapper, girlAnimatedStyle]}>
            <Image
              source={require('../../assets/characters/girl-watering-flower.png')}
              style={styles.girlImage}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.characterName}>{t('girl')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  charactersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    gap: 16,
  },
  characterCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  characterWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  boyImage: {
    width: 150,
    height: 150,
  },
  girlImage: {
    width: 150,
    height: 150,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default CharacterSelector;

