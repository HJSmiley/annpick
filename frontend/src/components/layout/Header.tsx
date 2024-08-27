import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  openLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openLoginModal }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 리스너를 추가하여 페이지 스크롤 상태를 감지합니다.
  useEffect(() => {
    const handleScroll = () => {
      // 페이지가 화면 높이의 절반 이상 스크롤되면 isScrolled를 true로 설정합니다.
      if (window.scrollY > window.innerHeight / 2) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 현재 활성화된 링크를 확인하는 함수입니다.
  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px]
        ${isScrolled ? 'bg-white shadow' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center space-x-8">
            {/* 로고 링크 */}
            <Link to="/" className="flex items-center">
              <img src= "/anpicktest.svg" alt= "앤픽 로고" className="w-[80px] h-[40px]"/>
              {/* <svg width="120" height="60" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="150" height="60" fill="#FF6B6B"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">엔픽 로고</text>
              </svg> */}
            </Link>
            {/* 네비게이션 메뉴 */}
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    to="/"
                    className={`font-black text-xl hover:text-orange-500 transition-colors ${
                      isActive('/') ? 'text-orange-500' : isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/anime-search"
                    className={`font-bold text-xl hover:text-orange-500 transition-colors ${
                      isActive('/anime-search') ? 'text-orange-500' : isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                  >
                    애니 검색
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* 로그인/가입 버튼 */}
          <div>
            <button
              onClick={openLoginModal}
              className={`font-bold text-xl hover:text-orange-500 transition-colors ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              로그인/가입
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;