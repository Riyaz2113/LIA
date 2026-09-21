import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * AuthContext
 * Global authentication state accessible to all components.
 *
 * Provides:
 *   - user        : current user object (null if unauthenticated)
 *   - profile     : role-specific profile (Student/Faculty/null for Admin)
 *   - isLoading   : true while the initial /me check is in flight
 *   - isAuthenticated : derived from user !== null
 *   - login()     : authenticate and update state
 *   - logout()    : clear session and state
 *   - refreshUser(): re-fetch the current user from the API
 *
 * Usage:
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *
 * The Login UI is implemented in a future phase — this is the infrastructure only.
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // start true to prevent flash

  // ── Load current user on app mount ────────────────────────────────────────
  // If the HTTP-only cookie is present, /api/auth/me will return the user.
  // This covers browser refresh — the cookie is sent automatically.
  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.me();
      setUser(data.user);
      setProfile(data.profile ?? null);
    } catch {
      // Not authenticated — clear state
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (identifier, password) => {
    const data = await authService.login({ identifier, password });
    setUser(data.user);
    setProfile(null); // /me is called separately if profile is needed
    return data;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth — hook for consuming AuthContext.
 * Must be used inside <AuthProvider>.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
