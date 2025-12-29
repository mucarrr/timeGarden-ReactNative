/**
 * Time Garden - Theme & Styles
 * Ortak renkler, font boyutları ve stiller
 */

export const Colors = {
  // Primary Colors
  primary: '#13ec5b',
  primaryDark: '#0ea640',
  
  // Background Colors
  background: '#f6f8f6',
  backgroundPattern: '#f6f8f6',
  
  // Text Colors
  textDark: '#102216',
  textSecondary: '#5c7a67',
  textLight: '#999',
  
  // Surface Colors
  surface: '#FFFFFF',
  inputBackground: '#eefbf2',
  
  // Border Colors
  borderLight: '#e2e8e4',
  borderInput: '#c8e6c9',
  
  // Accent Colors
  accent: '#ffeb3b',
  accentDark: '#5d4037',
  
  // Badge Colors
  badgeBackground: '#102216',
  badgeText: '#FFFFFF',
} as const;

export const FontSizes = {
  // Headings
  title: 32,
  subtitle: 20,
  
  // Body
  body: 16,
  bodySmall: 14,
  bodyTiny: 12,
  
  // Buttons
  button: 20,
} as const;

export const FontWeights = {
  bold: 'bold' as const,
  semiBold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const BorderRadius = {
  sm: 12,
  md: 24,
  lg: 40,
  xl: 88,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  logo: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
} as const;

export const CommonStyles = {
  // Title Styles
  title: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    lineHeight: 40,
  },
  
  // Subtitle Styles
  subtitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    lineHeight: 28,
  },
  
  // Label Styles
  label: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  
  // Button Styles (for PrimaryButton component)
  button: {
    width: '100%' as const,
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    borderBottomWidth: 8,
    borderBottomColor: Colors.primaryDark,
  },
  
  buttonText: {
    color: Colors.textDark,
    fontSize: FontSizes.button,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.5,
  },
  
  // Input Styles
  input: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.textDark,
  },
  
  inputContainer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.full,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  inputContainerFocused: {
    borderColor: Colors.primary,
  },
  
  // Card Styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    borderBottomWidth: 8,
    borderBottomColor: Colors.borderLight,
  },
} as const;

export default {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
  CommonStyles,
};

