import React, { useState, useEffect, useRef, useCallback } from 'react';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeData } from "../types/anime";

const ratingOptions = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

const AnimeList: React.FC = () => {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [visibleAnime, setVisibleAnime] = useState<AnimeData[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      // Replace this with your actual API call
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/anime?page=${page}&rating=${selectedRating || ''}`);
      const data = await response.json();
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setAnimeList(prevList => [...prevList, ...data]);
        setVisibleAnime(prevVisible => {
          const newVisible = [...prevVisible, ...data];
          return newVisible.slice(0, Math.min(newVisible.length, page * 20));
        });
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
    setLoading(false);
  }, [page, selectedRating]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const lastAnimeElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchAnime();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchAnime]
  );

  const handleRatingFilter = (rating: number) => {
    setSelectedRating(rating);
    setAnimeList([]);
    setVisibleAnime([]);
    setPage(1);
    setHasMore(true);
  };

  const handleShowMore = () => {
    const nextBatch = animeList.slice(visibleAnime.length, visibleAnime.length + 20);
    setVisibleAnime(prevVisible => [...prevVisible, ...nextBatch]);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">내 평가</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {ratingOptions.map(rating => (
          <button
            key={rating}
            onClick={() => handleRatingFilter(rating)}
            className={`px-3 py-1 rounded ${selectedRating === rating ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {rating}점
          </button>
        ))}
      </div>
      {visibleAnime.length === 0 && !loading ? (
        <p className="text-center text-gray-500">평가한 애니메이션이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleAnime.map((anime, index) => (
            <div
              key={anime.anime_id}
              ref={index === visibleAnime.length - 1 ? lastAnimeElementRef : null}
            >
              <AnimeCard {...anime} index={index} />
            </div>
          ))}
        </div>
      )}
      {loading && <p className="text-center mt-4">Loading...</p>}
      {!loading && visibleAnime.length < animeList.length && (
        <button
          onClick={handleShowMore}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 mx-auto block"
        >
          더보기
        </button>
      )}
    </div>
  );
};

export default AnimeList;