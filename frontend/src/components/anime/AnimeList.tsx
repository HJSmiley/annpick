import React, { useState, useCallback, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
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
  const [isMobile, setIsMobile] = useState(false);

  const cardWidth = 270; // 카드의 고정 너비 (픽셀)
  const cardMargin = 16; // 카드 사이의 여백 (픽셀)

  const controls = useAnimation();

  const updateLayout = useCallback(() => {
    const screenWidth = window.innerWidth;
    const isMobileView = screenWidth < 768; // 필요에 따라 이 브레이크포인트를 조정하세요
    setIsMobile(isMobileView);

    if (isMobileView) {
      setVisibleCount(1);
    } else {
      const containerWidth = screenWidth - 64; // 64px는 좌우 패딩 (32px * 2)
      const totalCardWidth = cardWidth + cardMargin;
      const newVisibleCount = Math.floor(containerWidth / totalCardWidth);
      setVisibleCount(Math.max(1, Math.min(5, newVisibleCount))); // 최소 1개, 최대 5개
    }
  }, []);

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  const moveCards = useCallback(
    (direction: "left" | "right") => {
      setStartIndex((prevIndex) => {
        if (direction === "left") {
          return Math.max(prevIndex - 1, 0);
        } else {
          return Math.min(prevIndex + 1, animes.length - visibleCount);
        }
      });
    },
    [animes.length, visibleCount]
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardWidth / 4;
    if (info.offset.x < -threshold) {
      moveCards("right");
    } else if (info.offset.x > threshold) {
      moveCards("left");
    }
    controls.start({ x: 0 });
  };

  const containerStyle: React.CSSProperties = {
    width: isMobile ? `${cardWidth}px` : `${(cardWidth + cardMargin) * visibleCount - cardMargin}px`,
    margin: '0 auto',
  };

  return (
    <div className="relative" style={containerStyle}>
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          initial={false}
          animate={controls}
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {animes.map((animeData, index: number) => (
            <motion.div
              key={animeData.anime_id}
              style={{
                flexShrink: 0,
                width: `${cardWidth}px`,
                marginRight: `${cardMargin}px`,
              }}
              animate={{ x: `${-startIndex * (cardWidth + cardMargin)}px` }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            >
              <AnimeCard
                {...animeData}
                index={index + 1}
                onRatingClick={onRatingClick}
                isModalOpen={isModalOpen}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      {!isMobile && (
        <>
          {startIndex > 0 && (
            <div className="absolute left-[-4px] top-[43%] transform -translate-y-1/2 z-10">
              <SwipeButton
                direction="left"
                onClick={() => moveCards("left")}
                aria-label="이전 애니메이션 보기"
              />
            </div>
          )}
          {startIndex < animes.length - visibleCount && (
            <div className="absolute right-[-4px] top-[43%] transform -translate-y-1/2 z-10">
              <SwipeButton
                direction="right"
                onClick={() => moveCards("right")}
                aria-label="다음 애니메이션 보기"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(AnimeList);