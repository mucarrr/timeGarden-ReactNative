import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SettingsScreenProps {
  navigation?: any;
  route?: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Ses & Efekt */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ses & Efekt</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="volume-up" size={24} color="#F59E0B" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Ses</Text>
                <Text style={styles.settingDescription}>
                  Uygulama seslerini aç/kapat
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#FCE7F3' }]}>
                <Icon name="music-note" size={24} color="#EC4899" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Efekt</Text>
                <Text style={styles.settingDescription}>
                  Animasyon efektlerini aç/kapat
                </Text>
              </View>
            </View>
            <Switch
              value={effectsEnabled}
              onValueChange={setEffectsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Hesap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // TODO: Kullanıcı bilgilerini değiştir sayfasına git
              navigation?.navigate('EditProfile');
            }}
            activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#DCFCE7' }]}>
                <Icon name="edit" size={24} color="#4CAF50" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Kullanıcı Bilgilerini Değiştir</Text>
                <Text style={styles.settingDescription}>
                  İsim, yaş ve diğer bilgileri güncelle
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // TODO: Hedef güncelleme sayfasına git
              navigation?.navigate('UpdateGoal');
            }}
            activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#E0E7FF' }]}>
                <Icon name="flag" size={24} color="#6366F1" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Hedefi Güncelle</Text>
                <Text style={styles.settingDescription}>
                  Namaz vakitleri hedefini değiştir
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default SettingsScreen;

