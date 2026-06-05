import { Topbar } from '@/components/ui/Topbar';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@/hooks/use-mutation';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { Eye, EyeOff, ChevronRight, CircleX, Check, LogOut } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, TextInput, Pressable, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { Layout } from '@/constants/layout';
import { useRouter, usePathname, Href, Stack } from 'expo-router';

export default function Register() {
    const { theme } = useThemeStorage();
    const colors = Colors[theme ?? 'light'];
    const {
        mutate,
        data: mutateData,
        loading: mutateLoading,
        error: mutateError
    } = useMutation('https://ismr-engine-service.onrender.com/auth/register', {
        method: 'POST',
    });

    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !displayName || !password) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.");
            return;
        }

        const fields = {
            username: username,
            display_name: displayName,
            password: password
        };

        try {
            const response = await mutate(fields);

            if (response) {
                Alert.alert(
                    "Sucesso!",
                    "Sua conta foi criada. Faça login para continuar.",
                    [
                        {
                            text: "OK",
                            onPress: () => router.replace('/login')
                        }
                    ]
                );
            }

        } catch (err: any) {
            console.log("Falha no cadastro:", err);
        }
    };

    const styles = StyleSheet.create({
        loadingSpinner: { color: colors.text },
        scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
        headerContainer: { marginBottom: 40 },
        title: { fontSize: Layout.ui.fontSize * 1.75, fontFamily: Fonts.strongTitle, marginBottom: 24, color: colors.text },
        divider: { height: 1, width: '100%', opacity: 0.5, backgroundColor: colors.border },
        formContainer: { gap: 24 },
        inputGroup: { gap: 8 },
        label: { fontFamily: Fonts.regular, fontSize: Layout.ui.fontSize, marginLeft: 2, color: colors.text },
        input: { height: 56, borderRadius: Layout.ui.borderRadius, paddingHorizontal: 16, fontSize: Layout.ui.fontSize, fontFamily: Layout.ui.fontFamily, backgroundColor: colors.border, color: colors.text },
        passwordContainer: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: Layout.ui.borderRadius, overflow: 'hidden', backgroundColor: colors.border },
        passwordInput: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: Layout.ui.fontSize, fontFamily: Layout.ui.fontFamily, color: colors.text },
        eyeButton: { padding: 16, justifyContent: 'center', alignItems: 'center' },
        loginButton: { height: 56, borderRadius: Layout.ui.borderRadius, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8, backgroundColor: colors.tint },
        loginButtonText: { fontSize: Layout.ui.fontSize, fontFamily: Fonts.title, color: colors.background },
        statusContainer: { borderRadius: 12, borderWidth: 1.5, padding: 16, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 6, marginBottom: 32 },
        errorContainer: { paddingHorizontal: 20 },
        statusTitle: { fontFamily: Fonts.strongTitle, color: colors.error, fontSize: Layout.ui.fontSize * 0.9 },
        statusMessage: { fontFamily: Fonts.regular, fontSize: Layout.ui.fontSize * 0.8, color: colors.error },
        centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
        logoutButton: {
            height: 56,
            borderRadius: Layout.ui.borderRadius,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: Layout.ui.iconStrokeWidth,
            borderColor: colors.error,
            backgroundColor: 'transparent'
        },
        logoutButtonText: {
            fontSize: Layout.ui.fontSize,
            fontFamily: Fonts.title,
            color: colors.error
        },
        linkButton: {
            alignItems: 'center',
            marginTop: 16,
            padding: 8,
        },
        linkText: {
            fontSize: Layout.ui.fontSize * 0.8,
            fontFamily: Fonts.regular,
            color: '#007AFF'
        }
    });

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <Topbar />
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: colors.background }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>
                            Olá, seja bem-vindo!
                        </Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.formContainer}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome de Exibição</Text>
                            <TextInput
                                style={styles.input}
                                value={displayName}
                                onChangeText={setDisplayName}
                                autoCapitalize="words"
                                placeholderTextColor={colors.tabIconDefault}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholderTextColor={colors.tabIconDefault}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nova Senha</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    placeholderTextColor={colors.tabIconDefault}
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    {showPassword ? (
                                        <Eye color={colors.tabIconDefault} size={Layout.ui.iconSize} strokeWidth={Layout.ui.iconStrokeWidth} />
                                    ) : (
                                        <EyeOff color={colors.tabIconDefault} size={Layout.ui.iconSize} strokeWidth={Layout.ui.iconStrokeWidth} />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.loginButton,
                                { opacity: pressed || mutateLoading ? 0.8 : 1 }
                            ]}
                            onPress={handleRegister}
                            disabled={mutateLoading}
                        >
                            {!mutateLoading && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Text style={styles.loginButtonText}>Salvar</Text>
                                    <ChevronRight color={colors.background} size={Layout.ui.iconSize} strokeWidth={Layout.ui.iconStrokeWidth} />
                                </View>
                            )}
                            {mutateLoading && <ActivityIndicator color={colors.background} size="small" />}
                        </Pressable>
                        <Pressable style={styles.linkButton} onPress={() => { router.replace("/login") }}>
                            <Text style={styles.linkText}>
                                Já tenho uma conta
                            </Text>
                        </Pressable>
                        {mutateError && (
                            <View style={[styles.statusContainer, styles.errorContainer, { borderColor: colors.error, backgroundColor: colors.background }]}>
                                <CircleX size={Layout.ui.iconSize} color={colors.error} />
                                <Text style={[styles.statusTitle]}>Falha ao registrar usuário</Text>
                                <Text style={[styles.statusMessage]}>{mutateError}</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}