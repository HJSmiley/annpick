// src/services/animeService.ts
import { AnimeData } from '../types/anime';

const API_URL = 'https://api.example.com/animes'; // 실제 API URL로 변경해야 합니다

export const fetchAnimes = async (): Promise<AnimeData[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch animes');
  }
  return response.json();
};

export const fetchAnimeById = async (id: number): Promise<AnimeData> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch anime');
  }
  return response.json();
};