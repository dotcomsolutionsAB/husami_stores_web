import type { ThemeProviderProps as MuiThemeProviderProps } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { createTheme } from './create-theme';
import { useThemeMode, ThemeModeProvider } from './theme-mode-context';

import type {} from './extend-theme-types';
import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export type ThemeProviderProps = Partial<MuiThemeProviderProps> & {
  themeOverrides?: ThemeOptions;
};

function ThemeProviderContent({ themeOverrides, children, ...other }: ThemeProviderProps) {
  const { mode } = useThemeMode();

  const theme = createTheme({
    themeOverrides,
  });

  return (
    <ThemeVarsProvider
      disableTransitionOnChange
      theme={theme}
      defaultMode={mode}
      modeStorageKey="theme-mode"
      {...other}
    >
      <CssBaseline />
      {children}
    </ThemeVarsProvider>
  );
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeModeProvider>
      <ThemeProviderContent {...props}>{children}</ThemeProviderContent>
    </ThemeModeProvider>
  );
}
