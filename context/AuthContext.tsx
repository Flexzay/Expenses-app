import { getToken, setToken } from "@/services/api";
import { loginService, logoutService, registerService } from "@/services/auth";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar: revisa si hay token guardado
  useEffect(() => {
    async function checkToken() {
      try {
        const token = await getToken();
        setIsAuthenticated(!!token);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    await loginService({ email, password });
    setIsAuthenticated(true);
    router.replace("/(main)/(tabs)/home");
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    await registerService({ name, email, password, password_confirmation });
    setIsAuthenticated(true);
    router.replace("/(main)/(tabs)/home");
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch {
      await setToken(null);
    }
    setIsAuthenticated(false);
    router.replace("/welcome");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}