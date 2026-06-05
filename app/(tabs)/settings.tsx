import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ScrollView,
  Pressable
} from 'react-native';
import { Topbar } from '@/components/ui/Topbar';
import { Colors, Fonts } from '@/constants/theme';
import { Layout } from '@/constants/layout';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { useFetch } from '@/hooks/use-fetch';
import { useMutation } from '@/hooks/use-mutation';
import { CircleX } from 'lucide-react-native';

interface Preferences {
  ai_personality?: string;
  focus_mode_active?: boolean;
  hide_sensitive_data?: boolean;
}

const PERSONALITY_OPTIONS = [
  { value: 'Helpful and polite', label: 'Prestativa e educada' },
  { value: 'Short and blunt', label: 'Direta e curta' },
  { value: 'Sarcastic and humorous', label: 'Sarcástica e bem-humorada' },
  { value: 'Formal and professional', label: 'Formal e profissional' },
];

export default function Settings() {
  const { theme } = useThemeStorage();
  const colors = Colors[theme ?? 'light'];

  const {
    data: fetchedPrefs,
    loading: isFetching,
    error: fetchError
  } = useFetch<Preferences>('https://ismr-engine-service.onrender.com/preferences');

  const { mutate: mutate, error: mutateError } = useMutation('https://ismr-engine-service.onrender.com/preferences', {
    method: 'PUT',
  });

  const [preferences, setPreferences] = useState<Preferences>({});

  useEffect(() => {
    if (fetchedPrefs) {
      setPreferences(fetchedPrefs);
    }
  }, [fetchedPrefs]);

  const handleChangeInPreferences = async (value: any, fieldName: keyof Preferences) => {
    const updated = {
      ...preferences,
      [fieldName]: value
    };
    setPreferences(updated);

    try {
      await mutate(updated);
    } catch (error) {
      console.error("Falha ao salvar preferência:", error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 24,
    },
    centerLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: Layout.ui.fontSize * 1.5,
      fontFamily: Fonts.strongTitle,
      color: colors.text,
      marginBottom: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
      opacity: 0.5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: Layout.ui.fontSize,
      fontFamily: Fonts.regular,
      color: colors.text,
      flex: 1,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'transparent',
    },
    chipActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    chipText: {
      fontSize: Layout.ui.fontSize * 0.85,
      fontFamily: Fonts.regular,
      color: colors.text,
    },
    chipTextActive: {
      color: colors.background,
      fontFamily: Fonts.title,
    },
    statusContainer: { borderRadius: 12, borderWidth: 1.5, padding: 16, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 6, marginBottom: 32 },
    errorContainer: { paddingHorizontal: 20 },
    statusTitle: { fontFamily: Fonts.strongTitle, color: colors.error, fontSize: Layout.ui.fontSize * 0.9 },
    statusMessage: { fontFamily: Fonts.regular, fontSize: Layout.ui.fontSize * 0.8, color: colors.error },
  });

  if (isFetching) {
    return (
      <View style={styles.container}>
        <Topbar />
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Topbar />
      <ScrollView contentContainerStyle={styles.content}>
        {fetchError ? (
          <View style={[styles.statusContainer, styles.errorContainer, { borderColor: colors.error, backgroundColor: colors.background, marginTop: 24 }]}>
            <CircleX size={Layout.ui.iconSize} color={colors.error} />
            <Text style={[styles.statusTitle]}>Falha ao carregar dados</Text>
            <Text style={[styles.statusMessage]}>{fetchError}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Preferências</Text>
            <View style={styles.divider} />

            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Personalidade da IA</Text>
              <View style={styles.chipContainer}>
                {PERSONALITY_OPTIONS.map((option) => {
                  const isActive = preferences.ai_personality === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => handleChangeInPreferences(option.value, 'ai_personality')}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Modo de foco</Text>
              <Switch
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor={colors.hover}
                ios_backgroundColor={colors.border}
                onValueChange={(value) => handleChangeInPreferences(value, 'focus_mode_active')}
                value={!!preferences.focus_mode_active}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Ocultar dados sensíveis?</Text>
              <Switch
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor={colors.hover}
                ios_backgroundColor={colors.border}
                onValueChange={(value) => handleChangeInPreferences(value, 'hide_sensitive_data')}
                value={!!preferences.hide_sensitive_data}
              />
            </View>
            {mutateError && <View style={[styles.statusContainer, styles.errorContainer, { borderColor: colors.error, backgroundColor: colors.background, marginTop: 24 }]}>
              <CircleX size={Layout.ui.iconSize} color={colors.error} />
              <Text style={[styles.statusTitle]}>Falha ao atualizar dados</Text>
              <Text style={[styles.statusMessage]}>{mutateError}</Text>
            </View>
            }
          </>)}
      </ScrollView>
    </View>
  );
}