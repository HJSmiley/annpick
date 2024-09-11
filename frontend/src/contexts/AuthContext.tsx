// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  profile_img: string;
  nickname: string;
}

interface AuthContextType {
  state: {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: User | null;
    token: string | null; // 토큰을 상태로 추가
  };
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";

interface JwtPayload {
  exp: number; // 토큰 만료 시간
  email: string;
  profile_img: string;
  nickname: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // 토큰 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedToken) {
      try {
        const decoded: JwtPayload = jwtDecode(storedToken);

        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser({
            email: decoded.email,
            profile_img: decoded.profile_img,
            nickname: decoded.nickname,
          });
          setToken(storedToken); // 토큰 설정
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

  const login = (newToken: string) => {
    try {
      const decoded: JwtPayload = jwtDecode(newToken);

      if (decoded.exp * 1000 > Date.now()) {
        localStorage.setItem(TOKEN_KEY, newToken);
        setIsAuthenticated(true);
        setUser({
          email: decoded.email,
          profile_img: decoded.profile_img,
          nickname: decoded.nickname,
        });
        setToken(newToken); // 토큰 설정
        setError(null);

        // 현재 URL 확인 (evaluation 페이지면 평가 페이지로 이동)
        if (window.location.pathname.includes("/evaluation")) {
          navigate("/evaluation"); // 별점 정보가 없으면 평가 페이지로 이동
        } else {
          navigate("/"); // 별점 정보가 있으면 메인 페이지로 이동
        }
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
    setToken(null); // 토큰 초기화
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        state: { isAuthenticated, loading, error, user, token }, // token 추가
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
