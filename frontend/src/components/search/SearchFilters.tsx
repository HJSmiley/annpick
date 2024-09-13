import React, { useState } from "react";
import { genres, tags } from "../../services/constants";

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  setGenreFilter: (genre: string[]) => void;
  setTagFilter: (tag: string[]) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  setGenreFilter,
  setTagFilter,
}) => {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isTagMainOpen, setIsTagMainOpen] = useState(true);
  const [isTagCategoryOpen, setIsTagCategoryOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleGenre = () => {
    setIsGenreOpen(!isGenreOpen);
  };

  const toggleTagMain = () => {
    setIsTagMainOpen(!isTagMainOpen);
  };

  const toggleTagCategory = (category: string) => {
    setIsTagCategoryOpen((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleGenreChange = (genre: string) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updatedGenres);
    setGenreFilter(updatedGenres);
  };

  const handleTagChange = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    setTagFilter(updatedTags);
  };

  return (
    <div className="w-64 p-4 space-y-4">
      {/* 장르 필터 */}
      <div className="border p-4 rounded-lg">
        <button
          onClick={toggleGenre}
          className="w-full text-left text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          {isGenreOpen ? "▼" : "▶"} 장르
        </button>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isGenreOpen ? "h-auto" : "h-0 overflow-hidden"
          }`}
        >
          <div className="mt-2 flex flex-col gap-2 overflow-y-auto max-h-60">
            {genres.map((genre) => (
              <div
                key={genre}
                className={`cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                  selectedGenres.includes(genre)
                    ? "bg-[#F35815] text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 태그 필터 */}
      <div className="border p-4 rounded-lg">
        <button
          onClick={toggleTagMain}
          className="w-full text-left text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          {isTagMainOpen ? "▼" : "▶"} 태그
        </button>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isTagMainOpen ? "h-auto" : "h-0 overflow-hidden"
          }`}
        >
          <div className="mt-2 flex flex-col gap-2">
            {Object.keys(tags).map((category) => (
              <div key={category} className="ml-4">
                <button
                  onClick={() => toggleTagCategory(category)}
                  className="w-full text-left text-base font-semibold text-gray-700 hover:text-gray-500 transition-colors"
                >
                  {isTagCategoryOpen[category] ? "▼" : "▶"} {category}
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isTagCategoryOpen[category]
                      ? "h-auto"
                      : "h-0 overflow-hidden"
                  }`}
                >
                  <div className="mt-2 ml-4 flex flex-col gap-2 overflow-y-auto max-h-60">
                    {tags[category].map((tag) => (
                      <div
                        key={tag}
                        className={`cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-[#F35815] text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => handleTagChange(tag)}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
