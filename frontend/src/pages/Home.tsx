// import React, { useEffect } from 'react';
// import PromotionBanner from '../components/PromotionBanner';
// import AnimeList from '../components/anime/AnimeList';
// import { useAnime } from '../context/AnimeContext';
// import { fetchAnimes } from '../services/animeService';

// const Home: React.FC = () => {
//   const { animes, setAnimes, loading, setLoading, error, setError } = useAnime();

//   useEffect(() => {
//     const loadAnimes = async () => {
//       setLoading(true);
//       try {
//         const fetchedAnimes = await fetchAnimes();
//         setAnimes(fetchedAnimes);
//       } catch (err) {
//         setError('Failed to load animes');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAnimes();
//   }, [setAnimes, setLoading, setError]);

//   return (
//     <>
//       <PromotionBanner />
//       <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
//         <h1 className="text-3xl font-bold mb-4">전 세계가 주목한 인기 Top 10</h1>
//         {loading && <p>Loading...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {!loading && !error && <AnimeList animes={animes} />}
//       </div>
//     </>
//   );
// };

// export default Home;

import React from 'react';
import PromotionBanner from '../components/PromotionBanner';
import AnimeList from '../components/anime/AnimeList';

const Home: React.FC = () => {
  // 더미 데이터
  const dummyAnimes = [
    { id: 1, title: "도망을 잘 치는 던컨", image: "https://via.placeholder.com/150" },
    { id: 2, title: "전생했더니 슬라임이었단 건에 대하여", image: "https://via.placeholder.com/150" },
    { id: 3, title: "ATRI -My Dear Moments-", image: "https://via.placeholder.com/150" },
    { id: 4, title: "최애의 아이", image: "https://via.placeholder.com/150" },
    { id: 5, title: "이세계 노예 꼬붕", image: "https://via.placeholder.com/150" },
  ];

  return (
    <>
      <PromotionBanner />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-3xl font-bold mb-4">전 세계가 주목한 인기 Top 10</h1>
        <AnimeList animes={dummyAnimes} />
      </div>
    </>
  );
};

export default Home;
