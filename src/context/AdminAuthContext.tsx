import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/ecommerce';

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { username?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('richpeople_admin_token') || localStorage.getItem('heems_admin_token');
  });
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('richpeople_admin_user') || localStorage.getItem('heems_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/admin/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAdmin(data.admin);
          localStorage.setItem('richpeople_admin_user', JSON.stringify(data.admin));
        } else {
          // Token expired or invalid
          setToken(null);
          setAdmin(null);
          localStorage.removeItem('richpeople_admin_token');
          localStorage.removeItem('richpeople_admin_user');
          localStorage.removeItem('heems_admin_token');
          localStorage.removeItem('heems_admin_user');
        }
      } catch (err) {
        console.error('Failed to verify admin token:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setAdmin(data.admin);
        localStorage.setItem('richpeople_admin_token', data.token);
        localStorage.setItem('richpeople_admin_user', JSON.stringify(data.admin));
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch {
      return { success: false, error: 'Network error occurred during login.' };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('richpeople_admin_token');
    localStorage.removeItem('richpeople_admin_user');
    localStorage.removeItem('heems_admin_token');
    localStorage.removeItem('heems_admin_user');
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update password' };
    } catch {
      return { success: false, error: 'Network error occurred.' };
    }
  };

  const updateProfile = async (data: { username?: string; email?: string }) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/admin/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setAdmin(resData.admin);
        localStorage.setItem('richpeople_admin_user', JSON.stringify(resData.admin));
        return { success: true };
      }
      return { success: false, error: resData.error || 'Failed to update profile' };
    } catch {
      return { success: false, error: 'Network error occurred.' };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        isLoading,
        login,
        logout,
        changePassword,
        updateProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
