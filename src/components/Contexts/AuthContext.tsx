/**
 * Auth Context
 * Global state management untuk authentication
 */

"use client";

import React, { createContext, useContext, useState } from "react";
import { authAPI, UserData } from "@/utils/helpers/api";
import { storage } from "@/utils/helpers/storage";

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    // Initialize from localStorage on mount
    if (typeof window !== "undefined") {
      return storage.getUser<UserData>();
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    // Initialize from localStorage on mount
    if (typeof window !== "undefined") {
      return storage.getToken();
    }
    return null;
  });

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });

    if (response.data) {
      setUser(response.data.user);
      setToken(response.data.token);
      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => {
    const response = await authAPI.register({
      name,
      email,
      password,
      role: role as "student" | "instructor" | "admin" | undefined,
    });

    if (response.data) {
      setUser(response.data.user);
      setToken(response.data.token);
      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading: false,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
