import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  openLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openLoginModal }) => {
  const location = useLocation();
  const { state } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight / 2;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isAnimeSearch = location.pathname === "/anime-search";

  const getTextColor = (isActiveLink: boolean) => {
    if (isActiveLink) return "text-orange-500";
    if (isAnimeSearch) return "text-gray-500";
    const colorValue = Math.round(255 - scrollProgress * 255);
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
  };

  const getLogoImage = () => {
    if (isAnimeSearch || scrollProgress >= 0.5) {
      return "/images/logo_annpick_dk.svg";
    } else {
      return "/images/logo_annpick_white.svg";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px]`}
      style={{
        backgroundColor: isAnimeSearch ? "rgba(255, 255, 255, 1)" : `rgba(255, 255, 255, ${scrollProgress})`,
        boxShadow: isAnimeSearch ? "0 2px 4px rgba(0, 0, 0, 0.1)" : `0 2px 4px rgba(0, 0, 0, ${scrollProgress * 0.1})`,
      }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <img
                src={getLogoImage()}
                alt="앤픽 로고"
                className="w-[80px] h-[40px]"
              />
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    to="/"
                    className={`font-black text-xl transition-colors ${
                      isActive("/") ? "text-orange-500" : ""
                    }`}
                    style={{
                      color: isActive("/")
                        ? "rgb(249, 115, 22)"
                        : getTextColor(false),
                    }}
                  >
                    <span className="hover:text-orange-500">홈</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/anime-search"
                    className={`font-bold text-xl transition-colors ${
                      isActive("/anime-search") ? "text-orange-500" : ""
                    }`}
                    style={{
                      color: isActive("/anime-search")
                        ? "rgb(249, 115, 22)"
                        : getTextColor(false),
                    }}
                  >
                    <span className="hover:text-orange-500">애니 검색</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            {state.isAuthenticated ? (
              <Link
                to="/profile"
                className="font-bold text-xl transition-colors"
                style={{ color: getTextColor(false) }}
              >
                <span className="hover:text-orange-500">프로필</span>
              </Link>
            ) : (
              <button
                onClick={openLoginModal}
                className="font-bold text-xl transition-colors"
                style={{ color: getTextColor(false) }}
              >
                <span className="hover:text-orange-500">로그인/가입</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;