import React from "react";

interface SwipeButtonProps {
  direction: "left" | "right" | "up" | "down";
  onClick: () => void;
  "aria-label": string;
  className?: string;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({
  direction,
  onClick,
  "aria-label": ariaLabel,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`absolute bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md z-10 ${
        direction === "left"
          ? "-left-5 top-1/2 -translate-y-1/2"
          : direction === "right"
          ? "-right-5 top-1/2 -translate-y-1/2"
          : direction === "up"
          ? "top-[-16px] left-1/2 -translate-x-1/2"
          : "bottom-[-16px] left-1/2 -translate-x-1/2"
      } ${className}`}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-8 h-8 ${
          direction === "left" || direction === "up" ? "rotate-180" : ""
        } hover:text-orange-500`}
      >
        <polyline
          points={
            direction === "left" || direction === "right"
              ? "9 18 15 12 9 6" // 좌우 화살표
              : "18 15 12 9 6 15" // 상하 화살표
          }
        />
      </svg>
    </button>
  );
};

export default SwipeButton;
