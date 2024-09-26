import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import EvalSearchGrid from "../components/search/EvaluationSearchGrid";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAnime } from "../contexts/AnimeContext";
import AnimeCard from "../components/anime/AnimeCard";
import SearchSuggestions from "../components/search/SearchSuggestions";
import RecentSearches from "../components/search/RecentSearches";
import { tagCategories } from "../configs/TagCategories";
import { ChevronDown, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import LoginModal from "../components/auth/LoginModal";

interface AnimeData {
  anime_id: number;
  genres: string[];
  tags: string[];
  thumbnail_url: string;
  title: string;
  format: string;
  status: string;
}

interface AnimeCardProps extends AnimeData {
  index: number;
  onRatingClick: () => void;
  isModalOpen: boolean;
}

const EvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const { state } = useAuth();
  const { animes, setAnimes, loading, setLoading, error, setError } =
    useAnime();
  const recentSearchesRef = useRef<HTMLDivElement>(null);
  const [filteredAnimes, setFilteredAnimes] = useState<AnimeData[]>([]);
  const [randomAnimes, setRandomAnimes] = useState<AnimeData[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const animeIds = [
    10, 11, 569, 659, 1031, 1099, 1326, 1441, 1470, 1629, 1733, 1747, 1755,
    1805, 1811, 1845, 1882, 1892, 1951, 1991, 2021, 2027, 2069, 2104, 2115,
    2206, 2216, 2282, 2373, 2418, 2496, 2543, 2546, 2547, 2600, 2606, 2625,
    2725, 2788, 2954,
  ];
  const genres = [
    "액션",
    "모험",
    "미스터리",
    "드라마",
    "일상",
    "로맨스",
    "공포",
    "마법소녀",
    "판타지",
    "코미디",
    "메카",
    "음악",
    "추리",
    "스포츠",
    "SF",
    "성인",
    "초자연적인",
    "스릴러",
  ];
  const tags = ["인물", "캐릭터", "관계", "직업", "진행/액션", "배경"];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm("");
    setError(null);
    setAnimes([]);
    fetchRandomAnimes();
  }, [setAnimes, setError]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    if (
      animes.length > 0 &&
      (selectedFilters.length > 0 || checkedTags.length > 0)
    ) {
      const filtered = animes.filter(
        (anime) =>
          (selectedFilters.length === 0 ||
            selectedFilters.every((filter) => anime.genres.includes(filter))) &&
          (checkedTags.length === 0 ||
            checkedTags.every((tag) => anime.tags.includes(tag)))
      );
      setFilteredAnimes(filtered);
    } else {
      setFilteredAnimes(animes);
    }
  }, [animes, selectedFilters, checkedTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        recentSearchesRef.current &&
        !recentSearchesRef.current.contains(event.target as Node)
      ) {
        setShowRecentSearches(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdowns([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const handleRatingClick = () => {
    if (!state.isAuthenticated) {
      setIsModalOpen(true);
    }
  };

  const handleRemoveRecentSearch = (searchTerm: string) => {
    const updatedSearches = recentSearches.filter(
      (search) => search !== searchTerm
    );
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
        const filterParam =
          selectedFilters.length > 0
            ? `&filters=${encodeURIComponent(selectedFilters.join(","))}`
            : "";

        const response = await fetch(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/api/v1/anime/search?query=${encodeURIComponent(
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
    [
      selectedFilters,
      state.isAuthenticated,
      state.token,
      setAnimes,
      setError,
      setLoading,
    ]
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

  const fetchRandomAnimes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/api/v1/anime/public/cards/?ids=${animeIds.join(",")}`,
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

      if (!response.ok) {
        throw new Error("랜덤 애니메이션을 가져오는 데 실패했습니다.");
      }

      const data = await response.json();
      setRandomAnimes(data);
    } catch (error) {
      console.error("랜덤 애니메이션 가져오기 오류:", error);
      setError("랜덤 애니메이션을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [state.isAuthenticated, state.token, setLoading, setError]);

  const handleTagCheck = (tag: string, categoryName: string) => {
    setCheckedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    updateActiveCategoryStatus(categoryName);
  };

  const updateActiveCategoryStatus = (categoryName: string) => {
    setActiveCategories((prev) => {
      const category = tagCategories.find((cat) => cat.name === categoryName);
      if (category) {
        const isActive = category.tags.some((tag) => checkedTags.includes(tag));
        if (isActive) {
          return Array.from(new Set([...prev, categoryName]));
        } else {
          return prev.filter((cat) => cat !== categoryName);
        }
      }
      return prev;
    });
  };

  const handleInputFocus = () => {
    setShowRecentSearches(true);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleDropdown = (categoryName: string) => {
    setOpenDropdowns((prev) => {
      if (prev.includes(categoryName)) {
        return [];
      } else {
        return [categoryName];
      }
    });
  };

  const isCategoryActive = (category: { name: string; tags: string[] }) => {
    return (
      activeCategories.includes(category.name) ||
      category.tags.some((tag) => checkedTags.includes(tag))
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!state.isAuthenticated) {
    return <div>로딩 중...</div>; // 로그인 상태가 확인될 때까지 로딩 메시지 출력
  }

  const handleCompleteEvaluation = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.recommendedAnimes && data.recommendedAnimes.length > 0) {
          alert("추천 생성이 완료되었습니다.");
          navigate("/");
        } else {
          alert("평가한 작품이 없어 추천을 생성할 수 없습니다.");
          navigate("/");
        }
      } else {
        console.error("추천 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("추천 생성 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center mb-10">
      <div className="flex-grow w-full max-w-screen-2xl px-4 sm:px-6 lg:px-20 pt-20 sm:pt-30 md:pt-40">
        <div className="w-full flex flex-col gap-4 items-center">
          <div className="max-w-md w-full relative" style={{ height: "50px" }}>
            <div className="relative">
              <h1 className="text-2xl font-bold mb-6 text-center">
                평가한 작품들로,
                <br />
                취향에 꼭 맞는 애니를 찾아드릴게요!
              </h1>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F7f7f7] focus:outline-none focus:ring-2 focus:ring-[#F35815] focus:border-transparent bg-[#F7f7f7] text-gray-700 placeholder-gray-400"
                style={{
                  caretColor: isFocused ? "#3c3b3b" : "transparent",
                }}
                placeholder="원하는 애니를 검색해보세요"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <div className="absolute inset-y-3 top-24 left-3 flex items-center">
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
              <div
                ref={recentSearchesRef}
                className="absolute w-full z-10 bg-white shadow-lg rounded-lg mt-1"
              >
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
        {searchPerformed ? (
          <div className="w-full mt-20">
            <div className="mb-4">
              <h1 className="font-bold mb-2">장르</h1>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleFilterClick(genre)}
                    className={`
                    px-2 py-0.5 text-xs sm:text-sm font-medium btn-outline border border-gray-300 rounded-lg bg-white
                    transition-all duration-200 ease-in-out
                    ${
                      selectedFilters.includes(genre)
                        ? "text-orange-600 border-orange-600  hover:bg-white hover:text-orange-500 hover:border-orange-500 border-2"
                        : "bg-white text-gray-700 hover:text-orange-600 hover:border-orange-600 hover:bg-white"
                    }
                  `}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            <div ref={dropdownRef}>
              <h2 className="font-bold mb-2">태그</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2 sm:gap-4">
                {tagCategories.map((category) => (
                  <div key={category.name} className="mb-2">
                    <div
                      className={`btn btn-sm w-full justify-between ${
                        category.tags.some((tag) => checkedTags.includes(tag))
                          ? "text-orange-600 border-orange-600 hover:bg-white hover:text-orange-500 hover:border-orange-500 border-2"
                          : "bg-white text-gray-700 hover:text-orange-600 hover:border-orange-600 hover:bg-white"
                      }`}
                      onClick={() => toggleDropdown(category.name)}
                    >
                      <span className="font-normal">{category.name}</span>
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          openDropdowns.includes(category.name)
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                    {openDropdowns.includes(category.name) && (
                      <div className="dropdown-content absolute z-[10] bg-base-100 rounded-box shadow mt-1">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full sm:w-[300px] md:w-[400px]">
                          {category.tags.map((tag) => (
                            <label
                              key={tag}
                              className="flex items-center space-x-2 cursor-pointer py-1 px-2"
                            >
                              <input
                                type="checkbox"
                                checked={checkedTags.includes(tag)}
                                onChange={() =>
                                  handleTagCheck(tag, category.name)
                                }
                                className="form-checkbox h-4 w-4 text-custom-orange rounded border-gray-300 focus:ring-custom-orange focus:ring-offset-0 focus:ring-0 focus:outline-none"
                              />
                              <span className="text-xs sm:text-sm peer-checked:text-orange-600 flex-grow">
                                {tag}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">
                  {loading ? "검색 중..." : `총 ${filteredAnimes.length}개`}
                </span>
              </div>

              {(selectedFilters.length > 0 || checkedTags.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedFilters.map((filter) => (
                    <span
                      key={filter}
                      className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-2 py-1 rounded-full"
                    >
                      {filter}
                      <button
                        className="ml-1 text-orange-600 hover:text-orange-800"
                        onClick={() => handleFilterClick(filter)}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {checkedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-orange-100 text-orange-800 text-xs sm:text-sm py-1 rounded-full px-2"
                    >
                      {tag}
                      <button
                        className="ml-1 text-orange-600 hover:text-orange-800"
                        onClick={() => handleTagCheck(tag, "")}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <div className="flex-grow"></div>
                  <button
                    className="text-xs sm:text-sm text-orange-600 hover:text-orange-800 self-start"
                    onClick={() => {
                      setSelectedFilters([]);
                      setCheckedTags([]);
                    }}
                  >
                    초기화
                  </button>
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8"
            >
              {error && (
                <div className="text-red-500 text-center mt-10 w-full col-span-full">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center mt-8 w-full col-span-full">
                  검색 중...
                </div>
              ) : (
                filteredAnimes.map((anime, index) => (
                  <motion.div
                    key={anime.anime_id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AnimeCard
                      {...anime}
                      index={index}
                      onRatingClick={handleRatingClick}
                      isModalOpen={isModalOpen}
                      onPickStatusChange={(animeId, isPicked) => {
                        /* Pick 상태 변경 로직 */
                      }}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        ) : (
          <div className="w-full mt-28">
            <h2 className="font-bold mb-4 text-xl"></h2>
            {randomAnimes.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {randomAnimes.map((anime, index) => (
                  <motion.div
                    key={anime.anime_id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AnimeCard
                      {...anime}
                      index={index}
                      onRatingClick={handleRatingClick}
                      isModalOpen={isModalOpen}
                      onPickStatusChange={(animeId, isPicked) => {
                        /* Pick 상태 변경 로직 */
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-gray-500 text-center mb-10">
                추천 애니메이션을 불러오는 중입니다...
              </div>
            )}
          </div>
        )}
      </div>
      <div className="fixed bottom-16 left-0 right-0 flex justify-center z-50">
        <button
          onClick={handleCompleteEvaluation}
          className="bg-[#F35815] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-[#D14704] transition duration-300 ease-in-out w-full max-w-sm"
          style={{
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // 플로팅 느낌을 주기 위한 그림자
          }}
          disabled={loading} // 추천 처리 중에는 버튼 비활성화
        >
          {loading ? "처리 중..." : "평가 완료"}
        </button>
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-6 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-20 text-orange-600 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-orange-400 transition-all duration-300 z-50"
          aria-label="맨 위로 스크롤"
        >
          <ArrowUpCircle size={24} />
        </button>
      )}
      {/* <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </div>
  );
};

export default EvaluationPage;
