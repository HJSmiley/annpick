export interface AnimeData {
  anime_id: number;
  thumbnail_url: string;
  title: string;
  format: string;
  status: string;
  genres: string[];
  tags: string[];
  rating?: number | null; // rating 속성을 선택적으로 추가
}
