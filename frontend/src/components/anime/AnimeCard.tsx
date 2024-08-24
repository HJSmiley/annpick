import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Anime } from '../../types/anime';
import { ReactComponent as ArrowIcon } from '../../assets/icons/ic_more.svg';

const sendRatingToServer = async (animeId: number, rating: number) => {
  // 서버로 별점 전송 로직 (이전과 동일)
};

const AnimeCard: React.FC<Anime> = ({ id, title, image }) => {
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
      sendRatingToServer(id, 0);
      setTimeout(() => setIsResetting(false), 50); // 짧은 지연 후 리셋 상태 해제
    } else {
      setRating(currentRating);
      sendRatingToServer(id, currentRating);
    }
  }, [rating, id]);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const leftHalfValue = index * 2 + 1;
      const fullStarValue = (index + 1) * 2;
      const currentValue = isResetting ? 0 : (hover || rating);
      
      return (
        <div key={index} className="inline-block">
          <span className="relative inline-block w-8 h-8">
            {currentValue >= fullStarValue ? (
              <FaStar className="w-8 h-8 text-yellow-400" />
            ) : currentValue >= leftHalfValue ? (
              <FaStarHalfAlt className="w-8 h-8 text-yellow-400" />
            ) : (
              <FaStar className="w-8 h-8 text-gray-300" />
            )}
            <div 
              className="absolute top-0 left-0 w-1/2 h-full"
              onClick={() => handleRating(leftHalfValue)}
              onMouseEnter={() => !isResetting && setHover(leftHalfValue)}
              onMouseLeave={() => !isResetting && setHover(rating)}
            />
            <div 
              className="absolute top-0 right-0 w-1/2 h-full"
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
    <div className="flex flex-col">
      <div 
        className="relative overflow-hidden rounded-lg shadow-lg aspect-[3/4]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        {isHovered && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex flex-col justify-between p-4 transition-opacity duration-300"
            style={{ caretColor: 'transparent' }}
          >
            <div className="flex-grow" />
            <div className="flex justify-center mb-8">
              {renderStars()}
            </div>
            <Link to={`/anime/${id}`} className="absolute bottom-4 right-4 text-white">
              <ArrowIcon className="w-8 h-8" />
            </Link>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold mt-2 text-center">{title}</h3>
    </div>
  );
};

export default AnimeCard;