import { useState, useEffect, useCallback, useRef } from "react";
import { useAnime } from "../contexts/AnimeContext";

// 검색 관련 커스텀 훅
export const useSearch = (authState: any) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const { setAnimes, setLoading, setError } = useAnime();

  const handleSearch = useCallback(
    async (term: string) => {
      if (!term.trim() && selectedFilters.length === 0) {
        setError("검색어를 입력하거나 태그를 선택해주세요.");
        return;
      }

      setLoading(true);
      setError(null);
      setAnimes([]);
      setSearchPerformed(true);

      try {
        const filterParam = selectedFilters.length > 0 ? `&filters=${encodeURIComponent(selectedFilters.join(","))}` : "";
        const searchParam = term.trim() ? `&query=${encodeURIComponent(term)}` : "";

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/anime/search?${searchParam}${filterParam}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(authState.isAuthenticated ? { Authorization: `Bearer ${authState.token}` } : {}),
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
    [selectedFilters, authState, setAnimes, setError, setLoading]
  );

  return { selectedFilters, setSelectedFilters, searchPerformed, handleSearch };
};

// 최근 검색어 관련 커스텀 훅
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);

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

  const handleRemoveRecentSearch = (searchTerm: string) => {
    const updatedSearches = recentSearches.filter(search => search !== searchTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  return {
    recentSearches,
    showRecentSearches,
    setShowRecentSearches,
    saveRecentSearch,
    clearRecentSearches,
    handleRemoveRecentSearch,
  };
};

// 외부 클릭 감지 커스텀 훅
export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};