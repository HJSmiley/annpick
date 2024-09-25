import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import LoginModal from "../../components/auth/LoginModal";

interface Staff {
  name: string;
  role: string;
}

interface AnimeDetails {
  anime_id: number;
  title: string;
  thumbnail_url: string;
  banner_img_url: string | null;
  format: string;
  status: string;
  release_date: string;
  description: string;
  season: string;
  studio: string;
  genres: string[];
  tags: string[];
  staff: Staff[];
  user_rating: number | null;
}

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAuth();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 서버에 평점 보내기
  const sendRatingToServer = async (animeId: number, rating: number) => {
    try {
      const token = state.isAuthenticated ? state.token : null;

      if (!token) {
        throw new Error("No token found, please log in again.");
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            anime_id: animeId,
            rating: rating, // 5점 만점으로 값을 전달
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send rating, status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error sending rating:", error);
    }
  };

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);

        const apiEndpoint = state.isAuthenticated
          ? `/api/v1/anime/details/${id}`
          : `/api/v1/anime/public/details/${id}`;

        const headers = state.isAuthenticated
          ? { Authorization: `Bearer ${state.token}` }
          : {};

        const response = await axios.get<AnimeDetails>(
          `${process.env.REACT_APP_BACKEND_URL}${apiEndpoint}`,
          { headers }
        );

        if (response.data) {
          setAnime(response.data);
          setRating(response.data.user_rating || 0);
        }
      } catch (error) {
        setError("Failed to fetch anime details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id, state.isAuthenticated, state.token]);

  useEffect(() => {
    if (!isResetting) {
      setHover(rating);
    }
  }, [isResetting, rating]);

  const handleRating = useCallback(
    (currentRating: number) => {
      if (!state.isAuthenticated) {
        setIsModalOpen(true);
        return;
      }

      if (rating === currentRating || currentRating <= rating) {
        setIsResetting(true);
        setRating(0);
        setHover(0);
        sendRatingToServer(parseInt(id!), 0); // 평점 0으로 설정
        setTimeout(() => setIsResetting(false), 50);
      } else {
        setRating(currentRating);
        sendRatingToServer(parseInt(id!), currentRating); // 선택한 평점으로 서버 업데이트
      }
    },
    [rating, id, state.isAuthenticated]
  );

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const fullStarValue = index + 1; // 한 개 별은 1, 2, 3, 4, 5로 처리
      const halfStarValue = index + 0.5; // 반 개 별은 0.5, 1.5, 2.5, 3.5, 4.5로 처리
      const currentValue = isResetting ? 0 : hover || rating;

      return (
        <div key={index} className="inline-block">
          <span className="relative inline-block w-8 h-8 mx-0.5 sm:w-10 sm:h-10">
            {currentValue >= fullStarValue ? (
              <FaStar className="w-full h-full text-yellow-400" />
            ) : currentValue >= halfStarValue ? (
              <FaStarHalfAlt className="w-full h-full text-yellow-400" />
            ) : (
              <FaStar className="w-full h-full text-gray-200" />
            )}
            <div
              className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
              onClick={() => handleRating(halfStarValue)} // 반 개 별 클릭
              onMouseEnter={() => !isResetting && setHover(halfStarValue)}
              onMouseLeave={() => !isResetting && setHover(rating)}
            />
            <div
              className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
              onClick={() => handleRating(fullStarValue)} // 한 개 별 클릭
              onMouseEnter={() => !isResetting && setHover(fullStarValue)}
              onMouseLeave={() => !isResetting && setHover(rating)}
            />
          </span>
        </div>
      );
    });
  };

  if (loading) return <div className="mt-28 mb-8 text-center">로딩 중...</div>;
  if (error) return <div className="mt-28 mb-8 text-center">에러: {error}</div>;

  const originStaff = anime?.staff.find((staff) => staff.role === "원작");
  const directorStaff = anime?.staff.find((staff) => staff.role === "감독");

  return (
    <div className="relative">
      {anime?.banner_img_url ? (
        <div
          className="relative h-[70vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${anime.banner_img_url})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end px-4 md:px-8 lg:px-16 pb-8">
            <h1 className="text-white text-4xl font-bold">{anime.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <span className="border border-white border-opacity-50 px-2 py-1 rounded-lg text-xs text-white">
                {anime.format}
              </span>
              <span className="bg-orange-500 px-2 py-1 rounded-lg text-xs text-white">
                {anime.status}
              </span>
              <span className="text-white">{anime.genres.join(", ")}</span>
            </div>
            <div className="flex items-center space-x-1 mt-2">
              {renderStars()}
              <span className="text-white ml-2">{rating} / 5</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-[70vh] flex">
          <div className="w-[40%] bg-black"></div>
          <div
            className="w-[60%] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%), url(${anime?.thumbnail_url})`,
              backgroundPosition: "center center",
            }}
          ></div>
          <div className="absolute inset-0 flex flex-col justify-end px-4 md:px-8 lg:px-16 pb-8">
            <h1 className="text-white text-4xl font-bold">{anime?.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <span className="border border-white border-opacity-50 px-2 py-1 rounded-lg text-xs text-white">
                {anime?.format}
              </span>
              <span className="bg-orange-500 px-2 py-1 rounded-lg text-xs text-white">
                {anime?.status}
              </span>
              <span className="text-white">{anime?.genres.join(", ")}</span>
            </div>
            <div className="flex items-center space-x-1 mt-2">
              {renderStars()}
              <span className="text-white ml-2">{rating} / 10</span>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">줄거리</h2>
            <p className="text-lg mb-4">{anime?.description}</p>
            <div className="flex flex-wrap gap-2">
              {anime?.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-700 bg-opacity-50 px-2 py-1 rounded-lg text-xs text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">제작사</h3>
              <p>{anime?.studio}</p>
            </div>
            {originStaff && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold">원작</h3>
                <p>{originStaff.name}</p>
              </div>
            )}
            {directorStaff && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold">감독</h3>
                <p>{directorStaff.name}</p>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">출시</h3>
              <p>{anime?.season}</p>
            </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AnimeDetail;
