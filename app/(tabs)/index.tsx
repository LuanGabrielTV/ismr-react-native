import { Topbar } from '@/components/ui/Topbar';
import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ear } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing
} from 'react-native-reanimated';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { Colors } from '@/constants/theme';
import { Layout } from '@/constants/layout';
import { Content } from '@/components/ui/Content';
import { useNotifications } from '@/hooks/use-notifications';
import { useHaptics } from '@/hooks/use-haptics';

export default function HomeScreen() {

  const { notify } = useNotifications();
  const haptic = useHaptics();
  const { theme } = useThemeStorage();
  const colors = Colors[theme ?? 'light'];
  const [isListening, setIsListening] = useState(false);
  const scale = useSharedValue(1);
  const border = useSharedValue(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      textAlign: 'center'
    },
    button: {
      width: 150,
      height: 150,
      borderRadius: 80,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: Layout.button.borderWidth,
      padding: 10,
      borderColor: colors.border,
      backgroundColor: colors.card
    },
  });

  useEffect(() => {
    if (isListening) {
      scale.value = withRepeat(
        withTiming(0.9, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );

      border.value = withRepeat(
        withTiming(2, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      cancelAnimation(scale);
      cancelAnimation(border);
      scale.value = withTiming(1, { duration: 200 });
      border.value = withTiming(0, { duration: 200 });
    }
  }, [isListening]);

  const handlePress = () => {
    if (isListening) { 
      haptic.success();
    } else {
      haptic.heavy();

      notify(
        "Estamos ouvindo!",
        "O aplicativo está agora gravando áudio ativamente."
      );
    }
    setIsListening(!isListening);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: border.value * 2
  }));

  return (
    <View style={styles.container}>
      <Topbar />
      <Content>
        <Animated.View
          style={[
            styles.button,
            animatedStyle
          ]}
        >
          <Pressable onPressIn={haptic.light}
            onPress={handlePress}>
            <Ear color={colors.tint} size={80} strokeWidth={1.5} />
          </Pressable>
        </Animated.View>
      </Content>
    </View>
  );
}

