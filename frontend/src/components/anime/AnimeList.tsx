import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AnimeCard from './AnimeCard';
import SwipeButton from '../common/SwipeButton';
import { AnimeData } from '../../types/anime';

interface AnimeListProps {
  animes: AnimeData[];
}

const AnimeList: React.FC<AnimeListProps> = ({ animes }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  const moveCards = useCallback((direction: 'left' | 'right') => {
    const moveBy = 5;
    setStartIndex(prevIndex => {
      if (direction === 'left') {
        return Math.max(prevIndex - moveBy, 0);
      } else {
        return Math.min(prevIndex + moveBy, animes.length - visibleCount);
      }
    });
  }, [animes.length]);

  const visibleAnimes = animes.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative overflow-hidden">
      {startIndex > 0 && (
        <SwipeButton 
          direction="left" 
          onClick={() => moveCards('left')} 
          aria-label="이전 애니메이션 보기"
        />
      )}
      <motion.div 
        className="flex"
        initial={false}
        animate={{ x: `${-startIndex * 20}%` }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
      >
        {animes.map((animeData, index: number) => (
          <div key={animeData.anime_id} className="flex-none w-1/5 px-2">
            <AnimeCard {...animeData} index={index + 1} />
          </div>
        ))}
      </motion.div>
      {startIndex < animes.length - visibleCount && (
        <SwipeButton 
          direction="right" 
          onClick={() => moveCards('right')} 
          aria-label="다음 애니메이션 보기"
        />
      )}
    </div>
  );
};

export default React.memo(AnimeList);