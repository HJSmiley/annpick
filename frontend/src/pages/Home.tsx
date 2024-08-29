import React, { useState, useEffect } from "react";
import axios from "axios";
import PromotionBanner from "../components/promotion/PromotionBanner";
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

        const sections = getAnimeSections();
        console.log("Sections:", sections); // 로깅 추가

        const responsePromises = sections.map(async (section) => {
          const ids = section.ids.join(",");
          const response = await axios.get<AnimeData[]>(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/cards?ids=${ids}`
          );

          console.log(
            "Response data for section:",
            section.title,
            response.data
          ); // 로깅 추가

          // 데이터를 anime_id 순서에 맞게 정렬하고 undefined 제거
          const sortedAnimes = section.ids
            .map((id) => {
              const anime = response.data.find(
                (anime) => anime.anime_id === id
              ); // anime_id 사용
              console.log("Found anime for id:", id, anime); // 로깅 추가
              return anime;
            })
            .filter((anime): anime is AnimeData => anime !== undefined);

          console.log(
            "Sorted animes for section:",
            section.title,
            sortedAnimes
          ); // 로깅 추가

          return {
            title: section.title,
            animes: sortedAnimes,
          };
        });

        const fetchedSections = await Promise.all(responsePromises);
        console.log("Fetched sections:", fetchedSections); // 로깅 추가
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
