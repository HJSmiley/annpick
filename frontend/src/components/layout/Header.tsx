import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// HeaderProps 인터페이스 정의
interface HeaderProps {
  openLoginModal: () => void; // 로그인 모달을 여는 함수
}

const Header: React.FC<HeaderProps> = ({ openLoginModal }) => {
  const location = useLocation(); // 현재 라우트 위치
  const { state } = useAuth(); // 인증 상태 가져오기
  const [scrollProgress, setScrollProgress] = useState(0); // 스크롤 진행도 (0~1)

  // 스크롤 이벤트 리스너 설정
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight / 2; // 최대 스크롤 값을 화면 높이의 절반으로 설정
      const progress = Math.min(scrollY / maxScroll, 1); // 스크롤 진행도 계산 (0~1)
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 현재 경로가 활성화된 경로인지 확인하는 함수
  const isActive = (path: string) => location.pathname === path;

  // 텍스트 색상을 계산하는 함수
  const getTextColor = (isActiveLink: boolean) => {
    if (isActiveLink) return "text-orange-500"; // 활성 링크는 항상 주황색
    // 스크롤 진행에 따라 흰색(255)에서 검은색(0)으로 변화
    const colorValue = Math.round(255 - scrollProgress * 255);
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px]`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${scrollProgress})`, // 배경색 투명도 조절
        boxShadow: `0 2px 4px rgba(0, 0, 0, ${scrollProgress * 0.1})`, // 그림자 효과 조절
      }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center space-x-8">
            {/* 로고 링크 */}
            <Link to="/" className="flex items-center">
              <img
                src="/images/anpicktest.svg"
                alt="앤픽 로고"
                className="w-[80px] h-[40px]"
              />
            </Link>
            {/* 네비게이션 메뉴 */}
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
                        : getTextColor(false), // 활성 링크는 주황색, 아니면 동적 색상
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
          {/* 로그인/가입 버튼 또는 프로필 버튼 */}
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
