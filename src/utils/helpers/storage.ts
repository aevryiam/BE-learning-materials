/**
 * Local Storage Helper
 * Utility untuk handle localStorage dengan type safety
 */

const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
} as const;

export const storage = {
  // Token operations
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }
    return null;
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  // User operations
  setUser: (user: unknown): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  getUser: <T = unknown>(): T | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Clear all auth data
  clearAuth: (): void => {
    storage.removeToken();
    storage.removeUser();
  },
};
