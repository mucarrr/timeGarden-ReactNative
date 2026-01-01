import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

interface BadgeModalProps {
  visible: boolean;
  onClose: () => void;
  badgeType?: string;
  character?: 'boy' | 'girl';
  level?: number;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ 
  visible, 
  onClose, 
  badgeType,
  character = 'boy',
  level = 1,
}) => {
  const getBadgeInfo = () => {
    switch (badgeType) {
      case 'first_harvest':
        return {
          title: 'Çiçek Tohumcusu',
          subtitle: 'Sabah Namazı Tohum...',
          message: 'Toprak seni çok sevdi. Artık bir',
          highlight: 'Çiçek Tohumcususun!',
          icon: 'local-florist',
          color: '#4CAF50',
        };
      case 'prayer_master':
        return {
          title: 'Namaz Ustası',
          subtitle: 'Namaz Ustası Rozeti',
          message: 'Namazlarını düzenli kılıyorsun. Artık bir',
          highlight: 'Namaz Ustasısın!',
          icon: 'mosque',
          color: '#4CAF50',
        };
      case 'garden_keeper':
        return {
          title: 'Bahçıvan',
          subtitle: 'Bahçıvan Rozeti',
          message: 'Bahçeni çok güzel yetiştirdin. Artık bir',
          highlight: 'Bahçıvansın!',
          icon: 'yard',
          color: '#4CAF50',
        };
      default:
        return {
          title: 'Yeni Rozet',
          subtitle: 'Yeni Rozet',
          message: 'Harika bir iş başardın. Artık bir',
          highlight: 'Şampiyonsun!',
          icon: 'stars',
          color: '#4CAF50',
        };
    }
  };

  const badgeInfo = getBadgeInfo();

  const characterImage = character === 'boy' 
    ? require('../../assets/characters/boy.png')
    : require('../../assets/characters/girl-watering-flower.png');

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}>
          <Icon name="close" size={28} color="#1F2937" />
        </TouchableOpacity>

        {/* Level Badge - Sağ üst */}
        <View style={styles.levelBadgeContainer}>
          <View style={styles.levelBadge}>
            <View style={styles.levelDot} />
            <Text style={styles.levelText}>SEVİYE {level}</Text>
          </View>
        </View>

        {/* Character Image - Ortada büyük */}
        <View style={styles.characterContainer}>
          <View style={styles.characterImageWrapper}>
            <Image
              source={characterImage}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.mainTitle}>Harikasın!</Text>

        {/* Message Bubble */}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            {badgeInfo.message}{' '}
            <Text style={styles.messageHighlight}>{badgeInfo.highlight}</Text>
          </Text>
        </View>

        {/* Earned Badge Section */}
        <View style={styles.badgeSection}>
          <View style={styles.badgeSectionHeader}>
            <Text style={styles.badgeSectionTitle}>KAZANILAN ROZET</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>Tümünü gör</Text>
            </TouchableOpacity>
          </View>

          {/* Badge Card */}
          <View style={styles.badgeCard}>
            <View style={styles.badgeIconContainer}>
              <Icon name={badgeInfo.icon} size={32} color={badgeInfo.color} />
            </View>
            <View style={styles.badgeCardContent}>
              <Text style={styles.badgeCardLabel}>TIME GARDEN</Text>
              <Text style={styles.badgeCardTitle}>{badgeInfo.subtitle}</Text>
              <TouchableOpacity style={styles.shareButton} activeOpacity={0.7}>
                <Icon name="ios-share" size={16} color="#6B7280" />
                <Text style={styles.shareButtonText}>Paylaş</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onClose}
            activeOpacity={0.8}>
            <Text style={styles.actionButtonText}>Bahçeme Dön</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4', // Açık yeşil arka plan
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  levelBadgeContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    left: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 1,
  },
  characterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  characterImageWrapper: {
    width: width * 0.7,
    height: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  messageBubble: {
    backgroundColor: '#DCFCE7',
    marginHorizontal: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageHighlight: {
    color: '#16A34A',
    fontWeight: '700',
  },
  badgeSection: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  badgeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  badgeCardContent: {
    flex: 1,
  },
  badgeCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  badgeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default BadgeModal;
