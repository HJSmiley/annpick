import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { ReactComponent as ArrowIcon } from "../../assets/icons/ic_next.svg";
import { ReactComponent as AddIcon } from "../../assets/icons/Boolean=add.svg";
import { AnimeData } from "../../types/anime";
import { useAuth } from "../../contexts/AuthContext";

// AnimeCard 컴포넌트의 props 인터페이스 정의
interface AnimeCardProps extends AnimeData {
  index: number;
  onRatingClick?: () => void;
  isModalOpen?: boolean;
}

// AnimeCard 컴포넌트 정의
const AnimeCard: React.FC<AnimeCardProps> = ({
  anime_id,
  title,
  thumbnail_url,
  format,
  status,
  genres,
  tags,
  onRatingClick,
  isModalOpen,
}) => {
  // 상태 변수들 정의
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // 인증 상태 가져오기
  const { state } = useAuth();

  // 서버에서 애니메이션 평점을 가져오는 함수
  const fetchRatingFromServer = async (animeId: number) => {
    try {
      if (!state.isAuthenticated) {
        // 비로그인 상태에서는 서버에 요청하지 않음
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
      return data.user_rating;
    } catch (error) {
      console.error("Error fetching rating:", error);
      return null;
    }
  };

  // 서버에 평점을 보내는 함수
  const sendRatingToServer = async (animeId: number, rating: number) => {
    try {
      if (!state.isAuthenticated) {
        throw new Error("No token found, please log in again.");
      }

      const token = state.token;

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
      console.log("Rating successfully sent:", data);
    } catch (error) {
      console.error("Error sending rating:", error);
    }
  };

  // 컴포넌트 마운트 시 평점 가져오기
  useEffect(() => {
    const fetchAndSetRating = async () => {
      try {
        const response = await fetchRatingFromServer(anime_id);
        if (response !== null) {
          setRating(response);
        }
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };

    fetchAndSetRating();
  }, [anime_id]);

  // hover 상태 관리
  useEffect(() => {
    if (!isHovered) {
      setHover(0);
    }
  }, [isHovered]);

  // 평점 처리 함수
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

  // 별점 렌더링 함수
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const leftHalfValue = index * 2 + 1;
      const fullStarValue = (index + 1) * 2;
      const currentValue = isResetting ? 0 : hover || rating;

      return (
        <div key={index} className="inline-block">
          {/* 별 간격 조정 (mx-0.5) */}
          <span className="relative inline-block w-8 h-8 mx-0.5 sm:w-10 sm:h-10">
            {currentValue >= fullStarValue ? (
              <FaStar className="w-full h-full text-yellow-400" />
            ) : currentValue >= leftHalfValue ? (
              <FaStarHalfAlt className="w-full h-full text-yellow-400" />
            ) : (
              <FaStar className="w-full h-full text-gray-200" />
            )}
            <div
              className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
              onClick={() => handleRating(leftHalfValue)}
              onMouseEnter={() => !isResetting && setHover(leftHalfValue)}
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

  // 컴포넌트 렌더링
  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-2xl shadow-lg aspect-[3/4]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isModalOpen && setIsHovered(false)}
      >
        {/* 썸네일 이미지 */}
        <img
          src={thumbnail_url}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* 호버 시 나타나는 상세 정보 */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-80 text-white pt-3 pl-3 flex flex-col">
            {/* 코드 리뷰: 전체 컨텐츠를 감싸는 div에 h-full을 추가하여 전체 높이를 차지하도록 했습니다. */}
            <div className="flex flex-col h-full">
              {/* 포맷 및 상태 표시 - 원래 정렬로 복구 */}
              <div className="flex justify-between items-center mb-3 pt-[35px] pl-[10px]">
                <div className="flex space-x-2">
                  <span className="border border-white border-opacity-80 px-2 py-1 rounded-[9px] text-[14px]">
                    {format}
                  </span>
                  {/* 완결 아이콘 글자 가운데 정렬 및 크기 조정 */}
                  <span className="bg-orange-600 px-2 py-1 rounded-[9px] text-[16px] flex items-center justify-center">
                    {status}
                  </span>
                </div>
              </div>
              {/* 장르 표시 - 구분자 제거 */}
              <div className="text-[15px] mb-[15px] pl-[10px]">{genres.join(" ")}</div>
              {/* 태그 표시 */}
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
              {/* 코드 리뷰: flex-grow를 추가하여 남은 공간을 차지하도록 했습니다. */}
              <div className="flex-grow-[0.8]"></div>
              {/* 별점 및 상세 페이지 링크 */}
              <div className="flex flex-col items-start justify-between pb-2">
                {/* 별점 왼쪽 정렬 */}
                <div className="flex items-start w-full mb-20 pl-[10px]">
                  {renderStars()}
                </div>
                {/* 상세보기 버튼 - 오른쪽 아래에 고정 */}
                {/* 코드 리뷰: absolute와 bottom-0, right-0을 사용하여 오른쪽 아래에 고정했습니다. */}
                <div className="absolute bottom-0 right-0 p-2 flex space-x-[9px]">
                  <Link to={`/anime/${anime_id}`} className="text-white"> 
                    <AddIcon className="w-13 h-13" />
                  </Link>
                  <Link to={`/anime/${anime_id}`} className="text-white">
                    <ArrowIcon className="w-13 h-13" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 애니메이션 제목 */}
      <div className="mt-2">
        <h3 className="text-lg font-semibold line-clamp-2 text-gray-800 dark:text-white">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default AnimeCard;