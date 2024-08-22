import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { Anime } from '../../types/anime';

const AnimeCard: React.FC<Anime> = ({ id, title, image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt={title} className="w-full h-auto" />
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4 transition-opacity duration-300">
          <h3 className="text-white text-lg font-bold">{title}</h3>
          <div className="flex justify-between items-center">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className="cursor-pointer"
                  color={index < rating ? "#ffc107" : "#e4e5e9"}
                  onClick={() => setRating(index + 1)}
                />
              ))}
            </div>
            <Link to={`/anime/${id}`} className="text-white">
              <span className="text-2xl">&gt;</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeCard;