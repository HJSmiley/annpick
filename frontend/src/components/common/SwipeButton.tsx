import React from 'react';

interface SwipeButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  'aria-label': string;
  className?: string;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({
  direction,
  onClick,
  'aria-label': ariaLabel,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md z-10 ${
        direction === 'left' ? '-left-5' : '-right-5'
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
        className={`w-6 h-6 ${direction === 'left' ? 'rotate-180' : ''}`}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

export default SwipeButton;