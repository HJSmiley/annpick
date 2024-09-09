import React, { useState, useCallback, useEffect } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { state } = useAuth();
  const { animes, setAnimes, loading, setLoading, error, setError } = useAnime();

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveRecentSearch = (search: string) => {
    const updatedSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/search?query=${encodeURIComponent(searchTerm)}&filter=${activeFilter}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(state.isAuthenticated ? { Authorization: `Bearer ${state.token}` } : {})
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error('검색 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setAnimes(data);
      saveRecentSearch(searchTerm);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeFilter, state.isAuthenticated, state.token, setAnimes, setError, setLoading]);

  const handleSuggestionSearch = async (term: string) => {
    setSearchTerm(term);
    await handleSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // 여기에 검색 제안을 위한 API 호출을 추가할 수 있습니다.
    // 예: fetchSuggestions(value).then(setSuggestions);
  };

  const handleRatingClick = useCallback(() => {
    setIsModalOpen(true);
    // 여기에 로그인 모달을 열거나 로그인 페이지로 리다이렉트하는 로직을 추가할 수 있습니다.
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-40 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">
            평가한 작품들로,<br />
            취향에 꼭 맞는 애니를 찾아드릴게요!
          </h1>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F7f7f7] focus:outline-none focus:ring-2 focus:ring-[#F35815] focus:border-transparent bg-[#F7f7f7] text-gray-700 placeholder-gray-400"
              placeholder="제목, 태그, 장르로 검색해보세요"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <SearchSuggestions
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionSearch}
            />
          </div>
          <SearchFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <button
            onClick={handleSearch}
            className="w-full bg-[#F35815] text-white font-bold py-3 px-16 rounded-full shadow-lg hover:bg-[#D14704] transition duration-300 ease-in-out"
          >
            검색
          </button>
          <RecentSearches
            recentSearches={recentSearches}
            onRecentSearchClick={handleSuggestionSearch}
            onClearRecentSearches={clearRecentSearches}
          />
        </div>

        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}

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

export default SearchGrid;