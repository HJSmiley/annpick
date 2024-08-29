import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import AnimeCard from "./AnimeCard";
import SwipeButton from "../common/SwipeButton";
import { AnimeData } from "../../types/anime";

interface AnimeListProps {
  animes: AnimeData[];
  onRatingClick?: () => void;
  isModalOpen?: boolean; // isModalOpen 추가
}

const AnimeList: React.FC<AnimeListProps> = ({
  animes,
  onRatingClick,
  isModalOpen,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  const moveCards = useCallback(
    (direction: "left" | "right") => {
      const moveBy = visibleCount;
      setStartIndex((prevIndex) => {
        if (direction === "left") {
          return Math.max(prevIndex - moveBy, 0);
        } else {
          return Math.min(prevIndex + moveBy, animes.length - visibleCount);
        }
      });
    },
    [animes.length, visibleCount]
  );

  const visibleAnimes = animes.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        {" "}
        {/* 슬라이딩 애니메이션이 숨겨진 부분에서 잘리도록 설정 */}
        <motion.div
          className="flex"
          initial={false}
          animate={{ x: `${(-startIndex * 100) / visibleCount}%` }} // 애니메이션의 이동을 정확하게 계산
          transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
        >
          {animes.map((animeData, index: number) => (
            <div key={animeData.anime_id} className="flex-none w-1/5 px-2">
              <AnimeCard
                {...animeData}
                index={index + 1}
                onRatingClick={onRatingClick}
                isModalOpen={isModalOpen}
              />{" "}
            </div>
          ))}
        </motion.div>
      </div>
      {startIndex > 0 && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <SwipeButton
            direction="left"
            onClick={() => moveCards("left")}
            aria-label="이전 애니메이션 보기"
          />
        </div>
      )}
      {startIndex < animes.length - visibleCount && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
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
