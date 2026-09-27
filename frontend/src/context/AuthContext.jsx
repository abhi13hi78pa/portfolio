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
          setIsLoading(false);
          return;
        } catch (error) {
          // Access token might be expired, attempt cookie-based refresh below
        }
      }

      // Try silent refresh using HttpOnly cookie
      try {
        const refreshData = await authApi.refresh();
        if (refreshData?.token) {
          localStorage.setItem('adminToken', refreshData.token);
          setToken(refreshData.token);
          const me = await authApi.getMe();
          setAdmin(me);
        } else {
          setAdmin(null);
        }
      } catch (err) {
        localStorage.removeItem('adminToken');
        setToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout network error:', err);
    } finally {
      localStorage.removeItem('adminToken');
      setToken(null);
      setAdmin(null);
    }
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
