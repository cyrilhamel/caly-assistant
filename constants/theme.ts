import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const colors = {
  // Or luxueux
  gold: '#FFD700',
  darkGold: '#B8860B',
  lightGold: '#FFF8DC',
  
  // Noir et blanc
  black: '#000000',
  almostBlack: '#0A0A0A',
  darkGray: '#1A1A1A',
  mediumGray: '#333333',
  lightGray: '#CCCCCC',
  white: '#FFFFFF',
  offWhite: '#F5F5F5',
  
  // Accents
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.gold,
    primaryContainer: colors.darkGold,
    secondary: colors.white,
    secondaryContainer: colors.mediumGray,
    background: colors.almostBlack,
    surface: colors.darkGray,
    surfaceVariant: colors.mediumGray,
    error: colors.error,
    onPrimary: colors.black,
    onSecondary: colors.black,
    onBackground: colors.white,
    onSurface: colors.white,
    onError: colors.white,
    outline: colors.gold,
    shadow: colors.black,
    inverseSurface: colors.white,
    inverseOnSurface: colors.black,
    inversePrimary: colors.darkGold,
    elevation: {
      level0: 'transparent',
      level1: colors.darkGray,
      level2: colors.mediumGray,
      level3: '#404040',
      level4: '#4A4A4A',
      level5: '#545454',
    },
  },
  roundness: 12,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.gold,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.white,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: colors.white,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    color: colors.lightGray,
  },
};
