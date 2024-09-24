import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AvatarDropdownProps {
  openLoginModal: () => void;
  isAnimeSearch: boolean;
  isProfilePage: boolean;
  isEvaluationPage: boolean;
  scrollProgress: number;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  openLoginModal,
  isProfilePage,
  isAnimeSearch,
  isEvaluationPage,
  scrollProgress,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate("/profile");
    }, 0);
  };

  const handleRecommendClick = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.recommendedAnimes && data.recommendedAnimes.length > 0) {
          alert("새로운 추천이 생성되었습니다.");
          if (location.pathname === "/") {
            window.location.reload(); // 메인 페이지에서 새로고침
          } else {
            navigate("/"); // 메인 페이지로 리다이렉트
          }
        } else {
          alert("평가한 작품이 없어 추천을 생성할 수 없습니다.");
        }
      } else {
        console.error("추천 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("추천 생성 중 오류 발생:", error);
    }
  };

  const isHomePage = location.pathname === "/";

  const getTextColor = () => {
    if (isProfilePage) return "rgb(249, 115, 22)";
    if (isAnimeSearch) return "rgb(107, 114, 128)";
    if (isEvaluationPage) return "rgb(0, 0, 0)";
    if (scrollProgress >= 0.5) return "rgb(0, 0, 0)";
    return "white";
  };

  if (!state.isAuthenticated) {
    return (
      <button
        onClick={openLoginModal}
        className="font-bold text-xl transition-colors hover:text-orange-500"
      >
        로그인/가입
      </button>
    );
  }

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 overflow-hidden">
          <img
            src={state.user?.profile_img || "/images/default-profile.png"}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className="font-semibold text-sm mr-1"
          style={{
            color: getTextColor(),
          }}
        >
          {state.user?.nickname || "사용자"}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          style={{ color: isHomePage ? "white" : "rgb(107, 114, 128)" }}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
          <div
            className="px-4 py-3 border-b border-gray-200 flex items-center cursor-pointer hover:bg-gray-50"
            onClick={handleProfileClick}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 overflow-hidden">
              <img
                src={state.user?.profile_img || "/images/default-profile.png"}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-semibold">
                {state.user?.nickname || "사용자"}
              </p>
              <p className="text-xs text-gray-500">
                {state.user?.email || "email@example.com"}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
          <Link
            to="/my-ratings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            내 평가
          </Link>
          <Link
            to="/my-picks"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            픽한 애니메이션
          </Link>
          <button
            onClick={handleRecommendClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            새로 추천받기
          </button>
          <div className="px-4 py-2">
            <button
              onClick={logout}
              className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
