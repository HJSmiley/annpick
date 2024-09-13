// src/contexts/AnimeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AnimeData } from '../types/anime';

interface AnimeContextType {
  animes: AnimeData[];
  setAnimes: React.Dispatch<React.SetStateAction<AnimeData[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
};

export const AnimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animes, setAnimes] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnimeContext.Provider value={{ animes, setAnimes, loading, setLoading, error, setError }}>
      {children}
    </AnimeContext.Provider>
  );
};