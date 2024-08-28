import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { ReactComponent as ArrowIcon } from '../../assets/icons/ic_more.svg';
import { AnimeData } from '../../types/anime';

// type AnimeCardProps = AnimeData;
interface AnimeCardProps extends AnimeData {
  index: number;
}

const sendRatingToServer = async (animeId: number, rating: number) => {
  // 서버로 별점 전송 로직 (구현 필요)
};

const AnimeCard: React.FC<AnimeCardProps> = ({
  anime_id,
  title,
  thumbnail_url,
  format,
  status,
  genres,
  tags
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setHover(0);
    }
  }, [isHovered]);

  const handleRating = useCallback((currentRating: number) => {
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
  }, [rating, anime_id]);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const leftHalfValue = index * 2 + 1;
      const fullStarValue = (index + 1) * 2;
      const currentValue = isResetting ? 0 : (hover || rating);
      
      return (
        <div key={index} className="inline-block">
          <span className="relative inline-block w-6 h-6">
            {currentValue >= fullStarValue ? (
              <FaStar className="w-6 h-6 text-yellow-400" />
            ) : currentValue >= leftHalfValue ? (
              <FaStarHalfAlt className="w-6 h-6 text-yellow-400" />
            ) : (
              <FaStar className="w-6 h-6 text-gray-300" />
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

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg aspect-[3/4]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={thumbnail_url} alt={title} className="w-full h-full object-cover" />
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 text-white p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">{format}</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">{status}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="text-sm mb-2">
            <strong>장르:</strong> {genres.join(', ')}
          </div>
          <div className="text-sm mb-2">
            <strong>태그:</strong> {tags.slice(0, 3).join(', ')}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex">
              {renderStars()}
            </div>
            <Link to={`/anime/${anime_id}`} className="text-white">
              <ArrowIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      )}
      {!isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default AnimeCard;