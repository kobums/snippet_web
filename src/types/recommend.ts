export interface BookRecommendDto {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  category: string | null;
  reason: string;
}
