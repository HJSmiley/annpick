import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import PromotionBanner from './components/PromotionBanner';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import AnimeSearch from './components/anime/AnimeSearch';

const Home: React.FC = () => (
  <>
    <PromotionBanner />
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
      <h1 className="text-3xl font-bold mb-4">Latest Animations</h1>
      {/* Add more content here */}
    </div>
  </>
);

const Login: React.FC = () => <h1>로그인/가입</h1>;

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header openLoginModal={openLoginModal} />
        <main className="flex-grow pt-16"> {/* Added top padding to account for fixed header */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime-search" element={<AnimeSearch />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      </div>
    </Router>
  );
};

export default App;