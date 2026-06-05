import React from 'react';
import {Pressable, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Fonts } from '@/constants/theme';
import { Layout } from '@/constants/layout';

type Props = {
    children: React.ReactNode;
    loading?: boolean;
};

export function Button({ children, loading = false }: Props) {
    const colors = Colors[useColorScheme() ?? 'light'];

    const styles = StyleSheet.create({
        base: {
            borderRadius: Layout.button.borderRadius,
            padding: Layout.button.padding,
            alignItems: 'center', 
            justifyContent: 'center',
            alignSelf: 'flex-start',
            backgroundColor: colors?.background,
            borderColor: colors?.tint,
            borderWidth: Layout.button.borderWidth,
            color: colors?.text,
            fontFamily: Fonts.regular
        },
        pressed: {
            opacity: 0.75
        }
    });

    return (
        <Pressable style={({ pressed }) => [styles.base, pressed && styles.pressed]} disabled={loading}>
            {loading ? <ActivityIndicator color={colors?.text} /> : <Text style={{ color: colors?.text }}>{children}</Text>}
        </Pressable>
    )
}