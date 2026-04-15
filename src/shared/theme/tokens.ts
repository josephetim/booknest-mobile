import type { Theme } from '@react-navigation/native';
import type { ColorSchemeName, TextStyle, ViewStyle } from 'react-native';

export type AppTheme = {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    elevated: string;
    card: string;
    border: string;
    text: string;
    mutedText: string;
    accent: string;
    accentMuted: string;
    accentText: string;
    placeholder: string;
    placeholderStrong: string;
    success: string;
    danger: string;
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  fonts: {
    serif: string;
    serifBold: string;
    sans: string;
    sansMedium: string;
    sansBold: string;
  };
  typography: {
    hero: TextStyle;
    title: TextStyle;
    heading: TextStyle;
    body: TextStyle;
    caption: TextStyle;
    label: TextStyle;
  };
  shadows: {
    card: ViewStyle;
    soft: ViewStyle;
  };
};

const sharedTheme = {
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
  },
  radii: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    round: 999,
  },
  fonts: {
    serif: 'CormorantGaramond_600SemiBold',
    serifBold: 'CormorantGaramond_700Bold',
    sans: 'Manrope_400Regular',
    sansMedium: 'Manrope_500Medium',
    sansBold: 'Manrope_600SemiBold',
  },
} as const;

const lightTheme: AppTheme = {
  isDark: false,
  colors: {
    background: '#f6efe6',
    surface: '#fffaf4',
    elevated: '#fffdf9',
    card: '#f1e4d3',
    border: '#e4d6c6',
    text: '#1f1914',
    mutedText: '#76695c',
    accent: '#8a5b39',
    accentMuted: '#dcc1a6',
    accentText: '#fff9f1',
    placeholder: '#d8cab8',
    placeholderStrong: '#c3ad95',
    success: '#5d7f55',
    danger: '#9f574d',
    shadow: 'rgba(90, 61, 35, 0.12)',
  },
  ...sharedTheme,
  typography: {
    hero: {
      fontFamily: sharedTheme.fonts.serifBold,
      fontSize: 40,
      lineHeight: 42,
      letterSpacing: 0.2,
    },
    title: {
      fontFamily: sharedTheme.fonts.serifBold,
      fontSize: 28,
      lineHeight: 30,
    },
    heading: {
      fontFamily: sharedTheme.fonts.serifBold,
      fontSize: 22,
      lineHeight: 26,
    },
    body: {
      fontFamily: sharedTheme.fonts.sans,
      fontSize: 15,
      lineHeight: 24,
    },
    caption: {
      fontFamily: sharedTheme.fonts.sans,
      fontSize: 13,
      lineHeight: 18,
    },
    label: {
      fontFamily: sharedTheme.fonts.sansMedium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
  },
  shadows: {
    card: {
      shadowColor: '#6a4a31',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    soft: {
      shadowColor: '#6a4a31',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  },
};

const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    background: '#16110d',
    surface: '#1f1813',
    elevated: '#271e18',
    card: '#32271f',
    border: '#43352a',
    text: '#f6ede5',
    mutedText: '#c2b3a3',
    accent: '#e2b07a',
    accentMuted: '#624a37',
    accentText: '#22160f',
    placeholder: '#47382c',
    placeholderStrong: '#5e4a3a',
    success: '#8db38b',
    danger: '#e29b93',
    shadow: 'rgba(0, 0, 0, 0.34)',
  },
  ...sharedTheme,
  typography: {
    hero: {
      fontFamily: sharedTheme.fonts.serifBold,
      fontSize: 40,
      lineHeight: 42,
      letterSpacing: 0.2,
    },
    title: {
      fontFamily: sharedTheme.fonts.serifBold,
      fontSize: 28,
      lineHeight: 30,
    },
    heading: {
      fontFamily: sharedTheme.fonts.serifBold,
      fontSize: 22,
      lineHeight: 26,
    },
    body: {
      fontFamily: sharedTheme.fonts.sans,
      fontSize: 15,
      lineHeight: 24,
    },
    caption: {
      fontFamily: sharedTheme.fonts.sans,
      fontSize: 13,
      lineHeight: 18,
    },
    label: {
      fontFamily: sharedTheme.fonts.sansMedium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
  },
  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.26,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 7,
    },
    soft: {
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
  },
};

export function getAppTheme(colorScheme: ColorSchemeName): AppTheme {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

export function toNavigationTheme(appTheme: AppTheme): Theme {
  return {
    dark: appTheme.isDark,
    colors: {
      primary: appTheme.colors.accent,
      background: appTheme.colors.background,
      card: appTheme.colors.surface,
      text: appTheme.colors.text,
      border: appTheme.colors.border,
      notification: appTheme.colors.accent,
    },
    fonts: {
      regular: {
        fontFamily: appTheme.fonts.sans,
        fontWeight: '400',
      },
      medium: {
        fontFamily: appTheme.fonts.sansMedium,
        fontWeight: '500',
      },
      bold: {
        fontFamily: appTheme.fonts.sansBold,
        fontWeight: '700',
      },
      heavy: {
        fontFamily: appTheme.fonts.serifBold,
        fontWeight: '800',
      },
    },
  };
}
