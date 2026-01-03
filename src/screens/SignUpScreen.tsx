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
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import IconWrapper from '../components/IconWrapper';

const childrenImage = require('../../assets/characters/children.png');
import PrimaryButton from '../components/PrimaryButton';
import { Colors, CommonStyles, FontSizes, FontWeights, Spacing } from '../styles/theme';
import { Language } from '../types';

interface SignUpScreenProps {
  navigation?: any;
  onComplete?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation, onComplete }) => {
  
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
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
            <Image 
              source={childrenImage} 
              style={styles.childrenImage}
              resizeMode="contain"
            />
          </View>

          {/* Main Content - Centered vertically */}
          <View style={styles.content}>
            <View style={styles.centeredArea}>
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
                    placeholderTextColor={Colors.placeholder}
                    value={nickname}
                    onChangeText={setNickname}
                    onFocus={() => setFocusedInput('nickname')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Age and Language Row */}
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
                      placeholderTextColor={Colors.placeholder}
                      value={age}
                      onChangeText={setAge}
                      keyboardType="numeric"
                      onFocus={() => setFocusedInput('age')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* Language */}
                <View style={[styles.inputGroup, styles.flex15]}>
                  <Text style={styles.label}>Dil</Text>
                  <View style={styles.languageSelector}>
                    <TouchableOpacity
                      style={[
                        styles.languageOption,
                        language === 'tr' && styles.languageOptionActive,
                      ]}
                      onPress={() => setLanguage('tr')}>
                      <Text style={styles.languageFlag}>🇹🇷</Text>
                      <Text
                        style={[
                          styles.languageText,
                          language === 'tr' && styles.languageTextActive,
                        ]}>
                        Türkçe
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.languageOption,
                        language === 'en' && styles.languageOptionActive,
                      ]}
                      onPress={() => setLanguage('en')}>
                      <Text style={styles.languageFlag}>🇬🇧</Text>
                      <Text
                        style={[
                          styles.languageText,
                          language === 'en' && styles.languageTextActive,
                        ]}>
                        English
                      </Text>
                    </TouchableOpacity>
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

            {/* Button area - Fixed at bottom */}
            <View style={styles.buttonArea}>
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
                <Text style={styles.loginLink} onPress={() => {
                  if (navigation) {
                    navigation.navigate('SignIn');
                  }
                }}>
                  Giriş Yap
                </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    zIndex: 10,
  },
  childrenImage: {
    width: 140,
    height: 140,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 10,
    justifyContent: 'space-between',
    marginTop: -60,
  },
  centeredArea: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
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
  languageSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  languageOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...CommonStyles.inputContainer,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  languageOptionActive: {
    borderColor: Colors.primary,
  },
  languageFlag: {
    fontSize: 16,
  },
  languageText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
  },
  languageTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.bold,
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
  buttonArea: {
    paddingTop: 20,
  },
  buttonWrapper: {
    marginBottom: Spacing.md,
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

