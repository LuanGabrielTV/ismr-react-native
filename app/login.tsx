import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Eye, EyeOff, ChevronRight, CircleX, Check } from 'lucide-react-native';
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Topbar } from '@/components/ui/Topbar';
import { Layout } from '@/constants/layout';
import { useMutation } from '@/hooks/use-mutation';

export default function Login() {
  const { theme } = useThemeStorage();
  const colors = Colors[theme ?? 'light'];
  const { login } = useAuth();
  const { mutate, loading, error } = useMutation('https://ismr-engine-service.onrender.com/auth/login', {
    method: 'POST',
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    
    const formData = new FormData();
    
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await mutate(formData);
      
      if (response && response.access_token) {
        
        const userData = { 
          username: username,
          password: password
        };
        
        await login(userData, response.access_token);
        
      }
    } catch (err) {
      console.log("Falha no login", err);
    }
  };

  const styles = StyleSheet.create({

    loadingSpinner: {
      color: colors.text
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 40,
    },
    headerContainer: {
      marginBottom: 40,
    },
    title: {
      fontSize: Layout.ui.fontSize * 1.75,
      fontFamily: Fonts.strongTitle,
      marginBottom: 24,
      color: colors.text
    },
    divider: {
      height: 1,
      width: '100%',
      opacity: 0.5,
      backgroundColor: colors.border
    },
    formContainer: {
      gap: 24
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontFamily: Fonts.regular,
      fontSize: Layout.ui.fontSize,
      marginLeft: 2,
      color: colors.text
    },
    input: {
      height: 56,
      borderRadius: Layout.ui.borderRadius,
      paddingHorizontal: 16,
      fontSize: Layout.ui.fontSize,
      fontFamily: Layout.ui.fontFamily,
      backgroundColor: colors.border,
      color: colors.text
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 56,
      borderRadius: Layout.ui.borderRadius,
      overflow: 'hidden',
      backgroundColor: colors.border
    },
    passwordInput: {
      flex: 1,
      height: '100%',
      paddingHorizontal: 16,
      fontSize: Layout.ui.fontSize,
      fontFamily: Layout.ui.fontFamily,
      color: colors.text
    },
    eyeButton: {
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginButton: {
      height: 56,
      borderRadius: Layout.ui.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      gap: 8,
      backgroundColor: colors.tint
    },
    loginButtonText: {
      fontSize: Layout.ui.fontSize,
      fontFamily: Fonts.title,
      color: colors.background
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
    },
    statusContainer: {
      borderRadius: 12,
      borderWidth: 1.5,
      padding: 16,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: 6,
      marginBottom: 32,
    },
    errorContainer: {
      paddingHorizontal: 20
    },
    statusTitle: {
      fontFamily: Fonts.strongTitle,
      color: colors.error,
      fontSize: Layout.ui.fontSize * 0.9,
    },
    statusMessage: {
      fontFamily: Fonts.regular,
      fontSize: Layout.ui.fontSize * 0.8,
      color: colors.error
    },
    errorText: {
      fontFamily: Fonts.regular,
      color: colors.error
    }
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Topbar />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            Bem vindo de{'\n'}volta!
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.formContainer}>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={
                styles.input
              }
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.tabIconDefault}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={[
              styles.passwordContainer,

            ]}>
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
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {!loading && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.loginButtonText}>Entrar</Text>
                <ChevronRight color={colors.background} size={Layout.ui.iconSize} strokeWidth={Layout.ui.iconStrokeWidth} />
              </View>
            )}
            {loading && <ActivityIndicator color={colors.background} size="small" />}
          </Pressable>

          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>
              Criar conta
            </Text>
          </Pressable>
          {error && (
            <View style={[styles.statusContainer, styles.errorContainer, { borderColor: colors.error, backgroundColor: colors.background }]}>
              <CircleX size={Layout.ui.iconSize} color={colors.error} />
              <Text style={[styles.statusTitle]}>Algo deu errado!</Text>
              <Text style={[styles.statusMessage]}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

