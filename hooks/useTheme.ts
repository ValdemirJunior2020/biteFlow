// File: hooks/useTheme.ts
import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  return {
    scheme,
    dark,
    colors: {
      background: dark ? '#0E1116' : '#F7F7F8',
      card: dark ? '#161B22' : '#FFFFFF',
      text: dark ? '#F7F9FB' : '#131313',
      mutedText: dark ? '#9FA7B2' : '#71717A',
      border: dark ? '#222A36' : '#ECECEC',
      primary: '#FF8A2A',
      secondary: '#5DB075',
      danger: '#EF4444',
      warning: '#F59E0B'
    }
  };
};
