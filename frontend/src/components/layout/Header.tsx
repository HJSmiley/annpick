import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AvatarDropdown from "../../components/mypage/AvatarDropdown";

interface HeaderProps {
  openLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openLoginModal }) => {
  const location = useLocation();
  const { state } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFixedHeader, setIsFixedHeader] = useState(false);

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

  useEffect(() => {
    const fixedHeaderRoutes = [
      "/anime-search",
      "/profile",
      "/evaluation",
      "/my-ratings",
      "/my-picks",
      "/terms-of-service",
      "/privacy-policy",
      "/marketing-agreement",
      "/not-found",
    ];
    setIsFixedHeader(fixedHeaderRoutes.includes(location.pathname));
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const getTextColor = (isActiveLink: boolean) => {
    if (isActiveLink) return "rgb(249, 115, 22)";
    if (isFixedHeader) return "rgb(107, 114, 128)";
    const colorValue = Math.round(255 - scrollProgress * 255);
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
  };

  const getLogoImage = () => {
    if (isFixedHeader || scrollProgress >= 0.5) {
      return "/images/logo_annpick_dk.svg";
    } else {
      return "/images/logo_annpick_white.svg";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px]`}
      style={{
        backgroundColor: isFixedHeader
          ? "rgba(255, 255, 255, 1)"
          : `rgba(255, 255, 255, ${scrollProgress})`,
        boxShadow: isFixedHeader
          ? "0 2px 4px rgba(0, 0, 0, 0.1)"
          : `0 2px 4px rgba(0, 0, 0, ${scrollProgress * 0.1})`,
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
                    className={`font-black text-xl transition-colors hover:text-orange-500`}
                    style={{
                      color: getTextColor(isActive("/")),
                    }}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/anime-search"
                    className={`font-bold text-xl transition-colors hover:text-orange-500`}
                    style={{
                      color: getTextColor(isActive("/anime-search")),
                    }}
                  >
                    애니 검색
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            {state.isAuthenticated ? (
              <AvatarDropdown
                openLoginModal={openLoginModal}
                isAnimeSearch={isFixedHeader}
                isProfilePage={location.pathname === "/profile"}
                isEvaluationPage={location.pathname === "/evaluation"}
                scrollProgress={scrollProgress}
              />
            ) : (
              <button
                onClick={openLoginModal}
                className="font-bold text-xl transition-colors hover:text-orange-500"
                style={{ color: getTextColor(false) }}
              >
                로그인/가입
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
