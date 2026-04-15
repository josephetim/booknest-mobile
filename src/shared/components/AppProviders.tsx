import { ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, type PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/src/shared/lib/query-client';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';
import { toNavigationTheme } from '@/src/shared/theme/tokens';

export function AppProviders({ children }: PropsWithChildren) {
  const theme = useAppTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => undefined);
  }, [theme.colors.background]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={toNavigationTheme(theme)}>
          <StatusBar style={theme.isDark ? 'light' : 'dark'} />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
