import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import AnimeList from "../../components/anime/AnimeList";
import { AnimeData } from "../../types/anime";
import LoginModal from "../../components/auth/LoginModal";

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

  useEffect(() => {
    const fetchPickedAnimeData = async () => {
      try {
        setIsLoading(true);

        // 로그인된 사용자일 경우 토큰 포함
        const headers = state.isAuthenticated
          ? { Authorization: `Bearer ${state.token}` }
          : {};

        // 1. 사용자가 픽한 애니메이션 데이터를 가져옴
        const picksResponse = await axios.get<PickData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/picks`,
          { headers }
        );

        const pickData = picksResponse.data;

        if (pickData.length === 0) {
          setPickedAnimes([]);
          return;
        }

        // 2. 픽한 애니메이션의 ID로 애니메이션 카드 데이터를 가져옴
        const animeIds = pickData.map((pick) => pick.anime_id).join(",");
        const animeResponse = await axios.get<AnimeData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/cards?ids=${animeIds}`,
          { headers }
        );

        const animeData = animeResponse.data;
        setPickedAnimes(animeData);
      } catch (err) {
        console.error("Error fetching picked anime data:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchPickedAnimeData();
    }
  }, [state.isAuthenticated, state.token]);

  const handlePickClick = () => {
    if (!state.isAuthenticated) {
      setIsModalOpen(true);
    }
  };

  if (isLoading)
    return <div className="mt-28 mb-8 text-center">로딩 중...</div>;
  if (error) return <div className="mt-28 mb-8 text-center">에러: {error}</div>;

  return (
    <div className="container mx-auto px-16 mt-28 mb-12">
      <h1 className="text-2xl font-bold mb-4">픽한 애니메이션</h1>
      {pickedAnimes.length > 0 ? (
        <AnimeList
          animes={pickedAnimes}
          onRatingClick={handlePickClick}
          isModalOpen={isModalOpen}
        />
      ) : (
        <div className="text-gray-500 text-center mb-10">
          픽한 애니메이션이 없어요
        </div>
      )}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MyPicks;
