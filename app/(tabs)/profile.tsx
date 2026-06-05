import { Topbar } from '@/components/ui/Topbar';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@/hooks/use-mutation';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { Eye, EyeOff, ChevronRight, CircleX, Check, LogOut } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, TextInput, Pressable, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { Layout } from '@/constants/layout';
import { useFetch } from '@/hooks/use-fetch';
import { useRouter, usePathname, Href } from 'expo-router';

export default function Profile() {
    const { theme } = useThemeStorage();
    const colors = Colors[theme ?? 'light'];
    const { logout } = useAuth();
    const { data: fetchData, loading: fetchLoading, error: fetchError, refetch } = useFetch('https://ismr-engine-service.onrender.com/users/me');
    const {
        mutate,
        data: mutateData,
        loading: mutateLoading,
        error: mutateError
    } = useMutation('https://ismr-engine-service.onrender.com/users/me', {
        method: 'PUT',
    });

    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (fetchData) {
            setUsername(fetchData.username || '');
            setDisplayName(fetchData.display_name || '');
        }
    }, [fetchData]);

    const handleSave = async () => {
        if (!username || !displayName || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const newFields: any = { username: username, display_name: displayName, password: password };

        try {
            const response = await mutate(newFields);
            if (response) {
                refetch();
                Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
            }

        } catch (err: any) {
            console.log("Falha na mutação:", err);
            Alert.alert(
                "Erro ao atualizar",
                err.message || "Ocorreu um problema ao salvar seus dados. Tente novamente."
            );
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Sair da conta",
            "Tem certeza que deseja desconectar do ismr?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
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
        }
    });

    if (fetchLoading) {
        return (
            <>
                <Topbar />
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            </>
        );
    }

    return (
        <>
            <Topbar />
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: colors.background }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                    {fetchError ? (
                        <View style={[styles.statusContainer, styles.errorContainer, { borderColor: colors.error, backgroundColor: colors.background, marginTop: 24 }]}>
                            <CircleX size={Layout.ui.iconSize} color={colors.error} />
                            <Text style={[styles.statusTitle]}>Falha ao carregar dados</Text>
                            <Text style={[styles.statusMessage]}>{fetchError}</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.headerContainer}>
                                <Text style={styles.title}>
                                    Olá, {fetchData?.display_name}!
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
                                    onPress={handleSave}
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

                                <Pressable
                                    style={({ pressed }) => [
                                        styles.logoutButton,
                                        { opacity: pressed ? 0.5 : 1 }
                                    ]}
                                    onPress={handleLogout}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <LogOut color={colors.error} size={Layout.ui.iconSize} strokeWidth={Layout.ui.iconStrokeWidth} />
                                        <Text style={styles.logoutButtonText}>Sair da conta</Text>
                                    </View>
                                </Pressable>

                            </View>
                        </>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}