import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // <-- 1. Import your Auth Context

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

  const { token } = useAuth();

  const mutate = async (payload?: TPayload) => {
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
        throw new Error(`HTTP error! Status: ${response.status}`);
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