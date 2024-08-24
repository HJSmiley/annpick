// src/components/anime/AnimeList.tsx
import React from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '../../types/anime';

interface AnimeListProps {
  animes: Anime[];
}

const AnimeList: React.FC<AnimeListProps> = ({ animes }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} {...anime} />
      ))}
    </div>
  );
};

export default AnimeList;