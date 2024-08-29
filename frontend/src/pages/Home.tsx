import React, { useState, useEffect } from "react";
import axios from "axios";
import PromotionBanner from "../components/promotion/PromotionBanner";
import AnimeList from "../components/anime/AnimeList";
import { AnimeData } from "../types/anime";
import { getAnimeSections } from "../services/sections";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/auth/LoginModal";

const Home: React.FC = () => {
  const { state } = useAuth();
  const [animeSections, setAnimeSections] = useState<
    { title: string; animes: AnimeData[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setIsLoading(true);

        const sections = getAnimeSections();
        const apiEndpoint = state.isAuthenticated
          ? "/api/v1/anime/cards"
          : "/api/v1/anime/public/cards";

        const headers = state.isAuthenticated
          ? { Authorization: `Bearer ${state.token}` }
          : {};

        const responsePromises = sections.map(async (section) => {
          const ids = section.ids.join(",");
          const response = await axios.get<AnimeData[]>(
            `${process.env.REACT_APP_BACKEND_URL}${apiEndpoint}?ids=${ids}`,
            { headers }
          );

          const sortedAnimes = section.ids
            .map((id) => response.data.find((anime) => anime.anime_id === id))
            .filter((anime): anime is AnimeData => anime !== undefined);

          return {
            title: section.title,
            animes: sortedAnimes,
          };
        });

        const fetchedSections = await Promise.all(responsePromises);
        setAnimeSections(fetchedSections);
      } catch (err) {
        console.error("Error fetching anime data:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
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
    <div>
      <div className="relative h-[90vh]">
        <PromotionBanner />
      </div>
      <div className="bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
          {animeSections.map((section, index) => (
            <div key={index} className="mb-12">
              <h1 className="text-3xl font-bold mb-4 text-left">
                {section.title}
              </h1>
              <AnimeList
                animes={section.animes}
                onRatingClick={handleRatingClick}
                isModalOpen={isModalOpen}
              />
            </div>
          ))}
        </div>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
