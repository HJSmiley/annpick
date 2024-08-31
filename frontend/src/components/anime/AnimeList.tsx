import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import AnimeCard from "./AnimeCard";
import SwipeButton from "../common/SwipeButton";
import { AnimeData } from "../../types/anime";

interface AnimeListProps {
  animes: AnimeData[];
  onRatingClick?: () => void;
  isModalOpen?: boolean;
}

const AnimeList: React.FC<AnimeListProps> = ({
  animes,
  onRatingClick,
  isModalOpen,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  const updateVisibleCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setVisibleCount(2);
    } else if (width < 1024) {
      setVisibleCount(3);
    } else {
      setVisibleCount(5);
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [updateVisibleCount]);

  const moveCards = useCallback(
    (direction: "left" | "right") => {
      setStartIndex((prevIndex) => {
        if (direction === "left") {
          return Math.max(prevIndex - visibleCount, 0);
        } else {
          return Math.min(prevIndex + visibleCount, animes.length - visibleCount);
        }
      });
    },
    [animes.length, visibleCount]
  );

  const visibleAnimes = animes.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          initial={false}
          animate={{ x: `${(-startIndex * 100) / visibleCount}%` }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
        >
          {animes.map((animeData, index: number) => (
            <div 
              key={animeData.anime_id} 
              className={`flex-none px-2 ${
                visibleCount === 5 ? 'w-1/5' : 
                visibleCount === 3 ? 'w-1/3' : 
                'w-1/2'
              }`}
            >
              <AnimeCard
                {...animeData}
                index={index + 1}
                onRatingClick={onRatingClick}
                isModalOpen={isModalOpen}
              />
            </div>
          ))}
        </motion.div>
      </div>
      {startIndex > 0 && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
          <SwipeButton
            direction="left"
            onClick={() => moveCards("left")}
            aria-label="이전 애니메이션 보기"
          />
        </div>
      )}
      {startIndex < animes.length - visibleCount && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
          <SwipeButton
            direction="right"
            onClick={() => moveCards("right")}
            aria-label="다음 애니메이션 보기"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(AnimeList);