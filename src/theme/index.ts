import { createTheme } from '@shopify/restyle';
import { lightColors, darkColors } from './tokens/colors';
import { appSpacing } from './tokens/spacing';
import { typography } from './tokens/typography';

// ✅ Define raw config once, build both themes from it
const baseConfig = {
  spacing: appSpacing,
  textVariants: typography,
  breakpoints: {},
};

export const theme = createTheme({
  ...baseConfig,
  colors: lightColors,
});

export type Theme = typeof theme;

export const darkTheme: Theme = {
  ...theme,
  colors: darkColors,
};

// ✅ Now createAppTheme builds from raw config, not a processed theme
export const createAppTheme = (mode: 'light' | 'dark'): Theme =>
  createTheme({
    ...baseConfig,
    colors: mode === 'light' ? lightColors : darkColors,
  });

export type AppTheme = ReturnType<typeof createAppTheme>;

export { ThemeModeProvider, useThemeMode } from './provider/ThemeModeContext';
export { FintechKitProvider } from './provider/FintechKitProvider';
