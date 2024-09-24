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
import TermsOfService from "./pages/terms/TermsOfService";
import PrivacyPolicy from "./pages/terms/PrivacyPolicy";
import MarketingAgreement from "./pages/terms/MarketingAgreement";
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

  // 인증 로딩 중일 때는 로딩 스피너를 보여줍니다.
  if (state.loading) {
    return <LoadingSpinner />;
  }

  // 인증되지 않은 경우에는 리다이렉트
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 인증된 경우에만 해당 페이지 렌더링
  return <>{children}</>;
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
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route
                  path="/marketing-agreement"
                  element={<MarketingAgreement />}
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-ratings"
                  element={
                    <ProtectedRoute>
                      <MyRatings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-picks"
                  element={
                    <ProtectedRoute>
                      <MyPicks />
                    </ProtectedRoute>
                  }
                />
                <Route path="/anime-search" element={<AnimeSearch />} />
                <Route path="/anime/:id" element={<AnimeDetail />} />
                <Route path="/evaluation" element={<EvaluationPage />} />
                {/* /not-found 경로로 리다이렉트 */}
                <Route
                  path="*"
                  element={<Navigate to="/not-found" replace />}
                />
                <Route path="/not-found" element={<NotFound />} />
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
