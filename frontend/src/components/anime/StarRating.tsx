import React from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  onRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <FaStar
            key={index}
            className="cursor-pointer"
            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
            size={20}
            onClick={() => onRating(ratingValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;