import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AnimeList from "../components/anime/AnimeList";
import AnimeCard from "../components/anime/AnimeCard";
import { AnimeData } from "../types/anime";
import LoginModal from "../components/auth/LoginModal";

interface RatingData {
  anime_id: number;
  rating: number;
}

interface AnimeSection {
  rating: number;
  animes: AnimeData[];
  isExpanded: boolean;
}

const MyRatings: React.FC = () => {
  const { state } = useAuth();
  const [animeSections, setAnimeSections] = useState<AnimeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const ratingOrder = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1];

  useEffect(() => {
    const fetchRatedAnimeData = async () => {
      try {
        setIsLoading(true);

        const headers = state.isAuthenticated
          ? { Authorization: `Bearer ${state.token}` }
          : {};

        const ratingsResponse = await axios.get<RatingData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/ratings`,
          { headers }
        );

        const ratingData = ratingsResponse.data;

        const animeIds = ratingData.map((rating) => rating.anime_id).join(",");
        const animeResponse = await axios.get<AnimeData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/cards?ids=${animeIds}`,
          { headers }
        );

        const animeData = animeResponse.data;

        const groupedByRating = ratingOrder.map((rating) => ({
          rating,
          animes: animeData.filter((anime) =>
            ratingData.some(
              (r) => r.anime_id === anime.anime_id && r.rating === rating
            )
          ),
          isExpanded: false,
        }));

        setAnimeSections(groupedByRating);
      } catch (err) {
        console.error("애니메이션 데이터 불러오기 오류:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchRatedAnimeData();
    }
  }, [state.isAuthenticated, state.token]);

  const handleRatingClick = () => {
    if (!state.isAuthenticated) {
      setIsModalOpen(true);
    }
  };

  const toggleExpand = (index: number) => {
    setAnimeSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, isExpanded: !section.isExpanded } : section
      )
    );
  };

  const handlePickStatusChange = useCallback((animeId: number, isPicked: boolean) => {
    console.log(`Anime ${animeId} pick status changed to ${isPicked}`);
    // 여기에 픽 상태 변경에 대한 추가 로직을 구현할 수 있습니다.
  }, []);

  if (isLoading)
    return <div className="mt-28 mb-8 text-center">로딩 중...</div>;
  if (error) return <div className="mt-28 mb-8 text-center">에러: {error}</div>;

  return (
    <div className="container mx-auto px-4 mt-28">
      <h1 className="text-2xl font-bold mb-4">내 평가</h1>
      {animeSections.map((section, sectionIndex) => (
        <div key={section.rating} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{section.rating}점</h2>
            {section.animes.length > 0 && (
              <button
                onClick={() => toggleExpand(sectionIndex)}
                className="text-orange-500 font-bold py-1 px-3 rounded text-sm hover:text-orange-700 mr-5"
              >
                {section.isExpanded ? "접기" : "더보기"}
              </button>
            )}
          </div>
          {section.animes.length > 0 ? (
            section.isExpanded ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {section.animes.map((anime, index) => (
                  <AnimeCard
                    key={anime.anime_id}
                    {...anime}
                    index={index + 1}
                    onRatingClick={handleRatingClick}
                    isModalOpen={isModalOpen}
                    onPickStatusChange={handlePickStatusChange}
                  />
                ))}
              </div>
            ) : (
              <AnimeList
                animes={section.animes}
                onRatingClick={handleRatingClick}
                isModalOpen={isModalOpen}
                showSwipeButtons={true}
              />
            )
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">평가한 애니메이션이 없어요</p>
            </div>
          )}
        </div>
      ))}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MyRatings;