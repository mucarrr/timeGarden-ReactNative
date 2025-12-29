import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconWrapper from '../components/IconWrapper';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, CommonStyles, FontSizes, FontWeights, BorderRadius, Spacing } from '../styles/theme';
import { Language } from '../types';

interface SignUpScreenProps {
  navigation?: any;
  onComplete?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation, onComplete }) => {
  
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<Language>('tr');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSignUp = () => {
    // TODO: Implement sign up logic (save user data, etc.)
    // After sign up, navigate to welcome screen
    if (navigation) {
      navigation.navigate('Welcome');
    } else if (onComplete) {
      onComplete();
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Background Pattern - Same as WelcomeScreen */}
          <View style={styles.patternOverlay} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <IconWrapper 
                  name="local-florist" 
                  size={28} 
                  color={Colors.primary}
                  emojiFallback="🌱"
                />
              </View>
            </View>
            <Text style={styles.headerTitle}>Vakit Bahçesi</Text>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={toggleLanguage}>
              <Text style={[styles.flag, language === 'tr' && styles.flagActive]}>
                🇹🇷
              </Text>
              <Text style={styles.languageDivider}>|</Text>
              <Text style={[styles.flag, language === 'en' && styles.flagActive]}>
                🇬🇧
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Aramıza Katıl</Text>
              <Text style={styles.subtitle}>
                Hoş geldin küçük bahçıvan! 🌱{'\n'}Kendi bahçeni kurmaya başlayalım mı?
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Nickname */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Takma Adın</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'nickname' && styles.inputContainerFocused,
                  ]}>
                  <IconWrapper
                    name="sentiment-satisfied"
                    size={24}
                    color={Colors.primary}
                    style={styles.inputIcon}
                    emojiFallback="😊"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Sana nasıl seslenelim?"
                    placeholderTextColor="#999"
                    value={nickname}
                    onChangeText={setNickname}
                    onFocus={() => setFocusedInput('nickname')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Age and Country Row */}
              <View style={styles.row}>
                {/* Age */}
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Yaşın</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === 'age' && styles.inputContainerFocused,
                    ]}>
                    <IconWrapper
                      name="cake"
                      size={24}
                      color={Colors.primary}
                      style={styles.inputIcon}
                      emojiFallback="🎂"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Yaş?"
                      placeholderTextColor="#999"
                      value={age}
                      onChangeText={setAge}
                      keyboardType="numeric"
                      onFocus={() => setFocusedInput('age')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Country */}
                <View style={[styles.inputGroup, styles.flex15]}>
                  <Text style={styles.label}>Ülke</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === 'country' && styles.inputContainerFocused,
                    ]}>
                    <IconWrapper
                      name="public"
                      size={24}
                      color={Colors.primary}
                      style={styles.inputIcon}
                      emojiFallback="🌍"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Seçiniz"
                      placeholderTextColor="#999"
                      value={country}
                      onChangeText={setCountry}
                      onFocus={() => setFocusedInput('country')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <IconWrapper
                      name="expand-more"
                      size={20}
                      color={Colors.textLight}
                      style={styles.dropdownIcon}
                      emojiFallback="▼"
                    />
                  </View>
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gizli Parola</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'password' && styles.inputContainerFocused,
                  ]}>
                  <IconWrapper
                    name="lock"
                    size={24}
                    color={Colors.primary}
                    style={styles.inputIcon}
                    emojiFallback="🔒"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Şifreni oluştur"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    <IconWrapper
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={24}
                      color={Colors.textLight}
                      emojiFallback={showPassword ? '🙈' : '👁️'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Spacer */}
              <View style={styles.spacer} />

              {/* Sign Up Button */}
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Aramıza Katıl"
                  onPress={handleSignUp}
                />
              </View>

              {/* Login Link */}
              <Text style={styles.loginText}>
                Zaten bir hesabın var mı?{' '}
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundPattern,
    opacity: 0.6,
    zIndex: 0,
    // Pattern effect - same as WelcomeScreen
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    display: 'none', // Hidden on mobile as per HTML
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    gap: Spacing.xs,
  },
  flag: {
    fontSize: 18,
    opacity: 0.5,
  },
  flagActive: {
    opacity: 1,
  },
  languageDivider: {
    fontSize: FontSizes.bodyTiny,
    color: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  title: {
    ...CommonStyles.title,
    color: Colors.textDark, // Same as button text color
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...CommonStyles.subtitle,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...CommonStyles.label,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...CommonStyles.inputContainer,
    paddingHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    ...CommonStyles.inputContainerFocused,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...CommonStyles.input,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  eyeIcon: {
    marginLeft: 8,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  flex15: {
    flex: 1.5,
  },
  spacer: {
    minHeight: 20,
    flexGrow: 1,
  },
  buttonWrapper: {
    marginTop: 16,
    marginBottom: 16,
  },
  loginText: {
    textAlign: 'center',
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: FontWeights.bold,
  },
});

export default SignUpScreen;

