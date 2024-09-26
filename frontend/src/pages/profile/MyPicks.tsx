import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import AnimeCard from "../../components/anime/AnimeCard";
import { AnimeData } from "../../types/anime";
import LoginModal from "../../components/auth/LoginModal";
import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";

interface PickData {
  anime_id: number;
  is_picked: boolean;
}

const MyPicks: React.FC = () => {
  const { state } = useAuth();
  const [pickedAnimes, setPickedAnimes] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const fetchPickedAnimeData = async () => {
      try {
        setIsLoading(true);

        const headers = state.isAuthenticated
          ? { Authorization: `Bearer ${state.token}` }
          : {};

        const picksResponse = await axios.get<PickData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/picks`,
          { headers }
        );

        const pickData = picksResponse.data;

        if (pickData.length === 0) {
          setPickedAnimes([]);
          return;
        }

        const animeIds = pickData.map((pick) => pick.anime_id).join(",");
        const animeResponse = await axios.get<AnimeData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/cards?ids=${animeIds}`,
          { headers }
        );

        const animeData = animeResponse.data;
        setPickedAnimes(animeData);
      } catch (err) {
        console.error("픽한 애니메이션 데이터 가져오기 오류:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchPickedAnimeData();
    }
  }, [state.isAuthenticated, state.token]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePickClick = () => {
    if (!state.isAuthenticated) {
      setIsModalOpen(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading)
    return <div className="mt-28 mb-8 text-center">로딩 중...</div>;
  if (error) return <div className="mt-28 mb-8 text-center">에러: {error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-12">
      <h1 className="text-2xl font-bold mb-6">픽한 애니메이션</h1>
      {pickedAnimes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {pickedAnimes.map((anime, index) => (
            <motion.div
              key={anime.anime_id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <AnimeCard
                {...anime}
                index={index + 1}
                onRatingClick={handlePickClick}
                isModalOpen={isModalOpen}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-gray-500 text-center mb-10">
          픽한 애니메이션이 없어요
        </div>
      )}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-6 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-20
 text-orange-600 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-orange-400 
 transition-all duration-300 z-50"
          aria-label="맨 위로 스크롤"
        >
          <ArrowUpCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default MyPicks;
