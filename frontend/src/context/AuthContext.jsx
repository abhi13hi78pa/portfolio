import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const me = await authApi.getMe();
          setAdmin(me);
        } catch (error) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('adminToken');
          setToken(null);
          setAdmin(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    if (data.require2FA) {
      return data;
    }
    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setAdmin({ id: data.id, email: data.email, role: data.role, twoFactorEnabled: data.twoFactorEnabled });
    return data;
  };

  const complete2FA = async (tempToken, code) => {
    const data = await authApi.verify2FA({ tempToken, code });
    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setAdmin({ id: data.id, email: data.email, role: data.role, twoFactorEnabled: data.twoFactorEnabled });
    return data;
  };

  const reloadAdmin = async () => {
    try {
      const me = await authApi.getMe();
      setAdmin(me);
    } catch (err) {
      console.error('Failed to reload admin:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        complete2FA,
        reloadAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
