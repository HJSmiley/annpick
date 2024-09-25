export interface AnimeData {
  anime_id: number;
  thumbnail_url: string;
  title: string;
  format: string;
  status: string;
  genres: string[];
  tags: string[];
  rating?: number | null;
}
