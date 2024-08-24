import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  openLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openLoginModal }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[100px]
        ${isScrolled ? 'bg-white shadow' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <svg width="150" height="60" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="150" height="60" fill="#FF6B6B"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">엔픽 로고</text>
              </svg>
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    to="/"
                    className={`hover:text-orange-500 transition-colors ${
                      isActive('/') ? 'text-orange-500' : isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/anime-search"
                    className={`hover:text-orange-500 transition-colors ${
                      isActive('/anime-search') ? 'text-orange-500' : isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                  >
                    애니 검색
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <button
              onClick={openLoginModal}
              className={`hover:text-orange-500 transition-colors ${
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