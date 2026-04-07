import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, logout as authLogout, onAuthStateChange } from '../utils/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function hydrateCurrentUser() {
      try {
        const { user: currentUser } = await getCurrentUser();
        if (!mounted) return;

        setUser(currentUser || null);
        if (currentUser) {
          localStorage.setItem('beautyHue_user', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('beautyHue_user');
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    }

    const unsubscribe = onAuthStateChange(({ user: nextUser }) => {
      if (!mounted) return;

      setUser(nextUser);
      if (nextUser) {
        localStorage.setItem('beautyHue_user', JSON.stringify(nextUser));
      } else {
        localStorage.removeItem('beautyHue_user');
      }

      setInitialized(true);
      setLoading(false);
    });

    hydrateCurrentUser();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await authLogout();
    setUser(null);
    localStorage.removeItem('beautyHue_user');
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
