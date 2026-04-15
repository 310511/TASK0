import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onIdTokenChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { configureAuthTokenGetter, createApiClient } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configureAuthTokenGetter(() => token);
  }, [token]);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setCurrentUser(user || null);

      if (!user) {
        setToken(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const freshToken = await user.getIdToken();
        setToken(freshToken);

        const api = createApiClient();
        const authHeaders = { headers: { Authorization: `Bearer ${freshToken}` } };
        let response;

        try {
          response = await api.get('/api/v1/auth/me', authHeaders);
        } catch (error) {
          if (error.response?.status !== 403) {
            throw error;
          }

          // Existing Firebase users can sign in before having a Supabase profile.
          const fallbackName = (user.displayName || user.email?.split('@')[0] || 'User').trim();
          const fullName = fallbackName.length >= 2 ? fallbackName : 'User Account';

          try {
            await api.post('/api/v1/auth/register', { full_name: fullName }, authHeaders);
          } catch (registerError) {
            if (registerError.response?.status !== 409) {
              throw registerError;
            }
          }
          response = await api.get('/api/v1/auth/me', authHeaders);
        }

        setUserRole(response.data.data.user.role);
      } catch (error) {
        console.error('Failed to sync user profile', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setToken(null);
    setUserRole(null);
  };

  const value = useMemo(
    () => ({ currentUser, token, userRole, loading, logout }),
    [currentUser, token, userRole, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
