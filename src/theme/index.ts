import { createTheme } from '@shopify/restyle';

export const lightColors = {
  primary: '#1B5EBF',
  success: '#1D9E75',
  danger: '#E24B4A',
  warning: '#BA7517',

  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#F1F3F5',

  surfacePrimary: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F8F9FA',

  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#888888',
  textInverse: '#FFFFFF',

  borderDefault: '#E0E0E0',
  borderStrong: '#CFCFCF',

  stateDisabled: '#CCCCCC',
  statePressed: '#E6E6E6',
  transparent: 'transparent',
  successBackground: '#EAF3DE',
  warningBackground: '#FAEEDA',
  dangerBackground: '#FCEBEB',
};

export const darkColors: typeof lightColors = {
  primary: '#4C8DFF',
  success: '#3DD6A5',
  danger: '#FF6B6B',
  warning: '#F4A261',

  backgroundPrimary: '#0F1115',
  backgroundSecondary: '#151821',
  backgroundTertiary: '#1C1F2A',

  surfacePrimary: '#151821',
  surfaceElevated: '#1C1F2A',
  surfaceMuted: '#0F1115',

  textPrimary: '#FFFFFF',
  textSecondary: '#C1C7D0',
  textMuted: '#8A93A6',
  textInverse: '#000000',

  borderDefault: '#2A2F3A',
  borderStrong: '#3A3F4A',

  stateDisabled: '#3A3F4A',
  statePressed: '#2A2F3A',
  transparent: 'transparent',
  successBackground: '#27500A',
  warningBackground: '#633806',
  dangerBackground: '#791F1F',
};

export const theme = createTheme({
  colors: lightColors,
  spacing: {
    'xs': 4,
    's': 8,
    'm': 16,
    'l': 24,
    '30': 30,
    'xl': 40,
    'mxl': 60,
    'xxl': 80,
    'pad': 20,
    'mid': 12,
  },
  textVariants: {
    bold: {
      fontSize: 14,
      color: 'textPrimary',
      fontFamily: 'Onest-Bold',
    },
    semibold: {
      fontSize: 14,
      color: 'textPrimary',
      fontFamily: 'Onest-Medium',
    },
    medium: {
      fontSize: 14,
      color: 'textPrimary',
      fontFamily: 'Onest-Medium',
    },
    regular: {
      fontSize: 14,
      color: 'textPrimary',
      fontFamily: 'Onest-Regular',
    },
    light: {
      fontSize: 14,
      color: 'textPrimary',
      fontFamily: 'Onest-Light',
    },
    defaults: {
      fontSize: 14,
      color: 'textPrimary',
      fontFamily: 'Onest-Regular',
    },
  },
  breakpoints: {},
});

export type Theme = typeof theme;

export const darkTheme: Theme = {
  ...theme,
  colors: darkColors,
};
export default theme;

export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    ...theme,
    colors: mode === 'light' ? lightColors : darkColors,
    // spacing: { ...theme.spacing },
  });

export type AppTheme = ReturnType<typeof createAppTheme>;

export { ThemeModeProvider, useThemeMode } from './ThemeModeContext';
export { FintechKitProvider } from './FintechKitProvider';
