import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// 사용자 정보 인터페이스
interface User {
  email: string;
  profile_img: string;
  nickname: string;
}

interface JwtPayload {
  exp: number;
  email: string;
  profile_img: string;
  nickname: string;
  naver_access_token: string;
  naver_refresh_token: string;
}

interface AuthContextType {
  state: {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: User | null;
    token: string | null;
  };
  login: (token: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // JWT 토큰 유효성 검사
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (e) {
      console.error("Failed to decode token:", e);
      return false;
    }
  };

  // 초기화: 로컬 스토리지에서 Access Token 로드 및 디코딩
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken && isTokenValid(storedToken)) {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(storedToken);
      setIsAuthenticated(true);
      setUser({
        email: decoded.email,
        profile_img: decoded.profile_img,
        nickname: decoded.nickname,
      });
      setToken(storedToken);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem(TOKEN_KEY);
    }
    setLoading(false);
  }, []);

  // 로그인 함수
  const login = (newToken: string) => {
    if (isTokenValid(newToken)) {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(newToken);
      setUser({
        email: decoded.email,
        profile_img: decoded.profile_img,
        nickname: decoded.nickname,
      });
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setIsAuthenticated(true);
    } else {
      setError("Token has expired or is invalid.");
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청을 보내고 세션 종료
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include", // Refresh Token이 쿠키에 저장되어 있을 경우 함께 삭제
      });
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      // 클라이언트 측 인증 상태 초기화
      localStorage.removeItem(TOKEN_KEY);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null); // 토큰 초기화
      setError(null);

      // 로그아웃 후 메인 페이지로 리다이렉트
      navigate("/");
    }
  };

  // Access Token 갱신 함수
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/token`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const { accessToken } = await response.json();
        login(accessToken); // 갱신된 토큰으로 로그인 처리
      } else {
        logout(); // 갱신 실패 시 로그아웃
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout(); // 갱신 실패 시 로그아웃
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state: {
          isAuthenticated,
          loading,
          error,
          user,
          token,
        },
        login,
        logout,
        refreshAccessToken,
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
