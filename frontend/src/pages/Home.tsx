// Home.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import PromotionBanner from "../components/promotion/PromotionBanner";
import AnimeList from "../components/anime/AnimeList";
import { AnimeData } from "../types/anime";
import { getAnimeSections } from "../configs/sections";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/auth/LoginModal";

const Home: React.FC = () => {
  const { state } = useAuth();
  const [animeSections, setAnimeSections] = useState<
    { title: string; animes: AnimeData[]; preference_score?: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setIsLoading(true);

        const headers = state.isAuthenticated
          ? { Authorization: `Bearer ${state.token}` }
          : {};

        if (state.isAuthenticated) {
          // 인증된 사용자일 경우 추천 섹션을 가져옵니다.
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/recommendations`,
            { headers }
          );

          if (response.data.length > 0) {
            // 추천 섹션이 있을 경우 해당 섹션을 사용합니다.
            const fetchedSections = await fetchRecommendedSectionsData(
              response.data,
              headers
            );
            setAnimeSections(fetchedSections);
          } else {
            // 추천 섹션이 없을 경우 기본 섹션을 사용합니다.
            const sections = getAnimeSections();
            const fetchedSections = await fetchSectionsData(sections, headers);
            setAnimeSections(fetchedSections);
          }
        } else {
          // 비회원일 경우 기본 섹션을 사용합니다.
          const sections = getAnimeSections();
          const fetchedSections = await fetchSectionsData(sections, headers);
          setAnimeSections(fetchedSections);
        }
      } catch (err) {
        console.error("애니메이션 데이터를 가져오는 중 오류 발생:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, [state.isAuthenticated, state.token]);

  // 추천 섹션의 애니메이션 데이터를 가져오는 함수
  const fetchRecommendedSectionsData = async (
    sections: { title: string; ids: number[]; preference_score?: number }[],
    headers: any
  ) => {
    const responsePromises = sections.map(async (section) => {
      const ids = section.ids.join(",");
      const response = await axios.get<AnimeData[]>(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/cards?ids=${ids}`,
        { headers }
      );

      const sortedAnimesPromises = section.ids.map(async (id) => {
        const anime = response.data.find((anime) => anime.anime_id === id);
        if (!anime) {
          console.warn(
            `섹션 "${section.title}"에서 ID가 ${id}인 애니메이션을 찾을 수 없습니다.`
          );
        }
        return anime;
      });

      const sortedAnimes = await Promise.all(sortedAnimesPromises);

      return {
        title: section.title,
        animes: sortedAnimes.filter(
          (anime): anime is AnimeData => anime !== undefined
        ),
        preference_score: section.preference_score, // preference_score 추가
      };
    });

    const fetchedSections = await Promise.all(responsePromises);
    return fetchedSections;
  };

  // 섹션의 애니메이션 데이터를 가져오는 함수
  const fetchSectionsData = async (
    sections: { title: string; ids: number[] }[],
    headers: any
  ) => {
    const apiEndpoint = state.isAuthenticated
      ? "/api/v1/anime/cards"
      : "/api/v1/anime/public/cards";

    const responsePromises = sections.map(async (section) => {
      const ids = section.ids.join(",");
      const response = await axios.get<AnimeData[]>(
        `${process.env.REACT_APP_BACKEND_URL}${apiEndpoint}?ids=${ids}`,
        { headers }
      );

      const sortedAnimesPromises = section.ids.map(async (id) => {
        const anime = response.data.find((anime) => anime.anime_id === id);
        if (!anime) {
          console.warn(
            `섹션 "${section.title}"에서 ID가 ${id}인 애니메이션을 찾을 수 없습니다.`
          );
          if (!state.isAuthenticated) {
            // 비로그인 상태에서 public 엔드포인트로 데이터 가져오기
            const publicResponse = await axios.get<AnimeData>(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/public/details/${id}`
            );
            return publicResponse.data;
          }
        }
        return anime;
      });

      const sortedAnimes = await Promise.all(sortedAnimesPromises);

      return {
        title: section.title,
        animes: sortedAnimes.filter(
          (anime): anime is AnimeData => anime !== undefined
        ),
      };
    });

    const fetchedSections = await Promise.all(responsePromises);
    return fetchedSections;
  };

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
                {section.title}{" "}
                {section.preference_score !== undefined && (
                  <span className="text-sm text-gray-500">
                    ({section.preference_score.toFixed(1)}%)
                  </span>
                )}
              </h1>
              <AnimeList
                animes={section.animes}
                onRatingClick={handleRatingClick}
                isModalOpen={isModalOpen}
              />
              {index === 1 && (
                // 두 번째 섹션 아래에 stripbanner.svg 추가
                <div className="mt-8">
                  <img src="/images/stripbanner.svg" alt="Strip Banner" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
