import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useNetwork } from './use-network';


interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useFetch<T = any>(url: string): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const { isConnected } = useNetwork();

    const fetchData = useCallback(async (abortController?: AbortController) => {
        if (!isConnected) {
            const offlineError = 'Sem conexão com a internet. Verifique sua rede.';
            setError(offlineError);
            setLoading(false);
            throw new Error(offlineError);
        }
        setLoading(true);
        setError(null);

        const fetchOptions: RequestInit = {
            method: 'GET',
            signal: abortController?.signal,
            headers: {}
        };

        if (token) {
            (fetchOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                try {
                    const errorJson = await response.json();
                    if (errorJson && errorJson.detail) {
                        throw new Error(errorJson.detail);
                    }
                } catch (e) {
                }
                throw new Error(`Erro ao carregar dados (${response.status})`);
            }

            const json = await response.json();
            setData(json);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                setError(err.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    }, [url, token]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller);

        return () => controller.abort();
    }, [fetchData]);

    useEffect(() => {
    if (isConnected && error) {
      console.log("Internet voltou! Recarregando dados automaticamente...");
      fetchData(); 
    }
  }, [isConnected, error, fetchData]);

    return { data, loading, error, refetch: () => fetchData() };
}