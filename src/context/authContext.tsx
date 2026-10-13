/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";

import api from "../utils/api";

import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types/authtypes";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    return storedUser && storedToken ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>(
        "/users/login",
        credentials
      );
      const { user: userData, token: newToken } = response.data;

      setToken(newToken);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // ✅ register با مدیریت loading
  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>(
        "/users/register",
        credentials
      );
      const { user: userData, token: newToken } = response.data;

      setToken(newToken);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // ✅ logout
  const logout = async (): Promise<void> => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
