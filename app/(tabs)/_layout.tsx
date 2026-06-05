import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Layout } from '@/constants/layout';
import { Cog, Home, User } from 'lucide-react-native';
import { useHaptics } from '@/hooks/use-haptics';

export default function TabLayout() {
  const colorScheme = Colors[useColorScheme()!];
  const haptic = useHaptics();

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          haptic.light();
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colorScheme.tint,
        tabBarInactiveTintColor: colorScheme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colorScheme.background,
          borderTopColor: colorScheme.border,
          elevation: 0,
          borderTopWidth: 1,
          paddingTop: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home size={Layout.ui.iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <Cog size={Layout.ui.iconSize} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User size={Layout.ui.iconSize} color={color} />,
        }}
      />
    </Tabs>
  );
}