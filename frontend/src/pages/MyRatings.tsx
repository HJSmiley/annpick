import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AnimeList from "../components/anime/AnimeList";
import { AnimeData } from "../types/anime";
import LoginModal from "../components/auth/LoginModal";

interface RatingData {
  anime_id: number;
  rating: number;
}

const MyRatings: React.FC = () => {
  const { state } = useAuth();
  const [animeSections, setAnimeSections] = useState<
    { rating: number; animes: AnimeData[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchRatedAnimeData = async () => {
      try {
        setIsLoading(true);

        // 로그인된 사용자일 경우 토큰 포함
        const headers = state.isAuthenticated
          ? { Authorization: `Bearer ${state.token}` }
          : {};

        // 1. 별점 데이터를 가져옴
        const ratingsResponse = await axios.get<RatingData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/ratings`,
          { headers }
        );

        const ratingData = ratingsResponse.data;

        // 2. 각 별점에 해당하는 애니메이션 카드 데이터를 가져옴
        const animeIds = ratingData.map((rating) => rating.anime_id).join(",");
        const animeResponse = await axios.get<AnimeData[]>(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/cards?ids=${animeIds}`,
          { headers }
        );

        const animeData = animeResponse.data;

        // 3. 별점 정보를 애니메이션 정보와 합침
        const groupedByRating = ratingData.reduce(
          (sections, { anime_id, rating }) => {
            const anime = animeData.find(
              (anime) => anime.anime_id === anime_id
            );
            if (!anime) return sections;

            let section = sections.find((s) => s.rating === rating);
            if (!section) {
              section = { rating, animes: [] };
              sections.push(section);
            }
            section.animes.push(anime);
            return sections;
          },
          [] as { rating: number; animes: AnimeData[] }[]
        );

        setAnimeSections(groupedByRating);
      } catch (err) {
        console.error("Error fetching anime data:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred."
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

  if (isLoading)
    return <div className="mt-28 mb-8 text-center">로딩 중...</div>;
  if (error) return <div className="mt-28 mb-8 text-center">에러: {error}</div>;

  return (
    <div className="container mx-auto px-4 mt-28">
      <h1 className="text-2xl font-bold mb-4">내 평가</h1>
      {animeSections.map((section) => (
        <div key={section.rating} className="mb-12">
          <h2 className="text-xl font-semibold mb-4">{section.rating}점</h2>
          <AnimeList
            animes={section.animes}
            onRatingClick={handleRatingClick}
            isModalOpen={isModalOpen}
          />
        </div>
      ))}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MyRatings;
