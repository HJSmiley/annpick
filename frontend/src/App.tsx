import React, { useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoginModal from "./components/auth/LoginModal";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/error/ErrorBoundary";
import MyRatings from "./pages/MyRatings";
import MyPicks from "./pages/MyPicks";
import EvaluationPage from "./pages/EvaluationPage";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const AnimeSearch = lazy(() => import("./pages/AnimeSearch"));
const AnimeDetail = lazy(() => import("./pages/AnimeDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Layout component
const Layout: React.FC<{
  children: React.ReactNode;
  openLoginModal: () => void;
}> = ({ children, openLoginModal }) => {
  const location = useLocation(); // 현재 경로를 가져옴

  return (
    <>
      <Header openLoginModal={openLoginModal} />
      <main>{children}</main>
      {/* /evaluation 경로가 아닐 때만 푸터를 렌더링 */}
      {location.pathname !== "/evaluation" && <Footer />}
    </>
  );
};
// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
      <Router>
        <AuthProvider>
          <Layout openLoginModal={openLoginModal}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/anime-search" element={<AnimeSearch />} />
                <Route path="/anime/:id" element={<AnimeDetail />} />{" "}
                <Route path="/my-ratings" element={<MyRatings />} />
                <Route path="/my-picks" element={<MyPicks />} />
                <Route path="/evaluation" element={<EvaluationPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
