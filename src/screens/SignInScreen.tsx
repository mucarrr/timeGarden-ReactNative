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
import IconWrapper from '../components/IconWrapper';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, CommonStyles, FontSizes, FontWeights, BorderRadius, Spacing } from '../styles/theme';
import { Language } from '../types';

interface SignInScreenProps {
  navigation?: any;
  onComplete?: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation, onComplete }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<Language>('tr');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSignIn = () => {
    // TODO: Implement sign in logic (validate credentials, etc.)
    // After sign in, navigate to welcome screen or garden screen
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

  const handleGoToSignUp = () => {
    if (navigation) {
      navigation.navigate('SignUp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.patternOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.helpButton}
          activeOpacity={0.7}>
          <IconWrapper
            name="help-outline"
            size={24}
            color={Colors.primary}
            emojiFallback="❓"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vakit Bahçesi</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
          activeOpacity={0.7}>
          <Text style={styles.languageFlag}>🇹🇷</Text>
          <Text style={styles.languageDivider}>|</Text>
          <Text style={[styles.languageFlag, styles.languageFlagInactive]}>
            🇬🇧
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          {/* Main Content - Centered */}
          <View style={styles.content}>
            <View style={styles.formContainer}>
              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Giriş Yap</Text>
                <Text style={styles.subtitle}>
                  Hoş geldin küçük bahçıvan! 🌱{'\n'}
                  Bahçene devam etmek için giriş yap.
                </Text>
              </View>

              {/* Input Fields - Centered */}
              <View style={styles.inputsContainer}>
                {/* Email/Username */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>E-posta veya Takma Adın</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === 'email' && styles.inputContainerFocused,
                    ]}>
                    <IconWrapper
                      name="mail"
                      size={24}
                      color={Colors.primary}
                      style={styles.inputIcon}
                      emojiFallback="📧"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="E-posta veya takma adın"
                      placeholderTextColor={Colors.placeholder}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                    />
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
                      placeholder="Şifreni gir"
                      placeholderTextColor={Colors.placeholder}
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
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Section - Button and Link - Fixed at bottom */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title="Giriş Yap"
            onPress={handleSignIn}
          />
        </View>

        {/* Sign Up Link */}
        <Text style={styles.signUpText}>
          Henüz hesabın yok mu?{' '}
          <Text style={styles.signUpLink} onPress={handleGoToSignUp}>
            Kayıt Ol
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundPattern,
    opacity: 0.6,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  helpButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    flex: 1,
    textAlign: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  languageFlag: {
    fontSize: 18,
  },
  languageDivider: {
    fontSize: 12,
    color: Colors.primary,
    marginHorizontal: 2,
  },
  languageFlagInactive: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  titleContainer: {
    marginBottom: Spacing.xl * 2,
    textAlign: 'center',
  },
  inputsContainer: {
    width: '100%',
  },
  title: {
    ...CommonStyles.title,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...CommonStyles.subtitle,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...CommonStyles.inputContainer,
    paddingHorizontal: Spacing.lg,
  },
  inputContainerFocused: {
    ...CommonStyles.inputContainerFocused,
  },
  inputIcon: {
    marginRight: 12,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    ...CommonStyles.input,
    paddingRight: 0,
    paddingLeft: 0,
    minWidth: 0, // Allows text to wrap/truncate properly
  },
  eyeIcon: {
    marginLeft: 8,
    padding: 4,
    flexShrink: 0,
  },
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: Colors.background,
  },
  buttonWrapper: {
    marginBottom: Spacing.md,
  },
  signUpText: {
    textAlign: 'center',
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  signUpLink: {
    color: Colors.primary,
    fontWeight: FontWeights.bold,
  },
});

export default SignInScreen;

