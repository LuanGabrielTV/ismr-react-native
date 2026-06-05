import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import {
  useFonts,
  WixMadeforDisplay_400Regular,
  WixMadeforDisplay_700Bold,
} from '@expo-google-fonts/wix-madefor-display';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { AuthProvider, useAuth } from '@/context/AuthContext'; 
import { Offline } from '@/components/ui/Offline';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
      <Offline />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useThemeStorage().theme ?? 'light';
  
  const [fontsLoaded] = useFonts({
    WixMadeforDisplay_400Regular,
    WixMadeforDisplay_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold
  });

  const { isReady, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded || !isReady) return;

    SplashScreen.hideAsync();

    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      router.replace('/login'); 
    } else if (isAuthenticated && !inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [fontsLoaded, isReady, isAuthenticated, segments]);

  if (!fontsLoaded || !isReady) {
    return null; 
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="login" options={{ headerShown: false }} /> 
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}