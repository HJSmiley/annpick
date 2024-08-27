import React, { useState, useEffect } from 'react';
import PromotionBanner from '../components/PromotionBanner';
import AnimeList from '../components/anime/AnimeList';
import { Anime } from '../types/anime';

const Home: React.FC = () => {
  const [animeSections, setAnimeSections] = useState<{ title: string; animes: Anime[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setIsLoading(true);
        // 더미 데이터 생성 (총 15개의 애니메이션)
        const dummyData = [
          {
            title: "인기 애니메이션 Top 15",
            animes: Array(15).fill(null).map((_, index) => ({
              id: index,
              title: `애니메이션 ${index + 1}`,
              image: `https://via.placeholder.com/150?text=Anime${index + 1}`,
            }))
          },
        ];
        setAnimeSections(dummyData);
      } catch (err) {
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