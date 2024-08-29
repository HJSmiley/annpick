import React, { useState, useEffect } from "react";
import axios from "axios";
import PromotionBanner from "../components/PromotionBanner";
import AnimeList from "../components/anime/AnimeList";
import { AnimeData } from "../types/anime";
import { getAnimeSections } from "../services/sections";

const Home: React.FC = () => {
  const [animeSections, setAnimeSections] = useState<
    { title: string; animes: AnimeData[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setIsLoading(true);
        // 섹션 데이터를 utils에서 가져옴
        const sections = getAnimeSections();

        const responsePromises = sections.map(async (section) => {
          const ids = section.ids.join(",");
          const response = await axios.get<AnimeData[]>(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/cards?ids=${ids}`
          );
          return {
            title: section.title,
            animes: response.data,
          };
        });

        const fetchedSections = await Promise.all(responsePromises);
        setAnimeSections(fetchedSections);
      } catch (err) {
        console.error("Error fetching anime data:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <div className="relative h-[90vh]">
        <PromotionBanner />
      </div>
      <div className="bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
          {animeSections.map((section, index) => (
            <div key={index} className="mb-8">
              <h1 className="text-3xl font-bold mb-4 text-left">
                {section.title}
              </h1>
              <AnimeList animes={section.animes} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
