import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import authApi from "../api/authApi";
import { tokenStorage } from "../api/client";

export const AUTH_STATUS = {
  UNKNOWN: "unknown",
  CHECKING: "checking",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState(AUTH_STATUS.UNKNOWN);
  const [user, setUser] = useState(null);

  const checkSession = useCallback(async () => {
    if (!tokenStorage.getAccessToken()) {
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
      return;
    }
    setStatus(AUTH_STATUS.CHECKING);
    try {
      const me = await authApi.getCurrentUser();
      setUser(me);
      setStatus(AUTH_STATUS.AUTHENTICATED);
    } catch {
      tokenStorage.clear();
      setUser(null);
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Fired by the API client when a refresh attempt fails.
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
    };
    window.addEventListener("chatfiles:session-expired", onExpired);
    return () => window.removeEventListener("chatfiles:session-expired", onExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    setStatus(AUTH_STATUS.AUTHENTICATED);
    return data;
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const data = await authApi.loginWithGoogle(credential);
    setUser(data.user);
    setStatus(AUTH_STATUS.AUTHENTICATED);
    return data;
  }, []);

  const register = useCallback(async (payload) => authApi.register(payload), []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setUser(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
  }, []);

  const value = useMemo(
    () => ({ status, user, setUser, login, loginWithGoogle, register, logout, refresh: checkSession }),
    [status, user, login, loginWithGoogle, register, logout, checkSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
