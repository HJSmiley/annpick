import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAnime } from "../contexts/AnimeContext";
import AnimeCard from "../components/anime/AnimeCard";
import SearchSuggestions from "../components/search/SearchSuggestions";
import RecentSearches from "./../components/search/RecentSearches";
import { tagCategories } from "./TagCategories";
import { ChevronDown } from "lucide-react";
// import { handleFilterClick, toggleCategory } from "./SearchUtils";

// AnimeData 인터페이스 수정
  interface AnimeData {
    anime_id: number;
    genres: string[];
    tags: string[];
    thumbnail_url: string;
    title: string;
    format: string;
    status: string;
  }

const SearchGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);
  // const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const { state } = useAuth();
  const { animes, setAnimes, loading, setLoading, error, setError } = useAnime();
  const recentSearchesRef = useRef<HTMLDivElement>(null);
  const [filteredAnimes, setFilteredAnimes] = useState<AnimeData[]>([]);
  const [randomAnimes, setRandomAnimes] = useState<AnimeData[]>([]);
  const genres = ['액션', '모험', '미스터리', '드라마', '일상', '판타지', '코미디', '미래소년', '메카', '음악', '추리', '스포츠', 'SF', '성인', '초자연적인', '스릴러'];
  const tags = ['인물', '캐릭터', '관계', '직업', '진행/에선', '배경'];

  

  useEffect(() => {
    setSearchTerm("");
    setError(null);
    setAnimes([]);
  }, [setAnimes]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // useEffect(() => {
  //   if (animes.length > 0 && selectedFilters.length > 0) {
  //     const filtered = animes.filter(anime => 
  //       selectedFilters.some(filter => anime.genres.includes(filter))
  //     );
  //     setFilteredAnimes(filtered);
  //   } else {
  //     setFilteredAnimes(animes);
  //   }
  // }, [animes, selectedFilters]);
  
  // 필터링 로직을 AND 개념으로 수정
  // useEffect(() => {
  //   if (animes.length > 0 && selectedFilters.length > 0) {
  //     const filtered = animes.filter(anime => 
  //       selectedFilters.every(filter => anime.genres.includes(filter))
  //     );
  //     setFilteredAnimes(filtered);
  //   } else {
  //     setFilteredAnimes(animes);
  //   }
  // }, [animes, selectedFilters]);

    useEffect(() => {
    if (animes.length > 0 && (selectedFilters.length > 0 || checkedTags.length > 0)) {
      const filtered = animes.filter(anime => 
        (selectedFilters.length === 0 || selectedFilters.every(filter => anime.genres.includes(filter))) &&
        (checkedTags.length === 0 || checkedTags.every(tag => anime.tags.includes(tag)))
      );
      setFilteredAnimes(filtered);
    } else {
      setFilteredAnimes(animes);
    }
  }, [animes, selectedFilters, checkedTags]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (recentSearchesRef.current && !recentSearchesRef.current.contains(event.target as Node)) {
        setShowRecentSearches(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const saveRecentSearch = (search: string) => {
    const updatedSearches = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleRemoveRecentSearch = (searchTerm: string) => {
    const updatedSearches = recentSearches.filter(search => search !== searchTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };


  

  const handleSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setError("검색어를 입력해주세요.");
        return;
      }

      setLoading(true);
      setError(null);
      setAnimes([]);
      setSearchPerformed(true);

      try {
        const filterParam = selectedFilters.length > 0 ? `&filters=${encodeURIComponent(selectedFilters.join(","))}` : "";

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/search?query=${encodeURIComponent(term)}${filterParam}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(state.isAuthenticated ? { Authorization: `Bearer ${state.token}` } : {}),
            },
            credentials: "include",
          }
        );

        if (response.status === 404) {
          setError("검색 결과가 없습니다.");
          setAnimes([]);
          return;
        }

        if (!response.ok) {
          throw new Error("검색 중 오류가 발생했습니다.");
        }

        const data = await response.json();
        setAnimes(data);
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
        setError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    },
    [selectedFilters, state.isAuthenticated, state.token, setAnimes, setError, setLoading]
  );

  const handleSearchSubmit = () => {
    handleSearch(searchTerm);
    saveRecentSearch(searchTerm);
    setShowRecentSearches(false);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    handleSearch(term);
    setShowRecentSearches(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };


  
  // 핸들러 함수 추가 (다른 핸들러 함수들 근처에 추가)
  const handleTagCheck = (tag: string, categoryName: string) => {
    setCheckedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    updateActiveCategoryStatus(categoryName);
  };

  const updateActiveCategoryStatus = (categoryName: string) => {
    setActiveCategories(prev => {
      const category = tagCategories.find(cat => cat.name === categoryName);
      if (category) {
        const isActive = category.tags.some(tag => checkedTags.includes(tag));
        if (isActive) {
          // Set을 사용하지 않고 배열로 직접 처리
          return Array.from(new Set([...prev, categoryName]));
        } else {
          return prev.filter(cat => cat !== categoryName);
        }
      }
      return prev;
    });
  };
  
  const handleInputFocus = () => {
    setShowRecentSearches(true);
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const toggleDropdown = (categoryName: string) => {
    setOpenDropdowns(prev => {
      if (prev.includes(categoryName)) {
        // 현재 카테고리가 이미 열려있다면 닫기
        return [];
      } else {
        // 현재 카테고리만 열고 나머지는 닫기
        return [categoryName];
      }
    });
  };

  const isCategoryActive = (category: { name: string; tags: string[] }) => {
    return activeCategories.includes(category.name) || category.tags.some(tag => checkedTags.includes(tag));
  };


  return (
    <div className="min-h-screen flex flex-col mb-10">
      <div className="flex-grow pt-40 px-4">
        <div className="max-w-6xl lg:max-w-screen-2xl mx-auto">
          <div className="w-full flex flex-col gap-4 items-center">
            <div className="max-w-md w-full relative" style={{ height: '40px' }}> {/* 높이 지정 */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F7f7f7] focus:outline-none focus:ring-2 focus:ring-[#F35815] focus:border-transparent bg-[#F7f7f7] text-gray-700 placeholder-gray-400 caret-[#3c3b3b]"
                  placeholder="원하는 애니를 검색해보세요"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                />
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <SearchSuggestions
                  suggestions={suggestions}
                  onSuggestionClick={handleRecentSearchClick}
                />
              </div>
              {showRecentSearches && (
                <div ref={recentSearchesRef} className="absolute w-full z-10 bg-white shadow-lg rounded-lg mt-1">
                  <RecentSearches
                    recentSearches={recentSearches}
                    onRecentSearchClick={handleRecentSearchClick}
                    onClearRecentSearches={clearRecentSearches}
                    onRemoveRecentSearch={handleRemoveRecentSearch}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mt-4"> {/* 장르 및 태그 섹션을 위한 마진 추가 */}
          <div className="mb-4">
            <h1 className="font-bold mb-2">장르</h1>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleFilterClick(genre)}
                  className={`
                    px-2 py-0.5 text-s font-medium btn-outline border border-gray-300 rounded-lg bg-white
                    transition-all duration-200 ease-in-out
                    ${selectedFilters.includes(genre) 
                      ? 'text-orange-600 border-orange-600  hover:bg-white hover:text-orange-500 hover:border-orange-500 border-2' 
                      : 'bg-white text-gray-700 hover:text-orange-600 hover:border-orange-600 hover:bg-white'}
                  `}
                >
                  {genre}
                </button>
              ))}
                </div>
              </div>
              <div>

              <h2 className="font-bold mb-2">태그</h2>
      <div className="flex flex-wrap gap-2">
      {tagCategories.map((category) => (
        <div key={category.name} className="mb-2">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className={`btn btn-sm ${
                category.tags.some(tag => checkedTags.includes(tag))
                ? 'text-orange-600 border-orange-600  hover:bg-white hover:text-orange-500 hover:border-orange-500 border-2' 
                : 'bg-white text-gray-700 hover:text-orange-600 hover:border-orange-600 hover:bg-white'}
            `}
              onClick={() => toggleDropdown(category.name)}
            >
              <span>{category.name}</span>
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  openDropdowns.includes(category.name) ? 'transform rotate-180' : ''
                }`}
              />
            </div>
            {openDropdowns.includes(category.name) && (
              <div className="dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow mt-1">
                <div className="grid grid-cols-2 gap-2 w-[400px]">
                  {category.tags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer py-1 px-2">
                      <input
                        type="checkbox"
                        checked={checkedTags.includes(tag)}
                        onChange={() => handleTagCheck(tag, category.name)}
                        className="form-checkbox h-4 w-4 text-custom-orange rounded border-gray-300 focus:ring-custom-orange focus:ring-offset-0 focus:ring-0 focus:outline-none"
                      />
                      <span className="text-sm peer-checked:text-orange-600 flex-grow">
                        {tag}
                      </span>
                    </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    
      {searchPerformed && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">
              {loading ? "검색 중..." : `총 ${filteredAnimes.length}개`}
            </span>
          
            {selectedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFilters.map((filter) => (
                  <span key={filter} className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                    {filter}
                    <button
                      className="ml-1 text-orange-600 hover:text-orange-800"
                      onClick={() => handleFilterClick(filter)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  className="text-sm text-orange-600 hover:text-orange-800"
                  onClick={() => setSelectedFilters([])}
                >
                  초기화
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-wrap gap-4">
        {error && (
          <div className="text-red-500 text-center mt-4 w-full">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center mt-8 w-full">검색 중...</div>
        ) : (
          filteredAnimes.map((anime, index) => (
            <div
              key={anime.anime_id}
              className="flex-shrink-0 w-[265px]"
            >
              <AnimeCard
                {...anime}
                index={index}
                onRatingClick={() => setIsModalOpen(true)}
                isModalOpen={isModalOpen}
              />
            </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchGrid;