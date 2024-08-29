// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  state: {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: User | null;
  };
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token"; // 로컬 스토리지에 저장할 키

interface JwtPayload {
  exp: number; // 토큰 만료 시간
  name: string; // 사용자 이름
  email: string; // 사용자 이메일
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);

        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser({ name: decoded.name, email: decoded.email });
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (e) {
        console.error("Failed to decode JWT token", e);
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const decoded: JwtPayload = jwtDecode(token);

      if (decoded.exp * 1000 > Date.now()) {
        localStorage.setItem(TOKEN_KEY, token);
        setIsAuthenticated(true);
        setUser({ name: decoded.name, email: decoded.email });
        setError(null);
        navigate("/");
      } else {
        setError("Token has expired");
      }
    } catch (e) {
      console.error("Failed to decode JWT token", e);
      setError("Invalid token");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        state: { isAuthenticated, loading, error, user },
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
