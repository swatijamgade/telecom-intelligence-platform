import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { getApiErrorMessage } from "../api/client";
import { getMe, login as loginRequest, logout as logoutRequest, signup as signupRequest } from "../services/authService";
import type { LoginPayload, SignupPayload, User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    getMe()
      .then((profile) => {
        if (active) {
          setUser(profile);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    setUser(response.user);
  };

  const signup = async (payload: SignupPayload) => {
    const response = await signupRequest(payload);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export function useAuthSafeError(error: unknown): string {
  return getApiErrorMessage(error);
}
