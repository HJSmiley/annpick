import React from 'react';

interface RecentSearchesProps {
  recentSearches: string[];
  onRecentSearchClick: (search: string) => void;
  onClearRecentSearches: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onRecentSearchClick,
  onClearRecentSearches
}) => {
  if (recentSearches.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">최근 검색어</h3>
        <button
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onClearRecentSearches}
        >
          모두 지우기
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search, index) => (
          <button
            key={index}
            className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-300"
            onClick={() => onRecentSearchClick(search)}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;