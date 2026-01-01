import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

interface BadgeScreenProps {
  navigation?: any;
  badgeType?: string;
}

const BadgeScreen: React.FC<BadgeScreenProps> = ({ navigation, badgeType }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rozetlerim</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* New Badge Notification */}
        {badgeType && (
          <View style={styles.newBadgeContainer}>
            <View style={styles.newBadgeIcon}>
              <Icon name="stars" size={48} color="#FFD700" />
            </View>
            <Text style={styles.newBadgeTitle}>🎉 Yeni Rozet Kazandınız!</Text>
            <Text style={styles.newBadgeText}>
              {badgeType === 'first_harvest' && 'İlk Hasat Rozeti'}
              {badgeType === 'prayer_master' && 'Namaz Ustası Rozeti'}
              {badgeType === 'garden_keeper' && 'Bahçıvan Rozeti'}
            </Text>
          </View>
        )}

        {/* Badges Grid */}
        <View style={styles.badgesGrid}>
          {/* First Harvest Badge */}
          <View style={[styles.badgeCard, badgeType === 'first_harvest' && styles.badgeCardNew]}>
            <View style={styles.badgeIconContainer}>
              <Icon name="local-florist" size={48} color="#EC4899" />
            </View>
            <Text style={styles.badgeName}>İlk Hasat</Text>
            <Text style={styles.badgeDescription}>İlk çiçeğini hasat et</Text>
          </View>

          {/* Prayer Master Badge */}
          <View style={[styles.badgeCard, badgeType === 'prayer_master' && styles.badgeCardNew]}>
            <View style={styles.badgeIconContainer}>
              <Icon name="mosque" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.badgeName}>Namaz Ustası</Text>
            <Text style={styles.badgeDescription}>10 çiçek hasat et</Text>
          </View>

          {/* Garden Keeper Badge */}
          <View style={[styles.badgeCard, badgeType === 'garden_keeper' && styles.badgeCardNew]}>
            <View style={styles.badgeIconContainer}>
              <Icon name="yard" size={48} color="#2E7D32" />
            </View>
            <Text style={styles.badgeName}>Bahçıvan</Text>
            <Text style={styles.badgeDescription}>50 çiçek hasat et</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  newBadgeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newBadgeIcon: {
    marginBottom: 12,
  },
  newBadgeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  newBadgeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  badgeCardNew: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
  },
  badgeIconContainer: {
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default BadgeScreen;

