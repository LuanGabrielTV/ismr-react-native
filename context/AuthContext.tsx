import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useFetch } from '@/hooks/use-fetch';

const TOKEN_KEY = 'ismr_jwt_token';

interface User {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (userData: User, authToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

        if (storedToken) {
          setToken(storedToken);

          const { data: fetchData} = useFetch('https://ismr-engine-service.onrender.com/users/me');
          if (fetchData) {
            setUser(fetchData);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar o token seguro:", error);
      } finally {
        setIsReady(true);
      }
    };

    loadSession();
  }, []);

  const login = async (userData: User, authToken: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error("Erro ao salvar o token:", error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Erro ao deletar o token:", error);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isReady,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}