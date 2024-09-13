// import React from 'react';
// import { FaStar } from 'react-icons/fa';

// interface StarRatingProps {
//   rating: number;
//   onRating: (rating: number) => void;
// }

// const StarRating: React.FC<StarRatingProps> = ({ rating, onRating }) => {
//   return (
//     <div className="flex">
//       {[...Array(5)].map((_, index) => {
//         const ratingValue = index + 1;
//         return (
//           <FaStar
//             key={index}
//             className="cursor-pointer"
//             color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
//             size={20}
//             onClick={() => onRating(ratingValue)}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default StarRating;

import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  onRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRating }) => {
  // 별점을 클릭했을 때 실행되는 함수
  const handleRating = (clickedRating: number) => {
    if (clickedRating === rating) {
      // 이미 선택된 별점을 다시 클릭하면 0으로 리셋
      onRating(0);
    } else {
      // 새로운 별점 선택
      onRating(clickedRating);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <div key={starValue} className="relative">
          {/* 빈 별 (회색) */}
          <FaStar
            className="cursor-pointer text-gray-300"
            size={30}
            onClick={() => handleRating(starValue)}
          />
          {/* 채워진 별 또는 반 별 (노란색) */}
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${Math.min(100, (rating - starValue + 1) * 100)}%` }}>
            {rating >= starValue - 0.5 && rating < starValue ? (
              <FaStarHalfAlt className="cursor-pointer text-yellow-400" size={30} onClick={() => handleRating(starValue - 0.5)} />
            ) : (
              <FaStar className="cursor-pointer text-yellow-400" size={30} onClick={() => handleRating(starValue)} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StarRating;