import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import AnimeSearch from './components/anime/AnimeSearch';
import AnimeDetail from './pages/AnimeDetail';
import Home from './pages/Home';

const Login: React.FC = () => <h1>로그인/가입</h1>;

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header openLoginModal={openLoginModal} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home openLoginModal={openLoginModal} />} />
            <Route path="/anime-search" element={<AnimeSearch/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
          </Routes>
        </main>
        <Footer />
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      </div>
    </Router>
  );
};

export default App;