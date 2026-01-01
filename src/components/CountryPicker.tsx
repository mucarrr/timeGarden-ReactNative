import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../styles/theme';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CountryPickerProps {
  visible: boolean;
  selectedCountry: string | null;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

const COUNTRIES: Country[] = [
  // Türkiye
  { code: 'tr', name: 'Türkiye', flag: '🇹🇷' },
  
  // ABD
  { code: 'us', name: 'Amerika Birleşik Devletleri', flag: '🇺🇸' },
  
  // Avrupa Ülkeleri
  { code: 'de', name: 'Almanya', flag: '🇩🇪' },
  { code: 'fr', name: 'Fransa', flag: '🇫🇷' },
  { code: 'it', name: 'İtalya', flag: '🇮🇹' },
  { code: 'es', name: 'İspanya', flag: '🇪🇸' },
  { code: 'nl', name: 'Hollanda', flag: '🇳🇱' },
  { code: 'be', name: 'Belçika', flag: '🇧🇪' },
  { code: 'ch', name: 'İsviçre', flag: '🇨🇭' },
  { code: 'at', name: 'Avusturya', flag: '🇦🇹' },
  { code: 'se', name: 'İsveç', flag: '🇸🇪' },
  { code: 'no', name: 'Norveç', flag: '🇳🇴' },
  { code: 'dk', name: 'Danimarka', flag: '🇩🇰' },
  { code: 'fi', name: 'Finlandiya', flag: '🇫🇮' },
  { code: 'pl', name: 'Polonya', flag: '🇵🇱' },
  { code: 'gr', name: 'Yunanistan', flag: '🇬🇷' },
  { code: 'pt', name: 'Portekiz', flag: '🇵🇹' },
  { code: 'ie', name: 'İrlanda', flag: '🇮🇪' },
  { code: 'cz', name: 'Çekya', flag: '🇨🇿' },
  { code: 'hu', name: 'Macaristan', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanya', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgaristan', flag: '🇧🇬' },
  { code: 'hr', name: 'Hırvatistan', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovakya', flag: '🇸🇰' },
  { code: 'si', name: 'Slovenya', flag: '🇸🇮' },
  { code: 'ee', name: 'Estonya', flag: '🇪🇪' },
  { code: 'lv', name: 'Letonya', flag: '🇱🇻' },
  { code: 'lt', name: 'Litvanya', flag: '🇱🇹' },
  { code: 'lu', name: 'Lüksemburg', flag: '🇱🇺' },
  { code: 'mt', name: 'Malta', flag: '🇲🇹' },
  { code: 'cy', name: 'Kıbrıs', flag: '🇨🇾' },
  { code: 'is', name: 'İzlanda', flag: '🇮🇸' },
  { code: 'uk', name: 'Birleşik Krallık', flag: '🇬🇧' },
];

const CountryPicker: React.FC<CountryPickerProps> = ({
  visible,
  selectedCountry,
  onSelect,
  onClose,
}) => {
  const handleSelect = (country: Country) => {
    onSelect(country);
    onClose();
  };

  const isSelected = (country: Country) => {
    if (!selectedCountry) return false;
    return selectedCountry.includes(country.name) || selectedCountry.includes(country.flag);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ülke Seçiniz</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseButton}>
              <Icon name="close" size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList}>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.modalItem}
                onPress={() => handleSelect(country)}>
                <Text style={styles.modalItemFlag}>{country.flag}</Text>
                <Text style={styles.modalItemText}>{country.name}</Text>
                {isSelected(country) && (
                  <Icon
                    name="check"
                    size={24}
                    color={Colors.primary}
                    style={styles.modalItemCheck}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    paddingHorizontal: Spacing.xl,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalItemFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  modalItemText: {
    flex: 1,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
  },
  modalItemCheck: {
    marginLeft: Spacing.md,
  },
});

export default CountryPicker;

