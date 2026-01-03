import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BadgeCardProps {
  title: string;
  subtitle?: string;
  showShareButton?: boolean;
  isNew?: boolean;
  badgeImage?: any; // require() ile gelen image
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  title,
  subtitle = 'TIME GARDEN',
  showShareButton = true,
  isNew = false,
  badgeImage,
}) => {
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `🌱 Time Garden'da "${title}" rozetini kazandım! 🎉\n\nSen de namazlarını takip ederek bahçeni büyüt!\n\n#TimeGarden #NamazTakip`,
        title: 'Time Garden - Rozet Paylaşımı',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Paylaşım yapılırken bir hata oluştu.');
      console.error('Share error:', error);
    }
  };

  return (
    <View style={[styles.badgeCard, isNew && styles.badgeCardNew]}>
      <View style={styles.badgeIconContainer}>
        {badgeImage ? (
          <Image
            source={badgeImage}
            style={styles.badgeImage}
            resizeMode="contain"
          />
        ) : (
          <Icon name="local-florist" size={32} color="#EC4899" />
        )}
      </View>
      <View style={styles.badgeCardContent}>
        <Text style={styles.badgeCardLabel}>{subtitle}</Text>
        <Text style={styles.badgeCardTitle} numberOfLines={2}>{title}</Text>
        {showShareButton && (
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={handleShare}
            activeOpacity={0.7}>
            <Icon name="ios-share" size={16} color="#6B7280" />
            <Text style={styles.shareButtonText}>Paylaş</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  badgeCardNew: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  badgeImage: {
    width: 40,
    height: 40,
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
});

export default BadgeCard;

