import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PromotionBanner from '../components/PromotionBanner';
import AnimeList from '../components/anime/AnimeList';
import { AnimeData } from '../types/anime';

const Home: React.FC = () => {
  const [animeSections, setAnimeSections] = useState<{ title: string; animes: AnimeData[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setIsLoading(true);
        const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].join(',');
        const response = await axios.get<AnimeData[]>(`http://3.36.94.230:8000/api/v1/animecards?ids=${ids}`);
        const animeData = response.data;

        const section = {
          title: "인기 애니메이션 Top 15",
          animes: animeData
        };

        setAnimeSections([section]);
      } catch (err) {
        console.error('Error fetching anime data:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
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
              <h1 className="text-3xl font-bold mb-4 text-left">{section.title}</h1>
              <AnimeList animes={section.animes} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;