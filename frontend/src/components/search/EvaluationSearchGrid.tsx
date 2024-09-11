import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAnime } from "../../contexts/AnimeContext";
import AnimeCard from "../../components/anime/AnimeCard";
import SearchSuggestions from "../../components/search/SearchSuggestions";
import RecentSearches from "./../../components/search/RecentSearches";

const EvalSearchGrid: React.FC = () => {
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
  const handleRemoveRecentSearch = (searchTerm: string) => {
    const updatedSearches = recentSearches.filter(search => search !== searchTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };
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
    setShowRecentSearches(value.length === 0);
  };

  const handleInputFocus = () => {
    setShowRecentSearches(searchTerm.length === 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  const handleRatingClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col mt-10 mb-32">
      <div className="flex-grow pt-40 px-4">
        <div className="max-w-md mx-auto">
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
                onClick={handleSearchButtonClick}
                className="h-5 w-5 text-gray-400 cursor-pointer"
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
            {showRecentSearches && (
              <RecentSearches
                recentSearches={recentSearches}
                onRecentSearchClick={handleRecentSearchClick}
                onClearRecentSearches={clearRecentSearches}
                onRemoveRecentSearch={handleRemoveRecentSearch} 
              />
            )}
          </div>
        </div>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {loading ? (
          <div className="text-center mt-8">검색 중...</div>
        ) : (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {animes.map((anime, index) => (
              <AnimeCard
                key={anime.anime_id}
                {...anime}
                index={index}
                onRatingClick={handleRatingClick}
                isModalOpen={isModalOpen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EvalSearchGrid;