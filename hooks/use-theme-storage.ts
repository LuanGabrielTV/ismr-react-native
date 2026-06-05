import { useEffect, useCallback } from 'react';
import { Appearance, useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@ismr_theme_preference';

export function useThemeStorage() {
    const systemTheme = useNativeColorScheme();
    const currentTheme = Appearance.getColorScheme() ?? systemTheme ?? 'light';

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme === 'light' || savedTheme === 'dark') {
                    Appearance.setColorScheme(savedTheme);
                }
            } catch (error) {
                console.error("Erro ao carregar o tema salvo:", error);
            }
        };
        
        loadTheme();
    }, []);

    const toggleTheme = useCallback(async () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        Appearance.setColorScheme(newTheme);

        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error("Erro ao persistir o tema:", error);
        }
    }, [currentTheme]);

    return {
        theme: currentTheme,
        toggleTheme
    };
}