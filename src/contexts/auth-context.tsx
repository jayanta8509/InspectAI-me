"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only access localStorage on client side
    const initializeAuth = () => {
      try {
        const savedAuth = localStorage.getItem("isAuthenticated");
        const savedEmail = localStorage.getItem("userEmail");
        if (savedAuth === "true") {
          setIsAuthenticated(true);
          setUserEmail(savedEmail);
        }
      } catch (error) {
        // localStorage not available (server-side)
        console.warn("localStorage not available");
      } finally {
        setLoading(false);
      }
    };

    // Delay initialization to avoid hydration mismatch
    const timer = setTimeout(initializeAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = (email: string, password: string) => {
    // Simple authentication logic (you can replace this with real auth)
    if (
      (email === "admin@inspectai.com" && password === "admin123") ||
      (email === "sourcebynet@gmail.com" && password === "sourcebynet@999")
    ) {
      setIsAuthenticated(true);
      setUserEmail(email);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}