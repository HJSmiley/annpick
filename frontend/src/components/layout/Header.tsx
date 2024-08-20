import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-black">엔픽</Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    to="/" 
                    className={`hover:text-orange-500 transition-colors ${isActive('/') ? 'text-orange-500' : 'text-gray-500'}`}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/anime-search" 
                    className={`hover:text-orange-500 transition-colors ${isActive('/anime-search') ? 'text-orange-500' : 'text-gray-500'}`}
                  >
                    애니 검색
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <Link 
              to="/login" 
              className={`hover:text-orange-500 transition-colors ${isActive('/login') ? 'text-orange-500' : 'text-gray-500'}`}
            >
              로그인/가입
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;