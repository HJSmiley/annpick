import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AvatarDropdownProps {
  openLoginModal: () => void;
  isAnimeSearch: boolean;
  isProfilePage: boolean;
  isEvaluationPage: boolean;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  openLoginModal,
  isProfilePage,
  isAnimeSearch,
  isEvaluationPage,
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
    navigate("/profile");
    setIsOpen(false);
  };

  const isHomePage = location.pathname === "/";

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
            src={state.user?.profile_img || "/default-profile.png"}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className="font-semibold text-sm mr-1"
          style={{
            color: isProfilePage
              ? "rgb(249, 115, 22)"
              : isAnimeSearch
              ? "rgb(107, 114, 128)"
              : isEvaluationPage
              ? "rgb(0, 0, 0)"
              : "white",
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
                src={state.user?.profile_img || "/default-profile.png"}
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