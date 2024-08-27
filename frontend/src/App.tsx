import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/error/ErrorBoundary';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const AnimeSearch = lazy(() => import('./pages/AnimeSearch'));
const AnimeDetail = lazy(() => import('./pages/AnimeDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Layout component
const Layout: React.FC<{ children: React.ReactNode; openLoginModal: () => void }> = ({ children, openLoginModal }) => {
  return (
    <>
      <Header openLoginModal={openLoginModal} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  
  if (state.loading) {
    return <LoadingSpinner />;
  }
  
  return state.isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout openLoginModal={openLoginModal}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/anime-search" element={<AnimeSearch />} />
                <Route path="/anime/:id" element={<AnimeDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;