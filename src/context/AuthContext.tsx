import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  departmentId?: string;
  departmentName?: string;
  employeeId?: string;
  preferredLanguage?: 'en' | 'hi' | 'mr';
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isVerifying: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => void;
  updateUserLanguage: (lang: 'en' | 'hi' | 'mr') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('civic_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null;
  });
  const [isVerifying, setIsVerifying] = useState(false);

  // Validate active session against backend server on mount or when user id changes
  useEffect(() => {
    let isMounted = true;
    const verifyBackendRole = async () => {
      if (!user) return;
      setIsVerifying(true);
      try {
        const res = await fetch(`/api/auth/me?userId=${user.id}&email=${encodeURIComponent(user.email)}`, {
          headers: {
            'x-user-id': user.id,
            'x-user-role': user.role,
            'x-user-email': user.email
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.user) {
            setUser(data.user);
            localStorage.setItem('civic_user', JSON.stringify(data.user));
          }
        } else if (res.status === 401 || res.status === 404) {
          // If session expired or invalid on server
          if (isMounted) {
            setUser(null);
            localStorage.removeItem('civic_user');
          }
        }
      } catch (err) {
        console.error('Failed to verify user role from backend server', err);
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    verifyBackendRole();
    return () => { isMounted = false; };
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('civic_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('civic_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Authentication failed. Please check your credentials.' };
      }
    } catch (e: any) {
      console.error('Login error', e);
      return { success: false, error: 'Network communication error. Please try again.' };
    }
  };

  const register = async (payload: RegisterPayload): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed.' };
      }
    } catch (e: any) {
      console.error('Registration error', e);
      return { success: false, error: 'Network communication error during registration.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_user');
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const updateUserLanguage = (lang: 'en' | 'hi' | 'mr') => {
    if (user) {
      const updated = { ...user, preferredLanguage: lang };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'CITIZEN',
        isAuthenticated: !!user,
        isVerifying,
        login,
        register,
        logout,
        updateUserLanguage
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

