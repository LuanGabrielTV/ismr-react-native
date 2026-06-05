import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Layout } from '@/constants/layout';

type Props = {
    children: React.ReactNode;
    loading?: boolean;
};

export function Content({ children, loading = false }: Props) {
    const colors = Colors[useColorScheme() ?? 'light'];

    const styles = StyleSheet.create({
        content: {
            flex: 1, 
            padding: Layout.content.padding,
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        text: {
            color: colors.text
        }
    });

    return (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator color={colors.text} />
            ) : (
                <Text style={styles.text}>{children}</Text>
            )}
        </View>
    )
}