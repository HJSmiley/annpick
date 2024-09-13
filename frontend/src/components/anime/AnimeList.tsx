import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import AnimeCard from "./AnimeCard";
import SwipeButton from "../common/SwipeButton";
import { AnimeData } from "../../types/anime";

interface AnimeListProps {
  animes: AnimeData[];
  onRatingClick?: () => void;
  isModalOpen?: boolean;
  showSwipeButtons?: boolean;
  isExpanded?: boolean; // 새로운 prop 추가
}

const AnimeList: React.FC<AnimeListProps> = ({
  animes,
  onRatingClick,
  isModalOpen,
  showSwipeButtons = true,
  isExpanded = false, // 기본값 false
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  const cardWidth = 265; // 카드의 고정 너비 (픽셀)
  const cardMargin = 16; // 카드 사이의 여백 (픽셀)

  const updateVisibleCount = useCallback(() => {
    if (!isExpanded) {
      const containerWidth = window.innerWidth - 64; // 64px는 좌우 패딩 (32px * 2)
      const totalCardWidth = cardWidth + cardMargin;
      const newVisibleCount = Math.floor(containerWidth / totalCardWidth);
      setVisibleCount(Math.max(1, Math.min(5, newVisibleCount))); // 최소 1개, 최대 5개
    }
  }, [isExpanded]);

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

  const containerStyle: React.CSSProperties = isExpanded
    ? {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: `${cardMargin}px`,
        width: '100%',
      }
    : {
        width: `${(cardWidth + cardMargin) * visibleCount - cardMargin}px`,
        margin: '0 auto',
        maxWidth: '100%',
      };

  const cardStyle: React.CSSProperties = isExpanded
    ? { width: '100%' }
    : {
        flexShrink: 0,
        width: `${cardWidth}px`,
        marginRight: `${cardMargin}px`,
      };

  return (
    <div className="relative" style={containerStyle}>
      {!isExpanded && (
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            initial={false}
            animate={{ x: `${-startIndex * (cardWidth + cardMargin)}px` }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
          >
            {animes.map((animeData, index: number) => (
              <div key={animeData.anime_id} style={cardStyle}>
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
      )}
      {isExpanded && animes.map((animeData, index: number) => (
        <div key={animeData.anime_id} style={cardStyle}>
          <AnimeCard
            {...animeData}
            index={index + 1}
            onRatingClick={onRatingClick}
            isModalOpen={isModalOpen}
          />
        </div>
      ))}
      {showSwipeButtons && !isExpanded && startIndex > 0 && (
        <div className="absolute left-[-4px] top-[43%] transform -translate-y-1/2 z-10">
          <SwipeButton
            direction="left"
            onClick={() => moveCards("left")}
            aria-label="이전 애니메이션 보기"
          />
        </div>
      )}
      {showSwipeButtons && !isExpanded && startIndex < animes.length - visibleCount && (
        <div className="absolute right-[-4px] top-[43%] transform -translate-y-1/2 z-10">
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