import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';
import { Layout } from '@/constants/layout';
import { Ear, Sun, Moon } from 'lucide-react-native';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { useHaptics } from '@/hooks/use-haptics';

export function Topbar() {
    const { theme, toggleTheme } = useThemeStorage();
    const colors = Colors[theme];
    const haptic = useHaptics();

    const styles = StyleSheet.create({
        header: {
            paddingTop: Layout.header.paddingTop,
            paddingLeft: Layout.header.paddingLeft,
            paddingRight: Layout.header.paddingRight,
            paddingBottom: Layout.header.paddingBottom,
            height: Layout.header.height,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors?.background,
            position: 'relative',
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
        },
        text: {
            color: colors?.text,
            fontFamily: Fonts.title,
            minWidth: 50, 
            textAlign: 'center'
        }
    });

    return (
        <View style={styles.header}>
            <Ear size={Layout.ui.iconSize} color={colors.tint} strokeWidth={Layout.ui.iconStrokeWidth} />
            <Text style={styles.text}>ismr </Text>
            <Pressable
                onPress={toggleTheme}
                onPressOut={() => {haptic.medium()}}
            >
                {theme === 'dark' && <Sun size={Layout.ui.iconSize} color={colors.tint} strokeWidth={Layout.ui.iconStrokeWidth} />}
                {theme === 'light' && <Moon size={Layout.ui.iconSize} color={colors.tint} strokeWidth={Layout.ui.iconStrokeWidth} />}
            </Pressable>
        </View>
    )
}