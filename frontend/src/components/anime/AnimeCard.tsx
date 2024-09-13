import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { ReactComponent as ArrowIcon } from "../../assets/icons/ic_next.svg";
import { ReactComponent as AddIcon } from "../../assets/icons/Boolean=pick.svg";
import { ReactComponent as PickedIcon } from "../../assets/icons/Boolean=picked.svg";
import { AnimeData } from "../../types/anime";
import { useAuth } from "../../contexts/AuthContext";

interface AnimeCardProps extends AnimeData {
  index: number;
  onRatingClick?: () => void;
  isModalOpen?: boolean;
  onPickStatusChange?: (animeId: number, isPicked: boolean) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  anime_id,
  title,
  thumbnail_url,
  format,
  status,
  genres = [],
  tags = [],
  onRatingClick,
  isModalOpen,
  onPickStatusChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [isPicked, setIsPicked] = useState(false);
  const { state } = useAuth();

  const fetchAnimeDataFromServer = async (animeId: number) => {
    try {
      if (!state.isAuthenticated) {
        return null;
      }

      const token = state.token;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/details/${animeId}`,
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        }
      );

      if (response.status === 401) {
        console.error("Unauthorized: Invalid or expired token.");
        return null;
      }

      const data = await response.json();
      return {
        userRating: data.user_rating,
        isPicked: data.is_picked, // 픽하기 정보 추가
      };
    } catch (error) {
      console.error("Error fetching anime data:", error);
      return null;
    }
  };

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
            rating: rating,
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

  // Pick 상태 변경을 처리하는 함수 (경로 변경됨)
  const sendPickStatusToServer = async (animeId: number, isPicked: boolean) => {
    try {
      if (!state.isAuthenticated) {
        throw new Error("No token found, please log in again.");
      }

      const token = state.token;

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/picks`, // 경로 수정
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            anime_id: animeId,
            is_picked: isPicked,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to send pick status, status: ${response.status}`
        );
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error sending pick status:", error);
    }
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const response = await fetchAnimeDataFromServer(anime_id);
        if (response !== null) {
          setRating(response.userRating);
          setIsPicked(response.isPicked);
        }
      } catch (error) {
        console.error("Failed to fetch anime data:", error);
      }
    };

    fetchAndSetData();
  }, [anime_id]);

  useEffect(() => {
    if (!isHovered) {
      setHover(0);
    }
  }, [isHovered]);

  const handleRating = useCallback(
    (currentRating: number) => {
      if (!state.isAuthenticated) {
        onRatingClick?.();
        return;
      }

      if (rating === currentRating || currentRating <= rating) {
        setIsResetting(true);
        setRating(0);
        setHover(0);
        sendRatingToServer(anime_id, 0);
        setTimeout(() => setIsResetting(false), 50);
      } else {
        setRating(currentRating);
        sendRatingToServer(anime_id, currentRating);
      }
    },
    [rating, anime_id, state.isAuthenticated, onRatingClick]
  );

  const handlePickClick = useCallback(() => {
    if (!state.isAuthenticated) {
      onRatingClick?.();
      return;
    }

    const newPickStatus = !isPicked;
    setIsPicked(newPickStatus);
    sendPickStatusToServer(anime_id, newPickStatus);
    onPickStatusChange?.(anime_id, newPickStatus);
  }, [
    state.isAuthenticated,
    isPicked,
    anime_id,
    onRatingClick,
    onPickStatusChange,
  ]);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const fullStarValue = index + 1;
      const halfStarValue = index + 0.5;
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
              onClick={() => handleRating(halfStarValue)}
              onMouseEnter={() => !isResetting && setHover(halfStarValue)}
              onMouseLeave={() => !isResetting && setHover(rating)}
            />
            <div
              className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
              onClick={() => handleRating(fullStarValue)}
              onMouseEnter={() => !isResetting && setHover(fullStarValue)}
              onMouseLeave={() => !isResetting && setHover(rating)}
            />
          </span>
        </div>
      );
    });
  };

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-2xl shadow-lg aspect-[3/4]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isModalOpen && setIsHovered(false)}
      >
        <img
          src={thumbnail_url}
          alt={title}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-80 text-white pt-3 pl-3 flex flex-col">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-3 pt-[35px] pl-[10px]">
                <div className="flex space-x-2">
                  <span className="border border-white border-opacity-80 px-2 py-1 rounded-[9px] text-[14px]">
                    {format}
                  </span>
                  <span className="bg-orange-600 px-2 py-1 rounded-[9px] text-[16px] flex items-center justify-center">
                    {status}
                  </span>
                </div>
              </div>
              <div className="text-[15px] mb-[15px] pl-[10px]">
                {genres.join(" ")}
              </div>
              <div className="text-[13px] mb-[5px] pl-[10px] flex flex-wrap">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-400 bg-opacity-60 px-2 py-1 rounded-[8px] text-m mr-2 mb-2 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex-grow-[0.8]"></div>
              <div className="flex flex-col items-start justify-between pb-2">
                <div className="flex items-start w-full mb-20 pl-[10px]">
                  {renderStars()}
                </div>
                <div className="absolute bottom-0 right-0 p-2 flex space-x-2">
                  <div className="relative bottom-2 right-0 group">
                    <button onClick={handlePickClick} className="text-white">
                      {isPicked ? (
                        <PickedIcon className="w-13 h-13" />
                      ) : (
                        <AddIcon className="w-13 h-13" />
                      )}
                    </button>
                    <span className="absolute bottom-full left-5 -translate-y-1 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {isPicked ? "픽 취소" : "픽 하기"}
                    </span>
                  </div>
                  <div className="relative bottom-2 left-1 group">
                    <Link to={`/anime/${anime_id}`} className="text-white">
                      <ArrowIcon className="w-13 h-13" />
                    </Link>
                    <span className="absolute bottom-full left-5 -translate-y-1 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      상세보기
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold line-clamp-2 text-gray-800">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default AnimeCard;
