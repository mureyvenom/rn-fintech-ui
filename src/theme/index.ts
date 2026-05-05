import { createTheme } from '@shopify/restyle';
import { lightColors, darkColors } from './tokens/colors';
import { appSpacing } from './tokens/spacing';
import { typography } from './tokens/typography';

export const theme = createTheme({
  colors: lightColors,
  spacing: appSpacing,
  textVariants: typography,
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

export { ThemeModeProvider, useThemeMode } from './provider/ThemeModeContext';
export { FintechKitProvider } from './provider/FintechKitProvider';
