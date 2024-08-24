import React from 'react';
import PromotionBanner from '../components/PromotionBanner';
import AnimeList from '../components/anime/AnimeList';
import { dummyAnimes, dummyAnimes2, dummyAnimes3 } from '../components/data/dummuyData';

interface HomeProps {
  openLoginModal: () => void;
}

const Home: React.FC<HomeProps> = ({ openLoginModal }) => {
  return (
    <div>
      <div className="relative">
        <PromotionBanner />
      </div>
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-3xl font-bold mb-4">전 세계가 주목한 인기 Top 10</h1>
        <AnimeList animes={dummyAnimes} />
        <h1 className="text-3xl font-bold mb-8 text-left">전 세계가 주목한 인기 리스트</h1>
        <AnimeList animes={dummyAnimes2} />
        <h1 className="text-3xl font-bold mb-8 text-left">애니매니아가 주목한 인기 리스트</h1>
        <AnimeList animes={dummyAnimes3} />
      </div>
    </div>
  );
};

export default Home;