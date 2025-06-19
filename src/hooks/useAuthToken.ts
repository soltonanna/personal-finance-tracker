import { useState, useEffect } from 'react';

export const useAuthToken = (): string => {
  const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token') || '';
      setToken(savedToken);
    }
  }, []);

  return token;
};
