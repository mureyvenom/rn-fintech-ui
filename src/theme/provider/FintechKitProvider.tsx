// src/theme/FintechKitProvider.tsx
import React, { createContext, useContext } from 'react';
import { ThemeProvider } from '@shopify/restyle';
import { ThemeModeProvider, useThemeMode } from './ThemeModeContext';
import { createAppTheme } from '../index';
import type { FintechKitConfig } from '../config';

const ConfigContext = createContext<FintechKitConfig>({});

export const useComponentConfig = () => useContext(ConfigContext);

type FintechKitProviderProps = {
  children: React.ReactNode;
  config?: FintechKitConfig; // ← the single customization entry point
};

const ThemedApp = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useThemeMode();
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export const FintechKitProvider = ({
  children,
  config = {},
}: FintechKitProviderProps) => {
  return (
    <ConfigContext.Provider value={config}>
      <ThemeModeProvider>
        <ThemedApp>{children}</ThemedApp>
      </ThemeModeProvider>
    </ConfigContext.Provider>
  );
};
