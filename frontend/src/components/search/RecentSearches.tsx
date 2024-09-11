import React from "react";

interface RecentSearchesProps {
  recentSearches: string[];
  onRecentSearchClick: (term: string) => void;
  onClearRecentSearches: () => void;
  onRemoveRecentSearch: (term: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onRecentSearchClick,
  onClearRecentSearches,
  onRemoveRecentSearch,
}) => {
  if (recentSearches.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md mt-2 w-full max-w-md">
      <div className="flex justify-between items-center p-3 border-b">
        <span className="text-sm font-semibold text-gray-700">최근검색어</span>
        <button
          onClick={onClearRecentSearches}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          전체삭제
        </button>
      </div>
      <ul>
        {recentSearches.map((term, index) => (
          <li
            key={index}
            className="px-3 py-2 hover:bg-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center cursor-pointer" onClick={() => onRecentSearchClick(term)}>
              <svg
                className="h-4 w-4 mr-2 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span className="text-sm text-gray-700">{term}</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => onRemoveRecentSearch(term)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;