import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAnime } from "../contexts/AnimeContext";
import AnimeCard from "../components/anime/AnimeCard";
import SearchSuggestions from "../components/search/SearchSuggestions";
import SearchFilters from "./../components/search/SearchFilters";
import RecentSearches from "./../components/search/RecentSearches";

const SearchGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("전체");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);

  const { state } = useAuth();
  const { animes, setAnimes, loading, setLoading, error, setError } = useAnime();
  const recentSearchesRef = useRef<HTMLDivElement>(null);

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

      try {
        let filterParam = "";

        if (genreFilter.length > 0) {
          filterParam += `&genre=${encodeURIComponent(genreFilter.join(","))}`;
        }

        if (tagFilter.length > 0) {
          filterParam += `&tag=${encodeURIComponent(tagFilter.join(","))}`;
        }

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/search?query=${encodeURIComponent(
            term
          )}${filterParam}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(state.isAuthenticated
                ? { Authorization: `Bearer ${state.token}` }
                : {}),
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
    [genreFilter, tagFilter, state.isAuthenticated, state.token, setAnimes, setError, setLoading]
  );

  const handleSearchButtonClick = () => {
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
      handleSearchButtonClick();
    }
  };

  const handleInputFocus = () => {
    setShowRecentSearches(true);
  };

  return (
    <div className="min-h-screen flex flex-col mb-10">
      <div className="flex-grow pt-40 px-4">
        <div className="max-w-6xl lg:max-w-screen-2xl mx-auto flex flex-col md:flex-row">
          <div className="hidden md:block w-1/4 pr-4 pt-10">
            <SearchFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              setGenreFilter={setGenreFilter}
              setTagFilter={setTagFilter}
            />
          </div>

          <div className="w-full md:w-3/4 flex flex-col gap-4 items-center">
            <div className="max-w-md w-full mr-28 lg:mr-10 sm:mr-0">
              <h1 className="text-2xl font-bold mb-6 text-center">
                평가한 작품들로,
                <br />
                취향에 꼭 맞는 애니를 찾아드릴게요!
              </h1>
              <div className="relative mb-4">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F7f7f7] focus:outline-none focus:ring-2 focus:ring-[#F35815] focus:border-transparent bg-[#F7f7f7] text-gray-700 placeholder-gray-400"
                  placeholder="제목, 태그, 장르로 검색해보세요"
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
                    onClick={handleSearchButtonClick}
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
                <div ref={recentSearchesRef}>
                  <RecentSearches
                    recentSearches={recentSearches}
                    onRecentSearchClick={handleRecentSearchClick}
                    onClearRecentSearches={clearRecentSearches}
                    onRemoveRecentSearch={handleRemoveRecentSearch}
                  />
                </div>
              )}
              <button
                onClick={handleSearchButtonClick}
                className="w-full bg-[#F35815] text-white font-bold py-3 px-16 rounded-full shadow-lg hover:bg-[#D14704] transition duration-300 ease-in-out"
              >
                검색
              </button>
            </div>

            <div className="flex-grow flex flex-wrap gap-4">
              {error && (
                <div className="text-red-500 text-center mt-4 w-full">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center mt-8 w-full">검색 중...</div>
              ) : (
                animes.map((anime, index) => (
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