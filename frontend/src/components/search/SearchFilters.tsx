import React from 'react';

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const filters = ['전체', '제목', '태그', '장르'];

  return (
    <div className="flex space-x-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-3 py-1 rounded-full ${
            activeFilter === filter ? 'bg-[#F35815] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default SearchFilters;