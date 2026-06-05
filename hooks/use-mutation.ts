import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // <-- 1. Import your Auth Context
import { useNetwork } from './use-network';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface MutationOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
}

export function useMutation<TResponse = any, TPayload = any>(
  url: string,
  options: MutationOptions = { method: 'POST' }
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useNetwork();

  const { token } = useAuth();

  const mutate = async (payload?: TPayload) => {
    if (!isConnected) {
      const offlineError = 'Sem conexão com a internet. Verifique sua rede.';
      setError(offlineError);
      throw new Error(offlineError);
    }
    setLoading(true);
    setError(null);

    try {
      let finalBody: any = undefined;
      let finalHeaders: Record<string, string> = { ...options.headers } as Record<string, string>;

      if (token) {
        finalHeaders['Authorization'] = `Bearer ${token}`;
      }

      if (payload instanceof FormData) {
        finalBody = payload;
      } else if (payload) {
        finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
        finalBody = JSON.stringify(payload);
      }

      const response = await fetch(url, {
        method: options.method,
        headers: finalHeaders,
        body: finalBody,
      });

      if (!response.ok) {
        try {
          const errorJson = await response.json();

          if (errorJson && errorJson.detail) {
            throw new Error(errorJson.detail);
          }
        } catch (parseError: any) {
          if (parseError instanceof Error && parseError.message !== 'Unexpected token...') {
            throw parseError;
          }
        }

        throw new Error(`Erro no servidor (${response.status})`);
      }

      const json = await response.json();
      setData(json);
      return json;

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}