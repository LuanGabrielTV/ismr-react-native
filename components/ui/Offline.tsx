import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native'; 
import { useNetwork } from '@/hooks/use-network';
import { Colors, Fonts } from '@/constants/theme';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

export function Offline() {
  const { isConnected } = useNetwork();
  const { theme } = useThemeStorage();
  const colors = Colors[theme ?? 'light'];
  
  const insets = useSafeAreaInsets(); 

  if (isConnected !== false) return null;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.error,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 12 
      }
    ]}>
      <WifiOff color={colors.background} size={16} />
      <Text style={[styles.text, { color: colors.background }]}>
        Você está offline. Verifique sua conexão.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 8,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, 
  },
  text: {
    fontFamily: Fonts.title,
    fontSize: 13,
    textAlign: 'center',
  },
});